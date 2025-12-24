# Hướng dẫn Test Hệ thống AI Chat

## Bước 1: Kiểm tra Inference Server (GPU)

### 1.1. Kiểm tra server đã chạy chưa

Mở terminal mới và chạy:

```bash
# Test health endpoint
curl http://localhost:8080/health
```

**Kết quả mong đợi:**
```json
{
  "status": "ok",
  "model_id": "MidWin/Medfinetune"
}
```

### 1.2. Test trực tiếp API inference

```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Bác sĩ ơi, tôi hay đau ngực khi leo cầu thang?",
    "session_id": "test-123",
    "max_new_tokens": 512,
    "top_k": 5
  }'
```

**Kết quả mong đợi:**
```json
{
  "answer": "Câu trả lời từ AI...",
  "draft": "...",
  "confidence": 0.85,
  "verdict": "pass",
  "citations": ["[1]", "[2]"],
  "context_docs": [...],
  "warning": null
}
```

---

## Bước 2: Kiểm tra Backend API

### 2.1. Đảm bảo backend đang chạy

Backend phải chạy ở port 4000 (hoặc port bạn đã cấu hình).

### 2.2. Test health endpoint của backend

```bash
curl http://localhost:4000/chat/health
```

**Kết quả mong đợi:**
```json
{
  "status": "ok",
  "model_id": "MidWin/Medfinetune"
}
```

### 2.3. Đăng nhập để lấy JWT token

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techxen.org",
    "password": "admin123"
  }'
```

**Kết quả mong đợi:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@techxen.org",
    ...
  }
}
```

**Lưu token lại để dùng cho bước tiếp theo:**
```bash
# Trên Linux/Mac
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Trên Windows PowerShell
$TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2.4. Test API chat qua backend

**Linux/Mac:**
```bash
curl -X POST http://localhost:4000/chat/ask \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Bác sĩ ơi, tôi hay đau ngực khi leo cầu thang?",
    "session_id": "test-user-123"
  }'
```

**Windows PowerShell:**
```powershell
$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}

$body = @{
    question = "Bác sĩ ơi, tôi hay đau ngực khi leo cầu thang?"
    session_id = "test-user-123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/chat/ask" -Method POST -Headers $headers -Body $body
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "reply": "Câu trả lời từ AI...",
  "confidence": 0.85,
  "verdict": "pass",
  "citations": ["[1]", "[2]"],
  "sources": [...],
  "warning": null,
  "session_id": "test-user-123"
}
```

---

## Bước 3: Test Frontend

### 3.1. Truy cập trang AI Chat

1. Mở trình duyệt
2. Điều hướng đến: `http://localhost:3000/dashboard/ai-chat`
   (hoặc port mà Next.js đang chạy)

### 3.2. Đăng nhập (nếu chưa)

- Email: `admin@techxen.org`
- Password: `admin123`

### 3.3. Test chat

1. Nhập câu hỏi vào ô input: "Bác sĩ ơi, tôi hay đau ngực khi leo cầu thang?"
2. Nhấn nút Send hoặc Enter
3. Đợi câu trả lời từ AI
4. Kiểm tra:
   - ✅ Câu trả lời hiển thị đúng
   - ✅ Loading state hoạt động
   - ✅ Citations hiển thị (nếu có)
   - ✅ Confidence score hiển thị (nếu có)
   - ✅ Warning hiển thị (nếu có)

---

## Bước 4: Test với các câu hỏi khác

### Test cases:

1. **Câu hỏi y tế thông thường:**
   ```
   "Tôi bị đau đầu thường xuyên, có phải do căng thẳng không?"
   ```

2. **Câu hỏi về triệu chứng:**
   ```
   "Dạo này tôi hay bị khó thở khi nằm, có nguy hiểm không?"
   ```

3. **Câu hỏi về thuốc:**
   ```
   "Thuốc huyết áp có tác dụng phụ gì không?"
   ```

4. **Câu hỏi khẩn cấp (sẽ có warning):**
   ```
   "Tôi đau ngực dữ dội và khó thở, phải làm sao?"
   ```

