# 🏥 Health Monitoring System with Secure Medical Chatbot

> Advanced healthcare platform with AI-powered chatbot featuring multi-layer security, PII protection, and medical compliance

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-blue)](https://ai.google.dev/)
[![Status](https://img.shields.io/badge/Status-Development-yellow)](https://github.com)

---

## 🌟 Features

### 🤖 **Secure Medical Chatbot** (NEW!)
- **6 Intent Types:** Personal data query, real-time analysis, general QA, admin tools, follow-up, out-of-scope
- **7 Security Layers:** Input validation, safety gate, auth, PII sanitization, DB security, output validation, audit logging
- **PII Protection:** Automatic detection & removal of 7 PII/PHI types (names, phones, IDs, addresses...)
- **Emergency Detection:** 50+ emergency keywords with immediate safety response
- **Medical Compliance:** HIPAA-ready audit trails, consent management, data minimization

### 📊 **Health Monitoring Platform**
- Real-time vital signs monitoring (ECG, SpO2, HR, PPG, PCG, GPS)
- Patient EHR management with medical history
- Alert system with configurable rules
- Analytics dashboard with trends
- Doctor-patient communication

### 🔐 **Enterprise Security**
- JWT authentication with role-based access control
- Multi-layer PII/PHI protection
- Prompt injection prevention
- Comprehensive audit logging
- GDPR-compliant data retention

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                      │
│              (Next.js 14 + TailwindCSS)                │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTPS/REST
┌─────────────────▼───────────────────────────────────────┐
│              Backend API (Express)                      │
│  ┌────────────────────────────────────────────────┐    │
│  │         Secure Chatbot Engine                  │    │
│  │  • Qwen Router (Intent Classification)        │    │
│  │  • PII Sanitization                           │    │
│  │  • Safety Gate                                │    │
│  │  • Gemini Integration                         │    │
│  │  • Audit Logging                              │    │
│  └────────────────────────────────────────────────┘    │
└─────────────┬───────────────────┬─────────────────────┘
              │                   │
    ┌─────────▼─────────┐   ┌────▼──────────┐
    │  PostgreSQL       │   │  Gemini API   │
    │  (Patient Data)   │   │  (Google AI)  │
    └───────────────────┘   └───────────────┘
              │
    ┌─────────▼─────────┐
    │  Qwen 14B Local   │
    │  (Classification) │
    └───────────────────┘
```

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed diagrams**

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://www.python.org/))
- **PostgreSQL** 16+ ([Download](https://www.postgresql.org/))
- **Gemini API Key** ([Get Free Key](https://makersuite.google.com/app/apikey))

### 1. Clone & Install

```bash
git clone https://github.com/HadeZ04/Health_Monitor_System.git
cd Health_Monitor_System

# Install backend dependencies
cd backend
npm install
cd ..

# Install Python dependencies (for Qwen router)
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy environment template
cp backend/env.example.txt backend/.env

# Edit .env and add your Gemini API key
# Get key from: https://makersuite.google.com/app/apikey
nano backend/.env
```

**Required in `.env`:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_secure_random_string
QWEN_API_URL=http://localhost:8081
```

### 3. Start Services

**Option A: Auto Start (Linux/Mac)**
```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

**Option B: Manual Start**

Terminal 1 - Qwen Router:
```bash
python qwen_router_server.py --port 8081 --mock
```

Terminal 2 - Backend:
```bash
cd backend
npm run dev
```

### 4. Test

```bash
# Get authentication token
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techxen.org","password":"admin123"}'

# Test chatbot
TOKEN="your_token_here"
curl -X POST http://localhost:4000/chat/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"question":"Triệu chứng COVID-19 là gì?"}'
```

**🎉 You're ready! See [QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) for more examples**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [**🚀 Quick Reference**](docs/QUICK_REFERENCE.md) | Common commands & workflows |
| [**🏗️ Architecture**](docs/ARCHITECTURE.md) | System design & data flows |
| [**⚙️ Setup Guide**](docs/CHATBOT_SECURE_SETUP.md) | Detailed installation steps |
| [**🧪 Test Scenarios**](docs/TEST_CHATBOT_SCENARIOS.md) | 10+ test scripts with examples |
| [**📦 Implementation**](docs/IMPLEMENTATION_SUMMARY.md) | What was built & how |

---

## 🎯 Chatbot Features Deep Dive

### 6 Intent Types Handled

| Intent | Example | Auth Required | DB Access | Gemini Call |
|--------|---------|---------------|-----------|-------------|
| **PERSONAL_DB_QUERY** | "Xét nghiệm lần trước của tôi?" | ✅ | ✅ | ✅ |
| **USER_INPUT_ANALYSIS** | "Huyết áp 150/95 có cao không?" | ❌ | ❌ | ✅ |
| **GENERAL_MEDICAL_QA** | "COVID-19 là gì?" | ❌ | ❌ | ✅ |
| **OPERATIONAL_ADMIN** | "Đặt lịch khám" | ❌ | ❌ | ❌ |
| **CONTEXT_FOLLOWUP** | "Vậy tôi nên làm gì?" | Depends | Depends | ✅ |
| **OUT_OF_SCOPE** | "Xin chào" / "Viết code" | ❌ | ❌ | ❌ |

### Security Features

✅ **PII/PHI Protection**
- Detect & remove: Names, phones, emails, IDs, addresses, DOB, medical record numbers
- Replace with placeholders before sending to Gemini
- Validate sanitization success

✅ **Safety Gate**
- Emergency keyword detection (50+ keywords)
- Self-harm & suicide indicators
- High-risk symptoms (chest pain, stroke, bleeding...)
- Drug interaction warnings
- Special populations (pregnancy, pediatric, elderly)

✅ **Prompt Injection Prevention**
- Detect malicious patterns: "ignore previous instructions", "show all data"
- Block SQL injection attempts
- Reject script injection

✅ **Audit Logging**
- Track all DB accesses
- Log PII detections
- Record safety alerts
- Generate compliance reports
- Auto-anonymize old logs (GDPR)

---

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

## 🛠️ Development

### Run Tests
```bash
# See docs/TEST_CHATBOT_SCENARIOS.md for full test suite
cd scripts
./test_emergency.sh
./test_pii.sh
./test_db_query.sh
```

### Add New Intent
```typescript
// 1. Add to types/chatbot.types.ts
export type IntentType = "..." | "NEW_INTENT";

// 2. Update services/qwenRouter.service.ts
// Add classification logic

// 3. Handle in controllers/chatController.ts
case "NEW_INTENT":
  // Your logic here
```

### Monitor Logs
```bash
# Backend logs
tail -f backend/logs/app.log

# Qwen logs
tail -f qwen.log
```

---

## 🚢 Deployment

### Docker Compose (Production)

```bash
# Build and start all services
docker compose up -d

# Services:
# - PostgreSQL (port 5432)
# - Backend API (port 4000)
# - Frontend UI (port 3000)
# - Qwen Router (port 8081)
```

### Environment Variables (Production)

```env
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
GEMINI_API_KEY=<your-key>
DATABASE_URL=postgresql://...
ENABLE_AUDIT_LOGGING=true
```

**⚠️ See [CHATBOT_SECURE_SETUP.md](docs/CHATBOT_SECURE_SETUP.md) for full production checklist**

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Guidelines
- Add tests for new features
- Update documentation
- Follow TypeScript best practices
- Include audit logging for new actions
- Test with all 6 intent types

---

## 📄 License

Private - Internal Use Only

---

## 👨‍💻 Author

**HadeZ04**
- GitHub: [@HadeZ04](https://github.com/HadeZ04)

---

## 🙏 Acknowledgments

- [Qwen by Alibaba Cloud](https://github.com/QwenLM/Qwen) - Intent classification
- [Google Gemini](https://ai.google.dev/) - Medical Q&A
- [Next.js](https://nextjs.org/) - Frontend framework
- [Prisma](https://www.prisma.io/) - Database ORM

---

## 📞 Support

- 📧 Email: support@healthmonitor.com
- 📖 Docs: [Full Documentation](docs/QUICK_REFERENCE.md)
- 🐛 Issues: [GitHub Issues](https://github.com/HadeZ04/Health_Monitor_System/issues)

---

<div align="center">

**Built with ❤️ for Healthcare**

[Documentation](docs/QUICK_REFERENCE.md) • [Architecture](docs/ARCHITECTURE.md) • [Setup Guide](docs/CHATBOT_SECURE_SETUP.md) • [Tests](docs/TEST_CHATBOT_SCENARIOS.md)

</div>
