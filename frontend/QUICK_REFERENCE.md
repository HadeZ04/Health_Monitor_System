# 🚀 Quick Reference - Shared Components

## Import Statement
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
} from '@/components/shared';
```

---

## 1. HealthMetricCard

```tsx
<HealthMetricCard
  label="Nhịp tim"
  value={72}
  unit="bpm"
  status="normal" // normal | warning | critical | low | info
  icon={Heart}
  trend="stable" // up | down | stable
  trendValue="+5%"
  timestamp="5 phút trước"
  size="md" // sm | md | lg
  onClick={() => {}}
/>
```

---

## 2. HealthTrendChart

```tsx
<HealthTrendChart
  title="Nhịp tim 7 ngày"
  data={[
    { timestamp: '01/12', heartRate: 72 },
    { timestamp: '02/12', heartRate: 75 },
  ]}
  metrics={[
    { key: 'heartRate', label: 'Nhịp tim', color: '#0EA5E9', unit: 'bpm' }
  ]}
  selectedRange="7d" // 7d | 30d | 3m | 6m | custom
  onRangeChange={(range) => {}}
  onExport={() => {}}
/>
```

---

## 3. AppointmentListItem

```tsx
<AppointmentListItem
  appointment={{
    id: 1,
    doctorName: "BS. Nguyễn Văn A",
    patientName: "Nguyễn Thị B",
    specialty: "Tim mạch",
    date: "25/12/2025",
    time: "09:00 - 10:00",
    status: "confirmed", // pending | confirmed | completed | canceled
    type: "video", // in-person | video | phone
    location: "Phòng 101",
    reason: "Khám định kỳ",
  }}
  viewMode="patient" // patient | doctor | admin
  onJoin={() => {}}
  onReschedule={() => {}}
  onCancel={() => {}}
/>
```

---

## 4. StatusBadge

```tsx
// Basic
<StatusBadge variant="confirmed" size="md">
  Đã xác nhận
</StatusBadge>

// With icon & dot
<StatusBadge variant="critical" icon={AlertTriangle} showDot>
  Nghiêm trọng
</StatusBadge>

// Presets
<PatientCriticalBadge />
<AppointmentConfirmedBadge />
<UserActiveBadge showDot />
```

**Variants:**
- Appointment: `pending` `confirmed` `completed` `canceled`
- Patient: `stable` `warning` `critical`
- User: `active` `inactive` `locked`
- General: `info` `success` `error` `default`

---

## 5. EmptyState

```tsx
<EmptyState
  variant="no-data" // default | no-results | error | no-data | custom
  icon={Users}
  title="Chưa có bệnh nhân"
  description="Hãy thêm bệnh nhân đầu tiên."
  actionLabel="Thêm bệnh nhân"
  onAction={() => {}}
  size="md" // sm | md | lg
/>

// Presets
<NoPatientsState actionLabel="Thêm" onAction={() => {}} />
<NoAppointmentsState />
<NoHealthDataState />
```

---

## 6. FilterBar

```tsx
<FilterBar
  searchPlaceholder="Tìm kiếm..."
  searchValue={search}
  onSearchChange={setSearch}
  dropdownFilters={[
    {
      id: 'status',
      label: 'Trạng thái',
      options: [
        { label: 'Tất cả', value: 'all' },
        { label: 'Hoạt động', value: 'active' },
      ],
    },
  ]}
  selectedFilters={filters}
  onFilterChange={(id, value) => {}}
  tagFilters={[
    { label: 'Tim mạch', value: 'cardiology' },
  ]}
  selectedTags={tags}
  onTagChange={setTags}
  showDateRange={true}
  onClearAll={() => {}}
  actions={<Button>Export</Button>}
/>
```

---

## 7. PageHeader

```tsx
<PageHeader
  title="Danh sách bệnh nhân"
  subtitle="Quản lý thông tin bệnh nhân"
  icon={Users}
  breadcrumb={[
    { label: 'Trang chủ', href: '/' },
    { label: 'Bệnh nhân' },
  ]}
  badges={[<StatusBadge variant="active">25 active</StatusBadge>]}
  actions={
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Thêm mới
    </Button>
  }
  showBackButton={false}
  variant="default" // default | gradient | minimal
