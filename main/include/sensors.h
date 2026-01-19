#pragma once
#include <cstdint>
#include "driver/i2c.h"
#include "driver/uart.h"
#include "esp_adc/adc_oneshot.h"
#include "state.h"

struct SensorDrivers {
  i2c_port_t i2c_port = I2C_NUM_0;
  uart_port_t uart_port = UART_NUM_2;
  adc_oneshot_unit_handle_t adc = nullptr;
  adc_unit_t adc_unit = ADC_UNIT_1;
  adc_channel_t adc_chan = ADC_CHANNEL_6;
  uint32_t last_step_ms = 0;
  float last_accel_mag = 0.0f;
  float accel_lp = 1.0f;
  bool step_high = false;
  float ir_dc = 0.0f;
  float red_dc = 0.0f;
  uint32_t last_beat_ms = 0;
  uint32_t last_valid_hr_ms = 0;
  int warmup_count = 0;
  float ecg_dc = 0.0f;
  float ecg_env = 0.0f;
  bool ecg_peak = false;
  uint32_t last_ecg_peak_ms = 0;
  float ecg_ac_last = 0.0f;
  int ecg_plot_last = 0;
  int ecg_bad_count = 0;
  bool ecg_signal_ok = true;
};

esp_err_t sensors_init(SensorDrivers& drv);
void sensors_update(SensorDrivers& drv, SensorState& state, uint32_t now_ms);
