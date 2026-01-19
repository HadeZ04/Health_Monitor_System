#include "ble_health.h"

#include <string.h>

#include "esp_err.h"
#include "esp_log.h"
#include "esp_timer.h"
#include "nvs_flash.h"

/* BLE (NimBLE) */
#include "nimble/nimble_port.h"
#include "nimble/nimble_port_freertos.h"
#include "host/ble_att.h"
#include "host/ble_gatt.h"
#include "host/ble_hs.h"
#include "host/ble_hs_mbuf.h"
#include "host/util/util.h"
#include "os/os_mbuf.h"
#include "services/gap/ble_svc_gap.h"
#include "services/gatt/ble_svc_gatt.h"

static const char *TAG = "BLE_HEALTH";

void ble_store_config_init(void);

static uint8_t s_own_addr_type;
static uint16_t s_conn_handle;
static bool s_notify_enabled;

static uint16_t s_tx_val_handle;
static uint16_t s_rx_val_handle;

static ble_health_packet_t s_last_packet;

/* {6E400001-B5A3-F393-E0A9-E50E24DCCA9E} */
static const ble_uuid128_t s_uart_svc_uuid = BLE_UUID128_INIT(0x9e, 0xca, 0xdc, 0x24, 0x0e, 0xe5, 0xa9, 0xe0, 0x93,
                                                              0xf3, 0xa3, 0xb5, 0x01, 0x00, 0x40, 0x6e);
/* {6E400002-B5A3-F393-E0A9-E50E24DCCA9E} */
static const ble_uuid128_t s_uart_rx_uuid = BLE_UUID128_INIT(0x9e, 0xca, 0xdc, 0x24, 0x0e, 0xe5, 0xa9, 0xe0, 0x93,
                                                             0xf3, 0xa3, 0xb5, 0x02, 0x00, 0x40, 0x6e);
/* {6E400003-B5A3-F393-E0A9-E50E24DCCA9E} */
static const ble_uuid128_t s_uart_tx_uuid = BLE_UUID128_INIT(0x9e, 0xca, 0xdc, 0x24, 0x0e, 0xe5, 0xa9, 0xe0, 0x93,
                                                             0xf3, 0xa3, 0xb5, 0x03, 0x00, 0x40, 0x6e);

static void ble_health_advertise(void);

static int gatt_access_cb(uint16_t conn_handle, uint16_t attr_handle, struct ble_gatt_access_ctxt *ctxt, void *arg)
{
    (void)conn_handle;

    if (attr_handle == s_tx_val_handle) {
        if (ctxt->op == BLE_GATT_ACCESS_OP_READ_CHR) {
            const int rc = os_mbuf_append(ctxt->om, &s_last_packet, sizeof(s_last_packet));
            return rc == 0 ? 0 : BLE_ATT_ERR_INSUFFICIENT_RES;
        }
        return BLE_ATT_ERR_READ_NOT_PERMITTED;
    }

    if (attr_handle == s_rx_val_handle) {
        if (ctxt->op == BLE_GATT_ACCESS_OP_WRITE_CHR) {
            ESP_LOGI(TAG, "RX write (%u bytes)", (unsigned)OS_MBUF_PKTLEN(ctxt->om));
            return 0;
        }
        return BLE_ATT_ERR_WRITE_NOT_PERMITTED;
    }

    return BLE_ATT_ERR_UNLIKELY;
}

static const struct ble_gatt_svc_def s_gatt_svcs[] = {
    {
        /* Nordic UART-like service */
        .type = BLE_GATT_SVC_TYPE_PRIMARY,
        .uuid = &s_uart_svc_uuid.u,
        .characteristics =
            (struct ble_gatt_chr_def[]){
                {
                    /* TX: notify + (optional) read last packet */
                    .uuid = &s_uart_tx_uuid.u,
                    .val_handle = &s_tx_val_handle,
                    .access_cb = gatt_access_cb,
                    .flags = BLE_GATT_CHR_F_NOTIFY | BLE_GATT_CHR_F_READ,
                },
                {
                    /* RX: write (optional, for future commands) */
                    .uuid = &s_uart_rx_uuid.u,
                    .val_handle = &s_rx_val_handle,
                    .access_cb = gatt_access_cb,
                    .flags = BLE_GATT_CHR_F_WRITE | BLE_GATT_CHR_F_WRITE_NO_RSP,
                },
                {0},
            },
    },
    {0},
};

static int gap_event_cb(struct ble_gap_event *event, void *arg)
{
    (void)arg;

    switch (event->type) {
    case BLE_GAP_EVENT_CONNECT:
        ESP_LOGI(TAG, "connect status=%d", event->connect.status);
        if (event->connect.status != 0) {
            ble_health_advertise();
            return 0;
        }
        s_conn_handle = event->connect.conn_handle;
        return 0;

    case BLE_GAP_EVENT_DISCONNECT:
        ESP_LOGI(TAG, "disconnect reason=%d", event->disconnect.reason);
        s_conn_handle = BLE_HS_CONN_HANDLE_NONE;
        s_notify_enabled = false;
        ble_health_advertise();
        return 0;

    case BLE_GAP_EVENT_ADV_COMPLETE:
        ESP_LOGI(TAG, "adv complete");
        ble_health_advertise();
        return 0;

    case BLE_GAP_EVENT_SUBSCRIBE:
        if (event->subscribe.attr_handle == s_tx_val_handle) {
            s_notify_enabled = event->subscribe.cur_notify;
            ESP_LOGI(TAG, "subscribe notify=%d", (int)s_notify_enabled);
        }
        return 0;

    case BLE_GAP_EVENT_MTU:
        ESP_LOGI(TAG, "mtu updated conn=%d mtu=%d", event->mtu.conn_handle, event->mtu.value);
        return 0;

    default:
        return 0;
    }
}

