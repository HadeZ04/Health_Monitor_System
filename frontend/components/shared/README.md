# 🎨 Hệ Thống Component Dùng Chung - Health Monitor System

Bộ component UI/UX được thiết kế chuyên biệt cho hệ thống quản lý sức khỏe, đảm bảo tính nhất quán và tái sử dụng cao trên toàn bộ Patient Portal, Doctor Portal và Admin Portal.

---

## 📋 Danh Sách Components

### 1. **HealthMetricCard** 
Hiển thị một chỉ số sức khỏe (vital sign)

**Props chính:**
- `label`: Tên chỉ số (VD: "Heart Rate", "Blood Pressure")
- `value`: Giá trị hiện tại
- `unit`: Đơn vị đo
- `status`: 'normal' | 'warning' | 'critical' | 'low' | 'info'
- `icon`: LucideIcon
- `trend`: 'up' | 'down' | 'stable'
- `trendValue`: Giá trị thay đổi (VD: "+5%")
- `timestamp`: Thời gian đo
- `size`: 'sm' | 'md' | 'lg'
- `onClick`: Click handler

**Ví dụ sử dụng:**
```tsx
// Patient Portal - Dashboard
<HealthMetricCard
  label="Nhịp tim"
  value={72}
  unit="bpm"
  status="normal"
  icon={Heart}
  trend="stable"
  timestamp="5 phút trước"
  onClick={() => navigate('/metrics/heart-rate')}
/>

// Doctor Portal - Patient Detail
<HealthMetricCard
  label="Huyết áp"
  value="140/90"
  unit="mmHg"
  status="warning"
  icon={Activity}
  trend="up"
  trendValue="+8%"
  size="lg"
/>
```

**Màu sắc theo trạng thái:**
- Normal: Xanh lá (success)
- Warning: Vàng (warning)
- Critical: Đỏ (error)
- Low: Xanh dương (blue)
- Info: Xám (slate)

---

### 2. **HealthTrendChart**
Biểu đồ xu hướng chỉ số sức khỏe theo thời gian

**Props chính:**
- `title`: Tiêu đề biểu đồ
- `data`: Array<HealthDataPoint>
- `metrics`: Array<MetricConfig> - Cấu hình các metrics
- `selectedRange`: '7d' | '30d' | '3m' | '6m' | 'custom'
- `onRangeChange`: Callback khi đổi khoảng thời gian
- `onExport`: Export dữ liệu
- `showGrid`: Hiển thị lưới
- `showLegend`: Hiển thị chú thích
- `height`: Chiều cao (px)
- `loading`: Loading state

**Ví dụ:**
```tsx
// Patient Portal - Health History
<HealthTrendChart
  title="Nhịp tim 7 ngày"
  data={heartRateData}
  metrics={[
    { 
      key: 'heartRate', 
      label: 'Nhịp tim', 
      color: '#0EA5E9', 
      unit: 'bpm' 
    }
  ]}
  selectedRange="7d"
  onRangeChange={handleRangeChange}
  onExport={exportData}
/>

// Doctor Portal - Multi-metric chart
<HealthTrendChart
  title="Huyết áp"
  data={bpData}
  metrics={[
    { key: 'systolic', label: 'Tâm thu', color: '#EF4444', unit: 'mmHg' },
    { key: 'diastolic', label: 'Tâm trương', color: '#3B82F6', unit: 'mmHg' },
  ]}
  height={400}
/>
```

**Features:**
- Time range selector tích hợp
- Custom tooltip với đầy đủ thông tin
- Footer hiển thị thống kê (Avg, Min, Max)
- Responsive design
- Hỗ trợ multiple metrics

---

### 3. **AppointmentListItem**
Hiển thị một lịch hẹn khám

**Props chính:**
- `appointment`: AppointmentData object
- `viewMode`: 'patient' | 'doctor' | 'admin'
- `showActions`: Boolean
- `onClick`: Click handler
- `onJoin`: Join video call
- `onReschedule`: Đổi lịch
- `onCancel`: Hủy lịch
- `onViewDetails`: Xem chi tiết
- `onMoreActions`: Menu actions khác

