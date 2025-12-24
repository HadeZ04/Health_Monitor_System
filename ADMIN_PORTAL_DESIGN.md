# 🎯 Admin Portal - Complete UI/UX Design

## 📋 TỔNG QUAN

Admin Portal được thiết kế hoàn chỉnh với **8 module chính** để quản trị viên dễ dàng quản lý toàn bộ hệ thống Healthcare Monitoring.

---

## 🗂️ CẤU TRÚC ROUTES

### **Danh sách Routes Admin:**

```
/admin                    → Admin Dashboard (Trang chính)
/admin/users              → Quản lý tất cả người dùng
/admin/doctors            → Quản lý bác sĩ
/admin/patients           → Quản lý bệnh nhân
/admin/roles              → Phân quyền & Role Management
/admin/settings           → Cài đặt hệ thống
/admin/logs               → Audit Logs & Activity Monitoring
/admin/docs               → Tài liệu hướng dẫn (TODO)
```

---

## 🎨 CHI TIẾT TỪNG MÀN HÌNH

### **1. 📊 Admin Dashboard** (`/admin`)

**Mục đích:** Tổng quan toàn hệ thống với KPI và biểu đồ

**Các thành phần:**
- ✅ **KPI Cards (4 cards):**
  - Tổng số Bệnh nhân (với % tăng trưởng)
  - Tổng số Bác sĩ (với số bác sĩ mới)
  - Lịch khám hôm nay (với % so với hôm qua)
  - Critical Alerts (cảnh báo cần xử lý)

- ✅ **Biểu đồ (2 charts):**
  - **Line Chart:** Lượt đăng nhập trong ngày (theo giờ)
  - **Bar Chart:** Lịch khám tuần này (theo ngày)

- ✅ **Phân bố người dùng:**
  - **Pie Chart:** Hiển thị tỷ lệ Patient/Doctor/Staff/Admin
  - Legend với số lượng cụ thể

- ✅ **Recent Activity Log:**
  - 6 hoạt động gần nhất
  - Hiển thị user, action, timestamp
  - Color-coded theo loại action

- ✅ **Quick Actions:**
  - Thêm người dùng mới
  - Quản lý bác sĩ
  - Cấu hình hệ thống
  - Xem audit logs

**UX Notes:**
- Dashboard tải nhanh với skeleton loading
- Auto-refresh mỗi 30s cho real-time data
- Responsive trên mọi thiết bị

---

### **2. 👥 User Management** (`/admin/users`)

**Mục đích:** Quản lý TẤT CẢ người dùng trong hệ thống

**Các thành phần:**
- ✅ **Stats Cards (5 cards):**
  - Số lượng Bệnh nhân
  - Số lượng Bác sĩ
  - Số lượng Nhân viên
  - Số lượng Admin
  - Số user đang hoạt động

- ✅ **Filters & Search:**
  - Search box: tìm theo tên, email
  - **Role filter:** All / Patient / Doctor / Staff / Admin
  - **Status filter:** All / Active / Inactive / Locked

- ✅ **User Table:**
  - Columns: Tên, Email, Role, Status, Last Login, Created Date, Actions
  - Avatar với chữ cái đầu
  - Badge màu sắc cho Role và Status
  
- ✅ **Actions cho mỗi user:**
  - Xem chi tiết / Edit
  - Lock / Unlock account
  - Reset password (gửi email)
  - More actions (dropdown)

**UX Features:**
- Pagination khi có > 50 users
- Bulk actions (select multiple users)
- Export to CSV/Excel
- Sort theo column

---

### **3. 👨‍⚕️ Doctor Management** (`/admin/doctors`)

**Mục đích:** Quản lý chuyên sâu thông tin bác sĩ

**Các thành phần:**
- ✅ **Stats Cards (4 cards):**
  - Bác sĩ đang hoạt động
  - Tổng bệnh nhân đang quản lý
  - Lịch khám hôm nay
  - Đánh giá trung bình (rating)

- ✅ **Filters:**
  - Search: tên, email, chuyên khoa
  - **Specialty filter:** Tim mạch, Nội tiết, Thần kinh, Nhi khoa, Da liễu...
  - **Status:** Active / Inactive

- ✅ **Doctor Cards Grid:**
  - Hiển thị dạng card với avatar
  - Thông tin: Tên, chuyên khoa, status
  - Stats mini: Số bệnh nhân, lịch hôm nay
  - Thông tin: Kinh nghiệm, Rating, Ngày tham gia
  - Contact: Email, Phone, License number
  - Actions: Chi tiết, Lịch làm việc

**UX Features:**
- Grid responsive: 3 cols desktop, 2 cols tablet, 1 col mobile
- Hover effect để highlight
- Quick view modal cho chi tiết nhanh

---

### **4. 🏥 Patient Management** (`/admin/patients`)

**Mục đích:** Quản lý hồ sơ bệnh nhân

**Các thành phần:**
- ✅ **Stats Cards (4 cards):**
  - Rủi ro cao (High risk - màu đỏ)
  - Rủi ro trung bình (Medium risk - màu vàng)
  - Rủi ro thấp (Low risk - màu xanh)
  - Đang hoạt động

