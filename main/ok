#include <stdio.h>
#include <math.h>
#include <string.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

#include "esp_adc/adc_oneshot.h"
#include "esp_timer.h"
#include "esp_err.h"

// --- Cấu hình Hardware ---
#define ADC_UNIT            ADC_UNIT_1
#define ADC_CHAN            ADC_CHANNEL_3  // GPIO 4
#define ADC_ATTEN           ADC_ATTEN_DB_12

// --- Cấu hình thuật toán ---
#define kSampleRateHz       125
#define kBeatSamples        187
#define kHistorySize        2048
#define kPeakSearchSamples  24
#define RAW_BUF_MAX         256

#define PRE_R_SEC           0.25f
#define POST_R_SEC          0.45f

// --- Block-based BPM: gom 3-5 nhịp rồi chốt, sau đó reset ---
#define RR_BLOCK_N          5       // đổi 3 hoặc 5 tùy bạn
#define RR_BLOCK_TIMEOUT_MS 2000    // quá 2s không đủ block -> reset block
#define RR_RATIO_MIN        0.65f   // RR mới không được nhỏ hơn 65% RR tốt trước đó
#define RR_RATIO_MAX        1.35f   // RR mới không được lớn hơn 135% RR tốt trước đó

struct BeatMessage {
    float bpm;
    float data[kBeatSamples];
};

static QueueHandle_t beat_queue;

static float history_buf[kHistorySize] = {0};
static int history_idx = 0;

// -------------------- Ring buffer helpers --------------------
static inline void add_to_history(float val) {
    history_buf[history_idx] = val;
    history_idx = (history_idx + 1) % kHistorySize;
}

static inline float get_history_at(int idx) {
    return history_buf[(idx + kHistorySize) % kHistorySize];
}

// -------------------- Linear resample --------------------
static void resample_linear(const float *in, int in_len, float *out, int out_len) {
    if (in_len <= 1 || out_len <= 1) return;
    for (int i = 0; i < out_len; i++) {
        float pos = (float)i * (float)(in_len - 1) / (float)(out_len - 1);
        int idx = (int)pos;
        float frac = pos - (float)idx;
        float a = in[idx];
        float b = (idx + 1 < in_len) ? in[idx + 1] : in[idx];
        out[i] = a * (1.0f - frac) + b * frac;
    }
}

// -------------------- Median helper (n <= 16) --------------------
static float median_small(const float *arr, int n) {
    float tmp[16];
    if (n <= 0) return 0.0f;
    if (n > 16) n = 16;

    for (int i = 0; i < n; i++) tmp[i] = arr[i];

    for (int i = 0; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            if (tmp[j] < tmp[i]) {
                float t = tmp[i];
                tmp[i] = tmp[j];
                tmp[j] = t;
            }
        }
    }
    return tmp[n / 2];
}

