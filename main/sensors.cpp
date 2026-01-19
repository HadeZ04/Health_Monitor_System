// #include "sensors.h"
// #include "pins.h"
// #include <algorithm>
// #include <cmath>
// #include <cstring>
// #include <cstdlib>
// #include <string>
// #include <vector>
// #include "freertos/FreeRTOS.h"
// #include "freertos/task.h"
// #include "driver/gpio.h"
// #include "driver/i2c.h"
// #include "driver/uart.h"
// #include "esp_check.h"
// #include "esp_adc/adc_oneshot.h"
// #include "esp_log.h"
// #include "esp_timer.h"

// namespace {
// constexpr const char* TAG = "sensors";
// constexpr uint8_t MPU6050_ADDR = 0x68;
// constexpr uint8_t MAX30100_ADDR = 0x57;

// inline uint32_t get_ms() { return esp_timer_get_time() / 1000; }

// esp_err_t i2c_write_reg(i2c_port_t port, uint8_t addr, uint8_t reg, uint8_t data) {
//   i2c_cmd_handle_t cmd = i2c_cmd_link_create();
//   i2c_master_start(cmd);
//   i2c_master_write_byte(cmd, (addr << 1) | I2C_MASTER_WRITE, true);
//   i2c_master_write_byte(cmd, reg, true);
//   i2c_master_write_byte(cmd, data, true);
//   i2c_master_stop(cmd);
//   esp_err_t ret = i2c_master_cmd_begin(port, cmd, pdMS_TO_TICKS(100));
//   i2c_cmd_link_delete(cmd);
//   return ret;
// }

// esp_err_t i2c_read_regs(i2c_port_t port, uint8_t addr, uint8_t reg, uint8_t* data, size_t len) {
//   i2c_cmd_handle_t cmd = i2c_cmd_link_create();
//   i2c_master_start(cmd);
//   i2c_master_write_byte(cmd, (addr << 1) | I2C_MASTER_WRITE, true);
//   i2c_master_write_byte(cmd, reg, true);
//   i2c_master_start(cmd);
//   i2c_master_write_byte(cmd, (addr << 1) | I2C_MASTER_READ, true);
//   if (len > 1) {
//     i2c_master_read(cmd, data, len - 1, I2C_MASTER_ACK);
//   }
//   i2c_master_read_byte(cmd, data + len - 1, I2C_MASTER_NACK);
//   i2c_master_stop(cmd);
//   esp_err_t ret = i2c_master_cmd_begin(port, cmd, pdMS_TO_TICKS(100));
//   i2c_cmd_link_delete(cmd);
//   return ret;
// }

// esp_err_t i2c_read_reg1(i2c_port_t port, uint8_t addr, uint8_t reg, uint8_t& data) {
//   return i2c_read_regs(port, addr, reg, &data, 1);
// }

// bool mpu6050_init(i2c_port_t port) {
//   if (i2c_write_reg(port, MPU6050_ADDR, 0x6B, 0x00) != ESP_OK) return false;  // wake
//   i2c_write_reg(port, MPU6050_ADDR, 0x1C, 0x00);  // accel +-2g
//   i2c_write_reg(port, MPU6050_ADDR, 0x1B, 0x00);  // gyro +-250dps
//   return true;
// }

// void i2c_scan(i2c_port_t port) {
//   ESP_LOGI(TAG, "I2C scan start");
//   for (uint8_t addr = 1; addr < 0x7F; ++addr) {
//     i2c_cmd_handle_t cmd = i2c_cmd_link_create();
//     i2c_master_start(cmd);
//     i2c_master_write_byte(cmd, (addr << 1) | I2C_MASTER_WRITE, true);
//     i2c_master_stop(cmd);
//     esp_err_t ret = i2c_master_cmd_begin(port, cmd, pdMS_TO_TICKS(50));
//     i2c_cmd_link_delete(cmd);
//     if (ret == ESP_OK) {
//       ESP_LOGI(TAG, "Found device at 0x%02X", addr);
//     }
//     vTaskDelay(pdMS_TO_TICKS(2));
//   }
//   ESP_LOGI(TAG, "I2C scan done");
// }