**Ví dụ:**
```tsx
// Patient Portal
<AppointmentListItem
  appointment={{
    id: 1,
    doctorName: "BS. Nguyễn Văn A",
    specialty: "Tim mạch",
    date: "25/12/2025",
    time: "09:00 - 10:00",
    status: "confirmed",
    type: "video",
    reason: "Khám định kỳ",
  }}
  viewMode="patient"
  onJoin={() => joinVideoCall()}
  onReschedule={() => openRescheduleModal()}
  onCancel={() => cancelAppointment()}
/>

// Doctor Portal
<AppointmentListItem
  appointment={{
    id: 2,
    patientName: "Nguyễn Thị B",
    date: "26/12/2025",
    time: "14:00 - 15:00",
    status: "pending",
    type: "in-person",
    location: "Phòng khám 101",
  }}
  viewMode="doctor"
  onClick={() => navigate(`/appointments/${id}`)}
/>
```

**View Mode Behavior:**
- `patient`: Hiển thị tên bác sĩ
- `doctor`: Hiển thị tên bệnh nhân
- `admin`: Hiển thị cả hai

---

### 4. **StatusBadge (Enhanced)**
Badge hiển thị trạng thái với nhiều variant

**Variants:**
- **Appointment**: pending, confirmed, completed, canceled, rescheduled, no-show
- **Patient Condition**: stable, warning, critical
- **User Status**: active, inactive, locked
- **System Status**: online, offline, maintenance
- **General**: info, success, error, default

**Props:**
- `variant`: Status variant
- `size`: 'sm' | 'md' | 'lg'
- `icon`: LucideIcon
- `showDot`: Hiển thị animated dot
- `tooltip`: Tooltip text
- `dotColor`: Custom dot color

**Ví dụ:**
```tsx
// Basic
<StatusBadge variant="confirmed">Đã xác nhận</StatusBadge>

// With icon & dot
<StatusBadge variant="critical" icon={AlertTriangle} showDot>
  Nghiêm trọng
</StatusBadge>

// Using presets
<PatientCriticalBadge size="lg" />
<AppointmentConfirmedBadge icon={CheckCircle} />
<UserActiveBadge showDot />
```

**Preset Components:**
- `AppointmentPendingBadge`, `AppointmentConfirmedBadge`, etc.
- `PatientStableBadge`, `PatientWarningBadge`, `PatientCriticalBadge`
- `UserActiveBadge`, `UserInactiveBadge`, `UserLockedBadge`

---

### 5. **EmptyState**
Hiển thị khi không có dữ liệu

**Props:**
- `variant`: 'default' | 'no-results' | 'error' | 'no-data' | 'custom'
- `icon`: Custom icon
- `title`: Tiêu đề
- `description`: Mô tả
- `actionLabel`: Nhãn button chính
- `onAction`: Action handler
- `secondaryActionLabel`: Nhãn button phụ
- `onSecondaryAction`: Secondary action
- `size`: 'sm' | 'md' | 'lg'

**Ví dụ:**
```tsx
// Basic
<EmptyState
  variant="no-data"
  icon={Users}
  title="Chưa có bệnh nhân"
  description="Hãy thêm bệnh nhân đầu tiên."
  actionLabel="Thêm bệnh nhân"
  onAction={() => openAddPatientModal()}
/>

// Error with retry
<EmptyState
  variant="error"
  actionLabel="Thử lại"
  onAction={() => refetch()}
/>

// Using presets
<NoPatientsState
  actionLabel="Thêm bệnh nhân"
  onAction={() => navigate('/patients/new')}
/>
<NoAppointmentsState size="lg" />
<NoHealthDataState />
```

**Preset Components:**
- `NoDataState`
- `NoSearchResultsState`
- `ErrorState`
- `NoPatientsState`
- `NoAppointmentsState`
- `NoHealthDataState`

---

### 6. **FilterBar**
Component filter & search dùng chung

**Props:**
- `searchPlaceholder`: Placeholder search
- `searchValue`: Giá trị search (controlled)
- `onSearchChange`: Search change handler
- `dropdownFilters`: Array dropdown filters
- `selectedFilters`: Object filters đã chọn
- `onFilterChange`: Filter change handler
- `showDateRange`: Hiển thị date picker
- `dateRange`: Date range value
- `onDateRangeChange`: Date range handler
- `tagFilters`: Array tag filters
- `selectedTags`: Tags đã chọn
- `onTagChange`: Tag change handler
- `onClearAll`: Clear all filters
- `actions`: Additional action buttons

