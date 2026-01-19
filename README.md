# 🏥 Health Monitoring System with Secure Medical Chatbot

> Advanced healthcare platform with AI-powered chatbot featuring multi-layer security, PII protection, and medical compliance

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-blue)](https://ai.google.dev/)
[![Status](https://img.shields.io/badge/Status-Development-yellow)](https://github.com)

---

## 🌟 Features


### 📊 **Health Monitoring Platform**
- Real-time vital signs monitoring (ECG, SpO2, HR)
- Patient EHR management with medical history
- Predicting abnormal heart rhythms
- Alert system with configurable rules
- Analytics dashboard with trends
- Doctor-patient communication
---

## Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                   User Interface                        │
│             (Next.js 14 + TailwindCSS)                  │
│   • Live ECG Graph   • Health Alerts   • Chatbot UI     │
└─────────────────▲─────────┬─────────────────────────────┘
                  │         │ HTTPS/REST & WebSocket
┌─────────────────▼─────────▼─────────────────────────────┐
│              Backend System (Express + Python)          │
│                                                         │
│  ┌────────────────────────┐   ┌──────────────────────┐  │
│  │  Secure Chatbot Engine │   │  ECG Analysis Engine │  │
│  │ • Qwen Router          │   │ • Signal Pre-process │  │
│  │ • PII Sanitization     │   │   (Noise Filtering)  │  │
│  │ • Gemini Integration   │   │ • Anomaly Detection  │  │
│  │ • Safety Gate          │   │   (AI/Arrhythmia)    │  │◄──┐
│  └───────────┬────────────┘   └──────────┬───────────┘  │   │
│              │                           │              │   │
└──────────────┼───────────────────────────┼──────────────┘   │
               │                           │                  │
      ┌────────▼─────────┐        ┌────────▼─────────┐        │
      │    PostgreSQL    │        │    Gemini API    │        │
      │  (Patient Data   │        │   (Advisory &    │        │
      │   & ECG Logs)    │        │    Report Gen)   │        │
      └──────────────────┘        └──────────────────┘        │
               │                                              │
      ┌────────▼─────────┐                                    │
      │  Qwen 14B Local  │                                    │
      │ (Classification) │                                    │
      └──────────────────┘                                    │
                                                              │
┌─────────────────────────────────────────────────────────┐   │
│                   IoT Hardware Layer                    │   │
│                                                         │   │
│  ┌──────────────┐      ┌──────────────┐                 │   │
│  │  Patient     │      │     MCU      │   MQTT / HTTP   │   │
│  │ (Bio-Signal) ├───►  │ (ESP32/RPi)  ├─────────────────┼───┘
│  └──────────────┘      │ + FW Logic   │                 │
│         │              └──────┬───────┘                 │
│         ▼                     │                         │
│  ┌──────────────┐             │                         │
│  │  ECG Sensor  │◄────────────┘                         │
│  │ (AD8232/PPG) │                                       │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Demo
https://drive.google.com/drive/folders/1LgMZBo7TKpf__LVrDuDrsNUa-TZPPx6a?usp=sharing


## 📁 Project Structure

```
Health_Monitor_System/
├── backend/                          # Express + TypeScript API (Central Hub)
│   ├── src/
│   │   ├── types/
│   │   │   ├── chatbot.types.ts      # Interfaces for Chatbot
│   │   │   └── ecg.types.ts          # [NEW] Data definitions for ECG signals
│   │   ├── config/
│   │   │   └── app.config.ts         # System configuration
│   │   ├── services/                 # Business Logic
│   │   │   ├── qwenRouter.service.ts # Intent Classification
│   │   │   ├── piiSanitization.ts    # PII Removal / Redaction
│   │   │   ├── medicalDB.service.ts  # Electronic Health Record (EHR) queries
│   │   │   ├── gemini.service.ts     # Health Advisory (GenAI)
│   │   │   ├── safetyGate.service.ts # Content Safety Checks
│   │   │   ├── ecgProcessor.service.ts # Noise filtering & Raw signal processing
│   │   │   └── anomalyDetection.ts   #  AI Anomaly Detection (Arrhythmia)
│   │   ├── controllers/
│   │   │   ├── chatController.ts     # Chat conversation handler
│   │   │   └── ecgController.ts      # [NEW] API to receive data from IoT devices
│   │   ├── routes/                   # API Endpoint Definitions
│   │   └── server.ts                 # Entry point (Express)
│   ├── .env                          # Backend Environment variables
│   └── package.json
│
├── frontend/                         # Next.js 14 App Router (Dashboard)
│   ├── app/
│   │   ├── dashboard/                # Real-time ECG Graph page
│   │   └── chat/                     # Chatbot UI
│   └── components/                   # UI Components (Charts, Chat Bubble)
│
├── database/                         # PostgreSQL + Prisma
│   ├── schema.prisma                 # Schema: Users, ECGSessions, ChatLogs
│   └── migrations/
│
├── inference_server/                 # Python Server for Qwen/AI Local
│   ├── qwen_model.py                 # Load Qwen 14B model
│   ├── ecg_model.py                  # [NEW] AI Model for Heart Disease Detection
│   ├── server.py                     # Internal API (Flask/FastAPI)
│   └── requirements.txt
│
├── main/                             # Main Source code for ESP32 (C/C++)
│   ├── main.c                        # Main Logic: Sensor reading, MQTT/BLE sending
│   └── config                       # ESP-IDF Project Configuration
│
├── components/                       # Custom ESP32 Libraries
│   ├── ecg_sensor/                   # AD8232 Sensor Driver
│   └── ble_manager/                  # Bluetooth Connection Manager
│
├── managed_components/               # [IoT] Third-party ESP-IDF Libraries
│
├── scripts/                          # Utility Scripts
│   ├── start.sh                      # Script to start the entire system
│   └── simulate_ecg.py               # [NEW] ECG Data Simulator for testing
│
├── ble_receiver.py                   # [Python] Script running on PC/Gateway
│                                     # Receives BLE data from ESP32 -> Pushes to Backend
│
├── docker-compose.yml                # Orchestration (DB, Backend, Inference)
├── CMakeLists.txt                    # Build config for ESP32 Project
├── README.md                         # Project Documentation
└── requirements.txt                  # Python dependencies (Shared)


---

