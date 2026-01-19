#pragma once

#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

// Nordic UART Service UUIDs (widely supported by mobile + BlueZ tools).
// Service:        6E400001-B5A3-F393-E0A9-E50E24DCCA9E
// Notify (TX):    6E400003-B5A3-F393-E0A9-E50E24DCCA9E
// Write (RX):     6E400002-B5A3-F393-E0A9-E50E24DCCA9E
#define BLE_HEALTH_SERVICE_UUID_STR "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
#define BLE_HEALTH_TX_CHAR_UUID_STR "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"
#define BLE_HEALTH_RX_CHAR_UUID_STR "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"

typedef struct __attribute__((packed)) ble_health_packet_t {
    uint32_t seq;
    uint32_t uptime_ms;
    int16_t heart_rate_bpm;       // -1 if invalid
    int16_t spo2_percent;         // -1 if invalid
    int16_t temperature_c_x100;   // centi-degC (e.g. 3650 => 36.50C)
    uint8_t flags;                // bit0=HR valid, bit1=SpO2 valid, bit2=Temp valid
} ble_health_packet_t;

void ble_health_init(void);
bool ble_health_connected(void);
bool ble_health_notify_enabled(void);
bool ble_health_notify(const ble_health_packet_t *packet);

#ifdef __cplusplus
}  // extern "C"
#endif

