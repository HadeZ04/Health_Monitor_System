# Kiến Trúc Hệ Thống Chatbot Y Tế Bảo Mật

## 📐 Sơ Đồ Tổng Quan

```
┌─────────────┐
│   User      │
│  (Patient)  │
└──────┬──────┘
       │ HTTP Request
       │ (Question)
       ▼
┌──────────────────────────────────────────────────────┐
│          Backend API (Express + TypeScript)          │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │  Step 1: Input Validation & Injection Check    │  │
│  │  - Normalize text                              │  │
│  │  - Detect prompt injection                     │  │
│  └────────────────────────────────────────────────┘  │
│                      │                                │
│                      ▼                                │
│  ┌────────────────────────────────────────────────┐  │
│  │  Step 2: Safety Gate                           │  │
│  │  - Emergency keyword detection                 │  │
│  │  - Self-harm indicators                        │  │
│  │  - High-risk symptoms                          │  │
│  │  - Drug safety checks                          │  │
│  └────────────────────────────────────────────────┘  │
│                      │                                │
│         ┌────────────┴────────────┐                  │
│         │  EMERGENCY?             │                  │
│         └─────┬──────────┬────────┘                  │
│              YES        NO                            │
│               │          │                            │
│               ▼          ▼                            │
│  ┌──────────────┐  ┌────────────────────────────┐   │
│  │  Return      │  │  Step 3: Intent             │   │
│  │  Emergency   │  │  Classification (Qwen)      │   │
│  │  Response    │  │  - Call Qwen local API      │   │
│  │  + Audit     │  │  - Get: intent, action,     │   │
│  │              │  │    confidence, specs        │   │
│  └──────────────┘  └────────────────────────────┘   │
│                              │                        │
│                              ▼                        │
│  ┌────────────────────────────────────────────────┐  │
│  │  Step 4: Authentication Check                  │  │
│  │  - If requires_auth && !userId → 401           │  │
│  └────────────────────────────────────────────────┘  │
│                      │                                │
│                      ▼                                │
│  ┌────────────────────────────────────────────────┐  │
│  │  Step 5: Route by Action                       │  │
│  └────────────────────────────────────────────────┘  │
│         │                                             │
│    ┌────┴────┬────────┬────────┬────────┐           │
│    │         │        │        │        │            │
│    ▼         ▼        ▼        ▼        ▼            │
│ SEARCH_DB CALL_   REPLY_ ADMIN_ EMERGENCY            │
│           GEMINI  LOCALLY TOOL   RESPONSE             │
└───┬─────────┬────────┬─────────┬────────────────────┘
    │         │        │         │
    │         │        │         │
    ▼         │        │         ▼
┌─────────┐   │        │    ┌──────────┐
│Local DB │   │        │    │Admin Tool│
│(Prisma) │   │        │    │(Booking, │
└────┬────┘   │        │    │ Pricing) │
     │        │        │    └──────────┘
     │ Raw    │        │
     │ Data   │        ▼
     ▼        │    ┌──────────┐
┌─────────┐   │    │Template  │
│PII      │   │    │Response  │
│Sanitize │   │    └──────────┘
└────┬────┘   │
     │        │
     │Cleaned │
     │Data    │
     ▼        │
┌─────────────┴────────────┐
│   Gemini API             │
│   (Google Cloud)         │
│   - Medical Q&A          │
│   - No PII received      │
└────────┬─────────────────┘
         │
         │ Response
         ▼
┌─────────────────────────┐
│  Output Validation      │
│  - Check for PII leak   │
│  - Validate safety      │
│  - Rewrite if needed    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Audit Logging          │
│  - Log all actions      │
│  - Track PII access     │
│  - Security monitoring  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Return Response        │
│  to User                │
└─────────────────────────┘
```

---

## 🎯 6 Case Xử Lý

### Case 1: PERSONAL_DB_QUERY
**Trigger:** "Kết quả xét nghiệm lần trước của tôi"

```
User Input → Safety Check → Qwen Router
                              ↓
                        [SEARCH_DB]
                              ↓
                        Check Auth (Required)
                              ↓
                        Query Database
                              ↓
                        Sanitize PII
                        (Remove: name, ID, DOB...)
                              ↓
                        Gemini API
                        (Clean data only)
                              ↓
                        Validate Response
                              ↓
                        Audit Log
                              ↓
                        Return Answer
```