// ============================================================
// TASK 1: XỬ LÝ TÍN HIỆU (Core 1)
// ============================================================
static void ecg_processing_task(void *pvParameters) {
    adc_oneshot_unit_handle_t adc1_handle = (adc_oneshot_unit_handle_t)pvParameters;

    // DC + envelope
    float dc_filter = 2048.0f;
    float env = 0.0f;

    // R-peak time tracking
    int64_t last_r_us = 0;
    int64_t current_r_us = 0;

    // Moving average buffer
    float smooth_buf[5] = {0};
    float smooth_sum = 0;
    int s_idx = 0;

    // Peak search window
    int peak_search_cnt = -1;
    float peak_max = -1e9f;
    int peak_max_hist_idx = 0;
    int peak_offset_in_window = 0;
    int64_t window_start_us = 0;

    // Beat capture
    int saved_idx = 0;
    bool capture_pending = false;
    int64_t capture_due_us = 0;

    // Adaptive refractory
    int refractory_ms = 300;

    // Block RR
    float rr_block[RR_BLOCK_N] = {0};
    int rr_count = 0;
    float rr_prev_good = 0.0f;
    int64_t last_good_rr_us = 0;

    float bpm_last = 0.0f;     // BPM output giữ gần nhất
    float bpm_out = 0.0f;      // BPM chốt theo block

    const int pre_samp  = (int)(PRE_R_SEC  * kSampleRateHz);
    const int post_samp = (int)(POST_R_SEC * kSampleRateHz);
    const int raw_len   = pre_samp + post_samp + 1;
    const int64_t Ts_us = 1000000LL / kSampleRateHz;

    TickType_t xLastWakeTime = xTaskGetTickCount();
    const TickType_t xFreq = pdMS_TO_TICKS(1000 / kSampleRateHz);

    while (true) {
        int raw = 0;
        adc_oneshot_read(adc1_handle, ADC_CHAN, &raw);

        // Lead-off / bão hòa: bỏ qua
        if (raw <= 10 || raw >= 4080) {
            vTaskDelayUntil(&xLastWakeTime, xFreq);
            continue;
        }

        float val = (float)raw;

        // 1) Lọc DC (high-pass) + moving average (low-pass nhẹ)
        dc_filter = 0.985f * dc_filter + 0.015f * val;
        float ac = val - dc_filter;

        smooth_sum -= smooth_buf[s_idx];
        smooth_buf[s_idx] = ac;
        smooth_sum += smooth_buf[s_idx];
        s_idx = (s_idx + 1) % 5;
        float lp = smooth_sum / 5.0f;

        add_to_history(lp);

        // 2) Ngưỡng động theo envelope
        env = 0.97f * env + 0.03f * fabsf(lp);
        float thres = env * 1.8f + 20.0f;

        int64_t now_us = esp_timer_get_time();

        // Refractory theo BPM gần nhất (tránh double-count)
        if (bpm_last > 20.0f) {
            int ref = (int)(0.4f * (60000.0f / bpm_last));
            refractory_ms = (ref < 200) ? 200 : (ref > 400 ? 400 : ref);
        }

        // 3) R-peak detect: vượt ngưỡng -> mở cửa sổ tìm max trong 24 mẫu
        if (peak_search_cnt < 0) {
            if (lp > thres) {
                int64_t since_last_r_ms = (now_us - current_r_us) / 1000;
                if (since_last_r_ms > refractory_ms) {
                    peak_search_cnt = kPeakSearchSamples;
                    peak_max = lp;
                    peak_max_hist_idx = (history_idx - 1 + kHistorySize) % kHistorySize;
                    window_start_us = now_us;
                    peak_offset_in_window = 0;
                }
            }
        } else {
            int progress = kPeakSearchSamples - peak_search_cnt;
            if (lp > peak_max) {
                peak_max = lp;
                peak_max_hist_idx = (history_idx - 1 + kHistorySize) % kHistorySize;
                peak_offset_in_window = progress;
            }

            if (--peak_search_cnt == 0) {
                int64_t peak_us = window_start_us + (int64_t)peak_offset_in_window * Ts_us;

                last_r_us = current_r_us;
                current_r_us = peak_us;

                // ===== BLOCK BPM: outlier reject + median RR + reset theo đợt =====
                if (last_r_us > 0) {
                    float rr_ms = (float)(current_r_us - last_r_us) / 1000.0f;

                    bool rr_ok = (rr_ms > 250.0f && rr_ms < 1500.0f);

                    // Outlier reject theo RR tốt trước đó
                    if (rr_ok && rr_prev_good > 0.0f) {
                        float ratio = rr_ms / rr_prev_good;
                        if (ratio < RR_RATIO_MIN || ratio > RR_RATIO_MAX) rr_ok = false;
                    }

                    // Timeout: block bị treo -> reset
                    if (last_good_rr_us > 0) {
                        int64_t dt_ms = (esp_timer_get_time() - last_good_rr_us) / 1000;
                        if (dt_ms > RR_BLOCK_TIMEOUT_MS) {
                            rr_count = 0;
                            rr_prev_good = 0.0f;
                            last_good_rr_us = 0;
                        }
                    }

                    if (rr_ok) {
                        rr_prev_good = rr_ms;
                        last_good_rr_us = esp_timer_get_time();

                        if (rr_count < RR_BLOCK_N) {
                            rr_block[rr_count++] = rr_ms;
                        }

                        // đủ block -> chốt BPM theo median rồi reset block
                        if (rr_count >= RR_BLOCK_N) {
                            float rr_med = median_small(rr_block, RR_BLOCK_N);
                            bpm_out = (rr_med > 1.0f) ? (60000.0f / rr_med) : bpm_last;
                            bpm_last = bpm_out;

                            rr_count = 0;     // reset theo đợt
                            // giữ rr_prev_good để outlier reject nhạy hơn cho đợt sau
                        }
                    }
                }

                // Capture waveform cho beat
                saved_idx = peak_max_hist_idx;
                capture_due_us = peak_us + (int64_t)post_samp * Ts_us;
                capture_pending = true;

                peak_search_cnt = -1;
            }
        }

        // 4) Capture beat waveform sau khi đủ post_samp
        if (capture_pending && now_us >= capture_due_us) {
            BeatMessage msg;
            msg.bpm = bpm_last;

            float raw_buf[RAW_BUF_MAX];
            int actual_raw_len = (raw_len > RAW_BUF_MAX) ? RAW_BUF_MAX : raw_len;

            int start_pos = saved_idx - pre_samp;
            for (int i = 0; i < actual_raw_len; i++) {
                raw_buf[i] = get_history_at(start_pos + i);
            }

            resample_linear(raw_buf, actual_raw_len, msg.data, kBeatSamples);

            // Reject beat quá phẳng (nhiễu/lead-off)
            float min_v = 1e9f, max_v = -1e9f;
            for (int i = 0; i < kBeatSamples; i++) {
                if (msg.data[i] < min_v) min_v = msg.data[i];
                if (msg.data[i] > max_v) max_v = msg.data[i];
            }
            if ((max_v - min_v) > 20.0f) {
                xQueueSend(beat_queue, &msg, 0);
            }

            capture_pending = false;
        }

        vTaskDelayUntil(&xLastWakeTime, xFreq);
    }
}

