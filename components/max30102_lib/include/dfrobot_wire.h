#pragma once

#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif
#include "driver/gpio.h"
#include "driver/i2c.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#ifdef __cplusplus
}
#endif

#ifndef DFROBOT_WIRE_I2C_PORT
#define DFROBOT_WIRE_I2C_PORT I2C_NUM_0
#endif

#ifndef DFROBOT_WIRE_SDA_IO
#define DFROBOT_WIRE_SDA_IO 8
#endif

#ifndef DFROBOT_WIRE_SCL_IO
#define DFROBOT_WIRE_SCL_IO 9
#endif

#ifndef DFROBOT_WIRE_FREQ_HZ
#define DFROBOT_WIRE_FREQ_HZ 100000
#endif

#ifndef DFROBOT_WIRE_TIMEOUT_MS
#define DFROBOT_WIRE_TIMEOUT_MS 1000
#endif

#ifndef DFROBOT_WIRE_BUFFER_SIZE
#define DFROBOT_WIRE_BUFFER_SIZE 64
#endif

class TwoWire
{
public:
    TwoWire();
    TwoWire(i2c_port_t port, gpio_num_t sda, gpio_num_t scl, uint32_t freq_hz = DFROBOT_WIRE_FREQ_HZ);

    void begin();

    void beginTransmission(uint8_t address);
    size_t write(uint8_t data);
    size_t write(const uint8_t *data, size_t len);
    uint8_t endTransmission(void);

    uint8_t requestFrom(uint8_t address, uint8_t quantity);
    int available(void);
    int read(void);

private:
    void ensureInit();

    i2c_port_t _port;
    gpio_num_t _sda;
    gpio_num_t _scl;
    uint32_t _freq_hz;

    uint8_t _address;

    uint8_t _tx_buf[DFROBOT_WIRE_BUFFER_SIZE];
    size_t _tx_len;

    uint8_t _rx_buf[DFROBOT_WIRE_BUFFER_SIZE];
    size_t _rx_len;
    size_t _rx_pos;

    bool _inited;
};

extern TwoWire Wire;

