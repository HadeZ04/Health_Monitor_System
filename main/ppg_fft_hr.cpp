#include "ppg_fft_hr.h"

#include <algorithm>
#include <cmath>

#include "esp_dsp.h"
#include "esp_err.h"
#include "esp_log.h"

namespace {
static const char* TAG = "PPG_FFT";

constexpr float kBpmMin = 35.0f;
constexpr float kBpmMax = 220.0f;

constexpr float kFftFreqMinHz = 0.7f;  // 42 bpm
constexpr float kFftFreqMaxHz = 4.0f;  // 240 bpm

constexpr float kMinSnr = 3.0f;

constexpr float kDerivEmaAlpha = 0.05f;
constexpr float kDerivFactor = 10.0f;
constexpr float kDerivMinNorm = 0.08f;  // 8%/sample is almost always an artifact at 100Hz

constexpr uint32_t kHoldLastBpmMs = 3000;
constexpr uint32_t kHoldLastSpo2Ms = 5000;

static inline float clampf(float v, float lo, float hi) { return std::max(lo, std::min(v, hi)); }

static void meanStd(const float* x, int n, float* mean_out, float* std_out) {
  if (mean_out) *mean_out = 0.0f;
  if (std_out) *std_out = 0.0f;
  if (x == nullptr || n <= 1) return;

  double sum = 0.0;
  for (int i = 0; i < n; ++i) sum += x[i];
  const float mean = (float)(sum / (double)n);

  double var = 0.0;
  for (int i = 0; i < n; ++i) {
    const double d = (double)x[i] - (double)mean;
    var += d * d;
  }
  var /= (double)n;

  if (mean_out) *mean_out = mean;
  if (std_out) *std_out = (float)std::sqrt(var);
}

static void histPush(std::array<float, 10>& hist, int& head, int& count, float v) {
  hist[head] = v;
  head = (head + 1) % (int)hist.size();
  if (count < (int)hist.size()) count++;
}

static void histCopy(const std::array<float, 10>& hist, int head, int count, float* out) {
  if (out == nullptr || count <= 0) return;
  const int n = std::min(count, (int)hist.size());
  const int start = (head - n + (int)hist.size()) % (int)hist.size();
  for (int i = 0; i < n; ++i) out[i] = hist[(start + i) % (int)hist.size()];
}
}  // namespace

bool PpgFftHrProcessor::init() {
  if (dsp_inited_) return true;

  const esp_err_t ret = dsps_fft2r_init_fc32(NULL, CONFIG_DSP_MAX_FFT_SIZE);
  if (ret != ESP_OK && ret != ESP_ERR_DSP_REINITIALIZED) {
    ESP_LOGE(TAG, "dsps_fft2r_init_fc32 failed: %d", (int)ret);
    return false;
  }
  dsps_wind_hann_f32(window_, kFftSize);
  dsp_inited_ = true;
  return true;
}

void PpgFftHrProcessor::reset() {
  head_ = 0;
  count_ = 0;
  has_prev_ = false;
  prev_ir_ = 0.0f;
  prev_red_ = 0.0f;
  abs_deriv_norm_ema_ = 0.0f;
  artifact_count_ = 0;

  last_bpm_ = -1.0f;
  last_spo2_ = -1.0f;
  last_bpm_ms_ = 0;
  last_spo2_ms_ = 0;

  bpm_hist_count_ = 0;
  bpm_hist_head_ = 0;
  spo2_hist_count_ = 0;
  spo2_hist_head_ = 0;
}

void PpgFftHrProcessor::ringPush(float ir, float red) {
  ir_[head_] = ir;
  red_[head_] = red;
  head_ = (head_ + 1) % kRingSize;
  if (count_ < kRingSize) count_++;
}

void PpgFftHrProcessor::ringCopyLast(int n, float* ir_out, float* red_out) const {
  if (n <= 0 || ir_out == nullptr) return;
  n = std::min(n, count_);
  const int start = (head_ - n + kRingSize) % kRingSize;
  for (int i = 0; i < n; ++i) {
    const int idx = (start + i) % kRingSize;
    ir_out[i] = ir_[idx];
    if (red_out) red_out[i] = red_[idx];
  }
}