// bool mpu6050_read_accel(i2c_port_t port, int16_t& ax, int16_t& ay, int16_t& az) {
//   uint8_t buf[6];
//   if (i2c_read_regs(port, MPU6050_ADDR, 0x3B, buf, sizeof(buf)) != ESP_OK) return false;
//   ax = (buf[0] << 8) | buf[1];
//   ay = (buf[2] << 8) | buf[3];
//   az = (buf[4] << 8) | buf[5];
//   return true;
// }

// bool max30100_init(i2c_port_t port) {
//   // Reset + clear FIFO
//   if (i2c_write_reg(port, MAX30100_ADDR, 0x06, 0x00) != ESP_OK) {
//     ESP_LOGE(TAG, "MAX30100 reset fail");
//     return false;
//   }
//   vTaskDelay(pdMS_TO_TICKS(10));
//   i2c_write_reg(port, MAX30100_ADDR, 0x02, 0x00);  // FIFO_WR_PTR
//   i2c_write_reg(port, MAX30100_ADDR, 0x03, 0x00);  // OVF_COUNTER
//   i2c_write_reg(port, MAX30100_ADDR, 0x04, 0x00);  // FIFO_RD_PTR

//   // SPO2 config: hi-res, 100Hz, 1600us pulse width (datasheet-valid)
//   if (i2c_write_reg(port, MAX30100_ADDR, 0x07, 0x47) != ESP_OK) {
//     ESP_LOGE(TAG, "MAX30100 sample rate/pulsewidth fail");
//     return false;
//   }
//   // LED currents ~24mA
//   if (i2c_write_reg(port, MAX30100_ADDR, 0x09, 0x66) != ESP_OK ||
//       i2c_write_reg(port, MAX30100_ADDR, 0x0A, 0x66) != ESP_OK) {
//     ESP_LOGE(TAG, "MAX30100 LED current set fail");
//     return false;
//   }
//   if (i2c_write_reg(port, MAX30100_ADDR, 0x06, 0x03) != ESP_OK) {
//     ESP_LOGE(TAG, "MAX30100 mode set fail");
//     return false;
//   }

//   uint8_t part = 0, rev = 0, mode = 0, spo2cfg = 0;
//   i2c_read_reg1(port, MAX30100_ADDR, 0xFF, part);
//   i2c_read_reg1(port, MAX30100_ADDR, 0xFE, rev);
//   i2c_read_reg1(port, MAX30100_ADDR, 0x06, mode);
//   i2c_read_reg1(port, MAX30100_ADDR, 0x07, spo2cfg);
//   ESP_LOGI(TAG, "MAX30100 init OK part=0x%02X rev=0x%02X mode=0x%02X spo2=0x%02X", part, rev, mode, spo2cfg);
//   return true;
// }

// struct MaxFifoSample { uint16_t ir; uint16_t red; };

// int max30100_read_fifo(i2c_port_t port, MaxFifoSample* out, int max_samples) {
//   uint8_t wr_ptr = 0, rd_ptr = 0;
//   if (i2c_read_regs(port, MAX30100_ADDR, 0x02, &wr_ptr, 1) != ESP_OK) return -1;
//   if (i2c_read_regs(port, MAX30100_ADDR, 0x04, &rd_ptr, 1) != ESP_OK) return -1;
//   int samples = (wr_ptr - rd_ptr) & 0x1F;
//   if (samples > max_samples) samples = max_samples;
//   for (int i = 0; i < samples; ++i) {
//     uint8_t buf[4];
//     if (i2c_read_regs(port, MAX30100_ADDR, 0x05, buf, 4) != ESP_OK) return -1;
//     out[i].ir = (buf[0] << 8) | buf[1];
//     out[i].red = (buf[2] << 8) | buf[3];
//   }
//   return samples;
// }

// void update_step_counter(SensorDrivers& d, SensorState& s, int16_t ax, int16_t ay, int16_t az, uint32_t now_ms) {
//   float accel_mag = sqrtf(ax * ax + ay * ay + az * az) / 16384.0f;
//   d.accel_lp = 0.9f * d.accel_lp + 0.1f * accel_mag;
//   const float high_th = 1.25f;
//   const float low_th = 1.02f;
//   const uint32_t debounce_ms = 400;

