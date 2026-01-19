#include "max3010x_ppg.h"

#include <algorithm>

#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

namespace {
static const char* TAG = "MAX3010X";

constexpr uint8_t REG_PART_ID = 0xFF;
constexpr uint8_t REG_REV_ID = 0xFE;

// MAX30102 registers
constexpr uint8_t MAX30102_REG_INTR_STATUS_1 = 0x00;
constexpr uint8_t MAX30102_REG_INTR_STATUS_2 = 0x01;
constexpr uint8_t MAX30102_REG_INTR_ENABLE_1 = 0x02;
constexpr uint8_t MAX30102_REG_INTR_ENABLE_2 = 0x03;
constexpr uint8_t MAX30102_REG_FIFO_WR_PTR = 0x04;
constexpr uint8_t MAX30102_REG_OVF_COUNTER = 0x05;
constexpr uint8_t MAX30102_REG_FIFO_RD_PTR = 0x06;
constexpr uint8_t MAX30102_REG_FIFO_DATA = 0x07;
constexpr uint8_t MAX30102_REG_FIFO_CONFIG = 0x08;
constexpr uint8_t MAX30102_REG_MODE_CONFIG = 0x09;
constexpr uint8_t MAX30102_REG_SPO2_CONFIG = 0x0A;
constexpr uint8_t MAX30102_REG_LED1_PA = 0x0C;  // Red
constexpr uint8_t MAX30102_REG_LED2_PA = 0x0D;  // IR

// MAX30100 registers
constexpr uint8_t MAX30100_REG_INTERRUPT_STATUS = 0x00;
constexpr uint8_t MAX30100_REG_INTERRUPT_ENABLE = 0x01;
constexpr uint8_t MAX30100_REG_FIFO_WR_PTR = 0x02;
constexpr uint8_t MAX30100_REG_OVF_COUNTER = 0x03;
constexpr uint8_t MAX30100_REG_FIFO_RD_PTR = 0x04;
constexpr uint8_t MAX30100_REG_FIFO_DATA = 0x05;
constexpr uint8_t MAX30100_REG_MODE_CONFIG = 0x06;
constexpr uint8_t MAX30100_REG_SPO2_CONFIG = 0x07;
constexpr uint8_t MAX30100_REG_LED_IR = 0x09;
constexpr uint8_t MAX30100_REG_LED_RED = 0x0A;

inline void delayMs(uint32_t ms) { vTaskDelay(pdMS_TO_TICKS(ms)); }
}  // namespace

bool Max3010xPpg::begin(TwoWire* wire, uint8_t addr) {
  wire_ = (wire != nullptr) ? wire : &Wire;
  addr_ = addr;

  wire_->begin();
  if (!detectModel()) {
    ESP_LOGW(TAG, "No supported MAX3010x detected at 0x%02X", addr_);
    return false;
  }
  if (!configure()) {
    ESP_LOGE(TAG, "MAX3010x configure failed (model=%d)", (int)model_);
    return false;
  }
  return true;
}

bool Max3010xPpg::writeReg(uint8_t reg, uint8_t value) {
  wire_->beginTransmission(addr_);
  wire_->write(reg);
  wire_->write(value);
  return wire_->endTransmission() == 0;
}

bool Max3010xPpg::readReg(uint8_t reg, uint8_t* buf, int len) {
  if (buf == nullptr || len <= 0) return false;
  wire_->beginTransmission(addr_);
  wire_->write(reg);
  if (wire_->endTransmission() != 0) return false;
  const uint8_t got = wire_->requestFrom(addr_, (uint8_t)len);
  if (got != (uint8_t)len) return false;
  for (int i = 0; i < len; ++i) {
    const int v = wire_->read();
    if (v < 0) return false;
    buf[i] = (uint8_t)v;
  }
  return true;
}

bool Max3010xPpg::readRegU8(uint8_t reg, uint8_t* value) {
  return readReg(reg, value, 1);
}

bool Max3010xPpg::detectModel() {
  uint8_t part = 0;
  uint8_t rev = 0;
  if (!readRegU8(REG_PART_ID, &part)) return false;
  (void)readRegU8(REG_REV_ID, &rev);

  // MAX30102 part ID is 0x15, MAX30100 is 0x11.
  if (part == 0x15) {
    model_ = Max3010xModel::Max30102;
  } else if (part == 0x11) {
    model_ = Max3010xModel::Max30100;
  } else {
    model_ = Max3010xModel::Unknown;
    ESP_LOGW(TAG, "Unknown PART_ID=0x%02X REV=0x%02X", part, rev);
    return false;
  }

  ESP_LOGI(TAG, "Detected model=%s PART_ID=0x%02X REV=0x%02X",
           (model_ == Max3010xModel::Max30102) ? "MAX30102" : "MAX30100", part, rev);
  return true;
}

