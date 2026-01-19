#include "display.h"
#include "pins.h"
#include <algorithm>
#include <cstring>
#include <string>
#include <vector>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_check.h"
#include "esp_log.h"

namespace {
constexpr const char* TAG = "display";
constexpr uint16_t COLOR_BG = 0x0000;
constexpr uint16_t COLOR_PRIMARY = 0x07FF;
constexpr uint16_t COLOR_SUCCESS = 0x07E0;
constexpr uint16_t COLOR_DANGER = 0xF800;
constexpr uint16_t COLOR_WARNING = 0xFFE0;
constexpr uint16_t COLOR_TEXT = 0xFFFF;

constexpr uint16_t TFT_WIDTH = 160;
constexpr uint16_t TFT_HEIGHT = 128;

constexpr uint8_t MADCTL_MX = 0x40;
constexpr uint8_t MADCTL_MY = 0x80;
constexpr uint8_t MADCTL_MV = 0x20;
constexpr uint8_t MADCTL_BGR = 0x08;

// 5x7 font from classic glcdfont (public domain)
const uint8_t font5x7[] = {
#include "glcdfont.inc"
};

inline uint16_t color565(uint8_t r, uint8_t g, uint8_t b) {
  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}
}  // namespace

Display::Display() = default;

esp_err_t Display::init() {
  spi_bus_config_t buscfg = {};
  buscfg.mosi_io_num = PIN_TFT_MOSI;
  buscfg.miso_io_num = -1;
  buscfg.sclk_io_num = PIN_TFT_SCLK;
  buscfg.quadwp_io_num = -1;
  buscfg.quadhd_io_num = -1;
  buscfg.data4_io_num = -1;
  buscfg.data5_io_num = -1;
  buscfg.data6_io_num = -1;
  buscfg.data7_io_num = -1;
  buscfg.max_transfer_sz = TFT_WIDTH * TFT_HEIGHT * 2 + 8;

  ESP_RETURN_ON_ERROR(spi_bus_initialize(SPI2_HOST, &buscfg, SPI_DMA_CH_AUTO), TAG, "bus init");

  spi_device_interface_config_t devcfg = {};
  devcfg.command_bits = 0;
  devcfg.address_bits = 0;
  devcfg.dummy_bits = 0;
  devcfg.mode = 0;
  devcfg.clock_speed_hz = 20 * 1000 * 1000;
  devcfg.spics_io_num = PIN_TFT_CS;
  devcfg.queue_size = 4;
  devcfg.flags = SPI_DEVICE_HALFDUPLEX;

  ESP_RETURN_ON_ERROR(spi_bus_add_device(SPI2_HOST, &devcfg, &spi_), TAG, "add device");

  gpio_config_t io_conf = {};
  io_conf.intr_type = GPIO_INTR_DISABLE;
  io_conf.mode = GPIO_MODE_OUTPUT;
  io_conf.pin_bit_mask = (1ULL << PIN_TFT_DC) | (1ULL << PIN_TFT_RST);
  io_conf.pull_down_en = GPIO_PULLDOWN_DISABLE;
  io_conf.pull_up_en = GPIO_PULLUP_DISABLE;
  ESP_RETURN_ON_ERROR(gpio_config(&io_conf), TAG, "gpio");

  gpio_set_level((gpio_num_t)PIN_TFT_RST, 0);
  vTaskDelay(pdMS_TO_TICKS(20));
  gpio_set_level((gpio_num_t)PIN_TFT_RST, 1);
  vTaskDelay(pdMS_TO_TICKS(120));

  struct Cmd {
    uint8_t cmd;
    const uint8_t* data;
    uint8_t len;
    uint16_t delay_ms;
  };

  // Orientation: landscape, normal (flip MX to remove mirror)
  static const uint8_t madctl = MADCTL_MV | MADCTL_MX | MADCTL_BGR;
  static const uint8_t colmod = 0x05;
  static const uint8_t framerate[] = {0x00, 0x06};
  static const uint8_t pwctr1[] = {0x02, 0x70};
  static const uint8_t pwctr2[] = {0x05};
  static const uint8_t pwctr3[] = {0x01, 0x02};
  static const uint8_t vmctr1[] = {0x3C, 0x38};
  static const uint8_t invoff = 0x20;
  static const uint8_t normal = 0x13;
  static const uint8_t disp_on = 0x29;
  static const uint8_t slpout = 0x11;

  const Cmd init_seq[] = {
      {0x01, nullptr, 0, 150},  // SWRESET
      {0x11, nullptr, 0, 120},  // SLPOUT
      {0x3A, &colmod, 1, 10},   // COLMOD 16bit
      {0x36, &madctl, 1, 10},   // MADCTL rotation
      {0xB1, framerate, 2, 10},
      {0xB4, pwctr1, 2, 10},
      {0xB7, pwctr2, 1, 10},
      {0xC0, pwctr3, 2, 10},
      {0xC5, vmctr1, 2, 10},
      {invoff, nullptr, 0, 10},
      {normal, nullptr, 0, 10},
      {slpout, nullptr, 0, 120},
      {disp_on, nullptr, 0, 10},
  };

  for (auto& c : init_seq) {
    writeCommand(c.cmd);
    if (c.len && c.data) writeData(c.data, c.len);
    if (c.delay_ms) vTaskDelay(pdMS_TO_TICKS(c.delay_ms));
  }

  // set full window
  setAddrWindow(0, 0, TFT_WIDTH - 1, TFT_HEIGHT - 1);
  uint16_t black = COLOR_BG;
  std::vector<uint16_t> buf(TFT_WIDTH * TFT_HEIGHT, black);
  writeCommand(0x2C);
  writeData(reinterpret_cast<uint8_t*>(buf.data()), buf.size() * sizeof(uint16_t));
  return ESP_OK;
}