//   if (!d.step_high && d.accel_lp > high_th && (now_ms - d.last_step_ms) > debounce_ms) {
//     d.step_high = true;
//   }
//   if (d.step_high && d.accel_lp < low_th) {
//     s.step_count++;
//     d.last_step_ms = now_ms;
//     d.step_high = false;
//   }

//   d.last_accel_mag = accel_mag;
// }

// void update_heart_spo2(SensorDrivers& d, SensorState& s, const MaxFifoSample* samples, int count, uint32_t now_ms) {
//   static uint32_t rr_intervals[5] = {0};
//   static int rr_idx = 0;
//   static int rr_count = 0;

//   for (int i = 0; i < count; ++i) {
//     float ir = samples[i].ir;
//     float red = samples[i].red;
//     d.ir_dc = 0.97f * d.ir_dc + 0.03f * ir;
//     d.red_dc = 0.97f * d.red_dc + 0.03f * red;

//     if (d.warmup_count < 40) {
//       d.warmup_count++;
//       continue;  // wait DC stable
//     }

//     if (d.ir_dc < 1200.0f || d.red_dc < 1200.0f) {
//       s.heart_rate = 0;
//       s.spo2 = 0;
//       d.last_beat_ms = 0;
//       continue;
//     }

//     float ir_ac = ir - d.ir_dc;
//     float ir_ac_abs = fabsf(ir_ac);
//     static bool was_low = true;
//     const float rise_th = d.ir_dc * 0.012f;
//     const float fall_th = d.ir_dc * 0.006f;
//     // Yêu cầu biên độ đủ lớn để tránh nhiễu
//     if (ir_ac > rise_th && ir_ac_abs > 500 && was_low && (now_ms - d.last_beat_ms) > 300) {
//       if (d.last_beat_ms != 0) {
//         float bpm = 60000.0f / (now_ms - d.last_beat_ms);
//         if (bpm > 40 && bpm < 180) {
//           rr_intervals[rr_idx] = now_ms - d.last_beat_ms;
//           rr_idx = (rr_idx + 1) % 5;
//           if (rr_count < 5) rr_count++;

//           uint32_t sum = 0;
//           for (int j = 0; j < rr_count; ++j) sum += rr_intervals[j];
//           float avg_interval = sum / static_cast<float>(rr_count);
//           float avg_bpm = 60000.0f / avg_interval;

//           // Giới hạn tốc độ thay đổi
//           if (s.heart_rate == 0 || fabsf(avg_bpm - s.heart_rate) < 30.0f) {
//             s.heart_rate = avg_bpm;
//             d.last_valid_hr_ms = now_ms;
//           }
//         }
//       }
//       d.last_beat_ms = now_ms;
//       was_low = false;
//     } else if (ir_ac < fall_th) {
//       was_low = true;
//     }

//     float ratio = 0.0f;
//     if (d.ir_dc > 800 && d.red_dc > 800) {
//       float red_ac = red - d.red_dc;
//       float ir_abs = fabsf(ir_ac);
//       if (ir_abs > 0.01f) ratio = fabsf(red_ac) / d.red_dc / (ir_abs / d.ir_dc);
//     }
//     if (ratio > 0.1f && ratio < 5.0f) {
//       float spo2 = 104.0f - 17.0f * ratio;
//       if (spo2 > 50 && spo2 <= 100) s.spo2 = spo2;
//     }
//   }

//   if (d.last_valid_hr_ms != 0 && (now_ms - d.last_valid_hr_ms) > 5000) {
//     s.heart_rate = 0;
//     d.last_valid_hr_ms = 0;
//   }
// }

// bool parse_float(const char* p, double& out) {
//   char* end = nullptr;
//   out = strtod(p, &end);
//   return end != p;
// }

// double nmea_coord_to_deg(double val, const char hemi) {
//   double deg = floor(val / 100.0);
//   double minutes = val - deg * 100.0;
//   double res = deg + minutes / 60.0;
//   if (hemi == 'S' || hemi == 'W') res = -res;
//   return res;
// }

