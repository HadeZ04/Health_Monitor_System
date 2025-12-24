# 🎯 Quick Reference Guide - Chatbot System

## 🚀 Start System

### Option 1: Auto Start (Linux/Mac)
```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

### Option 2: Manual Start (Windows/All)

**Terminal 1 - Qwen Router:**
```bash
python qwen_router_server.py --port 8081 --mock
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

---

## 🧪 Quick Tests

### 1. Login & Get Token
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techxen.org","password":"admin123"}' | jq

# Save token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Test Emergency Detection
```bash
curl -X POST http://localhost:4000/chat/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"question":"Tôi đau ngực dữ dội"}' | jq
```

### 3. Test General QA
```bash
curl -X POST http://localhost:4000/chat/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"Triệu chứng COVID-19 là gì?"}' | jq
```

### 4. Test PII Detection
```bash
curl -X POST http://localhost:4000/chat/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"question":"Tôi tên Nguyễn Văn A, SĐT 0901234567"}' | jq
```

### 5. Test DB Query (Requires Auth)
```bash
curl -X POST http://localhost:4000/chat/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"question":"Kết quả xét nghiệm đường huyết lần trước?"}' | jq
```

---

## 📊 Health Checks

```bash
# Qwen Router
curl http://localhost:8081/health | jq

# Backend API
curl http://localhost:4000/chat/health | jq

# All services
curl http://localhost:8081/health && \
curl http://localhost:4000/chat/health
```

---

## 🔑 Environment Variables

### Required
```env
GEMINI_API_KEY=your_key_here          # From https://makersuite.google.com
JWT_SECRET=your_secret_here           # Strong random string
```

### Optional
```env
QWEN_API_URL=http://localhost:8081    # Qwen router
ENABLE_PII_DETECTION=true             # PII protection
ENABLE_SAFETY_GATE=true               # Safety checks
ENABLE_AUDIT_LOGGING=true             # Audit logs
```

---

## 📝 Intent Classification

### 6 Intent Types

| Intent | Example | Auth Required |
|--------|---------|---------------|
| PERSONAL_DB_QUERY | "Xem xét nghiệm của tôi" | ✅ Yes |
| USER_INPUT_ANALYSIS | "Huyết áp 150/95 cao không?" | ❌ No |
| GENERAL_MEDICAL_QA | "COVID-19 là gì?" | ❌ No |
| OPERATIONAL_ADMIN | "Đặt lịch khám" | ❌ No |
| CONTEXT_FOLLOWUP | "Vậy tôi nên làm gì?" | Depends |
| OUT_OF_SCOPE | "Xin chào" / "Viết thơ" | ❌ No |

### Action Types

- `SEARCH_DB` - Query database
- `CALL_GEMINI` - Call Gemini API
- `CALL_ADMIN_TOOL` - Local tool
- `REPLY_LOCALLY` - Template response
- `EMERGENCY_RESPONSE` - Urgent safety

---

## 🔐 Security Features

### PII Types Detected
- `PATIENT_NAME` - Tên người
- `PHONE_NUMBER` - SĐT (0901234567, +84...)
- `EMAIL` - Email addresses
- `ID_NUMBER` - CCCD/CMND (9-12 digits)
- `ADDRESS` - Địa chỉ cụ thể
- `DATE_OF_BIRTH` - Ngày sinh
- `MEDICAL_RECORD_NUMBER` - Mã bệnh án

### Safety Checks
- ✅ Emergency keywords (50+)
- ✅ Self-harm indicators
- ✅ High-risk symptoms
- ✅ Drug interactions
- ✅ Prompt injection
- ✅ Special populations

---

## 🐛 Troubleshooting

### Issue: "Connection refused" to Qwen
```bash
# Check if Qwen is running
curl http://localhost:8081/health

# Restart Qwen
python qwen_router_server.py --port 8081 --mock
```

### Issue: "Gemini API key not configured"
```bash
# Check .env file
cat backend/.env | grep GEMINI_API_KEY

# Add key
echo "GEMINI_API_KEY=your_key" >> backend/.env
```

### Issue: "401 Unauthorized"
```bash
# Get new token
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techxen.org","password":"admin123"}'
```

### Issue: PII not detected
```bash
# Check config
cat backend/src/config/chatbot.config.ts | grep pii_patterns

# Test PII detection directly in code
```

---

## 📦 Project Structure

