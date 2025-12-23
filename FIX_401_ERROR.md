# Cách sửa lỗi 401 Unauthorized

## Nguyên nhân

Lỗi 401 xảy ra khi:
1. **Bạn chưa đăng nhập** - Không có token trong localStorage
2. **Token đã hết hạn** - Token JWT có thời hạn (mặc định 4h)
3. **JWT_SECRET không khớp** - Backend và token được tạo với secret khác nhau

## Cách sửa

### Bước 1: Đăng nhập lại

1. Truy cập: `http://localhost:3000/auth/login`
2. Đăng nhập với:
   - Email: `admin@techxen.org`
   - Password: `admin123`
3. Sau khi đăng nhập thành công, bạn sẽ được chuyển về dashboard
4. Thử chat lại

### Bước 2: Kiểm tra JWT_SECRET

Đảm bảo `JWT_SECRET` trong `backend/.env` khớp với secret đã dùng khi tạo token:

```env
JWT_SECRET=HadezD
```

**Lưu ý:** Nếu bạn đổi `JWT_SECRET`, tất cả token cũ sẽ không còn hợp lệ. Bạn cần đăng nhập lại.

### Bước 3: Kiểm tra token trong localStorage

Mở Developer Tools (F12) → Console và chạy:

```javascript
// Kiểm tra token
const session = JSON.parse(localStorage.getItem('hm.session'));
console.log('Token:', session?.token);
console.log('User:', session?.user);
```

Nếu `session` là `null` hoặc không có `token`, bạn cần đăng nhập lại.

### Bước 4: Xóa cache và đăng nhập lại

Nếu vẫn lỗi, thử xóa cache:

```javascript
// Trong Console (F12)
localStorage.removeItem('hm.session');
location.reload();
```

Sau đó đăng nhập lại.

## Code đã được cập nhật

Tôi đã cập nhật code để:
- ✅ Tự động kiểm tra session trước khi gửi request
- ✅ Tự động redirect về login nếu không có token
- ✅ Hiển thị message lỗi rõ ràng hơn
- ✅ Xử lý lỗi 401 tốt hơn

## Test lại

Sau khi đăng nhập lại:

1. Vào trang: `http://localhost:3000/dashboard/ai-chat`
2. Nhập câu hỏi: "Bác sĩ ơi, tôi hay đau ngực khi leo cầu thang?"
3. Nhấn Send hoặc Enter
4. Nếu vẫn lỗi, kiểm tra:
   - Backend đang chạy: `curl http://localhost:4000/chat/health`
   - Inference server đang chạy: `curl http://localhost:8080/health`
   - Token có trong localStorage không (xem Bước 3)

## Debug nâng cao

Nếu vẫn gặp vấn đề, mở Developer Tools (F12) → Network tab:

1. Gửi một câu hỏi
2. Tìm request đến `/chat/ask`
3. Kiểm tra:
   - **Request Headers** → Có `Authorization: Bearer <token>` không?
   - **Response** → Message lỗi là gì?

Nếu không có header `Authorization`, token chưa được gửi. Đăng nhập lại.

Nếu có header nhưng vẫn 401, có thể:
- Token đã hết hạn → Đăng nhập lại
- JWT_SECRET không khớp → Kiểm tra `backend/.env`