**Ví dụ:**
```tsx
<FilterBar
  searchPlaceholder="Tìm kiếm bác sĩ..."
  searchValue={search}
  onSearchChange={setSearch}
  dropdownFilters={[
    {
      id: 'specialty',
      label: 'Chuyên khoa',
      options: [
        { label: 'Tất cả', value: 'all' },
        { label: 'Tim mạch', value: 'cardiology' },
        { label: 'Nội khoa', value: 'internal' },
      ],
    },
    {
      id: 'status',
      label: 'Trạng thái',
      options: [
        { label: 'Đang hoạt động', value: 'active' },
        { label: 'Không hoạt động', value: 'inactive' },
      ],
    },
  ]}
  selectedFilters={filters}
  onFilterChange={handleFilterChange}
  tagFilters={specialtyTags}
  selectedTags={selectedTags}
  onTagChange={setSelectedTags}
  onClearAll={clearAllFilters}
  actions={
    <Button onClick={exportData}>
      <Download className="h-4 w-4 mr-2" />
      Export
    </Button>
  }
/>
```

**Features:**
- Debounced search (300ms)
- Responsive mobile filters panel
- Active filter count
- Tag-based filtering
- Custom action buttons

---

### 7. **PageHeader**
Header component cho tất cả các page

**Props:**
- `title`: Tiêu đề page
- `subtitle`: Mô tả
- `icon`: Icon bên cạnh title
- `breadcrumb`: Array breadcrumb items
- `badges`: Array badge components
- `actions`: Action buttons
- `showBackButton`: Hiển thị nút back
- `onBack`: Back handler
- `variant`: 'default' | 'gradient' | 'minimal'

**Ví dụ:**
```tsx
// Basic
<PageHeader
  title="Danh sách bệnh nhân"
  subtitle="Quản lý thông tin bệnh nhân trong hệ thống"
/>

// Full featured
<PageHeader
  icon={Calendar}
  title="Lịch hẹn"
  subtitle="Quản lý lịch hẹn khám bệnh"
  breadcrumb={[
    { label: 'Trang chủ', href: '/' },
    { label: 'Lịch hẹn' },
  ]}
  badges={[
    <StatusBadge variant="active">15 đang chờ</StatusBadge>,
  ]}
  actions={
    <>
      <Button variant="outline">
        <Filter className="h-4 w-4 mr-2" />
        Lọc
      </Button>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Thêm lịch hẹn
      </Button>
    </>
  }
/>

// With back button
<PageHeader
  variant="gradient"
  icon={User}
  title="Bệnh nhân Nguyễn Văn A"
  subtitle="ID: #12345"
  showBackButton
  badges={[<PatientStableBadge />]}
/>
```

---

### 8. **FormModal**
Modal/Drawer cho form

**Props:**
- `open`: Modal visibility
- `onClose`: Close handler
- `title`: Tiêu đề
- `description`: Mô tả
- `layout`: 'modal' | 'drawer' | 'auto'
- `sections`: Array form sections
- `children`: Form content
- `onSubmit`: Submit handler
- `onCancel`: Cancel handler
- `submitLabel`: Nhãn nút submit
- `cancelLabel`: Nhãn nút cancel
- `loading`: Loading state
- `error`: Error message
- `disableSubmit`: Disable submit
- `hideFooter`: Ẩn footer
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl'

**Ví dụ:**
```tsx
// Simple form
<FormModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Thêm bệnh nhân"
  description="Nhập thông tin bệnh nhân mới"
  onSubmit={handleSubmit}
  loading={isSubmitting}
>
  <Input label="Họ và tên" />
  <Input label="Email" type="email" />
  <Input label="Số điện thoại" />
</FormModal>

// Multi-section form
<FormModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Tạo lịch hẹn"
  sections={[
    {
      id: 'basic',
      title: 'Thông tin cơ bản',
      description: 'Thông tin chung về lịch hẹn',
      content: (
        <>
          <Select label="Bệnh nhân" options={patients} />
          <Select label="Bác sĩ" options={doctors} />
        </>
      ),
    },
    {
      id: 'datetime',
      title: 'Ngày giờ',
      content: (
        <>
          <DatePicker label="Ngày khám" />
          <TimePicker label="Giờ khám" />
        </>
      ),
    },
  ]}
  onSubmit={handleCreateAppointment}
  error={errorMessage}
/>
```

**Features:**
- Auto responsive (Modal desktop, Drawer mobile)
- Multi-section support
- Loading & error states
- Prevent body scroll
- Form validation support

---

### 9. **NotificationDropdown**
Dropdown thông báo trên navbar