void PpgFftHrProcessor::push(uint32_t ir_raw_u, uint32_t red_raw_u) {
  const float ir_raw = (float)ir_raw_u;
  const float red_raw = (float)red_raw_u;

  if (!has_prev_) {
    has_prev_ = true;
    prev_ir_ = ir_raw;
    prev_red_ = red_raw;
    ringPush(ir_raw, red_raw);
    return;
  }

  const float denom = std::max(prev_ir_, 1.0f);
  const float deriv_norm = (ir_raw - prev_ir_) / denom;
  const float abs_deriv_norm = std::fabs(deriv_norm);

  if (abs_deriv_norm_ema_ <= 0.0f) {
    abs_deriv_norm_ema_ = abs_deriv_norm;
  }

  const float thresh = std::max(kDerivMinNorm, kDerivFactor * abs_deriv_norm_ema_);
  const bool artifact = abs_deriv_norm > thresh;
  if (artifact) {
    artifact_count_++;
    ringPush(prev_ir_, prev_red_);
    return;
  }

  abs_deriv_norm_ema_ = (1.0f - kDerivEmaAlpha) * abs_deriv_norm_ema_ + kDerivEmaAlpha * abs_deriv_norm;
  prev_ir_ = ir_raw;
  prev_red_ = red_raw;
  ringPush(ir_raw, red_raw);
}

float PpgFftHrProcessor::estimateBpmFft(const float* ir, int n, float* snr_out) {
  if (snr_out) *snr_out = 0.0f;
  if (!dsp_inited_ || ir == nullptr || n != kFftSize) return -1.0f;

  float mean = 0.0f;
  float std = 0.0f;
  meanStd(ir, n, &mean, &std);
  if (!std::isfinite(std) || std <= 0.0f) return -1.0f;

  const float rel_ac = std / std::max(mean, 1.0f);
  if (rel_ac < 0.0005f) {
    return -1.0f;  // likely no finger / too flat
  }

  for (int i = 0; i < n; ++i) {
    const float v = (ir[i] - mean) * window_[i];
    fft_[2 * i + 0] = v;
    fft_[2 * i + 1] = 0.0f;
  }

  if (dsps_fft2r_fc32(fft_, n) != ESP_OK) return -1.0f;
  if (dsps_bit_rev_fc32(fft_, n) != ESP_OK) return -1.0f;

  const float fs = (float)kSampleRateHz;
  const int k_min = std::max(1, (int)std::ceil(kFftFreqMinHz * (float)n / fs));
  const int k_max = std::min((n / 2) - 2, (int)std::floor(kFftFreqMaxHz * (float)n / fs));
  if (k_max <= k_min) return -1.0f;

  int best_k = -1;
  float best_mag = 0.0f;
  double sum_mag = 0.0;
  int mag_count = 0;
  for (int k = k_min; k <= k_max; ++k) {
    const float re = fft_[2 * k + 0];
    const float im = fft_[2 * k + 1];
    const float mag = re * re + im * im;
    sum_mag += (double)mag;
    mag_count++;
    if (mag > best_mag) {
      best_mag = mag;
      best_k = k;
    }
  }
  if (best_k < 0 || best_mag <= 0.0f || mag_count <= 0) return -1.0f;

  const float noise = (float)((sum_mag - (double)best_mag) / (double)std::max(1, mag_count - 1));
  const float snr = best_mag / std::max(noise, 1e-9f);
  if (snr_out) *snr_out = snr;
  if (!std::isfinite(snr) || snr < kMinSnr) return -1.0f;

  float delta = 0.0f;
  if (best_k > 0 && best_k < (n / 2) - 1) {
    const auto mag_at = [&](int k) -> float {
      const float re = fft_[2 * k + 0];
      const float im = fft_[2 * k + 1];
      return re * re + im * im;
    };
    const float m1 = std::log(std::max(mag_at(best_k - 1), 1e-12f));
    const float m2 = std::log(std::max(mag_at(best_k), 1e-12f));
    const float m3 = std::log(std::max(mag_at(best_k + 1), 1e-12f));
    const float denom = (m1 - 2.0f * m2 + m3);
    if (std::fabs(denom) > 1e-12f) {
      delta = 0.5f * (m1 - m3) / denom;
      delta = clampf(delta, -0.5f, 0.5f);
    }
  }

  const float freq = ((float)best_k + delta) * fs / (float)n;
  const float bpm = freq * 60.0f;
  if (!std::isfinite(bpm) || bpm < kBpmMin || bpm > kBpmMax) return -1.0f;
  return bpm;
}