/>
```

---

## 8. FormModal

```tsx
<FormModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Thêm bệnh nhân"
  description="Nhập thông tin bệnh nhân mới"
  layout="auto" // modal | drawer | auto
  maxWidth="lg" // sm | md | lg | xl | 2xl
  onSubmit={handleSubmit}
  loading={isLoading}
  error={errorMessage}
  submitLabel="Lưu"
  cancelLabel="Hủy"
>
  <Input label="Họ và tên" />
  <Input label="Email" />
</FormModal>

// With sections
<FormModal
  sections={[
    {
      id: 'basic',
      title: 'Thông tin cơ bản',
      content: <Input label="Name" />,
    },
    {
      id: 'details',
      title: 'Chi tiết',
      content: <Textarea label="Notes" />,
    },
  ]}
  {...props}
/>
```

---

## 9. NotificationDropdown

```tsx
<NotificationDropdown
  notifications={[
    {
      id: 1,
      type: 'warning', // warning | info | system | appointment | health
      title: 'Chỉ số bất thường',
      message: 'Huyết áp cao hơn bình thường',
      timestamp: '5 phút trước',
      read: false,
      actionUrl: '/metrics/bp',
      actionLabel: 'Xem chi tiết',
    },
  ]}
  onMarkAsRead={(id) => {}}
  onMarkAllAsRead={() => {}}
  onDelete={(id) => {}}
  viewAllUrl="/notifications"
  maxDisplayItems={5}
  showBadge={true}
/>
```

---

## 10. LanguageThemeSwitcher

```tsx
// Full switcher (uncontrolled)
<LanguageThemeSwitcher />

// Controlled
<LanguageThemeSwitcher
  language="vi" // en | vi
  onLanguageChange={setLanguage}
  theme="light" // light | dark | system
  onThemeChange={setTheme}
  size="md" // sm | md | lg
  orientation="horizontal" // horizontal | vertical
/>

// Separate components
<LanguageSwitcher language="vi" onLanguageChange={setLang} />
<ThemeSwitcher theme="light" onThemeChange={setTheme} />
<LanguageThemeDropdown {...props} />
```

---

## Color Tokens

```tsx
// Status Colors
status="normal"    // Green (#22C55E)
status="warning"   // Yellow (#FBBF24)
status="critical"  // Red (#EF4444)
status="low"       // Blue (#3B82F6)
status="info"      // Slate (#64748B)

// Badge Variants
variant="confirmed"  // Green
variant="pending"    // Yellow
variant="canceled"   // Red
variant="completed"  // Gray
```

---

## Common Patterns

### Patient Dashboard
```tsx
<PageHeader title="Dashboard" />
<div className="grid grid-cols-4 gap-4">
  <HealthMetricCard {...} />
</div>
<HealthTrendChart {...} />
```

### List Page with Filters
```tsx
<PageHeader icon={Users} title="Bệnh nhân" actions={<Button>Thêm</Button>} />
<FilterBar searchValue={search} onSearchChange={setSearch} />
{data.length === 0 ? <EmptyState /> : <List />}
```

### Detail Page
```tsx
<PageHeader
  showBackButton
  title="Chi tiết"
  badges={[<StatusBadge />]}
/>
<Content />
```

---

## Responsive Breakpoints

```tsx
// Tailwind breakpoints used
sm:  640px  // Mobile landscape
md:  768px  // Tablet
lg:  1024px // Desktop
xl:  1280px // Large desktop
```

---

## Accessibility Checklist

- ✅ Semantic HTML (`<button>`, `<nav>`, etc.)
- ✅ ARIA labels (`aria-label`, `aria-disabled`)
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus indicators (`:focus-visible`)
- ✅ Screen reader support
- ✅ Color contrast (WCAG AA)

---

## Demo & Documentation

- **Demo Page:** `/app/demo/shared-components/page.tsx`
- **Full Docs:** `/components/shared/README.md`
- **Summary:** `/SHARED_COMPONENTS_SUMMARY.md`
- **This Quick Ref:** `/QUICK_REFERENCE.md`

---

**✨ Happy Coding!**