// void parse_nmea_line(const std::string& line, SensorState& s) {
//   if (line.rfind("$GPGGA", 0) == 0 || line.rfind("$GNGGA", 0) == 0) {
//     std::vector<std::string> f;
//     size_t start = 0, pos;
//     while ((pos = line.find(',', start)) != std::string::npos) {
//       f.emplace_back(line.substr(start, pos - start));
//       start = pos + 1;
//     }
//     f.emplace_back(line.substr(start));
//     if (f.size() >= 10) {
//       double lat_raw, lon_raw, alt;
//       if (parse_float(f[2].c_str(), lat_raw) && parse_float(f[4].c_str(), lon_raw)) {
//         s.latitude = nmea_coord_to_deg(lat_raw, f[3].empty() ? 'N' : f[3][0]);
//         s.longitude = nmea_coord_to_deg(lon_raw, f[5].empty() ? 'E' : f[5][0]);
//         s.gps_fix = f[6] != "0";
//       }
//       s.satellites = atoi(f[7].c_str());
//       if (f.size() > 9 && parse_float(f[9].c_str(), alt)) s.altitude_m = alt;
//     }
//   } else if (line.rfind("$GPRMC", 0) == 0 || line.rfind("$GNRMC", 0) == 0) {
//     std::vector<std::string> f;
//     size_t start = 0, pos;
//     while ((pos = line.find(',', start)) != std::string::npos) {
//       f.emplace_back(line.substr(start, pos - start));
//       start = pos + 1;
//     }
//     f.emplace_back(line.substr(start));
//     if (f.size() >= 8 && f[2] == "A") {
//       double lat_raw, lon_raw, speed_kn;
//       if (parse_float(f[3].c_str(), lat_raw) && parse_float(f[5].c_str(), lon_raw)) {
//         s.latitude = nmea_coord_to_deg(lat_raw, f[4].empty() ? 'N' : f[4][0]);
//         s.longitude = nmea_coord_to_deg(lon_raw, f[6].empty() ? 'E' : f[6][0]);
//         s.gps_fix = true;
//       }
//       if (parse_float(f[7].c_str(), speed_kn)) s.speed_kmh = speed_kn * 1.852;
//     }
//   }
// }

// void update_ecg(SensorDrivers& d, SensorState& s, int ecg_raw, uint32_t now_ms, int& plot_value) {
//   bool saturated = (ecg_raw < 50) || (ecg_raw > 4045);
//   if (saturated) d.ecg_bad_count++; else d.ecg_bad_count = 0;
//   if (d.ecg_bad_count > 3) {
//     if (d.ecg_signal_ok) ESP_LOGW(TAG, "ECG signal saturated/float, ignoring until stable");
//     d.ecg_signal_ok = false;
//     d.ecg_dc = static_cast<float>(ecg_raw);
//     d.ecg_env = 0.0f;
//     d.ecg_peak = false;
//     s.ecg_heart_rate = 0.0f;
//     d.last_ecg_peak_ms = 0;
//     plot_value = 30;
//     d.ecg_plot_last = plot_value;
//     d.ecg_ac_last = 0.0f;
//     return;
//   }

//   if (!d.ecg_signal_ok && !saturated) {
//     ESP_LOGI(TAG, "ECG signal back");
//     d.ecg_signal_ok = true;
//     d.ecg_dc = static_cast<float>(ecg_raw);
//     d.ecg_env = 0.0f;
//     d.ecg_peak = false;
//     d.last_ecg_peak_ms = 0;
//   }

//   d.ecg_dc = 0.995f * d.ecg_dc + 0.005f * static_cast<float>(ecg_raw);
//   float ecg_ac = static_cast<float>(ecg_raw) - d.ecg_dc;
//   d.ecg_env = 0.90f * d.ecg_env + 0.10f * fabsf(ecg_ac);
//   d.ecg_ac_last = ecg_ac;

//   const float thresh = d.ecg_env * 1.6f + 8.0f;
//   const uint32_t refractory_ms = 250;