**Key Points:**
- ✅ Authentication REQUIRED
- ✅ Database accessed with least privilege
- ✅ PII removed before Gemini
- ✅ Audit log records DB access

---

### Case 2: USER_INPUT_ANALYSIS
**Trigger:** "Tôi vừa đo huyết áp 150/95"

```
User Input → Safety Check → Qwen Router
                              ↓
                        [CALL_GEMINI]
                              ↓
                        PII Scan
                        (Remove names, phones...)
                              ↓
                        Gemini API
                        (Analyze metrics)
                              ↓
                        Validate Response
                              ↓
                        Return Answer
```

**Key Points:**
- ✅ No DB access (real-time data)
- ✅ PII scan on input
- ✅ Direct Gemini call
- ❌ No authentication required

---

### Case 3: GENERAL_MEDICAL_QA
**Trigger:** "Tiểu đường type 2 là gì?"

```
User Input → Safety Check → Qwen Router
                              ↓
                        [CALL_GEMINI]
                              ↓
                        Gemini API
                        (General knowledge)
                              ↓
                        Return Answer
```

**Key Points:**
- ✅ Simplest flow
- ❌ No DB, no auth, no PII
- ✅ Public knowledge only

---

### Case 4: OPERATIONAL_ADMIN
**Trigger:** "Đặt lịch khám", "Giá xét nghiệm"

```
User Input → Qwen Router
               ↓
         [CALL_ADMIN_TOOL]
               ↓
         Local Function
         (booking_system,
          price_list,
          hospital_info)
               ↓
         Return Info
```

**Key Points:**
- ✅ No external API calls
- ✅ Static data or internal API
- ❌ Never use Gemini for pricing
  (avoid hallucination)

---

### Case 5: CONTEXT_FOLLOWUP
**Trigger:** "Vậy tôi nên làm gì?" (after previous turn)

```
User Input → Qwen Router
               ↓
         [CONTEXT_FOLLOWUP]
               ↓
         Combine:
         - Previous context
         - New question
               ↓
         Route to appropriate case
         (1, 2, or 3)
```

**Key Points:**
- ✅ Maintains conversation context
- ✅ Routes to appropriate handler
- ✅ PII check on combined context

---

### Case 6: OUT_OF_SCOPE
**Trigger:** "Xin chào", "Viết thơ"

```
User Input → Qwen Router
               ↓
         [OUT_OF_SCOPE]
               ↓
         Check subtype:
         - Social → Template response
         - Off-topic → Polite refusal
               ↓
         [REPLY_LOCALLY]
               ↓
         Return Response
```

**Key Points:**
- ✅ Local templates
- ❌ No Gemini call
- ✅ Fast response

---

## 🔐 Security Layers

### Layer 1: Input Validation
- Normalize Unicode
- Detect prompt injection
- Block malicious patterns

### Layer 2: Safety Gate
- Emergency detection
- Self-harm indicators
- High-risk symptoms
- Drug safety
- Special populations

### Layer 3: Authentication
- JWT validation
- Permission checks
- Caregiver authorization

### Layer 4: PII Sanitization
- Detect: Names, Phones, Emails, IDs, Addresses
- Replace with placeholders
- Validate sanitization

### Layer 5: Database Security
- Least privilege queries
- Row-level security
- Audit all access

### Layer 6: Output Validation
- Check Gemini response for leaks
- Validate medical advice safety
- Rewrite if needed

### Layer 7: Audit Logging
- Log all interactions
- Track PII access
- Security monitoring
- Compliance reports

---

## 📊 Data Flow Examples

### Example 1: Emergency Case

```
User: "Tôi đau ngực dữ dội"
       ↓
Safety Gate: CRITICAL risk detected
       ↓
Action: EMERGENCY_RESPONSE
       ↓
Output: "🚨 GỌI NGAY 115..."
       ↓
Audit: Log CRITICAL event
       ↓
No Gemini call (immediate safety)
```

### Example 2: Personal Data with PII

