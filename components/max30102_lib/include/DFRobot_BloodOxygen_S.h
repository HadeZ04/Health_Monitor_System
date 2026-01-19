/*!
 * @file DFRobot_BloodOxygen_S.h
 * @brief ESP-IDF port of DFRobot_BloodOxygen_S (I2C class API).
 *
 * This preserves the public API of:
 * - `DFRobot_BloodOxygen_S` (high-level helpers)
 * - `DFRobot_BloodOxygen_S_I2C` (I2C transport)
 *
 * Arduino-only dependencies (Arduino.h/Wire.h/Serial/RTU) are replaced with an
 * ESP-IDF `TwoWire` compatibility wrapper (`dfrobot_wire.h`).
 */
#ifndef __DFRobot_BloodOxygen_S_H__
#define __DFRobot_BloodOxygen_S_H__

#include <stdint.h>

#include "dfrobot_wire.h"

class DFRobot_BloodOxygen_S
{
public:
    /**
     * @struct sHeartbeatSPO2
     * @brief The struct for storing heart rate and oxygen saturation
     */
    typedef struct
    {
        int SPO2;
        int Heartbeat;
    } sHeartbeatSPO2;

    /**
     * @enum ebautrate
     * @brief Baud rate enum (kept for API parity)
     */
    typedef enum
    {
        BAUT_RATE_1200 = 0,
        BAUT_RATE_2400 = 1,
        BAUT_RATE_9600 = 3,
        BAUT_RATE_19200 = 5,
        BAUT_RATE_38400 = 6,
        BAUT_RATE_57600 = 7,
        BAUT_RATE_115200 = 8
    } ebautrate;

    DFRobot_BloodOxygen_S(void) {}
    virtual ~DFRobot_BloodOxygen_S(void) {}

    void getHeartbeatSPO2(void);
    float getTemperature_C(void);
    void setBautrate(ebautrate bautrate);
    uint32_t getBautrate(void);
    void sensorStartCollect(void);
    void sensorEndCollect(void);

    sHeartbeatSPO2 _sHeartbeatSPO2;
    ebautrate _bautrate;

protected:
    virtual void writeReg(uint16_t reg_addr, uint8_t *data_buf, uint8_t len) = 0;
    virtual int16_t readReg(uint16_t reg_addr, uint8_t *data_buf, uint8_t len) = 0;
};

class DFRobot_BloodOxygen_S_I2C : public DFRobot_BloodOxygen_S
{
public:
    DFRobot_BloodOxygen_S_I2C(TwoWire *pWire = &Wire, uint8_t addr = 0x57);
    ~DFRobot_BloodOxygen_S_I2C() override {}

    bool begin(void);

protected:
    void writeReg(uint16_t reg_addr, uint8_t *data_buf, uint8_t len) override;
    int16_t readReg(uint16_t reg_addr, uint8_t *data_buf, uint8_t len) override;

private:
    TwoWire *_pWire;
    uint8_t _I2C_addr;
};

#endif