static void ble_on_sync(void)
{
    int rc = ble_hs_id_infer_auto(0, &s_own_addr_type);
    if (rc != 0) {
        ESP_LOGE(TAG, "ble_hs_id_infer_auto failed rc=%d", rc);
        return;
    }
    ble_health_advertise();
}

static void ble_on_reset(int reason)
{
    ESP_LOGW(TAG, "resetting state; reason=%d", reason);
}

static void ble_health_advertise(void)
{
    struct ble_gap_adv_params adv_params;
    struct ble_hs_adv_fields fields;
    struct ble_hs_adv_fields rsp_fields;
    const char *name;
    int rc;

    memset(&fields, 0, sizeof(fields));
    memset(&rsp_fields, 0, sizeof(rsp_fields));
    fields.flags = BLE_HS_ADV_F_DISC_GEN | BLE_HS_ADV_F_BREDR_UNSUP;
    fields.tx_pwr_lvl_is_present = 1;
    fields.tx_pwr_lvl = BLE_HS_ADV_TX_PWR_LVL_AUTO;

    name = ble_svc_gap_device_name();
    fields.name = (uint8_t *)name;
    fields.name_len = strlen(name);
    fields.name_is_complete = 1;

    rsp_fields.uuids128 = (ble_uuid128_t *)&s_uart_svc_uuid;
    rsp_fields.num_uuids128 = 1;
    rsp_fields.uuids128_is_complete = 1;

    rc = ble_gap_adv_set_fields(&fields);
    if (rc != 0) {
        ESP_LOGE(TAG, "adv set fields failed rc=%d", rc);
        return;
    }

    rc = ble_gap_adv_rsp_set_fields(&rsp_fields);
    if (rc != 0) {
        ESP_LOGE(TAG, "adv rsp set fields failed rc=%d", rc);
        return;
    }

    memset(&adv_params, 0, sizeof(adv_params));
    adv_params.conn_mode = BLE_GAP_CONN_MODE_UND;
    adv_params.disc_mode = BLE_GAP_DISC_MODE_GEN;

    rc = ble_gap_adv_start(s_own_addr_type, NULL, BLE_HS_FOREVER, &adv_params, gap_event_cb, NULL);
    if (rc != 0) {
        ESP_LOGE(TAG, "adv start failed rc=%d", rc);
        return;
    }
    ESP_LOGI(TAG, "advertising as \"%s\"", name);
}

static int gatt_init(void)
{
    int rc;

    ble_svc_gap_init();
    ble_svc_gatt_init();

    rc = ble_gatts_count_cfg(s_gatt_svcs);
    if (rc != 0) {
        return rc;
    }
    rc = ble_gatts_add_svcs(s_gatt_svcs);
    if (rc != 0) {
        return rc;
    }
    return 0;
}

static void ble_host_task(void *param)
{
    (void)param;
    ESP_LOGI(TAG, "BLE host task started");
    nimble_port_run();
    nimble_port_freertos_deinit();
}

void ble_health_init(void)
{
    static bool inited = false;
    if (inited) {
        return;
    }
    inited = true;

    s_conn_handle = BLE_HS_CONN_HANDLE_NONE;
    s_notify_enabled = false;
    memset(&s_last_packet, 0, sizeof(s_last_packet));

    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    ret = nimble_port_init();
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "nimble_port_init failed: %d", ret);
        return;
    }

    ble_hs_cfg.reset_cb = ble_on_reset;
    ble_hs_cfg.sync_cb = ble_on_sync;
    ble_hs_cfg.store_status_cb = ble_store_util_status_rr;

    const int rc = gatt_init();
    if (rc != 0) {
        ESP_LOGE(TAG, "gatt init failed rc=%d", rc);
        return;
    }

    (void)ble_svc_gap_device_name_set("HealthMonitor");
    ble_store_config_init();

    nimble_port_freertos_init(ble_host_task);
}

bool ble_health_connected(void)
{
    return s_conn_handle != BLE_HS_CONN_HANDLE_NONE;
}

bool ble_health_notify_enabled(void)
{
    return s_notify_enabled;
}

bool ble_health_notify(const ble_health_packet_t *packet)
{
    if (packet == NULL) {
        return false;
    }
    s_last_packet = *packet;

    if (!s_notify_enabled || s_conn_handle == BLE_HS_CONN_HANDLE_NONE) {
        return false;
    }

    struct os_mbuf *om = ble_hs_mbuf_from_flat(packet, sizeof(*packet));
    if (om == NULL) {
        ESP_LOGW(TAG, "notify alloc failed");
        return false;
    }

    const int rc = ble_gatts_notify_custom(s_conn_handle, s_tx_val_handle, om);
    if (rc != 0) {
        ESP_LOGW(TAG, "notify failed rc=%d", rc);
        return false;
    }
    return true;
}
