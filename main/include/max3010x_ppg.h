#pragma once

#include <cstdint>

#include "dfrobot_wire.h"

enum class Max3010xModel : uint8_t {
  Unknown = 0,
  Max30100 = 1,
  Max30102 = 2,
};

struct Max3010xSample {
  uint32_t ir = 0;
  uint32_t red = 0;
};

class Max3010xPpg {
 public:
  bool begin(TwoWire* wire = &Wire, uint8_t addr = 0x57);
  Max3010xModel model() const { return model_; }

  // Returns number of samples read (0..max_samples). -1 on I2C error.
  int readFifo(Max3010xSample* out, int max_samples);

 private:
  bool writeReg(uint8_t reg, uint8_t value);
  bool readReg(uint8_t reg, uint8_t* buf, int len);
  bool readRegU8(uint8_t reg, uint8_t* value);

  bool detectModel();
  bool configure();

  TwoWire* wire_ = nullptr;
  uint8_t addr_ = 0x57;
  Max3010xModel model_ = Max3010xModel::Unknown;
};