---

## Troubleshooting

### Lỗi: "Connection refused" khi test inference server

**Nguyên nhân:** Inference server chưa chạy hoặc chạy sai port

**Giải pháp:**
```bash
# Kiểm tra inference server có đang chạy không
cd inference_server
python -m src.api

# Hoặc kiểm tra port 8080 có bị chiếm không
# Linux/Mac:
lsof -i :8080

# Windows:
netstat -ano | findstr :8080
```

### Lỗi: "Failed to call inference API" từ backend

**Nguyên nhân:** 
- `INFERENCE_API_URL` trong `.env` sai
- Inference server chưa sẵn sàng (đang tải model)

**Giải pháp:**
1. Kiểm tra file `backend/.env` có đúng `INFERENCE_API_URL=http://localhost:8080`
2. Đợi inference server tải xong model (có thể mất 10-30 phút lần đầu)
3. Kiểm tra inference server health: `curl http://localhost:8080/health`

### Lỗi: "401 Unauthorized" khi test backend API

**Nguyên nhân:** Token JWT hết hạn hoặc sai

**Giải pháp:**
1. Đăng nhập lại để lấy token mới
2. Kiểm tra token có đúng format: `Bearer <token>`

### Lỗi: Frontend không kết nối được backend

**Nguyên nhân:** 
- Backend chưa chạy
- `NEXT_PUBLIC_API_URL` trong frontend sai

**Giải pháp:**
1. Kiểm tra backend đang chạy: `curl http://localhost:4000/chat/health`
2. Kiểm tra file `.env.local` trong frontend (nếu có):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

### Lỗi: "Model đang tải" hoặc timeout

**Nguyên nhân:** Inference server đang tải model lần đầu

**Giải pháp:**
- Đợi 10-30 phút để model tải xong
- Kiểm tra log của inference server để xem tiến trình
- Kiểm tra GPU memory có đủ không: `nvidia-smi`

---

## Checklist Test

- [ ] Inference server chạy và trả lời `/health`
- [ ] Inference server trả lời câu hỏi qua API trực tiếp
- [ ] Backend chạy và trả lời `/chat/health`
- [ ] Backend có thể đăng nhập và lấy token
- [ ] Backend gọi được inference API và trả về kết quả
- [ ] Frontend hiển thị trang AI chat
- [ ] Frontend gửi được câu hỏi và nhận câu trả lời
- [ ] Frontend hiển thị đầy đủ thông tin (citations, confidence, warning)

---

## Test nhanh với script

Tạo file `test.sh` (Linux/Mac) hoặc `test.ps1` (Windows):

**test.sh:**
```bash
#!/bin/bash

echo "Testing Inference Server..."
curl -s http://localhost:8080/health | jq .

echo -e "\nTesting Backend Health..."
curl -s http://localhost:4000/chat/health | jq .

echo -e "\nTesting Login..."
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techxen.org","password":"admin123"}' | jq -r .token)

echo "Token: $TOKEN"

echo -e "\nTesting Chat API..."
curl -s -X POST http://localhost:4000/chat/ask \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question":"Bác sĩ ơi, tôi hay đau ngực khi leo cầu thang?"}' | jq .
```

**test.ps1:**
```powershell
Write-Host "Testing Inference Server..."
Invoke-RestMethod -Uri "http://localhost:8080/health" | ConvertTo-Json

Write-Host "`nTesting Backend Health..."
Invoke-RestMethod -Uri "http://localhost:4000/chat/health" | ConvertTo-Json

Write-Host "`nTesting Login..."
$loginBody = @{
    email = "admin@techxen.org"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:4000/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.token
Write-Host "Token: $token"

Write-Host "`nTesting Chat API..."
$chatBody = @{
    question = "Bác sĩ ơi, tôi hay đau ngực khi leo cầu thang?"
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:4000/chat/ask" -Method POST -Headers $headers -Body $chatBody | ConvertTo-Json
```

