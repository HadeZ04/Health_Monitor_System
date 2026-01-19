#pragma once

// TFT ST7735
constexpr int PIN_TFT_CS = 5;
constexpr int PIN_TFT_RST = 4;
constexpr int PIN_TFT_DC = 2;
constexpr int PIN_TFT_MOSI = 23;
constexpr int PIN_TFT_SCLK = 18;

// ECG AD8232
// Đổi sang GPIO35 (ADC1_CH7) để thử nếu GPIO34 nhiễu/hỏng
constexpr int PIN_ECG = 35;
constexpr int PIN_ECG_LO_PLUS = 25;
constexpr int PIN_ECG_LO_MINUS = 26;

// GPS UART2
constexpr int PIN_GPS_RX = 16;
constexpr int PIN_GPS_TX = 17;

// I2C (MPU6050 + MAX30100)
// constexpr int PIN_I2C_SDA = 21;
// constexpr int PIN_I2C_SCL = 22;
