#include "dfrobot_wire.h"

#include <string.h>

#include "esp_err.h"

TwoWire Wire;

TwoWire::TwoWire()
    : TwoWire(DFROBOT_WIRE_I2C_PORT, (gpio_num_t)DFROBOT_WIRE_SDA_IO, (gpio_num_t)DFROBOT_WIRE_SCL_IO,
              DFROBOT_WIRE_FREQ_HZ)
{
}

TwoWire::TwoWire(i2c_port_t port, gpio_num_t sda, gpio_num_t scl, uint32_t freq_hz)
    : _port(port),
      _sda(sda),
      _scl(scl),
      _freq_hz(freq_hz),
      _address(0),
      _tx_buf(),
      _tx_len(0),
      _rx_buf(),
      _rx_len(0),
      _rx_pos(0),
      _inited(false)
{
}

void TwoWire::begin()
{
    ensureInit();
}

void TwoWire::ensureInit()
{
    if (_inited)
    {
        return;
    }

    i2c_config_t conf;
    memset(&conf, 0, sizeof(conf));
    conf.mode = I2C_MODE_MASTER;
    conf.sda_io_num = _sda;
    conf.scl_io_num = _scl;
    conf.sda_pullup_en = GPIO_PULLUP_ENABLE;
    conf.scl_pullup_en = GPIO_PULLUP_ENABLE;
    conf.master.clk_speed = _freq_hz;
    conf.clk_flags = 0;

    (void)i2c_param_config(_port, &conf);

    esp_err_t err = i2c_driver_install(_port, conf.mode, 0, 0, 0);
    if (err != ESP_OK && err != ESP_ERR_INVALID_STATE)
    {
        // Keep _inited=false so callers will keep trying.
        return;
    }

    _inited = true;
}

void TwoWire::beginTransmission(uint8_t address)
{
    _address = address;
    _tx_len = 0;
}

size_t TwoWire::write(uint8_t data)
{
    if (_tx_len >= DFROBOT_WIRE_BUFFER_SIZE)
    {
        return 0;
    }

    _tx_buf[_tx_len++] = data;
    return 1;
}

size_t TwoWire::write(const uint8_t *data, size_t len)
{
    if (data == nullptr || len == 0)
    {
        return 0;
    }

    size_t written = 0;
    while (written < len)
    {
        if (write(data[written]) == 0)
        {
            break;
        }
        written++;
    }
    return written;
}

uint8_t TwoWire::endTransmission(void)
{
    ensureInit();

    const TickType_t timeout_ticks = pdMS_TO_TICKS(DFROBOT_WIRE_TIMEOUT_MS);
    esp_err_t err = ESP_FAIL;

    if (!_inited)
    {
        _tx_len = 0;
        return 4;
    }

    if (_tx_len == 0)
    {
        // Probe (address + STOP), matches Arduino Wire.beginTransmission/endTransmission without payload.
        i2c_cmd_handle_t cmd = i2c_cmd_link_create();
        i2c_master_start(cmd);
        i2c_master_write_byte(cmd, (uint8_t)((_address << 1) | I2C_MASTER_WRITE), true);
        i2c_master_stop(cmd);
        err = i2c_master_cmd_begin(_port, cmd, timeout_ticks);
        i2c_cmd_link_delete(cmd);
    }
    else
    {
        err = i2c_master_write_to_device(_port, _address, _tx_buf, _tx_len, timeout_ticks);
    }

    _tx_len = 0;

    // Arduino endTransmission() returns 0 on success, non-zero on error.
    return (err == ESP_OK) ? 0 : 4;
}

uint8_t TwoWire::requestFrom(uint8_t address, uint8_t quantity)
{
    ensureInit();

    if (!_inited)
    {
        _rx_len = 0;
        _rx_pos = 0;
        return 0;
    }

    const size_t to_read = (quantity > DFROBOT_WIRE_BUFFER_SIZE) ? (size_t)DFROBOT_WIRE_BUFFER_SIZE : (size_t)quantity;
    const TickType_t timeout_ticks = pdMS_TO_TICKS(DFROBOT_WIRE_TIMEOUT_MS);

    esp_err_t err = i2c_master_read_from_device(_port, address, _rx_buf, to_read, timeout_ticks);
    if (err != ESP_OK)
    {
        _rx_len = 0;
        _rx_pos = 0;
        return 0;
    }

    _rx_len = to_read;
    _rx_pos = 0;
    return (uint8_t)to_read;
}

int TwoWire::available(void)
{
    if (_rx_pos >= _rx_len)
    {
        return 0;
    }
    return (int)(_rx_len - _rx_pos);
}

int TwoWire::read(void)
{
    if (available() == 0)
    {
        return -1;
    }
    return (int)_rx_buf[_rx_pos++];
}