float PpgFftHrProcessor::estimateSpo2(const float* ir, const float* red, int n) {
  if (ir == nullptr || red == nullptr || n < 50) return -1.0f;

  float ir_mean = 0.0f, ir_std = 0.0f;
  float red_mean = 0.0f, red_std = 0.0f;
  meanStd(ir, n, &ir_mean, &ir_std);
  meanStd(red, n, &red_mean, &red_std);
  if (!std::isfinite(ir_mean) || !std::isfinite(red_mean) || ir_mean <= 0.0f || red_mean <= 0.0f) return -1.0f;
  if (!std::isfinite(ir_std) || !std::isfinite(red_std) || ir_std <= 0.0f || red_std <= 0.0f) return -1.0f;

  const float ir_ac_dc = ir_std / std::max(ir_mean, 1.0f);
  const float red_ac_dc = red_std / std::max(red_mean, 1.0f);
  if (ir_ac_dc < 0.0003f || red_ac_dc < 0.0003f) return -1.0f;

  const float ratio = (red_ac_dc) / std::max(ir_ac_dc, 1e-9f);
  float spo2 = 110.0f - 25.0f * ratio;
  spo2 = clampf(spo2, 0.0f, 100.0f);

  // Typical display ranges.
  if (spo2 < 50.0f || spo2 > 100.0f) return -1.0f;
  return spo2;
}

bool PpgFftHrProcessor::acceptBpm(uint32_t now_ms, float bpm) {
  if (!std::isfinite(bpm) || bpm < kBpmMin || bpm > kBpmMax) return false;

  if (bpm_hist_count_ >= 3) {
    float tmp[10] = {0};
    histCopy(bpm_hist_, bpm_hist_head_, bpm_hist_count_, tmp);
    float mean = 0.0f, std = 0.0f;
    meanStd(tmp, bpm_hist_count_, &mean, &std);
    const float diff = std::fabs(bpm - mean);
    const float thresh = std::max(15.0f, 3.0f * std);
    if (diff > thresh) return false;
  }

  if (last_bpm_ > 0.0f && std::fabs(bpm - last_bpm_) > 35.0f) return false;

  histPush(bpm_hist_, bpm_hist_head_, bpm_hist_count_, bpm);
  last_bpm_ = bpm;
  last_bpm_ms_ = now_ms;
  return true;
}

bool PpgFftHrProcessor::acceptSpo2(uint32_t now_ms, float spo2) {
  if (!std::isfinite(spo2) || spo2 < 50.0f || spo2 > 100.0f) return false;

  if (spo2_hist_count_ >= 3) {
    float tmp[10] = {0};
    histCopy(spo2_hist_, spo2_hist_head_, spo2_hist_count_, tmp);
    float mean = 0.0f, std = 0.0f;
    meanStd(tmp, spo2_hist_count_, &mean, &std);
    const float diff = std::fabs(spo2 - mean);
    const float thresh = std::max(6.0f, 3.0f * std);
    if (diff > thresh) return false;
  }

  if (last_spo2_ > 0.0f && std::fabs(spo2 - last_spo2_) > 8.0f) return false;

  histPush(spo2_hist_, spo2_hist_head_, spo2_hist_count_, spo2);
  last_spo2_ = spo2;
  last_spo2_ms_ = now_ms;
  return true;
}

bool PpgFftHrProcessor::estimate(uint32_t now_ms, PpgEstimates* out) {
  if (out == nullptr) return false;
  out->bpm = -1.0f;
  out->spo2 = -1.0f;
  out->bpm_snr = 0.0f;
  out->artifacts = artifact_count_;

  if (!ready()) {
    return false;
  }

  float ir_win[kFftSize];
  float red_win[kFftSize];
  ringCopyLast(kFftSize, ir_win, red_win);

  float snr = 0.0f;
  const float bpm = estimateBpmFft(ir_win, kFftSize, &snr);
  if (bpm > 0.0f) {
    (void)acceptBpm(now_ms, bpm);
  }

  // SpO2 tends to stabilize with a shorter window; reuse last ~3 seconds.
  constexpr int kSpo2N = 300;
  float ir_s[kSpo2N];
  float red_s[kSpo2N];
  if (count_ >= kSpo2N) {
    ringCopyLast(kSpo2N, ir_s, red_s);
    const float spo2 = estimateSpo2(ir_s, red_s, kSpo2N);
    if (spo2 > 0.0f) {
      (void)acceptSpo2(now_ms, spo2);
    }
  }

  // Hold last accepted values briefly to avoid flicker when a single estimate is rejected.
  if (last_bpm_ > 0.0f && (now_ms - last_bpm_ms_) <= kHoldLastBpmMs) {
    out->bpm = last_bpm_;
    out->bpm_snr = snr;
  }
  if (last_spo2_ > 0.0f && (now_ms - last_spo2_ms_) <= kHoldLastSpo2Ms) {
    out->spo2 = last_spo2_;
  }

  return true;
}