- ✅ **Filters:**
  - Search: tên, mã BN, email
  - **Risk Level:** All / High / Medium / Low
  - **Gender:** All / Nam / Nữ
  - **Status:** Active / Inactive

- ✅ **Patient Table:**
  - Columns: Mã BN, Thông tin, Tuổi/GT, Risk Level, Bác sĩ, Last Visit, Next Appointment, Actions
  - Badge cho risk level (color-coded)
  - Hiển thị conditions (bệnh lý)
  - Icons cho upcoming appointments

- ✅ **Actions:**
  - Xem hồ sơ đầy đủ
  - Xem chỉ số sức khỏe (vital signs)
  - Lock / Unlock account

**UX Features:**
- Color coding rõ ràng cho risk levels
- Quick filter cho high-risk patients
- Export patient list

---

### **5. 🔐 Role & Permission Management** (`/admin/roles`)

**Mục đích:** Cấu hình phân quyền chi tiết

**Các thành phần:**
- ✅ **Role Cards (4 cards):**
  - Admin (màu đỏ)
  - Doctor (màu xanh lá)
  - Patient (màu xanh dương)
  - Staff (màu tím)
  - Hiển thị: Số user, mô tả, icon

- ✅ **Permission Matrix:**
  - Bảng 2 chiều: Modules (rows) × Permissions (columns)
  - **Modules:** 14 modules (Dashboard, Users, Doctors, Patients, Appointments, Medical Records, Monitoring, AI Chat, Reports, Analytics, IoT, Settings, Logs, Security)
  - **Permissions:** Read, Write, Delete
  - Icon check/cross màu sắc rõ ràng

- ✅ **Summary Stats:**
  - Số Read permissions được cấp
  - Số Write permissions được cấp
  - Số Delete permissions được cấp

**UX Features:**
- Click role card để xem permission matrix
- Visual matrix dễ hiểu
- Edit mode để thay đổi permissions
- Legend giải thích icons

---

### **6. ⚙️ System Settings** (`/admin/settings`)

**Mục đích:** Cấu hình toàn bộ hệ thống

**Tabs (4 tabs):**

#### **Tab 1: Cài đặt chung (General)**
- ✅ Tên hệ thống
- ✅ Domain
- ✅ Upload logo
- ✅ Ngôn ngữ mặc định (vi/en)
- ✅ Timezone
- ✅ Định dạng ngày
- ✅ Currency

#### **Tab 2: Bảo mật (Security)**
- ✅ **Chính sách mật khẩu:**
  - Độ dài tối thiểu
  - Yêu cầu chữ hoa
  - Yêu cầu số
  - Yêu cầu ký tự đặc biệt
  - Thời gian session
  
- ✅ **Bảo vệ tài khoản:**
  - Số lần đăng nhập sai tối đa
  - Thời gian khóa
  - Bắt buộc 2FA

#### **Tab 3: Email**
- ✅ SMTP configuration (host, port, user, password)
- ✅ Sender info (name, email)
- ✅ Test email button

#### **Tab 4: Lưu trữ (Storage)**
- ✅ Storage usage với progress bar
- ✅ Max file size
- ✅ Allowed file types
- ✅ Storage provider (Local/S3/Azure)
- ✅ **Auto backup:**
  - Enable/Disable
  - Frequency (hourly/daily/weekly)
  - Retention period

**UX Features:**
- Tab navigation rõ ràng
- Visual feedback cho settings đã thay đổi
- Confirmation modal khi save
- Reset to default option

---

### **7. 📋 Audit Logs & Monitoring** (`/admin/logs`)

**Mục đích:** Theo dõi mọi hoạt động trong hệ thống

**Các thành phần:**
- ✅ **Stats Cards (4 cards):**
  - Info logs (màu xanh)
  - Warning logs (màu vàng)
  - Error logs (màu đỏ)
  - Success rate (%)

- ✅ **Filters:**
  - Search: user, action, details
  - **Date filter:** Today / Yesterday / 7 days / 30 days
  - **Level filter:** All / Info / Warning / Error
  - **Module filter:** Authentication, User Management, Patient Management, System...

- ✅ **Log Entries:**
  - Timeline layout với màu sắc theo level
  - Hiển thị: Timestamp, User, Action, Module, Details, IP address
  - Icons cho status (success/failed/warning)
  - Expand để xem details

- ✅ **Actions:**
  - View log details
  - Export logs
  - Refresh
  - Pagination

**UX Features:**
- Real-time log streaming (WebSocket)
- Color-coded severity levels
- Search highlight
- Infinite scroll or pagination
- Quick filters cho critical logs

---

### **8. 📚 Documentation** (`/admin/docs`) - TODO

**Mục đích:** Hướng dẫn sử dụng cho admin

**Nội dung (đề xuất):**
- Getting started guide
- User management tutorial
- Role configuration guide
- System settings explanation
- Troubleshooting common issues
- API documentation (if needed)
- Video tutorials

