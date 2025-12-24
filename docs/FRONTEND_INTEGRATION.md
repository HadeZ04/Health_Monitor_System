# 🔌 Frontend Integration Guide - Secure Medical Chatbot

> Hướng dẫn kết nối Frontend (Next.js) với Backend Secure Chatbot API

---

## ✅ Trạng thái kết nối hiện tại

### **Đã hoàn thành:**

1. ✅ **Backend API Ready**
   - Endpoint: `POST /chat/ask` (port 4000)
   - Authentication: JWT middleware required
   - Route mounted in [server.ts#L26](../backend/src/server.ts#L26)

2. ✅ **Frontend UI Component**
   - Page: [frontend/app/dashboard/ai-chat/page.tsx](../frontend/app/dashboard/ai-chat/page.tsx)
   - URL: `http://localhost:3000/dashboard/ai-chat`
   - Features: Chat history, loading states, error handling, session management

3. ✅ **API Integration Updated**
   - Frontend gọi đúng endpoint `/chat/ask`
   - Request format tương thích
   - Response handling cập nhật cho secure chatbot

---

## 📡 API Contract

### **Request Format**

```typescript
POST /chat/ask
Headers: {
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}

Body: {
  "question": string,        // Câu hỏi của user
  "session_id"?: string      // Optional: Session ID cho context tracking
}
```

### **Response Format (Secure Chatbot)**

```typescript
{
  "success": boolean,
  "message": string,                    // Câu trả lời chính
  
  // Metadata
  "intent": "PERSONAL_DB_QUERY" | "USER_INPUT_ANALYSIS" | "GENERAL_MEDICAL_QA" | 
            "OPERATIONAL_ADMIN" | "CONTEXT_FOLLOWUP" | "OUT_OF_SCOPE",
  "action": "DB_QUERY_THEN_GEMINI" | "GEMINI_ONLY" | "LOCAL_RESPONSE" | 
            "ADMIN_TOOL" | "ERROR",
  
  // Data (optional)
  "data"?: {
    "db_results"?: Array<Record<string, any>>,  // Kết quả từ DB
    "analysis"?: string                         // Phân tích từ Gemini
  },
  
  // Safety
  "warning"?: string,                   // Cảnh báo khẩn cấp nếu có
  
  // Metadata for debugging
  "metadata": {
    "timestamp": string,
    "pii_detected": boolean,
    "safety_triggered": boolean,
    "processing_time_ms": number
  }
}
```

---

## 🎯 Các Intent Types và Xử lý

### **1. PERSONAL_DB_QUERY** - Truy vấn dữ liệu cá nhân
**Ví dụ:** "Xét nghiệm máu gần nhất của tôi?"

**Response:**
```json
{
  "success": true,
  "message": "Dưới đây là kết quả xét nghiệm máu gần nhất của bạn...",
  "intent": "PERSONAL_DB_QUERY",
  "action": "DB_QUERY_THEN_GEMINI",
  "data": {
    "db_results": [
      {
        "test_name": "Xét nghiệm máu tổng quát",
        "date": "2024-12-20",
        "results": {...}
      }
    ],
    "analysis": "Kết quả xét nghiệm của bạn cho thấy..."
  }
}
```

**Frontend hiển thị:**
- Message chính
- Database results (formatted as table hoặc list)
- Analysis từ Gemini

---

### **2. USER_INPUT_ANALYSIS** - Phân tích dữ liệu real-time
**Ví dụ:** "Huyết áp 150/95 có cao không?"

**Response:**
```json
{
  "success": true,
  "message": "Huyết áp 150/95 mmHg cao hơn mức bình thường...",
  "intent": "USER_INPUT_ANALYSIS",
  "action": "GEMINI_ONLY",
  "data": {
    "analysis": "Đây là huyết áp giai đoạn 1..."
  }
}
```

**Frontend hiển thị:**
- Message với phân tích chi tiết
- Có thể thêm visual indicators (màu vàng/đỏ cho high risk)

---

### **3. GENERAL_MEDICAL_QA** - Câu hỏi y khoa chung
**Ví dụ:** "COVID-19 là gì?"

**Response:**
```json
{
  "success": true,
  "message": "COVID-19 là bệnh do virus SARS-CoV-2 gây ra...",
  "intent": "GENERAL_MEDICAL_QA",
  "action": "GEMINI_ONLY"
}
```

**Frontend hiển thị:**
- Message trực tiếp
- Simple text response

---

### **4. OPERATIONAL_ADMIN** - Admin tools
**Ví dụ:** "Đặt lịch khám với bác sĩ"

**Response:**
```json
{
  "success": true,
  "message": "Để đặt lịch khám, vui lòng truy cập mục Lịch hẹn...",
  "intent": "OPERATIONAL_ADMIN",
  "action": "ADMIN_TOOL",
  "data": {
    "redirect_url": "/dashboard/appointments",
    "suggested_actions": ["Chọn bác sĩ", "Chọn thời gian"]
  }
}
```

**Frontend hiển thị:**
- Message hướng dẫn
- Optional: Button để redirect đến page khác

---

### **5. EMERGENCY DETECTION** - Phát hiện khẩn cấp
**Ví dụ:** "Tôi đau ngực dữ dội và khó thở"

**Response:**
```json
{
  "success": true,
  "message": "⚠️ CẢNH BÁO: Triệu chứng của bạn có thể nghiêm trọng...",
  "intent": "USER_INPUT_ANALYSIS",
  "action": "GEMINI_ONLY",
  "warning": "🚨 KHẨN CẤP: Gọi ngay 115 hoặc đến bệnh viện gần nhất!",
  "metadata": {
    "safety_triggered": true,
    "emergency_keywords": ["đau ngực", "khó thở"]
  }
}
```

**Frontend hiển thị:**
- Red alert box với `warning` message
- Large, prominent display
- Emergency contact buttons (Call 115)

---

### **6. OUT_OF_SCOPE** - Ngoài phạm vi
**Ví dụ:** "Hôm nay thời tiết thế nào?"

**Response:**
```json
{
  "success": true,
  "message": "Xin lỗi, tôi chỉ có thể hỗ trợ về các vấn đề y tế...",
  "intent": "OUT_OF_SCOPE",
  "action": "LOCAL_RESPONSE"
}
```

---

## 🎨 Frontend Component Structure

### **Current Implementation:**

```tsx
// frontend/app/dashboard/ai-chat/page.tsx

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  warning?: string | null;      // Emergency warnings
  confidence?: number;          // Optional confidence score
}

// API Call
const response = await apiFetch<{
  success: boolean;
  message: string;
  intent?: string;
  action?: string;
  data?: {
    db_results?: Array<Record<string, any>>;
    analysis?: string;
  };
  warning?: string | null;
  metadata?: {
    timestamp: string;
    pii_detected: boolean;
    safety_triggered: boolean;
  };
}>("/chat/ask", {
  method: "POST",
  body: JSON.stringify({
    question,
    session_id: chatSessionId,
  }),
});

// Display logic
let displayContent = response.message;

// Add DB results if present
if (response.data?.db_results && response.data.db_results.length > 0) {
  displayContent += "\n\n📊 **Kết quả từ hồ sơ của bạn:**\n";
  response.data.db_results.forEach((item, idx) => {
    displayContent += `\n${idx + 1}. ${JSON.stringify(item, null, 2)}`;
  });
}

// Add analysis
if (response.data?.analysis) {
  displayContent += "\n\n💡 **Phân tích:**\n" + response.data.analysis;
}
```

---

## 🔐 Authentication Flow

### **1. Login**
```typescript
// User login at /auth/login
const loginResponse = await apiFetch("/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password })
});

// Save token to localStorage
localStorage.setItem("session", JSON.stringify({
  token: loginResponse.token,
  user: loginResponse.user
}));
```

### **2. Authenticated Request**
```typescript
// apiFetch automatically adds JWT token from session
const session = getSession(); // From localStorage
headers["Authorization"] = `Bearer ${session.token}`;
```

### **3. Token Expiry Handling**
```typescript
// Backend returns 401 if token expired
// Frontend automatically:
// 1. Clear session from localStorage
// 2. Show error message
// 3. Redirect to /auth/login
```

---

## 🧪 Testing the Integration

### **1. Start Backend**
```bash
cd backend
npm run dev
# Running on http://localhost:4000
```

### **2. Start Qwen Router**
```bash
python qwen_router_server.py --port 8081 --mock
# Running on http://localhost:8081
```

### **3. Start Frontend**
```bash
cd frontend
npm run dev
# Running on http://localhost:3000
```

### **4. Test Flow**

1. **Login:**
   - Go to http://localhost:3000/auth/login
   - Use credentials: `admin@techxen.org` / `admin123`

2. **Navigate to AI Chat:**
   - Go to http://localhost:3000/dashboard/ai-chat

3. **Test Each Intent:**

```bash
# Test 1: General QA
"COVID-19 là gì?"
# Expected: GENERAL_MEDICAL_QA intent, Gemini response

# Test 2: Emergency
"Tôi đau ngực và khó thở"
# Expected: warning displayed, safety_triggered=true

# Test 3: Personal Query (requires auth)
"Xét nghiệm máu gần nhất của tôi?"
# Expected: DB results + Gemini analysis

# Test 4: Real-time Analysis
"Huyết áp 150/95 có cao không?"
# Expected: Analysis from Gemini

# Test 5: Out of Scope
"Viết code Python"
# Expected: Polite rejection message
```

---

## 📊 Response Display Examples

### **Example 1: DB Query Result**

**Backend sends:**
```json
{
  "message": "Dưới đây là kết quả xét nghiệm của bạn",
  "data": {
    "db_results": [
      {
        "test_name": "Glucose",
        "value": "95 mg/dL",
        "date": "2024-12-20",
        "status": "Normal"
      }
    ],
    "analysis": "Đường huyết của bạn trong mức bình thường..."
  }
}
```

**Frontend displays:**
```
Trợ lý AI:
Dưới đây là kết quả xét nghiệm của bạn

📊 Kết quả từ hồ sơ của bạn:

1. {
  "test_name": "Glucose",
  "value": "95 mg/dL",
  "date": "2024-12-20",
  "status": "Normal"
}

💡 Phân tích:
Đường huyết của bạn trong mức bình thường...
```

---

### **Example 2: Emergency Warning**

**Backend sends:**
```json
{
  "message": "Tôi nhận thấy bạn đang gặp triệu chứng nghiêm trọng...",
  "warning": "🚨 KHẨN CẤP: Gọi ngay 115 hoặc đến bệnh viện!"
}
```

**Frontend displays:**
```
┌─────────────────────────────────────┐
│ 🚨 KHẨN CẤP                        │
│ Gọi ngay 115 hoặc đến bệnh viện!   │
│                                     │
│ [📞 Gọi 115]  [🏥 Tìm bệnh viện]   │
└─────────────────────────────────────┘

Trợ lý AI:
Tôi nhận thấy bạn đang gặp triệu chứng nghiêm trọng...
```

---

## 🔧 Customization Options

### **1. Add Custom DB Result Formatting**

```typescript
// Format lab results as a table
if (response.data?.db_results) {
  const formattedResults = (
    <table className="w-full">
      <thead>
        <tr>
          <th>Test</th>
          <th>Value</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {response.data.db_results.map(item => (
          <tr key={item.id}>
            <td>{item.test_name}</td>
            <td>{item.value}</td>
            <td className={item.status === 'Normal' ? 'text-green-600' : 'text-red-600'}>
              {item.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### **2. Add Emergency Action Buttons**

```typescript
{message.warning && (
  <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
    <p className="text-red-800 font-bold text-lg mb-4">{message.warning}</p>
    <div className="flex gap-3">
      <button 
        onClick={() => window.location.href = 'tel:115'}
        className="bg-red-600 text-white px-6 py-3 rounded-lg"
      >
        📞 Gọi 115
      </button>
      <button 
        onClick={() => router.push('/dashboard/emergency')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        🏥 Tìm bệnh viện gần nhất
      </button>
    </div>
  </div>
)}
```

### **3. Add Intent-based Styling**

```typescript
const getIntentColor = (intent: string) => {
  switch(intent) {
    case 'PERSONAL_DB_QUERY': return 'border-blue-500';
    case 'USER_INPUT_ANALYSIS': return 'border-yellow-500';
    case 'GENERAL_MEDICAL_QA': return 'border-green-500';
    case 'OUT_OF_SCOPE': return 'border-gray-400';
    default: return 'border-blue-500';
  }
};

<div className={`rounded-lg ${getIntentColor(message.intent)}`}>
  {message.content}
</div>
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: 401 Unauthorized**
```
Error: "Phiên đăng nhập đã hết hạn"
```

**Solution:**
- Token expired or invalid
- Frontend automatically redirects to `/auth/login`
- User needs to login again

---

### **Issue 2: CORS Error**
```
Access to fetch at 'http://localhost:4000/chat/ask' has been blocked by CORS
```

**Solution:**
```typescript
// backend/src/server.ts
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true
}));
```

---

### **Issue 3: Empty Response**
```
Response: { success: true, message: "" }
```

**Solution:**
- Check Gemini API key in backend/.env
- Check Qwen router is running
- Check backend logs for errors

---

### **Issue 4: PII Not Removed**
```
Response contains phone numbers or patient names
```

**Solution:**
- PII sanitization should happen in backend
- Check backend logs: "PII detected: ..."
- If PII leaks to frontend, report as critical bug

---

## 📈 Monitoring & Debugging

### **1. Browser DevTools**
```javascript
// Console tab - check API calls
Network → /chat/ask → Response

// Check localStorage
console.log(localStorage.getItem('session'));
```

### **2. Backend Logs**
```bash
# Watch backend logs
cd backend
npm run dev

# Look for:
# [INFO] New chat request: {...}
# [INFO] Intent classified: PERSONAL_DB_QUERY
# [INFO] PII detected: PHONE_NUMBER
# [INFO] Gemini response received
```

### **3. Qwen Router Logs**
```bash
# Watch Qwen logs
tail -f qwen.log

# Look for:
# Classification request: ...
# Detected patterns: ...
# Result: PERSONAL_DB_QUERY
```

---

## ✅ Integration Checklist

Before going to production:

- [ ] Backend running on port 4000
- [ ] Qwen router running on port 8081
- [ ] Frontend running on port 3000
- [ ] GEMINI_API_KEY configured in backend/.env
- [ ] JWT_SECRET configured
- [ ] Database connected (Prisma migrations run)
- [ ] Test all 6 intent types
- [ ] Test emergency detection
- [ ] Test PII protection
- [ ] Test authentication flow
- [ ] Test token expiry handling
- [ ] HTTPS enabled for production
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Audit logging enabled

---

## 🚀 Next Steps

1. **Enhance UI:**
   - Add loading skeletons
   - Add typing indicators
   - Add voice input (Speech-to-Text)
   - Add export chat history

2. **Add Features:**
   - Multi-language support (i18n)
   - File upload for medical images
   - Integration with EHR system
   - Real-time vitals display in chat

3. **Improve UX:**
   - Suggested questions/prompts
   - Quick reply buttons
   - Context-aware follow-up suggestions
   - Confidence score display

4. **Production:**
   - Setup Docker deployment
   - Configure CDN for frontend
   - Setup monitoring (Sentry, DataDog)
   - Setup analytics (Google Analytics, Mixpanel)

---

## 📞 Support

- **Backend Issues:** Check [CHATBOT_SECURE_SETUP.md](CHATBOT_SECURE_SETUP.md)
- **Test Scenarios:** See [TEST_CHATBOT_SCENARIOS.md](TEST_CHATBOT_SCENARIOS.md)
- **Architecture:** Review [ARCHITECTURE.md](ARCHITECTURE.md)
- **Quick Reference:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

<div align="center">

**Frontend ⇄ Backend Integration Complete! 🎉**

[← Back to README](../README.md) | [Architecture →](ARCHITECTURE.md)

</div>