//   bool allow_new_peak = d.last_ecg_peak_ms == 0 || (now_ms - d.last_ecg_peak_ms) > refractory_ms;
//   if (!d.ecg_peak && allow_new_peak && ecg_ac > thresh) {
//     if (d.last_ecg_peak_ms != 0) {
//       float bpm = 60000.0f / (now_ms - d.last_ecg_peak_ms);
//       if (bpm > 35.0f && bpm < 220.0f) s.ecg_heart_rate = bpm;
//     }
//     d.last_ecg_peak_ms = now_ms;
//     d.ecg_peak = true;
//   } else if (d.ecg_peak && ecg_ac < thresh * 0.5f) {
//     d.ecg_peak = false;
//   }

//   if (d.last_ecg_peak_ms != 0 && (now_ms - d.last_ecg_peak_ms) > 4000) {
//     s.ecg_heart_rate = 0.0f;
//   }

//   float gain = (d.ecg_env > 1.0f) ? (24.0f / d.ecg_env) : 1.5f;
//   float plot_f = 30.0f + ecg_ac * gain;
//   if (plot_f < 0.0f) plot_f = 0.0f;
//   if (plot_f > 59.0f) plot_f = 59.0f;
//   plot_value = static_cast<int>(std::lround(plot_f));
//   d.ecg_plot_last = plot_value;
// }
// }  // namespace

// esp_err_t sensors_init(SensorDrivers& d) {
//   i2c_config_t i2c_conf = {};
//   i2c_conf.mode = I2C_MODE_MASTER;
//   i2c_conf.sda_io_num = PIN_I2C_SDA;
//   i2c_conf.scl_io_num = PIN_I2C_SCL;
//   i2c_conf.sda_pullup_en = GPIO_PULLUP_ENABLE;
//   i2c_conf.scl_pullup_en = GPIO_PULLUP_ENABLE;
//   i2c_conf.master.clk_speed = 400000;
//   ESP_RETURN_ON_ERROR(i2c_param_config(d.i2c_port, &i2c_conf), TAG, "i2c cfg");
//   ESP_RETURN_ON_ERROR(i2c_driver_install(d.i2c_port, I2C_MODE_MASTER, 0, 0, 0), TAG, "i2c install");

//   gpio_set_direction((gpio_num_t)PIN_ECG_LO_PLUS, GPIO_MODE_INPUT);
//   gpio_set_direction((gpio_num_t)PIN_ECG_LO_MINUS, GPIO_MODE_INPUT);
//   gpio_pullup_en((gpio_num_t)PIN_ECG_LO_PLUS);
//   gpio_pullup_en((gpio_num_t)PIN_ECG_LO_MINUS);
//   gpio_set_direction((gpio_num_t)PIN_ECG, GPIO_MODE_INPUT);
//   gpio_set_pull_mode((gpio_num_t)PIN_ECG, GPIO_FLOATING);

//   adc_oneshot_unit_init_cfg_t unit_cfg = {};
//   unit_cfg.unit_id = ADC_UNIT_1;
//   unit_cfg.clk_src = ADC_RTC_CLK_SRC_DEFAULT;
//   unit_cfg.ulp_mode = ADC_ULP_MODE_DISABLE;
//   ESP_RETURN_ON_ERROR(adc_oneshot_new_unit(&unit_cfg, &d.adc), TAG, "adc unit");

//   adc_unit_t adc_unit = ADC_UNIT_1;
//   adc_channel_t adc_chan = ADC_CHANNEL_6;
//   ESP_ERROR_CHECK(adc_oneshot_io_to_channel((gpio_num_t)PIN_ECG, &adc_unit, &adc_chan));
//   d.adc_unit = adc_unit;
//   d.adc_chan = adc_chan;

//   adc_oneshot_chan_cfg_t chan_cfg = {};
//   chan_cfg.atten = ADC_ATTEN_DB_12;  // full-scale ~3.6V for AD8232 3V3 output
//   chan_cfg.bitwidth = ADC_BITWIDTH_12;
//   ESP_RETURN_ON_ERROR(adc_oneshot_config_channel(d.adc, adc_chan, &chan_cfg), TAG, "adc ch");

