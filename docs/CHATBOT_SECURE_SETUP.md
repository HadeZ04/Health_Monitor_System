# Chatbot Y Tế Bảo Mật - Hướng Dẫn Triển Khai

## 🏗️ Kiến Trúc Hệ Thống

Hệ thống chatbot y tế được thiết kế với nhiều lớp bảo mật và tuân thủ các nguyên tắc:

### Các Thành Phần Chính

1. **Qwen Router (Local)** - Port 8081
   - Phân loại intent (6 loại)
   - Phát hiện PII/PHI
   - Quyết định routing logic
   - Không gửi data ra ngoài

2. **Gemini API (Google Cloud)**
   - Trả lời câu hỏi y tế
   - Chỉ nhận dữ liệu đã được làm sạch PII
   - Không lưu trữ dữ liệu bệnh nhân

3. **Medical Database (PostgreSQL + Prisma)**
   - Lưu trữ hồ sơ bệnh án
   - Được query với quyền hạn rõ ràng
   - Dữ liệu được sanitized trước khi gửi đi

4. **Safety Gate**
   - Phát hiện tình huống khẩn cấp
   - Kiểm tra rủi ro y tế
   - Chặn prompt injection

5. **Audit Logging**
   - Ghi log mọi truy cập dữ liệu
   - Compliance với quy định y tế
   - Security monitoring

---

## 📦 Cài Đặt

### 1. Prerequisites

```bash
# Node.js 20+
node --version

# Python 3.10+ (for Qwen local model)
python --version

# PostgreSQL 16
psql --version
```

### 2. Clone & Install Dependencies

```bash
cd Health_Monitor_System/backend
npm install
```

### 3. Setup Environment Variables

```bash
# Copy template
cp env.example.txt .env

# Edit .env file
nano .env
```

**Required Configuration:**

```env
# Server
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET=<your-secure-secret-here>
JWT_TTL=4h

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/health_monitor

# Qwen Local API (Run this separately)
QWEN_API_URL=http://localhost:8081

# Gemini API (Get key from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=<your-gemini-api-key>

# Security
ENABLE_PII_DETECTION=true
ENABLE_SAFETY_GATE=true
ENABLE_AUDIT_LOGGING=true
```

### 4. Setup Qwen Local Router (Separate Service)

Qwen là model local chạy riêng để phân loại intent và bảo mật.

```bash
# Trong thư mục riêng (không phải backend)
cd ../qwen-router-service  # Tạo folder mới

# Install dependencies
pip install transformers torch flask

# Create simple Flask server
python qwen_server.py --port 8081
```

**qwen_server.py** (Ví dụ đơn giản):

```python
from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import json

app = Flask(__name__)

# Load Qwen 14B model (hoặc version nhỏ hơn nếu GPU hạn chế)
model_name = "Qwen/Qwen-14B-Chat"  # Hoặc "Qwen/Qwen-7B-Chat"
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    trust_remote_code=True
).eval()

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    data = request.json
    messages = data.get('messages', [])
    
    # Convert messages to Qwen format
    response, history = model.chat(tokenizer, messages[-1]['content'], history=None)
    
    # Return in OpenAI-compatible format
    return jsonify({
        "choices": [{
            "message": {
                "content": response
            }
        }]
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model": model_name})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081)
```

### 5. Setup Database

```bash
# Run PostgreSQL
docker run -d \
  --name health_monitor_db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=health_monitor \
  -p 5432:5432 \
  postgres:16

# Run migrations (when Prisma is integrated)
npx prisma migrate dev --name init

# Seed demo data
npx prisma db seed
```

### 6. Start Backend Server

```bash
npm run dev
```

Backend sẽ chạy ở `http://localhost:4000`

---

## 🧪 Testing

### Test 1: Emergency Detection

```bash
curl -X POST http://localhost:4000/chat/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "question": "Tôi đau ngực dữ dội và khó thở"
  }'
```

**Expected:** Response với cảnh báo khẩn cấp, gọi 115.

### Test 2: Personal Data Query (Requires Auth)

```bash
curl -X POST http://localhost:4000/chat/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "question": "Kết quả xét nghiệm đường huyết lần trước của tôi là bao nhiêu?"
  }'
```

**Expected:** Query DB → Sanitize → Call Gemini → Return answer.

### Test 3: Real-time Data Analysis

```bash
curl -X POST http://localhost:4000/chat/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "question": "Tôi vừa đo huyết áp 150/95, có cao không?"
  }'
```

**Expected:** Direct Gemini call with data analysis.

### Test 4: General Medical QA

```bash
curl -X POST http://localhost:4000/chat/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Tiểu đường type 2 là gì?"
  }'
```

**Expected:** Gemini trả lời kiến thức y khoa chung.

### Test 5: PII Detection

```bash
curl -X POST http://localhost:4000/chat/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "question": "Tôi tên Nguyễn Văn A, SĐT 0901234567, đường huyết cao"
  }'
```

