# Backend API Implementation Plan

## 📋 Tổng Quan
Tài liệu này chi tiết hóa toàn bộ các Backend API cần phát triển để thay thế mock data trong Frontend.

---

## 🏥 1. PATIENT APIs

### 1.1 Patient Dashboard
**Endpoint:** `GET /api/patients/dashboard/:patientId`
```typescript
Response: {
  profile: {
    name: string;
    age: number;
    gender: string;
    bloodType: string;
    avatar?: string;
  };
  latestVitals: Array<{
    label: string;
    value: string;
    unit: string;
    status: "normal" | "warning" | "critical";
    timestamp: Date;
  }>;
  upcomingAppointments: Array<{
    id: string;
    doctor: string;
    specialty: string;
    date: Date;
    time: string;
    status: "confirmed" | "pending" | "cancelled";
  }>;
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    time: string;
    taken: boolean;
    nextDose: Date;
  }>;
  notifications: Array<{
    id: string;
    type: "appointment" | "medication" | "result" | "alert";
    message: string;
    time: Date;
    unread: boolean;
  }>;
  healthScore: number;
}
```

### 1.2 Patient Vitals History
**Endpoint:** `GET /api/patients/:patientId/vitals`
**Query Params:** `?type=bloodPressure|heartRate|glucose|spo2&from=date&to=date`

### 1.3 Patient Appointments
**Endpoint:** `GET /api/patients/:patientId/appointments`
**Endpoint:** `POST /api/patients/:patientId/appointments`
**Endpoint:** `PUT /api/patients/:patientId/appointments/:appointmentId`
**Endpoint:** `DELETE /api/patients/:patientId/appointments/:appointmentId`

### 1.4 Patient Medications
**Endpoint:** `GET /api/patients/:patientId/medications`
**Endpoint:** `POST /api/patients/:patientId/medications/:medicationId/take`
**Endpoint:** `GET /api/patients/:patientId/medications/schedule`

### 1.5 Patient Lab Results
**Endpoint:** `GET /api/patients/:patientId/lab-results`
**Endpoint:** `GET /api/patients/:patientId/lab-results/:resultId`
**Endpoint:** `GET /api/patients/:patientId/lab-results/:resultId/download`

---

## 👨‍⚕️ 2. DOCTOR APIs

### 2.1 Doctor Dashboard
**Endpoint:** `GET /api/doctors/dashboard/:doctorId`
```typescript
Response: {
  stats: {
    todayAppointments: number;
    completedToday: number;
    patientsUnderCare: number;
    highRiskPatients: number;
    pendingLabOrders: number;
    urgentLabOrders: number;
    unreadMessages: number;
    highPriorityMessages: number;
  };
  todaySchedule: Array<{
    id: string;
    time: string;
    patient: {
      id: string;
      name: string;
      age: number;
    };
    type: "new" | "follow-up" | "emergency";
    reason: string;
    status: "completed" | "in-progress" | "waiting" | "cancelled";
    priority: "normal" | "high" | "critical";
  }>;
  criticalAlerts: Array<{
    id: string;
    patient: {
      id: string;
      name: string;
      age: number;
      room?: string;
    };
    issue: string;
    severity: "warning" | "critical";
    time: Date;
  }>;
  recentActivities: Array<{
    id: string;
    type: "diagnosis" | "prescription" | "lab" | "consultation";
    title: string;
    patient: string;
    time: Date;
  }>;
}
```