```
User: "Tôi tên Nguyễn Văn A, SĐT 0901234567, xem đơn thuốc"
       ↓
PII Detection: NAME, PHONE detected
       ↓
Qwen Router: PERSONAL_DB_QUERY
       ↓
Auth Check: Pass (user logged in)
       ↓
DB Query: Get prescriptions for user_id
       ↓
Raw Data: {
  name: "Nguyễn Văn A",  
  phone: "0901234567",
  medications: [...]
}
       ↓
Sanitize: {
  medications: [...]  // Name & phone removed
}
       ↓
Gemini Input: "Người dùng hỏi về đơn thuốc. Dữ liệu: {...}"
       ↓
Gemini Output: "Đơn thuốc hiện tại của bạn gồm..."
       ↓
Validate: No PII leaked ✓
       ↓
Audit: Log DB_ACCESS + PII_REMOVED
       ↓
Return to user
```

### Example 3: Real-time Analysis

```
User: "Huyết áp 150/95 có cao không?"
       ↓
PII Detection: None
       ↓
Qwen Router: USER_INPUT_ANALYSIS
       ↓
Action: CALL_GEMINI (no DB)
       ↓
Gemini Input: "Phân tích: Huyết áp 150/95"
       ↓
Gemini: "Huyết áp 150/95 mmHg cao hơn mức bình thường..."
       ↓
Add Warning: "ℹ️ Thông tin tham khảo, không thay thế bác sĩ"
       ↓
Return to user
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js 20 + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL + Prisma ORM (TODO: integrate)
- **Authentication:** JWT

### AI Models
- **Qwen 14B (Local):** Intent classification, PII detection, routing
- **Gemini API (Cloud):** Medical Q&A, data analysis

### Security
- **PII Detection:** Regex patterns + NLP
- **Authentication:** JWT + Role-based access
- **Encryption:** TLS 1.3, database encryption
- **Audit:** Structured logging + compliance reports

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx (production)
- **Monitoring:** Prometheus + Grafana (TODO)
- **Logging:** Winston + ELK stack (TODO)

---

## 📈 Performance Considerations

### Latency Breakdown (Target)

```
Total Response Time: < 2 seconds

- Input validation:      10ms
- Safety check:          20ms
- Qwen classification:   200ms (local GPU)
- DB query:              50ms (if needed)
- PII sanitization:      30ms
- Gemini API:            800ms (main bottleneck)
- Output validation:     20ms
- Audit logging:         10ms (async)
```

### Optimization Strategies

1. **Caching:**
   - Cache Qwen classifications for common questions
   - Cache Gemini responses for general QA
   - Redis for session management

2. **Async Processing:**
   - Audit logging (non-blocking)
   - Analytics (background jobs)

3. **Connection Pooling:**
   - Database connections
   - HTTP keep-alive for Gemini

4. **Rate Limiting:**
   - Per user: 10 requests/minute
   - Per session: 50 requests/hour

---

## 🔄 Future Enhancements

### Phase 2: Advanced Features

- [ ] Multi-modal support (image, voice)
- [ ] RAG with medical literature
- [ ] Doctor-patient chat handoff
- [ ] Automated alert delivery
- [ ] Multi-language support
- [ ] Federated learning

### Phase 3: Production Hardening

- [ ] Kubernetes deployment
- [ ] Multi-region setup
- [ ] Disaster recovery
- [ ] Advanced threat detection
- [ ] HIPAA compliance audit
- [ ] Penetration testing

---

## 📞 Support & Maintenance

### Monitoring Dashboards

1. **Real-time Metrics:**
   - Request rate
   - Response time (p50, p95, p99)
   - Error rate
   - Gemini API usage

2. **Security Metrics:**
   - PII detection events
   - Prompt injection attempts
   - Authentication failures
   - Emergency alerts

3. **Business Metrics:**
   - Active users
   - Intent distribution
   - Satisfaction scores
   - Escalation to doctors

### On-Call Procedures

**Critical Alerts:**
- PII leaked to Gemini
- Emergency system down
- Database breach attempt
- API quota exceeded

**Response SLA:**
- P0 (Critical): 15 minutes
- P1 (High): 1 hour
- P2 (Medium): 4 hours
- P3 (Low): Next business day

---

## 📚 Documentation

- [Setup Guide](CHATBOT_SECURE_SETUP.md)
- [Test Scenarios](TEST_CHATBOT_SCENARIOS.md)
- [API Reference](./API_REFERENCE.md) (TODO)
- [Runbook](./RUNBOOK.md) (TODO)

---

**Last Updated:** 2025-12-24
**Version:** 1.0.0
**Status:** Development
