#pragma once
#include <cstddef>

struct SensorState {
  int step_count = 0;
  float heart_rate = 0.0f;
  float spo2 = 0.0f;
  int ecg_value = 0;
  int ecg_buffer[160] = {0};
  std::size_t ecg_index = 0;
  float ecg_heart_rate = 0.0f;
  double latitude = 0.0;
  double longitude = 0.0;
  int satellites = 0;
  float speed_kmh = 0.0f;
  float altitude_m = 0.0f;
  bool gps_fix = false;
};