### 2.2 Doctor Patients List
**Endpoint:** `GET /api/doctors/:doctorId/patients`
**Query Params:** `?search=&status=&priority=&gender=&sortBy=`
```typescript
Response: {
  patients: Array<{
    id: string;
    code: string;
    name: string;
    age: number;
    gender: string;
    status: "stable" | "warning" | "critical";
    priority: "normal" | "high" | "critical";
    condition: string;
    lastVisit: Date;
    nextAppointment?: Date;
    vitals: {
      bloodPressure: string;
      heartRate: number;
      glucose: number;
      spo2: number;
    };
    tags: string[];
    room?: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

### 2.3 Doctor Patient Detail
**Endpoint:** `GET /api/doctors/:doctorId/patients/:patientId`
**Endpoint:** `GET /api/doctors/:doctorId/patients/:patientId/history`
**Endpoint:** `GET /api/doctors/:doctorId/patients/:patientId/vitals`

### 2.4 Doctor Consultation
**Endpoint:** `GET /api/doctors/:doctorId/consultations/:consultationId`
**Endpoint:** `POST /api/doctors/:doctorId/consultations`
**Endpoint:** `PUT /api/doctors/:doctorId/consultations/:consultationId`
```typescript
Request Body: {
  patientId: string;
  symptoms: string[];
  diagnosis?: string;
  prescription?: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  labOrders?: Array<{
    testType: string;
    priority: "normal" | "urgent";
    notes?: string;
  }>;
  notes: string;
  nextAppointment?: Date;
}
```

### 2.5 Doctor Schedule
**Endpoint:** `GET /api/doctors/:doctorId/schedule`
**Query Params:** `?from=date&to=date`
**Endpoint:** `PUT /api/doctors/:doctorId/schedule`

### 2.6 Doctor Lab Orders
**Endpoint:** `GET /api/doctors/:doctorId/lab-orders`
**Query Params:** `?status=pending|completed&priority=&patientId=`
**Endpoint:** `POST /api/doctors/:doctorId/lab-orders/:orderId/approve`
**Endpoint:** `GET /api/doctors/:doctorId/lab-orders/:orderId/results`

### 2.7 Doctor Messages
**Endpoint:** `GET /api/doctors/:doctorId/messages`
**Endpoint:** `POST /api/doctors/:doctorId/messages`
**Endpoint:** `GET /api/doctors/:doctorId/messages/:conversationId`

---

## 🛡️ 3. ADMIN APIs

### 3.1 Admin Dashboard
**Endpoint:** `GET /api/admin/dashboard`
```typescript
Response: {
  kpi: {
    totalPatients: number;
    patientsChange: string;
    totalDoctors: number;
    doctorsChange: string;
    totalAppointments: number;
    appointmentsChange: string;
    activeUsers: number;
    activeChange: string;
    criticalAlerts: number;
    systemHealth: number;
  };
  charts: {
    loginActivity: Array<{
      time: string;
      logins: number;
    }>;
    appointmentTrends: Array<{
      day: string;
      count: number;
    }>;
    userDistribution: Array<{
      name: string;
      value: number;
      color: string;
    }>;
  };
  recentActivities: Array<{
    id: string;
    user: string;
    action: string;
    time: Date;
    type: string;
  }>;
}
```

### 3.2 Admin Users Management
**Endpoint:** `GET /api/admin/users`
**Query Params:** `?search=&role=&status=&page=&limit=`
```typescript
Response: {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: "patient" | "doctor" | "staff" | "admin";
    status: "active" | "inactive" | "locked";
    lastLogin: Date;
    createdAt: Date;
  }>;
  stats: {
    total: number;
    patients: number;
    doctors: number;
    staff: number;
    admins: number;
    active: number;
    locked: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

**Endpoint:** `POST /api/admin/users`
**Endpoint:** `PUT /api/admin/users/:userId`
**Endpoint:** `DELETE /api/admin/users/:userId`
**Endpoint:** `POST /api/admin/users/:userId/lock`
**Endpoint:** `POST /api/admin/users/:userId/unlock`
**Endpoint:** `POST /api/admin/users/:userId/reset-password`

### 3.3 Admin Doctors Management
**Endpoint:** `GET /api/admin/doctors`
**Query Params:** `?search=&specialty=&status=&page=&limit=`
```typescript
Response: {
  doctors: Array<{
    id: string;
    name: string;
    email: string;
    specialty: string;
    status: "active" | "inactive";
    patients: number;
    appointments: number;
    experience: number;
    rating: number;
    license: string;
    phone: string;
    joinedDate: Date;
  }>;
  stats: {
    total: number;
    active: number;
    totalPatients: number;
    totalAppointments: number;
    avgRating: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

**Endpoint:** `POST /api/admin/doctors`
**Endpoint:** `PUT /api/admin/doctors/:doctorId`
**Endpoint:** `DELETE /api/admin/doctors/:doctorId`
**Endpoint:** `GET /api/admin/doctors/:doctorId/performance`

### 3.4 Admin Patients Management
**Endpoint:** `GET /api/admin/patients`
**Query Params:** `?search=&riskLevel=&gender=&status=&page=&limit=`
```typescript
Response: {
  patients: Array<{
    id: string;
    patientCode: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    age: number;
    status: "active" | "inactive";
    riskLevel: "low" | "medium" | "high";
    doctor: string;
    lastVisit: Date;
    nextAppointment?: Date;
    conditions: string[];
    joinedDate: Date;
  }>;
  stats: {
    total: number;
    active: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

**Endpoint:** `POST /api/admin/patients`
**Endpoint:** `PUT /api/admin/patients/:patientId`
**Endpoint:** `DELETE /api/admin/patients/:patientId`
**Endpoint:** `GET /api/admin/patients/:patientId/details`

### 3.5 Admin Roles & Permissions
**Endpoint:** `GET /api/admin/roles`
**Endpoint:** `POST /api/admin/roles`
**Endpoint:** `PUT /api/admin/roles/:roleId`
**Endpoint:** `DELETE /api/admin/roles/:roleId`
**Endpoint:** `GET /api/admin/roles/:roleId/permissions`
**Endpoint:** `PUT /api/admin/roles/:roleId/permissions`

### 3.6 Admin System Logs
**Endpoint:** `GET /api/admin/logs`
**Query Params:** `?type=&severity=&userId=&from=&to=&page=&limit=`

### 3.7 Admin Settings
**Endpoint:** `GET /api/admin/settings`
**Endpoint:** `PUT /api/admin/settings`

---

## 📊 4. ANALYTICS & MONITORING APIs

### 4.1 Real-time Monitoring
**Endpoint:** `GET /api/monitoring/dashboard`
**WebSocket:** `ws://server/monitoring/stream`

### 4.2 Analytics
**Endpoint:** `GET /api/analytics/overview`
**Query Params:** `?from=date&to=date&type=`
**Endpoint:** `GET /api/analytics/patients`
**Endpoint:** `GET /api/analytics/doctors`
**Endpoint:** `GET /api/analytics/appointments`

---

## 🔔 5. ALERTS & NOTIFICATIONS APIs

### 5.1 Alerts
**Endpoint:** `GET /api/alerts`
**Query Params:** `?userId=&severity=&status=&page=&limit=`
**Endpoint:** `POST /api/alerts`
**Endpoint:** `PUT /api/alerts/:alertId/acknowledge`
**Endpoint:** `PUT /api/alerts/:alertId/resolve`
**WebSocket:** `ws://server/alerts/stream/:userId`

### 5.2 Notifications
**Endpoint:** `GET /api/notifications/:userId`
**Endpoint:** `PUT /api/notifications/:notificationId/read`
**Endpoint:** `PUT /api/notifications/mark-all-read`
**Endpoint:** `DELETE /api/notifications/:notificationId`

---

## 💬 6. MESSAGING & CHAT APIs

### 6.1 Patient-Doctor Chat
**Endpoint:** `GET /api/chat/conversations/:userId`
**Endpoint:** `GET /api/chat/conversations/:conversationId/messages`
**Endpoint:** `POST /api/chat/conversations/:conversationId/messages`
**WebSocket:** `ws://server/chat/:conversationId`

### 6.2 AI Chatbot
**Endpoint:** `POST /api/chat/ai`
**Endpoint:** `GET /api/chat/ai/history/:userId`

---

## 📱 7. IoT & DEVICES APIs

### 7.1 Devices Management
**Endpoint:** `GET /api/devices`
**Endpoint:** `POST /api/devices`
**Endpoint:** `PUT /api/devices/:deviceId`
**Endpoint:** `DELETE /api/devices/:deviceId`
**Endpoint:** `GET /api/devices/:deviceId/status`

### 7.2 Device Signals
**Endpoint:** `POST /api/devices/:deviceId/signals`
**Endpoint:** `GET /api/devices/:deviceId/signals`
**Query Params:** `?type=ecg|ppg|spo2|heartrate&from=&to=`

---

## 📄 8. REPORTS APIs

### 8.1 Medical Reports
**Endpoint:** `GET /api/reports/:patientId`
**Endpoint:** `POST /api/reports`
**Endpoint:** `GET /api/reports/:reportId/download`
**Endpoint:** `GET /api/reports/:reportId/share`

---

## 🔐 9. AUTHENTICATION & AUTHORIZATION APIs

### 9.1 Auth
**Endpoint:** `POST /api/auth/login`
**Endpoint:** `POST /api/auth/register`
**Endpoint:** `POST /api/auth/logout`
**Endpoint:** `POST /api/auth/refresh`
**Endpoint:** `POST /api/auth/forgot-password`
**Endpoint:** `POST /api/auth/reset-password`
**Endpoint:** `GET /api/auth/me`

---

## 🎯 Implementation Priority

### Phase 1 - Critical (Week 1-2)
1. ✅ Authentication APIs (đã có)
2. 🔴 Patient Dashboard API
3. 🔴 Doctor Dashboard API
4. 🔴 Admin Dashboard API
5. 🔴 Alerts & Notifications APIs

### Phase 2 - High Priority (Week 3-4)
1. 🔴 Doctor Patients Management APIs
2. 🔴 Admin Users Management APIs
3. 🔴 Admin Doctors Management APIs
4. 🔴 Admin Patients Management APIs
5. 🔴 Appointments APIs

### Phase 3 - Medium Priority (Week 5-6)
1. 🔴 Patient Vitals APIs
2. 🔴 Medications APIs
3. 🔴 Lab Results & Orders APIs
4. 🔴 Doctor Consultation APIs
5. 🔴 Messaging APIs

### Phase 4 - Low Priority (Week 7-8)
1. 🔴 Analytics APIs
2. 🔴 Reports APIs
3. 🔴 Settings APIs
4. 🔴 System Logs APIs

---

## 📚 Database Schema Updates Needed

### New Tables Required:
1. **Appointments** - lịch hẹn khám
2. **Medications** - thuốc và đơn thuốc
3. **MedicationSchedules** - lịch uống thuốc
4. **LabOrders** - yêu cầu xét nghiệm
5. **LabResults** - kết quả xét nghiệm
6. **Consultations** - buổi khám bệnh
7. **Prescriptions** - đơn thuốc
8. **DoctorSchedules** - lịch làm việc bác sĩ
9. **Conversations** - cuộc hội thoại
10. **Messages** - tin nhắn
11. **Notifications** - thông báo
12. **AuditLogs** - nhật ký hệ thống
13. **SystemSettings** - cài đặt hệ thống
14. **Permissions** - quyền hạn
15. **RolePermissions** - phân quyền

### Existing Tables to Update:
1. **User** - thêm fields: name, phone, avatar, status, lastLogin
2. **PatientProfile** - thêm fields: bloodType, healthScore, riskLevel
3. **Device** - cập nhật status tracking
4. **Alert** - thêm severity, acknowledgedBy, resolvedBy

---

## 🔧 Technical Requirements

### Backend Stack:
- ✅ Node.js + Express (đã có)
- ✅ TypeScript (đã có)
- ✅ Prisma ORM (đã có)
- ✅ PostgreSQL (đã có)
- 🔴 WebSocket (ws) - cần implement
- 🔴 Redis - cho caching và real-time
- 🔴 Bull Queue - cho background jobs

### Security:
- ✅ JWT Authentication (đã có)
- 🔴 Role-based Access Control (RBAC)
- 🔴 Rate Limiting
- 🔴 Input Validation (Zod)
- 🔴 Data Encryption for sensitive data

### Testing:
- 🔴 Unit Tests (Jest)
- 🔴 Integration Tests
- 🔴 E2E Tests
- 🔴 Load Testing

### Documentation:
- 🔴 API Documentation (Swagger/OpenAPI)
- 🔴 Postman Collection
- 🔴 Developer Guide

---

## 📝 Next Steps

1. **Update Database Schema** - Tạo migrations cho các bảng mới
2. **Implement Core APIs** - Bắt đầu với Phase 1
3. **Setup WebSocket** - Cho real-time features
4. **Setup Redis** - Cho caching
5. **Implement RBAC** - Phân quyền chi tiết
6. **Write Tests** - Unit + Integration tests
7. **API Documentation** - Swagger docs
8. **Frontend Integration** - Thay thế mock data bằng API calls

---

## 🎬 Getting Started

### 1. Database Migration
```bash
cd backend
npx prisma migrate dev --name add_all_tables
```

### 2. Create Route Files
```bash
# Tạo các route files mới
touch src/routes/appointments.ts
touch src/routes/medications.ts
touch src/routes/consultations.ts
touch src/routes/notifications.ts
touch src/routes/lab-orders.ts
# ... etc
```

### 3. Implement Controllers
```bash
# Tạo controllers
mkdir -p src/controllers
touch src/controllers/appointmentController.ts
touch src/controllers/medicationController.ts
# ... etc
```

### 4. Add Services Layer
```bash
# Tạo services
touch src/services/appointmentService.ts
touch src/services/medicationService.ts
# ... etc
```

---

**Status:** 🔴 Planning Complete - Ready for Implementation  
**Last Updated:** December 24, 2025  
**Version:** 1.0
