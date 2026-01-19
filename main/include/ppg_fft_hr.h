#pragma once

#include <array>
#include <cstdint>

struct PpgEstimates {
  float bpm = -1.0f;
  float spo2 = -1.0f;
  float bpm_snr = 0.0f;  // peak/noise ratio (linear)
  uint32_t artifacts = 0;
};

class PpgFftHrProcessor {
 public:
  static constexpr int kSampleRateHz = 100;
  static constexpr int kBufferSeconds = 7;
  static constexpr int kRingSize = kSampleRateHz * kBufferSeconds;
  static constexpr int kFftSize = 512;  // ~5.12s @ 100Hz

  PpgFftHrProcessor() = default;

  bool init();
  void reset();

  void push(uint32_t ir_raw, uint32_t red_raw);
  bool ready() const { return count_ >= kFftSize; }

  // Returns true if a fresh computation was attempted (even if values are invalid).
  bool estimate(uint32_t now_ms, PpgEstimates* out);

 private:
  void ringPush(float ir, float red);
  void ringCopyLast(int n, float* ir_out, float* red_out) const;

  float estimateBpmFft(const float* ir, int n, float* snr_out);
  float estimateSpo2(const float* ir, const float* red, int n);

  bool acceptBpm(uint32_t now_ms, float bpm);
  bool acceptSpo2(uint32_t now_ms, float spo2);

  // Raw ring buffer (stores latest 5-7s data).
  std::array<float, kRingSize> ir_{};
  std::array<float, kRingSize> red_{};
  int head_ = 0;
  int count_ = 0;

  // Derivative check (artifact rejection).
  bool has_prev_ = false;
  float prev_ir_ = 0.0f;
  float prev_red_ = 0.0f;
  float abs_deriv_norm_ema_ = 0.0f;
  uint32_t artifact_count_ = 0;

  // Accepted outputs + timestamps.
  float last_bpm_ = -1.0f;
  float last_spo2_ = -1.0f;
  uint32_t last_bpm_ms_ = 0;
  uint32_t last_spo2_ms_ = 0;

  // Outlier rejection history (last 10 accepted).
  std::array<float, 10> bpm_hist_{};
  int bpm_hist_count_ = 0;
  int bpm_hist_head_ = 0;
  std::array<float, 10> spo2_hist_{};
  int spo2_hist_count_ = 0;
  int spo2_hist_head_ = 0;

  // FFT scratch.
  bool dsp_inited_ = false;
  alignas(16) float window_[kFftSize]{};
  alignas(16) float fft_[kFftSize * 2]{};
};