void Display::writeCommand(uint8_t cmd) {
  gpio_set_level((gpio_num_t)PIN_TFT_DC, 0);
  spi_transaction_t t = {};
  t.length = 8;
  t.tx_buffer = &cmd;
  spi_device_polling_transmit(spi_, &t);
}

void Display::writeData(const uint8_t* data, size_t len) {
  if (!len) return;
  gpio_set_level((gpio_num_t)PIN_TFT_DC, 1);
  spi_transaction_t t = {};
  t.length = len * 8;
  t.tx_buffer = data;
  spi_device_polling_transmit(spi_, &t);
}

void Display::setAddrWindow(uint16_t x0, uint16_t y0, uint16_t x1, uint16_t y1) {
  uint8_t caset[] = {static_cast<uint8_t>(x0 >> 8), static_cast<uint8_t>(x0 & 0xFF),
                     static_cast<uint8_t>(x1 >> 8), static_cast<uint8_t>(x1 & 0xFF)};
  uint8_t raset[] = {static_cast<uint8_t>(y0 >> 8), static_cast<uint8_t>(y0 & 0xFF),
                     static_cast<uint8_t>(y1 >> 8), static_cast<uint8_t>(y1 & 0xFF)};
  writeCommand(0x2A);
  writeData(caset, sizeof(caset));
  writeCommand(0x2B);
  writeData(raset, sizeof(raset));
  writeCommand(0x2C);
}

void Display::fillRect(uint16_t x, uint16_t y, uint16_t w, uint16_t h, uint16_t color) {
  if (x >= TFT_WIDTH || y >= TFT_HEIGHT) return;
  if (x + w - 1 >= TFT_WIDTH) w = TFT_WIDTH - x;
  if (y + h - 1 >= TFT_HEIGHT) h = TFT_HEIGHT - y;
  setAddrWindow(x, y, x + w - 1, y + h - 1);
  constexpr size_t CHUNK_PIXELS = 1024;
  std::vector<uint16_t> buf(std::min<size_t>(w * h, CHUNK_PIXELS), color);
  size_t total = w * h;
  while (total > 0) {
    size_t batch = std::min(total, CHUNK_PIXELS);
    writeData(reinterpret_cast<uint8_t*>(buf.data()), batch * sizeof(uint16_t));
    total -= batch;
  }
}

void Display::drawFastHLine(uint16_t x, uint16_t y, uint16_t w, uint16_t color) {
  fillRect(x, y, w, 1, color);
}

void Display::drawFastVLine(uint16_t x, uint16_t y, uint16_t h, uint16_t color) {
  fillRect(x, y, 1, h, color);
}