//   // Quick sanity check ADC channel
//   int adc_min = 5000, adc_max = -1, adc_val = 0;
//   for (int i = 0; i < 16; ++i) {
//     if (adc_oneshot_read(d.adc, d.adc_chan, &adc_val) == ESP_OK) {
//       if (adc_val < adc_min) adc_min = adc_val;
//       if (adc_val > adc_max) adc_max = adc_val;
//     }
//     vTaskDelay(pdMS_TO_TICKS(2));
//   }
//   ESP_LOGI(TAG, "ADC sanity GPIO%d (ch%d) min=%d max=%d", PIN_ECG, d.adc_chan, adc_min, adc_max);

//   uart_config_t uart_conf = {};
//   uart_conf.baud_rate = 9600;
//   uart_conf.data_bits = UART_DATA_8_BITS;
//   uart_conf.parity = UART_PARITY_DISABLE;
//   uart_conf.stop_bits = UART_STOP_BITS_1;
//   uart_conf.flow_ctrl = UART_HW_FLOWCTRL_DISABLE;
//   ESP_RETURN_ON_ERROR(uart_param_config(d.uart_port, &uart_conf), TAG, "uart cfg");
//   ESP_RETURN_ON_ERROR(uart_set_pin(d.uart_port, PIN_GPS_TX, PIN_GPS_RX, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE), TAG, "uart pins");
//   ESP_RETURN_ON_ERROR(uart_driver_install(d.uart_port, 2048, 0, 0, nullptr, 0), TAG, "uart install");

//   i2c_scan(d.i2c_port);

//   if (!mpu6050_init(d.i2c_port)) ESP_LOGW(TAG, "MPU6050 init failed");
//   if (!max30100_init(d.i2c_port)) ESP_LOGW(TAG, "MAX30100 init failed (check wiring VCC=3V3, SDA=%d, SCL=%d)", PIN_I2C_SDA, PIN_I2C_SCL);

//   return ESP_OK;
// }

// void sensors_update(SensorDrivers& d, SensorState& s, uint32_t now_ms) {
//   int16_t ax = 0, ay = 0, az = 0;
//   if (mpu6050_read_accel(d.i2c_port, ax, ay, az)) {
//     update_step_counter(d, s, ax, ay, az, now_ms);
//   }

//   bool lo_fault = (gpio_get_level((gpio_num_t)PIN_ECG_LO_PLUS) == 1 ||
//                    gpio_get_level((gpio_num_t)PIN_ECG_LO_MINUS) == 1);
//   int ecg_raw = 0;
//   int sample_min = 0;
//   int sample_max = 0;
//   // Even if LO is faulted, still read ADC for debugging visibility
//   if (true) {
//     const int samples = 8;
//     int vals[samples];
//     bool adc_ok = true;
//     for (int i = 0; i < samples; ++i) {
//       int v = 0;
//       esp_err_t ret = adc_oneshot_read(d.adc, d.adc_chan, &v);
//       if (ret != ESP_OK) {
//         adc_ok = false;
//         break;
//       }
//       vals[i] = v;
//     }
//     if (adc_ok) {
//       std::sort(vals, vals + samples);
//       sample_min = vals[0];
//       sample_max = vals[samples - 1];
//       int trimmed_sum = 0;
//       for (int i = 2; i < samples - 2; ++i) trimmed_sum += vals[i];
//       ecg_raw = trimmed_sum / (samples - 4);
//     } else {
//       lo_fault = true;
//     }
//   }
//   s.ecg_value = ecg_raw;
//   int ecg_plot_val = 30;
//   if (!lo_fault) {
//     // Clamp any remaining extreme spikes to previous plotted value range
//     if (ecg_raw < 30) ecg_raw = 30;
//     if (ecg_raw > 4065) ecg_raw = 4065;
//     update_ecg(d, s, ecg_raw, now_ms, ecg_plot_val);
//   } else {
//     // Still show what ADC sees even khi LO hở để debug
//     if (ecg_raw < 30) ecg_raw = 30;
//     if (ecg_raw > 4065) ecg_raw = 4065;
//     update_ecg(d, s, ecg_raw, now_ms, ecg_plot_val);
//   }
//   s.ecg_buffer[s.ecg_index] = ecg_plot_val;
//   s.ecg_index = (s.ecg_index + 1) % 160;