```
Health_Monitor_System/
├── backend/
│   ├── src/
│   │   ├── types/chatbot.types.ts       # All interfaces
│   │   ├── config/chatbot.config.ts     # Config & patterns
│   │   ├── services/                    # Core services
│   │   │   ├── qwenRouter.service.ts
│   │   │   ├── piiSanitization.service.ts
│   │   │   ├── medicalDB.service.ts
│   │   │   ├── gemini.service.ts
│   │   │   ├── safetyGate.service.ts
│   │   │   └── auditLog.service.ts
│   │   └── controllers/chatController.ts # Main controller
│   └── .env                              # Config (create from env.example.txt)
├── qwen_router_server.py                 # Qwen local server
├── scripts/                              # Scripts
│   ├── start.sh                          # Auto start script
│   ├── test_integration.sh/.ps1          # Integration tests
│   └── test-api.sh/.ps1                  # API tests
└── docs/
    ├── ARCHITECTURE.md                   # System design
    ├── CHATBOT_SECURE_SETUP.md          # Setup guide
    ├── TEST_CHATBOT_SCENARIOS.md        # Test scripts
    └── IMPLEMENTATION_SUMMARY.md         # Summary
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | What was built |
| [ARCHITECTURE.md](ARCHITECTURE.md) | How it works |
| [CHATBOT_SECURE_SETUP.md](CHATBOT_SECURE_SETUP.md) | How to set up |
| [TEST_CHATBOT_SCENARIOS.md](TEST_CHATBOT_SCENARIOS.md) | How to test |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | This file! |

---

## 🔄 Common Workflows

### Development Workflow
```bash
# 1. Start services
./scripts/start.sh

# 2. Make code changes
code backend/src/controllers/chatController.ts

# 3. Backend auto-reloads (nodemon)

# 4. Test
curl -X POST http://localhost:4000/chat/ask ...

# 5. Check logs
tail -f backend/logs/*.log
```

### Add New Intent
```typescript
// 1. Add to types
export type IntentType = "..." | "NEW_INTENT";

// 2. Update Qwen router
// backend/src/services/qwenRouter.service.ts
private buildClassificationPrompt() {
  // Add NEW_INTENT to prompt
}

// 3. Handle in controller
// backend/src/controllers/chatController.ts
switch (routerOutput.intent) {
  case "NEW_INTENT":
    // Handle logic
}

// 4. Test
curl -X POST http://localhost:4000/chat/ask -d '...'
```

### Add New PII Pattern
```typescript
// backend/src/config/chatbot.config.ts
pii_patterns: {
  NEW_PII_TYPE: /your-regex-here/g,
  // ...
}

// backend/src/types/chatbot.types.ts
export type PIIType = "..." | "NEW_PII_TYPE";
```

---

## 🚀 Production Deployment

### Before Deploy Checklist
- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Configure real database (Prisma)
- [ ] Setup HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup monitoring (Prometheus)
- [ ] Setup logging (ELK/Splunk)
- [ ] Security audit
- [ ] Load testing
- [ ] Backup strategy
- [ ] Incident response plan

### Docker Compose (Production)
```yaml
version: '3.9'
services:
  qwen-router:
    build: ./qwen-router
    ports: ["8081:8081"]
    
  backend:
    build: ./backend
    env_file: .env.production
    depends_on: [qwen-router, db]
    
  db:
    image: postgres:16
    volumes: [db_data:/var/lib/postgresql/data]
```

---

## 📞 Support

### Log Files
```bash
# Backend logs
tail -f backend/logs/app.log

# Qwen router logs
tail -f qwen.log

# System logs
journalctl -u chatbot-backend -f
```

### Debug Mode
```bash
# Enable debug logging
export DEBUG=chatbot:*
npm run dev

# Or in .env
NODE_ENV=development
LOG_LEVEL=debug
```

### Report Issues
Include:
1. Error message
2. Request payload
3. Logs (backend + qwen)
4. Environment (.env without secrets)
5. Steps to reproduce

---

## 🎓 Learning Resources

### Gemini API
- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Docs](https://ai.google.dev/docs)

### Qwen Model
- [Qwen GitHub](https://github.com/QwenLM/Qwen)
- [Model Card](https://huggingface.co/Qwen/Qwen-14B-Chat)

### Medical AI Ethics
- [HIPAA Guidelines](https://www.hhs.gov/hipaa/)
- [WHO AI Ethics](https://www.who.int/publications/i/item/9789240029200)

---

**Last Updated:** 2025-12-24  
**Version:** 1.0.0  
**Status:** Production-Ready (after DB integration)
