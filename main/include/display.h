#pragma once
#include <cstdint>
#include "state.h"
#include "driver/spi_master.h"
#include <vector>

enum class Screen : uint8_t { Home = 0, Steps, Ecg, Heart, Gps, Count };

class Display {
public:
  Display();
  esp_err_t init();
  void showBoot();
  void render(Screen screen, const SensorState& state);

private:
  spi_device_handle_t spi_ = nullptr;
  std::vector<uint16_t> frame_;

  void writeCommand(uint8_t cmd);
  void writeData(const uint8_t* data, size_t len);
  void setAddrWindow(uint16_t x0, uint16_t y0, uint16_t x1, uint16_t y1);
  void clear(uint16_t color);
  void flush();
  void fillRect(uint16_t x, uint16_t y, uint16_t w, uint16_t h, uint16_t color);
  void drawFastHLine(uint16_t x, uint16_t y, uint16_t w, uint16_t color);
  void drawFastVLine(uint16_t x, uint16_t y, uint16_t h, uint16_t color);
  void drawLine(int x0, int y0, int x1, int y1, uint16_t color);
  void drawChar(uint16_t x, uint16_t y, char c, uint16_t color, uint16_t bg, uint8_t size);
  void drawText(uint16_t x, uint16_t y, const char* text, uint16_t color, uint8_t size = 1);

  void drawHeader(const char* title);
  void drawInfoBox(int x, int y, int w, int h, const char* label, const char* value, uint16_t color);
  void drawHeartIcon(int x, int y, uint16_t color);
  void renderHome(const SensorState& state);
  void renderSteps(const SensorState& state);
  void renderEcg(const SensorState& state);
  void renderHeart(const SensorState& state);
  void renderGps(const SensorState& state);
};
