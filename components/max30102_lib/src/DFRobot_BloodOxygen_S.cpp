/*!
 * @file DFRobot_BloodOxygen_S.cpp
 * @brief ESP-IDF port of DFRobot_BloodOxygen_S (I2C class API).
 *
 * Based on: https://github.com/DFRobot/DFRobot_BloodOxygen_S
 */

#include "DFRobot_BloodOxygen_S.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

static void delay(uint32_t ms)
{
    vTaskDelay(pdMS_TO_TICKS(ms));
}

void DFRobot_BloodOxygen_S::getHeartbeatSPO2(void)
{
    uint8_t rbuf[8] = {0};
    (void)readReg(0x0C, rbuf, 8);

    _sHeartbeatSPO2.SPO2 = (int)rbuf[0];
    if (_sHeartbeatSPO2.SPO2 == 0)
    {
        _sHeartbeatSPO2.SPO2 = -1;
    }

    _sHeartbeatSPO2.Heartbeat = ((uint32_t)rbuf[2] << 24) | ((uint32_t)rbuf[3] << 16) | ((uint32_t)rbuf[4] << 8) |
                                ((uint32_t)rbuf[5]);
    if (_sHeartbeatSPO2.Heartbeat == 0)
    {
        _sHeartbeatSPO2.Heartbeat = -1;
    }
}

float DFRobot_BloodOxygen_S::getTemperature_C(void)
{
    uint8_t temp_buf[2] = {0};
    (void)readReg(0x14, temp_buf, 2);
    const float Temperature = (float)temp_buf[0] + ((float)temp_buf[1] / 100.0f);
    return Temperature;
}

void DFRobot_BloodOxygen_S::setBautrate(ebautrate bautrate)
{
    uint8_t w_buf[2];
    w_buf[0] = (uint8_t)(bautrate >> 8);
    w_buf[1] = (uint8_t)bautrate;
    writeReg(0x06, w_buf, (uint8_t)sizeof(w_buf));
    delay(100);

    w_buf[0] = 0x00;
    w_buf[1] = 0x01;
    writeReg(0x1A, w_buf, (uint8_t)sizeof(w_buf));
    delay(1000);
}

uint32_t DFRobot_BloodOxygen_S::getBautrate(void)
{
    uint8_t r_buf[2] = {0};
    (void)readReg(0x06, r_buf, (uint8_t)sizeof(r_buf));

    const uint16_t baudrate_type = (uint16_t)r_buf[0] << 8 | (uint16_t)r_buf[1];
    switch (baudrate_type)
    {
    case 0: return 1200;
    case 1: return 2400;
    case 3: return 9600;
    case 5: return 19200;
    case 6: return 38400;
    case 7: return 57600;
    case 8: return 115200;
    default: return 9600;
    }
}

void DFRobot_BloodOxygen_S::sensorStartCollect(void)
{
    uint8_t wbuf[2] = {0, 1};
    writeReg(0x20, wbuf, 2);
}

void DFRobot_BloodOxygen_S::sensorEndCollect(void)
{
    uint8_t wbuf[2] = {0, 2};
    writeReg(0x20, wbuf, 2);
}

DFRobot_BloodOxygen_S_I2C::DFRobot_BloodOxygen_S_I2C(TwoWire *pWire, uint8_t addr)
{
    _pWire = (pWire != nullptr) ? pWire : &Wire;
    _I2C_addr = addr;
}

bool DFRobot_BloodOxygen_S_I2C::begin(void)
{
    _pWire->begin();
    _pWire->beginTransmission(_I2C_addr);
    return (_pWire->endTransmission() == 0);
}

void DFRobot_BloodOxygen_S_I2C::writeReg(uint16_t reg_addr, uint8_t *data_buf, uint8_t len)
{
    _pWire->beginTransmission(_I2C_addr);
    _pWire->write((uint8_t)reg_addr);
    for (uint8_t i = 0; i < len; i++)
    {
        _pWire->write(data_buf[i]);
    }
    (void)_pWire->endTransmission();
}

int16_t DFRobot_BloodOxygen_S_I2C::readReg(uint16_t reg_addr, uint8_t *data_buf, uint8_t len)
{
    int i = 0;
    _pWire->beginTransmission(_I2C_addr);
    _pWire->write((uint8_t)reg_addr);
    if (_pWire->endTransmission() != 0)
    {
        return -1;
    }

    (void)_pWire->requestFrom(_I2C_addr, len);
    while (_pWire->available())
    {
        data_buf[i++] = (uint8_t)_pWire->read();
    }
    return (int16_t)len;
}