---

## 🎨 DESIGN SYSTEM

### **Color Palette:**
```css
Primary: Blue (#3b82f6)
Success: Green (#10b981)
Warning: Yellow (#f59e0b)
Error: Red (#ef4444)
Info: Cyan (#06b6d4)

Background: Slate-950 (#020617)
Surface: Slate-900 (#0f172a)
Border: Slate-700 (#334155)
Text: Slate-100 (#f1f5f9)
```

### **Typography:**
- Heading: Font bold, larger size
- Body: Regular weight
- Code/Mono: Font mono cho IDs, codes

### **Components:**
- Gradient cards với glassmorphism
- Consistent border radius (8px)
- Shadow và hover effects
- Loading skeletons
- Toast notifications cho actions

### **Icons:**
- Lucide React icons
- Consistent size (16px, 20px, 24px)
- Color matching context

---

## 🚀 FEATURES CHUNG

### **Toàn bộ Admin Portal có:**
1. ✅ **Responsive Design** - hoạt động mượt trên mobile/tablet/desktop
2. ✅ **Dark Theme** - thiết kế tối ưu cho làm việc lâu
3. ✅ **Real-time Updates** - data tự động refresh
4. ✅ **Search & Filter** - tìm kiếm nhanh mọi thứ
5. ✅ **Export Data** - xuất CSV/Excel/PDF
6. ✅ **Breadcrumb Navigation** - biết đang ở đâu
7. ✅ **Loading States** - skeleton loading cho UX tốt
8. ✅ **Error Handling** - hiển thị lỗi rõ ràng
9. ✅ **Keyboard Shortcuts** - thao tác nhanh
10. ✅ **Accessibility (a11y)** - ARIA labels, keyboard nav

---

## 📱 RESPONSIVE BREAKPOINTS

```
Mobile: < 768px (1 column)
Tablet: 768px - 1024px (2 columns)
Desktop: > 1024px (3-4 columns)
```

---

## 🔒 SECURITY FEATURES

1. **Role-based Access Control** - chỉ admin mới vào được
2. **Audit Trail** - log mọi thao tác admin
3. **Session Timeout** - auto logout sau X phút
4. **2FA Support** - xác thực 2 lớp
5. **IP Whitelist** - giới hạn IP được truy cập

---

## 📊 PERFORMANCE

- **Lazy Loading** cho tables lớn
- **Virtual Scrolling** cho danh sách dài
- **Debounced Search** tránh lag
- **Optimistic UI** cho actions nhanh
- **Cache Strategy** cho data ít thay đổi

---

## 🎯 NEXT STEPS (Tích hợp Backend)

### **API Endpoints cần có:**
```
GET  /api/admin/dashboard/stats
GET  /api/admin/users?role=&status=&search=
POST /api/admin/users
PUT  /api/admin/users/:id
DELETE /api/admin/users/:id

GET  /api/admin/doctors?specialty=&status=
GET  /api/admin/patients?risk=&gender=

GET  /api/admin/roles
PUT  /api/admin/roles/:id/permissions

GET  /api/admin/settings
PUT  /api/admin/settings

GET  /api/admin/logs?level=&module=&date=
```

### **WebSocket cho Real-time:**
```
ws://backend/admin/dashboard → live stats
ws://backend/admin/logs → live log stream
```

---

## ✅ CHECKLIST HOÀN THÀNH

- ✅ Admin Dashboard với KPI & charts
- ✅ User Management với filter & actions
- ✅ Doctor Management với specialty filter
- ✅ Patient Management với risk levels
- ✅ Role & Permission Matrix
- ✅ System Settings (4 tabs)
- ✅ Audit Logs & Monitoring
- ✅ Navigation config updated
- ✅ Responsive design
- ✅ Dark theme với gradient effects
- ⏳ Documentation page (TODO)
- ⏳ Backend API integration (TODO)
- ⏳ WebSocket real-time updates (TODO)

---

## 💡 UX BEST PRACTICES ĐÃ ÁP DỤNG

1. **Consistency:** Tất cả pages dùng chung PageHero, Card layout
2. **Clarity:** Labels rõ ràng, icons phù hợp, color-coding logic
3. **Efficiency:** Quick filters, bulk actions, keyboard shortcuts
4. **Feedback:** Loading states, success/error messages, confirmation modals
5. **Accessibility:** Proper semantic HTML, ARIA labels, keyboard navigation
6. **Performance:** Lazy loading, debounced search, optimistic updates
7. **Safety:** Confirmation cho destructive actions (delete, lock user)
8. **Help:** Tooltips, descriptions, documentation links

---

## 📞 SUPPORT

Để sử dụng Admin Portal:
1. Đăng nhập với tài khoản **admin**
2. Truy cập `/admin` hoặc click "Admin Dashboard" trong sidebar
3. Tất cả routes admin bắt đầu bằng `/admin/*`
4. Chỉ user có role = "admin" mới truy cập được

---

**🎉 Admin Portal đã sẵn sàng sử dụng!**

Next: Tích hợp backend APIs và thêm real-time features.