//   static uint32_t last_ecg_log_ms = 0;
//   if (now_ms - last_ecg_log_ms > 200) {
//     ESP_LOGI(TAG, "ECG raw=%d ac=%.1f env=%.1f plot=%d bpm=%.1f lo=%s min=%d max=%d",
//              s.ecg_value, d.ecg_ac_last, d.ecg_env, d.ecg_plot_last, s.ecg_heart_rate,
//              lo_fault ? "on" : "off", sample_min, sample_max);
//     last_ecg_log_ms = now_ms;
//   }

//   MaxFifoSample fifo[8];
//   int sample_count = max30100_read_fifo(d.i2c_port, fifo, 8);
//   static int idle_fifo_count = 0;
//   if (sample_count > 0) {
//     update_heart_spo2(d, s, fifo, sample_count, now_ms);
//     idle_fifo_count = 0;
//   } else if (sample_count < 0) {
//     static uint32_t last_err_log = 0;
//     if (now_ms - last_err_log > 2000) {
//       ESP_LOGW(TAG, "MAX30100 read failed (I2C)");
//       last_err_log = now_ms;
//     }
//     idle_fifo_count++;
//   } else {
//     static uint32_t last_ptr_log = 0;
//     if (now_ms - last_ptr_log > 2000) {
//       uint8_t wr = 0, rd = 0;
//       if (i2c_read_reg1(d.i2c_port, MAX30100_ADDR, 0x02, wr) == ESP_OK &&
//           i2c_read_reg1(d.i2c_port, MAX30100_ADDR, 0x04, rd) == ESP_OK) {
//         ESP_LOGI(TAG, "MAX30100 FIFO idle wr=%u rd=%u", wr, rd);
//       }
//       last_ptr_log = now_ms;
//     }
//     idle_fifo_count++;
//   }

//   // Nếu FIFO mãi không tăng, thử reset lại mode + FIFO
//   if (idle_fifo_count > 8) {  // ~ vài giây
//     idle_fifo_count = 0;
//     ESP_LOGW(TAG, "MAX30100 FIFO stuck, reconfig");
//     i2c_write_reg(d.i2c_port, MAX30100_ADDR, 0x06, 0x00);  // reset mode
//     vTaskDelay(pdMS_TO_TICKS(5));
//     i2c_write_reg(d.i2c_port, MAX30100_ADDR, 0x02, 0x00);
//     i2c_write_reg(d.i2c_port, MAX30100_ADDR, 0x03, 0x00);
//     i2c_write_reg(d.i2c_port, MAX30100_ADDR, 0x04, 0x00);
//     i2c_write_reg(d.i2c_port, MAX30100_ADDR, 0x07, 0x47);  // 1600us, 100Hz
//     i2c_write_reg(d.i2c_port, MAX30100_ADDR, 0x09, 0x66);
//     i2c_write_reg(d.i2c_port, MAX30100_ADDR, 0x0A, 0x66);
//     i2c_write_reg(d.i2c_port, MAX30100_ADDR, 0x06, 0x03);  // HR+SpO2
//   }

//   static uint32_t last_log_ms = 0;
//   if (now_ms - last_log_ms > 1000) {
//     ESP_LOGI(TAG, "IRdc=%.0f REDdc=%.0f HR=%.1f SpO2=%.1f steps=%d ecg=%d ecgHR=%.1f",
//              d.ir_dc, d.red_dc, s.heart_rate, s.spo2, s.step_count, s.ecg_value, s.ecg_heart_rate);
//     last_log_ms = now_ms;
//   }

//   uint8_t buf[256];
//   int len = uart_read_bytes(d.uart_port, buf, sizeof(buf) - 1, 10 / portTICK_PERIOD_MS);
//   if (len > 0) {
//     buf[len] = 0;
//     std::string data(reinterpret_cast<char*>(buf));
//     size_t start = 0;
//     size_t pos;
//     while ((pos = data.find('\n', start)) != std::string::npos) {
//       auto line = data.substr(start, pos - start);
//       if (!line.empty() && line.back() == '\r') line.pop_back();
//       parse_nmea_line(line, s);
//       start = pos + 1;
//     }
//   }
// }