**Props:**
- `notifications`: Array<Notification>
- `onMarkAsRead`: Mark as read handler
- `onMarkAllAsRead`: Mark all handler
- `onDelete`: Delete handler
- `viewAllUrl`: Link xem tất cả
- `maxDisplayItems`: Số lượng hiển thị tối đa
- `showBadge`: Hiển thị badge đếm

**Notification Types:**
- `warning`: Cảnh báo
- `info`: Thông tin
- `system`: Hệ thống
- `appointment`: Lịch hẹn
- `health`: Sức khỏe

**Ví dụ:**
```tsx
<NotificationDropdown
  notifications={[
    {
      id: 1,
      type: 'warning',
      title: 'Chỉ số bất thường',
      message: 'Huyết áp của bạn cao hơn bình thường',
      timestamp: '5 phút trước',
      read: false,
      actionUrl: '/metrics/blood-pressure',
      actionLabel: 'Xem chi tiết',
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Lịch hẹn sắp tới',
      message: 'Bạn có lịch khám vào 9:00 ngày mai',
      timestamp: '1 giờ trước',
      read: false,
      actionUrl: '/appointments/123',
    },
    {
      id: 3,
      type: 'system',
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống sẽ bảo trì vào 2:00 AM',
      timestamp: '3 giờ trước',
      read: true,
    },
  ]}
  onMarkAsRead={(id) => markNotificationAsRead(id)}
  onMarkAllAsRead={() => markAllAsRead()}
  onDelete={(id) => deleteNotification(id)}
  viewAllUrl="/dashboard/notifications"
  maxDisplayItems={5}
/>
```

**Features:**
- Badge đếm unread
- Animated bell icon
- Mark as read/delete actions
- Click outside to close
- Scroll trong dropdown
- Responsive

---

### 10. **LanguageThemeSwitcher**
Chuyển đổi ngôn ngữ và theme

**Components:**
- `LanguageThemeSwitcher`: Full component
- `LanguageSwitcher`: Chỉ ngôn ngữ
- `ThemeSwitcher`: Chỉ theme
- `LanguageThemeDropdown`: Dropdown variant

**Props:**
- `language`: 'en' | 'vi' (controlled)
- `onLanguageChange`: Language handler
- `theme`: 'light' | 'dark' | 'system' (controlled)
- `onThemeChange`: Theme handler
- `showLanguage`: Hiển thị language switcher
- `showTheme`: Hiển thị theme switcher
- `orientation`: 'horizontal' | 'vertical'
- `size`: 'sm' | 'md' | 'lg'

**Ví dụ:**
```tsx
// Full switcher (uncontrolled - uses localStorage)
<LanguageThemeSwitcher />

// Controlled
<LanguageThemeSwitcher
  language={currentLanguage}
  onLanguageChange={setLanguage}
  theme={currentTheme}
  onThemeChange={setTheme}
/>

// Language only
<LanguageSwitcher
  language={lang}
  onLanguageChange={setLang}
  size="sm"
/>

// Theme only
<ThemeSwitcher
  theme={theme}
  onThemeChange={setTheme}
/>

// Dropdown variant (tiết kiệm không gian navbar)
<LanguageThemeDropdown
  language={lang}
  onLanguageChange={setLang}
  theme={theme}
  onThemeChange={setTheme}
/>
```

**Features:**
- Persistent preferences (localStorage)
- Auto apply theme to document
- Smooth transitions
- Compact design
- Icons indicators

---

## 🎨 Design System

