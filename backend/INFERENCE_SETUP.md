# Hướng dẫn tích hợp Inference Server

## Cấu hình

1. **Tạo file `.env` từ template:**
   ```bash
   cp .env.example .env
   ```

2. **Cấu hình biến môi trường trong `.env`:**
   ```env
   INFERENCE_API_URL=http://localhost:8080
   ```
   
   Thay `http://localhost:8080` bằng URL thực tế của GPU inference server:
   - Local: `http://localhost:8080`
   - Remote GPU: `http://your-gpu-server-ip:8080`
   - Với domain: `https://your-domain.com`

## API Endpoints

### 1. Gửi câu hỏi y tế

**POST** `/chat/ask`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "question": "Bác sĩ ơi, tôi hay đau ngực khi leo cầu thang?",
  "session_id": "optional-session-id",
  "max_new_tokens": 512,
  "top_k": 5
}
```

**Response:**
```json
{
  "success": true,
  "reply": "Câu trả lời từ AI...",
  "confidence": 0.85,
  "verdict": "pass",
  "citations": ["[1]", "[2]"],
  "sources": [
    {
      "title": "Bài báo y khoa",
      "abstract": "Tóm tắt...",
      "pmid": "12345678",
      "score": 0.75
    }
  ],
  "warning": null,
  "session_id": "user-123"
}
```

### 2. Kiểm tra trạng thái Inference Server

**GET** `/chat/health`

**Response:**
```json
{
  "status": "ok",
  "model_id": "MidWin/Medfinetune"
}
```

## Frontend Integration

Frontend đã được tích hợp sẵn tại trang `/dashboard/ai-chat`. 

Trang này sẽ:
- Tự động gửi token JWT trong header
- Hiển thị câu trả lời với format đẹp
- Hiển thị citations và confidence score
- Hiển thị warning nếu có
- Quản lý session tự động dựa trên user ID

## Testing

1. **Khởi động backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Khởi động inference server** (trên GPU server):
   ```bash
   cd inference_server
   python -m src.api
   ```

3. **Test API bằng curl:**
   ```bash
   # Lấy token từ login
   TOKEN="your-jwt-token"
   
   # Gửi câu hỏi
   curl -X POST http://localhost:4000/chat/ask \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "question": "Bác sĩ ơi, tôi hay đau ngực khi leo cầu thang?"
     }'
   ```

## Troubleshooting

### Lỗi: "Failed to call inference API"

- Kiểm tra `INFERENCE_API_URL` trong `.env` có đúng không
- Kiểm tra inference server đã chạy chưa: `curl http://localhost:8080/health`
- Kiểm tra firewall/network có chặn không

### Lỗi: "Connection refused"

- Đảm bảo inference server đang chạy
- Kiểm tra port 8080 có bị chiếm không
- Nếu dùng remote server, kiểm tra firewall rules

### Lỗi: "Timeout"

- Inference server có thể đang tải model lần đầu (mất 10-30 phút)
- Kiểm tra GPU memory có đủ không
- Tăng timeout trong code nếu cần