**Expected:** PII được detect và xóa trước khi gửi Gemini.

---

## 🔐 Security Features

### 1. PII/PHI Protection

- ✅ Tự động phát hiện: Tên, SĐT, Email, CMND, Địa chỉ, Ngày sinh
- ✅ Thay thế bằng placeholder: `[TÊN_BỆNH_NHÂN]`, `[SỐ_ĐIỆN_THOẠI]`
- ✅ Validate sau khi sanitize (không còn PII)
- ✅ Database fields được filter trước khi gửi Gemini

### 2. Safety Gate

- ✅ Phát hiện 50+ emergency keywords
- ✅ Detect self-harm/suicide indicators
- ✅ High-risk symptoms (đau ngực, khó thở, đột quỵ...)
- ✅ Drug interaction warnings
- ✅ Special populations (pregnant, pediatric, elderly)

### 3. Prompt Injection Prevention

- ✅ Detect malicious patterns: "ignore previous", "show all data"
- ✅ Block SQL injection attempts
- ✅ Reject script injection

### 4. Authentication & Authorization

- ✅ JWT-based authentication
- ✅ Personal data requires login
- ✅ Role-based access control (ready to implement)

### 5. Audit Logging

- ✅ Log mọi DB access
- ✅ Log PII detection
- ✅ Log safety alerts
- ✅ Export logs for compliance
- ✅ Auto-anonymize old logs (GDPR)

---

## 📊 Flow Diagrams

### Case 1: PERSONAL_DB_QUERY

```
User Question → Safety Gate → Qwen Router → Check Auth
                                   ↓
                            [SEARCH_DB action]
                                   ↓
                        Query DB (with permissions)
                                   ↓
                        Sanitize PII (remove name, ID...)
                                   ↓
                    Gemini API (clean data only)
                                   ↓
                        Validate Response
                                   ↓
                        Return Answer + Audit Log
```

### Case 2: USER_INPUT_ANALYSIS

```
User Question → Safety Gate → Qwen Router
                                   ↓
                        [CALL_GEMINI action]
                                   ↓
                    Detect & Remove PII from input
                                   ↓
                    Gemini API (sanitized input)
                                   ↓
                        Validate Response
                                   ↓
                        Return Answer + Audit Log
```

### Case 6: EMERGENCY

```
User Question → Safety Gate
                    ↓
            [EMERGENCY keywords detected]
                    ↓
            Return Emergency Response
            (No Gemini call, immediate safety)
                    ↓
            Audit Log (CRITICAL level)
```

---

## 🚀 Production Checklist

### Before Deployment:

- [ ] Change `JWT_SECRET` to strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Setup rate limiting
- [ ] Enable HTTPS
- [ ] Setup real database (not in-memory)
- [ ] Configure Prisma Client
- [ ] Setup proper logging service (not console.log)
- [ ] Setup error tracking (Sentry)
- [ ] Configure backup strategy
- [ ] Setup monitoring (Prometheus + Grafana)
- [ ] Test disaster recovery
- [ ] Security audit
- [ ] Load testing
- [ ] HIPAA compliance review
- [ ] Data retention policy
- [ ] Incident response plan

---

## 📝 API Documentation

### POST /chat/ask

**Request:**

```json
{
  "question": "Câu hỏi của bạn",
  "session_id": "optional-session-id",
  "language": "vi"
}
```

**Response:**

```json
{
  "success": true,
  "reply": "Câu trả lời...",
  "confidence": 0.95,
  "intent": "PERSONAL_DB_QUERY",
  "action_taken": "SEARCH_DB",
  "sources": ["[1]", "[2]"],
  "session_id": "session-123",
  "metadata": {
    "pii_removed": true,
    "db_accessed": true,
    "safety_level": "LOW"
  }
}
```

---

## 🐛 Troubleshooting

### Issue: "Gemini API key not configured"

**Solution:** Add `GEMINI_API_KEY` to `.env` file.

### Issue: "Qwen API error: ECONNREFUSED"

**Solution:** Start Qwen local server:
```bash
python qwen_server.py --port 8081
```

### Issue: "Authentication required"

**Solution:** Login first to get JWT token:
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@techxen.org", "password": "admin123"}'
```

### Issue: PII still leaked to Gemini

**Solution:** Check audit logs:
```bash
# In backend code
const logs = await auditLog.getHighRiskLogs(100);
console.log(logs);
```

---

## 📚 References

- [Qwen Documentation](https://github.com/QwenLM/Qwen)
- [Gemini API Docs](https://ai.google.dev/docs)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa/)
- [PII Detection Best Practices](https://owasp.org/www-community/vulnerabilities/Privacy_Violation)

---

## 🤝 Contributing

1. Test new features with all 6 cases
2. Add audit logging for new actions
3. Update PII patterns if needed
4. Write security tests
5. Document changes

---

## 📄 License

Private - Internal Use Only