bool Max3010xPpg::configure() {
  if (model_ == Max3010xModel::Max30102) {
    uint8_t tmp = 0;
    (void)readRegU8(MAX30102_REG_INTR_STATUS_1, &tmp);
    (void)readRegU8(MAX30102_REG_INTR_STATUS_2, &tmp);

    if (!writeReg(MAX30102_REG_MODE_CONFIG, 0x40)) return false;
    // MAX30102: MODE_CONFIG bit6 is RESET (self-clearing).
    bool reset_ok = false;
    for (int i = 0; i < 50; ++i) {
      uint8_t mode = 0;
      if (!readRegU8(MAX30102_REG_MODE_CONFIG, &mode)) return false;
      if ((mode & 0x40) == 0) {
        reset_ok = true;
        break;
      }
      delayMs(10);
    }
    if (!reset_ok) return false;

    if (!writeReg(MAX30102_REG_FIFO_WR_PTR, 0x00)) return false;
    if (!writeReg(MAX30102_REG_OVF_COUNTER, 0x00)) return false;
    if (!writeReg(MAX30102_REG_FIFO_RD_PTR, 0x00)) return false;

    // FIFO: sample avg = 4, FIFO rollover = 1, almost full = 0
    if (!writeReg(MAX30102_REG_FIFO_CONFIG, 0x50)) return false;

    // SpO2 config: ADC range=4096nA, sample rate=100Hz, pulse width=411us (18-bit)
    if (!writeReg(MAX30102_REG_SPO2_CONFIG, 0x27)) return false;

    // LED currents (tune as needed)
    if (!writeReg(MAX30102_REG_LED1_PA, 0x24)) return false;
    if (!writeReg(MAX30102_REG_LED2_PA, 0x24)) return false;

    // Enable SpO2 mode (red+IR)
    if (!writeReg(MAX30102_REG_MODE_CONFIG, 0x03)) return false;

    // Enable PPG_RDY interrupt (optional)
    (void)writeReg(MAX30102_REG_INTR_ENABLE_1, 0x40);
    (void)writeReg(MAX30102_REG_INTR_ENABLE_2, 0x00);
    return true;
  }

  if (model_ == Max3010xModel::Max30100) {
    // Stop
    if (!writeReg(MAX30100_REG_MODE_CONFIG, 0x00)) return false;
    delayMs(10);

    uint8_t tmp = 0;
    (void)readRegU8(MAX30100_REG_INTERRUPT_STATUS, &tmp);

    // Clear FIFO pointers
    if (!writeReg(MAX30100_REG_FIFO_WR_PTR, 0x00)) return false;
    if (!writeReg(MAX30100_REG_OVF_COUNTER, 0x00)) return false;
    if (!writeReg(MAX30100_REG_FIFO_RD_PTR, 0x00)) return false;

    // SpO2 config: hi-res, 100Hz, 1600us pulse width
    if (!writeReg(MAX30100_REG_SPO2_CONFIG, 0x47)) return false;

    // LED currents (~24mA, tune as needed)
    if (!writeReg(MAX30100_REG_LED_IR, 0x66)) return false;
    if (!writeReg(MAX30100_REG_LED_RED, 0x66)) return false;

    // Mode: HR + SpO2
    if (!writeReg(MAX30100_REG_MODE_CONFIG, 0x03)) return false;

    // Interrupts optional
    (void)writeReg(MAX30100_REG_INTERRUPT_ENABLE, 0x00);
    return true;
  }

  return false;
}

int Max3010xPpg::readFifo(Max3010xSample* out, int max_samples) {
  if (out == nullptr || max_samples <= 0) return 0;

  if (model_ == Max3010xModel::Max30102) {
    uint8_t wr = 0, rd = 0;
    if (!readRegU8(MAX30102_REG_FIFO_WR_PTR, &wr)) return -1;
    if (!readRegU8(MAX30102_REG_FIFO_RD_PTR, &rd)) return -1;

    int count = (int)((wr - rd) & 0x1F);  // FIFO depth=32
    count = std::min(count, max_samples);
    if (count <= 0) return 0;

    constexpr int kBytesPerSample = 6;
    const int bytes = count * kBytesPerSample;
    uint8_t buf[10 * kBytesPerSample];
    if (bytes > (int)sizeof(buf)) {
      count = (int)(sizeof(buf) / kBytesPerSample);
    }
    if (count <= 0) return 0;

    if (!readReg(MAX30102_REG_FIFO_DATA, buf, count * kBytesPerSample)) return -1;

    for (int i = 0; i < count; ++i) {
      const uint8_t* p = &buf[i * kBytesPerSample];
      const uint32_t red = (((uint32_t)p[0] << 16) | ((uint32_t)p[1] << 8) | (uint32_t)p[2]) & 0x3FFFF;
      const uint32_t ir = (((uint32_t)p[3] << 16) | ((uint32_t)p[4] << 8) | (uint32_t)p[5]) & 0x3FFFF;
      out[i] = {.ir = ir, .red = red};
    }
    return count;
  }

  if (model_ == Max3010xModel::Max30100) {
    uint8_t wr = 0, rd = 0;
    if (!readRegU8(MAX30100_REG_FIFO_WR_PTR, &wr)) return -1;
    if (!readRegU8(MAX30100_REG_FIFO_RD_PTR, &rd)) return -1;

    int count = (int)((wr - rd) & 0x0F);  // FIFO depth=16
    count = std::min(count, max_samples);
    if (count <= 0) return 0;

    constexpr int kBytesPerSample = 4;
    const int bytes = count * kBytesPerSample;
    uint8_t buf[16 * kBytesPerSample];
    if (bytes > (int)sizeof(buf)) {
      count = (int)(sizeof(buf) / kBytesPerSample);
    }
    if (count <= 0) return 0;

    if (!readReg(MAX30100_REG_FIFO_DATA, buf, count * kBytesPerSample)) return -1;

    for (int i = 0; i < count; ++i) {
      const uint8_t* p = &buf[i * kBytesPerSample];
      const uint32_t ir = ((uint32_t)p[0] << 8) | (uint32_t)p[1];
      const uint32_t red = ((uint32_t)p[2] << 8) | (uint32_t)p[3];
      out[i] = {.ir = ir, .red = red};
    }
    return count;
  }

  return -1;
}
