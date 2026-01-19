idf_component_register(
    SRCS "app_main.cpp" "ble_health.c" "max3010x_ppg.cpp" "ppg_fft_hr.cpp"
    INCLUDE_DIRS "include"
    REQUIRES max30102_lib bt nvs_flash esp-dsp esp_adc
)