// ============================================================
// TASK 2: XUẤT DỮ LIỆU (Core 0)
// ============================================================
static void serial_output_task(void *pvParameters) {
    (void)pvParameters;

    BeatMessage msg;
    while (true) {
        if (xQueueReceive(beat_queue, &msg, portMAX_DELAY)) {
            float min_v = 1e9f, max_v = -1e9f;
            for (int i = 0; i < kBeatSamples; i++) {
                if (msg.data[i] < min_v) min_v = msg.data[i];
                if (msg.data[i] > max_v) max_v = msg.data[i];
            }
            float range = (max_v - min_v) < 1.0f ? 1.0f : (max_v - min_v);

            printf("BPM:%.1f|BEAT:", msg.bpm);
            for (int i = 0; i < kBeatSamples; i++) {
                float norm = (msg.data[i] - min_v) / range;
                printf("%.6f%c", norm, (i == kBeatSamples - 1) ? '\n' : ',');

            }
        }
    }
}

extern "C" void app_main(void) {
    // ADC Init
    adc_oneshot_unit_handle_t adc1_handle;

    adc_oneshot_unit_init_cfg_t init_cfg = {
        .unit_id = ADC_UNIT,
        .clk_src = ADC_RTC_CLK_SRC_DEFAULT,
        .ulp_mode = ADC_ULP_MODE_DISABLE, // fix warning missing initializer
    };
    ESP_ERROR_CHECK(adc_oneshot_new_unit(&init_cfg, &adc1_handle));

    adc_oneshot_chan_cfg_t config = {
        .atten = ADC_ATTEN,
        .bitwidth = ADC_BITWIDTH_DEFAULT,
    };
    ESP_ERROR_CHECK(adc_oneshot_config_channel(adc1_handle, ADC_CHAN, &config));

    beat_queue = xQueueCreate(10, sizeof(BeatMessage));

    xTaskCreatePinnedToCore(ecg_processing_task, "ECG_Task", 4096, adc1_handle, 5, NULL, 1);
    xTaskCreatePinnedToCore(serial_output_task, "Serial_Task", 4096, NULL, 2, NULL, 0);
}
