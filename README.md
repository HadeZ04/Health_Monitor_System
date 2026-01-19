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

## 🏗️ Architecture

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


---

## 🚀 Demo
https://drive.google.com/drive/folders/1LgMZBo7TKpf__LVrDuDrsNUa-TZPPx6a?usp=sharing


## 📁 Project Structure

```
Health_Monitor_System/
├── backend/                                   # Express + TypeScript API
│   ├── src/
│   │   ├── types/chatbot.types.ts            # TypeScript interfaces
│   │   ├── config/chatbot.config.ts          # Config & patterns
│   │   ├── services/                         # Business logic
│   │   │   ├── qwenRouter.service.ts         # Intent classification
│   │   │   ├── piiSanitization.service.ts    # PII removal
│   │   │   ├── medicalDB.service.ts          # Database queries
│   │   │   ├── gemini.service.ts             # Gemini API
│   │   │   ├── safetyGate.service.ts         # Safety checks
│   │   │   └── auditLog.service.ts           # Audit logging
│   │   ├── controllers/chatController.ts     # Main orchestrator
│   │   ├── routes/                           # API routes
│   │   └── server.ts                         # Express server
│   ├── .env                                  # Configuration
│   └── package.json
├── frontend/                                  # Next.js 14 App Router
├── database/                                  # Prisma schema + migrations
├── inference_server/                          # OLD inference (giữ lại)
├── qwen_router_server.py                     # Qwen local server
├── requirements.txt                           # Python deps
├── scripts/                                   # Utility scripts
│   ├── start.sh                              # Auto start script
│   ├── test_integration.sh/.ps1              # Integration tests
│   └── test-api.sh/.ps1                      # API tests
└── docs/                                      # Documentation
    ├── ARCHITECTURE.md                       # System design
    ├── CHATBOT_SECURE_SETUP.md              # Setup guide
    ├── FRONTEND_INTEGRATION.md              # FE-BE integration
    ├── TEST_CHATBOT_SCENARIOS.md            # Test scenarios
    ├── QUICK_REFERENCE.md                   # Quick reference
    └── IMPLEMENTATION_SUMMARY.md             # What was built
```

---

## 🧪 Example Conversations

### Emergency Detection
```
👤 User: "Tôi đau ngực dữ dội và khó thở"

🤖 Bot: 
🚨 CẢNH BÁO KHẨN CẤP 🚨

⚠️ Triệu chứng của bạn có thể nghiêm trọng.
Vui lòng GỌI NGAY 115 hoặc đến cơ sở y tế gần nhất.
Đừng trì hoãn!

📞 GỌI NGAY: 115
```

### PII Protection
```
👤 User: "Tôi tên Nguyễn Văn A, SĐT 0901234567, đường huyết cao"

🔒 System: 
- Detected PII: PATIENT_NAME, PHONE_NUMBER
- Sanitized: "Tôi tên [TÊN_BỆNH_NHÂN], SĐT [SỐ_ĐIỆN_THOẠI], đường huyết cao"
- Sent to Gemini: Clean version only

🤖 Bot: "Đường huyết cao cần được theo dõi và điều trị..."
```

### Real-time Analysis
```
👤 User: "Tôi vừa đo huyết áp 150/95, có cao không?"

🤖 Bot: "Huyết áp 150/95 mmHg cao hơn mức bình thường (120/80).
Đây là huyết áp ở mức Cao huyết áp Giai đoạn 1...
💡 Khuyến nghị: Gặp bác sĩ để đánh giá và tư vấn điều trị."
```

---


[Documentation](docs/QUICK_REFERENCE.md) • [Architecture](docs/ARCHITECTURE.md) • [Setup Guide](docs/CHATBOT_SECURE_SETUP.md) • [Tests](docs/TEST_CHATBOT_SCENARIOS.md)

</div>