### Màu sắc
Hệ thống sử dụng màu sắc nhất quán:
- **Primary**: Sky Blue (#0EA5E9)
- **Secondary**: Teal (#14B8A6)
- **Success**: Green (#22C55E)
- **Warning**: Yellow (#FBBF24)
- **Error**: Red (#EF4444)
- **Info**: Blue (#3B82F6)

### Spacing
- Gap nhỏ: 2-3 (8-12px)
- Gap trung bình: 4 (16px)
- Gap lớn: 6 (24px)
- Padding card: 4-6 (16-24px)

### Typography
- Title: text-2xl / text-3xl, font-bold
- Subtitle: text-sm / text-base, text-slate-600
- Body: text-sm
- Label: text-xs, font-medium

### Border & Radius
- Border: border-2 hoặc border
- Radius: rounded-xl (12px) cho cards, rounded-lg (8px) cho buttons
- Shadow: shadow-sm / shadow-md / shadow-lg

---

## 📱 Responsive Design

Tất cả components đều responsive:
- **Mobile (<768px)**: Stack layout, drawer modals
- **Tablet (768-1024px)**: 2-column layouts
- **Desktop (>1024px)**: Full layouts, modals

---

## ♿ Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states
- Screen reader support

---

## 🔄 Cách Sử Dụng Trong Project

### Import
```tsx
import {
  HealthMetricCard,
  HealthTrendChart,
  AppointmentListItem,
  StatusBadge,
  EmptyState,
  FilterBar,
  PageHeader,
  FormModal,
  NotificationDropdown,
  LanguageThemeSwitcher,
  // Preset components
  PatientCriticalBadge,
  NoAppointmentsState,
} from '@/components/shared';
```

### Usage Scenarios

#### Patient Portal Dashboard
```tsx
<PageHeader title="Dashboard" subtitle="Tổng quan sức khỏe của bạn" />

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <HealthMetricCard
    label="Nhịp tim"
    value={72}
    unit="bpm"
    status="normal"
    icon={Heart}
  />
  {/* More metrics... */}
</div>

<HealthTrendChart
  title="Nhịp tim 7 ngày"
  data={heartRateData}
  metrics={heartRateMetrics}
/>
```

#### Doctor Portal - Patient List
```tsx
<PageHeader
  icon={Users}
  title="Bệnh nhân"
  actions={
    <Button onClick={openAddPatient}>
      <UserPlus className="h-4 w-4 mr-2" />
      Thêm bệnh nhân
    </Button>
  }
/>

<FilterBar
  searchPlaceholder="Tìm kiếm bệnh nhân..."
  dropdownFilters={statusFilters}
  tagFilters={conditionTags}
  onClearAll={clearFilters}
/>

{patients.length === 0 ? (
  <NoPatientsState
    actionLabel="Thêm bệnh nhân"
    onAction={openAddPatient}
  />
) : (
  <div className="space-y-3">
    {patients.map(patient => (
      <PatientListItem key={patient.id} patient={patient} />
    ))}
  </div>
)}
```

#### Admin Portal - Appointments
```tsx
<PageHeader
  icon={Calendar}
  title="Quản lý lịch hẹn"
  breadcrumb={[
    { label: 'Trang chủ', href: '/admin' },
    { label: 'Lịch hẹn' },
  ]}
/>

<FilterBar
  searchPlaceholder="Tìm lịch hẹn..."
  dropdownFilters={appointmentFilters}
  showDateRange
  dateRange={dateRange}
  onDateRangeChange={setDateRange}
/>

<div className="space-y-3">
  {appointments.map(apt => (
    <AppointmentListItem
      key={apt.id}
      appointment={apt}
      viewMode="admin"
      onViewDetails={() => navigate(`/appointments/${apt.id}`)}
    />
  ))}
</div>
```

---

## ✅ Best Practices

1. **Consistency**: Luôn dùng shared components thay vì tự tạo mới
2. **Props typing**: Sử dụng TypeScript types được export
3. **Status colors**: Dùng status predefined (normal/warning/critical...)
4. **Responsive**: Test trên nhiều screen sizes
5. **Accessibility**: Cung cấp đầy đủ aria-labels và keyboard support
6. **Loading states**: Xử lý loading & error states
7. **Empty states**: Luôn có empty state cho empty data

---

## 🔗 Component Dependencies

```
HealthMetricCard -> StatusBadge (implicitly)
HealthTrendChart -> recharts library
AppointmentListItem -> StatusBadge, Button, Badge
FormModal -> Button
FilterBar -> Input, Button
NotificationDropdown -> Button
```

Tất cả đều sử dụng:
- `@/lib/utils` (cn helper)
- `lucide-react` (icons)
- Tailwind CSS

---

## 📦 File Structure

```
components/
  shared/
    HealthMetricCard.tsx
    HealthTrendChart.tsx
    AppointmentListItem.tsx
    StatusBadge.tsx
    EmptyState.tsx
    FilterBar.tsx
    PageHeader.tsx
    FormModal.tsx
    NotificationDropdown.tsx
    LanguageThemeSwitcher.tsx
    index.ts (exports)
    README.md (this file)
```

---

Hệ thống component này cung cấp nền tảng vững chắc cho việc xây dựng UI/UX nhất quán, chuyên nghiệp và dễ bảo trì cho toàn bộ Health Monitor System.
