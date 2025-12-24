# 🚀 Hướng dẫn truy cập Admin Portal (DEMO MODE)

## ✅ Bước 1: Chạy Frontend Development Server

Mở terminal và chạy:

```bash
cd C:\Web\Health_Monitor_System\frontend
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

---

## ✅ Bước 2: Truy cập Admin Portal

Mở browser và truy cập:

### **Admin Dashboard:**
```
http://localhost:3000/admin
```

### **Các trang khác:**
```
http://localhost:3000/admin/users          → Quản lý người dùng
http://localhost:3000/admin/doctors        → Quản lý bác sĩ
http://localhost:3000/admin/patients       → Quản lý bệnh nhân
http://localhost:3000/admin/roles          → Phân quyền
http://localhost:3000/admin/settings       → Cài đặt hệ thống
http://localhost:3000/admin/logs           → Audit logs
```

---

## 🎯 DEMO MODE được bật tự động

File `AuthGuard.tsx` đã được cấu hình với:

```typescript
const DEMO_MODE = true;  // ✅ Đã bật
```

**Tính năng DEMO MODE:**
- ✅ Tự động bypass authentication
- ✅ Tạo mock session với role "admin"
- ✅ Không cần backend API
- ✅ Tất cả data là mock data trong frontend
- ✅ Có thể test toàn bộ UI/UX

---

## 🎨 Preview các trang

### 1. **Admin Dashboard** (`/admin`)
- KPI cards: Tổng bệnh nhân, bác sĩ, lịch khám, alerts
- Line chart: Lượt đăng nhập
- Bar chart: Lịch khám tuần
- Pie chart: Phân bố users
- Recent activity log

### 2. **User Management** (`/admin/users`)
- 5 stats cards
- Filter theo role và status
- User table với actions
- Mock 8 users

### 3. **Doctor Management** (`/admin/doctors`)
- 4 stats cards
- Filter theo specialty
- Doctor cards grid
- Mock 5 doctors

### 4. **Patient Management** (`/admin/patients`)
- Risk level cards (High/Medium/Low)
- Filter theo risk, gender
- Patient table
- Mock 5 patients

### 5. **Role & Permission** (`/admin/roles`)
- 4 role cards
- Permission matrix 14×3
- Summary stats

### 6. **System Settings** (`/admin/settings`)
- 4 tabs: General, Security, Email, Storage
- Form inputs interactive
- Storage usage progress bar

### 7. **Audit Logs** (`/admin/logs`)
- 4 stats cards
- Filter theo level & module
- Timeline log entries
- Mock 8 log entries

---

## 🔧 Tắt DEMO MODE (khi có backend)

Khi backend ready, sửa file `components/layout/AuthGuard.tsx`:

```typescript
const DEMO_MODE = false;  // ❌ Tắt demo mode
```

Sau đó cần:
1. Setup authentication với backend
2. Implement API calls thay mock data
3. Configure session management

---

## 📱 Kiểm tra Responsive

Thử resize browser window hoặc mở DevTools (F12):
- Mobile view: < 768px
- Tablet view: 768px - 1024px  
- Desktop view: > 1024px

---

## 🎨 Theme

Toàn bộ Admin Portal sử dụng:
- **Dark theme** (slate-950 background)
- **Gradient cards** với glassmorphism
- **Color-coded badges** theo context
- **Recharts** cho biểu đồ

---

## 🐛 Troubleshooting

### Lỗi: Module not found
```bash
npm install
```

### Lỗi: Port 3000 đã được sử dụng
```bash
# Chạy trên port khác
npm run dev -- -p 3001
```

### UI không hiển thị đúng
1. Clear cache: Ctrl + Shift + R
2. Kiểm tra console errors (F12)
3. Xóa folder `.next` và restart:
```bash
rm -r .next
npm run dev
```

---

## 📊 Mock Data

Tất cả data hiện tại là mock:
- 8 users (patients, doctors, staff, admin)
- 5 doctors với specialties khác nhau
- 5 patients với risk levels
- 8 log entries
- KPI statistics
- Chart data

---

## ✨ Features đã hoạt động

✅ Navigation giữa các pages  
✅ Filter & search (client-side)  
✅ Sort tables  
✅ Responsive design  
✅ Interactive forms  
✅ Charts & visualization  
✅ Color-coded badges  
✅ Hover effects  
✅ Loading states  

---

## 🚀 Next: Tích hợp Backend

Khi backend ready:
1. Tắt `DEMO_MODE = false`
2. Implement API calls trong từng page
3. Replace mock data bằng API response
4. Setup WebSocket cho real-time updates
5. Implement authentication flow

---

**🎉 Giờ bạn có thể test toàn bộ Admin Portal!**

Chạy `npm run dev` và truy cập http://localhost:3000/admin