void Display::drawLine(int x0, int y0, int x1, int y1, uint16_t color) {
  int dx = abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  int dy = -abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  int err = dx + dy, e2;
  while (true) {
    fillRect(x0, y0, 1, 1, color);
    if (x0 == x1 && y0 == y1) break;
    e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

void Display::drawChar(uint16_t x, uint16_t y, char c, uint16_t color, uint16_t bg, uint8_t size) {
  if (c < 32 || c > 127) return;
  const uint8_t* glyph = font5x7 + (c - 32) * 5;
  for (int i = 0; i < 6; i++) {
    uint8_t line = (i == 5) ? 0x0 : glyph[i];
    for (int j = 0; j < 8; j++) {
      uint16_t col = (line & 0x1) ? color : bg;
      if (size == 1) {
        fillRect(x + i, y + j, 1, 1, col);
      } else {
        fillRect(x + i * size, y + j * size, size, size, col);
      }
      line >>= 1;
    }
  }
}

void Display::drawText(uint16_t x, uint16_t y, const char* text, uint16_t color, uint8_t size) {
  uint16_t cursor_x = x;
  while (*text) {
    if (*text == '\n') {
      cursor_x = x;
      y += 8 * size;
      text++;
      continue;
    }
    drawChar(cursor_x, y, *text, color, COLOR_BG, size);
    cursor_x += 6 * size;
    text++;
  }
}

void Display::showBoot() {
  fillRect(0, 0, TFT_WIDTH, TFT_HEIGHT, COLOR_PRIMARY);
  drawText(20, 30, "HEALTH", COLOR_TEXT, 2);
  drawText(15, 50, "MONITOR", COLOR_TEXT, 2);
  drawText(30, 80, "Starting...", COLOR_TEXT, 1);
  for (int i = 0; i < 3; ++i) {
    fillRect(50 + i * 20, 100, 6, 6, COLOR_TEXT);
    vTaskDelay(pdMS_TO_TICKS(250));
  }
  fillRect(0, 0, TFT_WIDTH, TFT_HEIGHT, COLOR_BG);
}

void Display::render(Screen screen, const SensorState& state) {
  fillRect(0, 0, TFT_WIDTH, TFT_HEIGHT, COLOR_BG);
  switch (screen) {
    case Screen::Home:  renderHome(state); break;
    case Screen::Steps: renderSteps(state); break;
    case Screen::Ecg:   renderEcg(state); break;
    case Screen::Heart: renderHeart(state); break;
    case Screen::Gps:   renderGps(state); break;
    default: break;
  }
}

void Display::drawHeader(const char* title) {
  fillRect(0, 0, TFT_WIDTH, 18, COLOR_PRIMARY);
  drawText((TFT_WIDTH - strlen(title) * 6) / 2, 5, title, COLOR_TEXT, 1);
}

void Display::drawInfoBox(int x, int y, int w, int h, const char* label, const char* value, uint16_t color) {
  drawFastHLine(x, y, w, color);
  drawFastHLine(x, y + h, w, color);
  drawFastVLine(x, y, h, color);
  drawFastVLine(x + w, y, h, color);
  drawText(x + 3, y + 4, label, color, 1);
  drawText(x + 3, y + 16, value, COLOR_TEXT, 2);
}

void Display::drawHeartIcon(int x, int y, uint16_t color) {
  fillRect(x - 5, y, 5, 5, color);
  fillRect(x, y, 5, 5, color);
  fillRect(x - 8, y + 4, 18, 8, color);
  fillRect(x - 4, y + 8, 10, 8, color);
}

void Display::renderHome(const SensorState& state) {
  drawHeader("DASHBOARD");
  char buf[32];
  int y = 25;
  snprintf(buf, sizeof(buf), "%d", state.step_count);
  drawInfoBox(5, y, 75, 35, "STEPS", buf, COLOR_SUCCESS);
  if (state.heart_rate > 0) snprintf(buf, sizeof(buf), "%d", (int)state.heart_rate); else snprintf(buf, sizeof(buf), "--");
  drawInfoBox(85, y, 75, 35, "BPM", buf, COLOR_DANGER);
  y += 40;
  if (state.spo2 > 0) snprintf(buf, sizeof(buf), "%d%%", (int)state.spo2); else snprintf(buf, sizeof(buf), "--");
  drawInfoBox(5, y, 75, 35, "SpO2", buf, COLOR_PRIMARY);
  snprintf(buf, sizeof(buf), "%d sat", state.satellites);
  drawInfoBox(85, y, 75, 35, "GPS", buf, COLOR_WARNING);
  drawText(35, 115, "Auto-switching", COLOR_TEXT, 1);
}

void Display::renderSteps(const SensorState& state) {
  drawHeader("STEP COUNTER");
  char buf[48];
  snprintf(buf, sizeof(buf), "%d", state.step_count);
  drawText(40, 45, buf, COLOR_SUCCESS, 3);
  drawText(55, 75, "steps", COLOR_TEXT, 1);
  float distance_km = state.step_count * 0.0007f;
  int calories = static_cast<int>(state.step_count * 0.04f);
  snprintf(buf, sizeof(buf), "Distance: %.2f km", distance_km);
  drawText(10, 95, buf, COLOR_TEXT, 1);
  snprintf(buf, sizeof(buf), "Calories: %d kcal", calories);
  drawText(10, 107, buf, COLOR_TEXT, 1);
}

void Display::renderEcg(const SensorState& state) {
  drawHeader("ECG MONITOR");
  for (int x = 0; x < TFT_WIDTH; x += 10) drawFastVLine(x, 25, 60, 0x18C3);
  for (int y = 25; y < 85; y += 10) drawFastHLine(0, y, TFT_WIDTH, 0x18C3);
  for (int i = 1; i < 160; i++) {
    int y1 = 85 - state.ecg_buffer[(state.ecg_index + i - 1) % 160];
    int y2 = 85 - state.ecg_buffer[(state.ecg_index + i) % 160];
    drawLine(i - 1, y1, i, y2, COLOR_DANGER);
  }
  drawText(10, 95, state.ecg_value > 0 ? "Status: Monitoring" : "Status: No signal", COLOR_TEXT, 1);
  char buf[32];
  snprintf(buf, sizeof(buf), "Value: %d", state.ecg_value);
  drawText(10, 107, buf, COLOR_TEXT, 1);
}

void Display::renderHeart(const SensorState& state) {
  drawHeader("HEART RATE");
  if ((xTaskGetTickCount() * portTICK_PERIOD_MS) % 1000 < 500) drawHeartIcon(70, 45, COLOR_DANGER);
  char buf[32];
  if (state.heart_rate > 0) snprintf(buf, sizeof(buf), "%d", (int)state.heart_rate); else snprintf(buf, sizeof(buf), "--");
  drawText(45, 70, buf, COLOR_DANGER, 3);
  drawText(68, 95, "BPM", COLOR_TEXT, 1);
  if (state.spo2 > 0) snprintf(buf, sizeof(buf), "Blood Oxygen: %d%%", (int)state.spo2);
  else snprintf(buf, sizeof(buf), "Blood Oxygen: --");
  drawText(10, 110, buf, COLOR_TEXT, 1);
}

void Display::renderGps(const SensorState& state) {
  drawHeader("GPS LOCATION");
  char buf[48];
  if (state.gps_fix) {
    snprintf(buf, sizeof(buf), "Lat: %.6f", state.latitude);
  } else {
    snprintf(buf, sizeof(buf), "Lat: No signal");
  }
  drawText(10, 30, buf, COLOR_TEXT, 1);
  if (state.gps_fix) {
    snprintf(buf, sizeof(buf), "Lng: %.6f", state.longitude);
  } else {
    snprintf(buf, sizeof(buf), "Lng: No signal");
  }
  drawText(10, 45, buf, COLOR_TEXT, 1);
  snprintf(buf, sizeof(buf), "Satellites: %d", state.satellites);
  drawText(10, 65, buf, COLOR_TEXT, 1);
  snprintf(buf, sizeof(buf), "Speed: %.1f km/h", state.speed_kmh);
  drawText(10, 80, buf, COLOR_TEXT, 1);
  snprintf(buf, sizeof(buf), "Altitude: %.0f m", state.altitude_m);
  drawText(10, 95, buf, COLOR_TEXT, 1);
}
