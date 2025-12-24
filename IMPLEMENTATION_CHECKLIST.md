# ✅ Implementation Checklist

## Frontend - API Integration Tasks

### 🏥 Patient Portal
- [ ] Create `services/api/patient.service.ts`
  - [ ] `getPatientDashboard(patientId)`
  - [ ] `getPatientVitals(patientId, filters)`
  - [ ] `getPatientAppointments(patientId)`
  - [ ] `getPatientMedications(patientId)`
  - [ ] `getPatientLabResults(patientId)`

- [ ] Create hooks
  - [ ] `usePatientDashboard()`
  - [ ] `usePatientVitals()`
  - [ ] `usePatientAppointments()`

- [ ] Update components
  - [ ] [app/patient/dashboard/page.tsx](frontend/app/patient/dashboard/page.tsx)
  - [ ] [app/patient/metrics/page.tsx](frontend/app/patient/metrics/page.tsx)
  - [ ] [app/patient/appointments/page.tsx](frontend/app/patient/appointments/page.tsx)

### 👨‍⚕️ Doctor Portal
- [ ] Create `services/api/doctor.service.ts`
  - [ ] `getDoctorDashboard(doctorId)`
  - [ ] `getDoctorPatients(doctorId, filters)`
  - [ ] `getPatientDetail(doctorId, patientId)`
  - [ ] `getDoctorSchedule(doctorId, dateRange)`
  - [ ] `getLabOrders(doctorId, filters)`

- [ ] Create hooks
  - [ ] `useDoctorDashboard()`
  - [ ] `useDoctorPatients()`
  - [ ] `useDoctorSchedule()`

- [ ] Update components
  - [ ] [app/doctor/dashboard/page.tsx](frontend/app/doctor/dashboard/page.tsx)
  - [ ] [app/doctor/patients/page.tsx](frontend/app/doctor/patients/page.tsx)
  - [ ] [app/doctor/schedule/page.tsx](frontend/app/doctor/schedule/page.tsx)

### 🛡️ Admin Portal
- [ ] Create `services/api/admin.service.ts`
  - [ ] `getAdminDashboard()`
  - [ ] `getUsers(filters)`
  - [ ] `getDoctors(filters)`
  - [ ] `getPatients(filters)`
  - [ ] `getRoles()`
  - [ ] `getSystemLogs(filters)`

- [ ] Create hooks
  - [ ] `useAdminDashboard()`
  - [ ] `useUsers()`
  - [ ] `useDoctors()`
  - [ ] `usePatients()`

- [ ] Update components
  - [ ] [app/admin/page.tsx](frontend/app/admin/page.tsx)
  - [ ] [app/admin/users/page.tsx](frontend/app/admin/users/page.tsx)
  - [ ] [app/admin/doctors/page.tsx](frontend/app/admin/doctors/page.tsx)
  - [ ] [app/admin/patients/page.tsx](frontend/app/admin/patients/page.tsx)

### 🔔 Shared Features
- [ ] Create `services/api/notification.service.ts`
  - [ ] `getNotifications(userId)`
  - [ ] `markAsRead(notificationId)`
  - [ ] `markAllAsRead()`

- [ ] Create `services/api/auth.service.ts`
  - [ ] `login(credentials)`
  - [ ] `logout()`
  - [ ] `refreshToken()`
  - [ ] `getCurrentUser()`

- [ ] Update components
  - [ ] [components/layout/TopNav-new.tsx](frontend/components/layout/TopNav-new.tsx)
  - [ ] [components/layout/AuthGuard.tsx](frontend/components/layout/AuthGuard.tsx)

### 🔧 Infrastructure
- [ ] Setup API base configuration
  - [ ] `lib/api/client.ts` - Axios/Fetch wrapper
  - [ ] `lib/api/endpoints.ts` - API endpoints constants
  - [ ] `lib/api/interceptors.ts` - Request/Response interceptors

- [ ] Setup React Query
  - [ ] Install `@tanstack/react-query`
  - [ ] Configure QueryClient
  - [ ] Add QueryClientProvider to app layout

- [ ] Error Handling
  - [ ] Create error boundary components
  - [ ] Setup toast notifications
  - [ ] Add retry logic

- [ ] Loading States
  - [ ] Create skeleton components
  - [ ] Add loading spinners
  - [ ] Implement optimistic updates

### 📱 Type Definitions
- [ ] Create TypeScript interfaces matching backend
  - [ ] `types/patient.ts`
  - [ ] `types/doctor.ts`
  - [ ] `types/admin.ts`
  - [ ] `types/notification.ts`
  - [ ] `types/appointment.ts`
  - [ ] `types/medication.ts`

---

## Backend - API Implementation Tasks

### 🗄️ Database
- [ ] Update Prisma schema (see BACKEND_API_PLAN.md)
  - [ ] Add Appointments table
  - [ ] Add Medications table
  - [ ] Add MedicationSchedules table
  - [ ] Add LabOrders table
  - [ ] Add LabResults table
  - [ ] Add Consultations table
  - [ ] Add Prescriptions table
  - [ ] Add DoctorSchedules table
  - [ ] Add Conversations table
  - [ ] Add Messages table
  - [ ] Add Notifications table
  - [ ] Add AuditLogs table
  - [ ] Add SystemSettings table
  - [ ] Add Permissions table
  - [ ] Add RolePermissions table

- [ ] Update existing tables
  - [ ] User - add name, phone, avatar, status, lastLogin
  - [ ] PatientProfile - add bloodType, healthScore, riskLevel
  - [ ] Device - update status tracking
  - [ ] Alert - add severity, acknowledgedBy, resolvedBy

- [ ] Run migrations
  ```bash
  cd backend
  npx prisma migrate dev --name add_all_tables
  npx prisma generate
  ```

### 🔌 Phase 1 APIs - Critical (Week 1-2)
- [ ] Patient Dashboard API
  - [ ] `GET /api/patients/dashboard/:patientId`
  - [ ] Controller: `patientController.getDashboard()`
  - [ ] Service: `patientService.getDashboardData()`

- [ ] Doctor Dashboard API
  - [ ] `GET /api/doctors/dashboard/:doctorId`
  - [ ] Controller: `doctorController.getDashboard()`
  - [ ] Service: `doctorService.getDashboardData()`

- [ ] Admin Dashboard API
  - [ ] `GET /api/admin/dashboard`
  - [ ] Controller: `adminController.getDashboard()`
  - [ ] Service: `adminService.getDashboardData()`

- [ ] Notifications API
  - [ ] `GET /api/notifications/:userId`
  - [ ] `PUT /api/notifications/:id/read`
  - [ ] `PUT /api/notifications/mark-all-read`
  - [ ] WebSocket: `ws://server/notifications/:userId`

### 🔌 Phase 2 APIs - High Priority (Week 3-4)
- [ ] Doctor Patients Management
  - [ ] `GET /api/doctors/:doctorId/patients`
  - [ ] `GET /api/doctors/:doctorId/patients/:patientId`
  - [ ] `GET /api/doctors/:doctorId/patients/:patientId/history`

- [ ] Admin Users Management
  - [ ] `GET /api/admin/users`
  - [ ] `POST /api/admin/users`
  - [ ] `PUT /api/admin/users/:userId`
  - [ ] `DELETE /api/admin/users/:userId`
  - [ ] `POST /api/admin/users/:userId/lock`
  - [ ] `POST /api/admin/users/:userId/unlock`

- [ ] Admin Doctors Management
  - [ ] `GET /api/admin/doctors`
  - [ ] `POST /api/admin/doctors`
  - [ ] `PUT /api/admin/doctors/:doctorId`
  - [ ] `DELETE /api/admin/doctors/:doctorId`

- [ ] Admin Patients Management
  - [ ] `GET /api/admin/patients`
  - [ ] `POST /api/admin/patients`
  - [ ] `PUT /api/admin/patients/:patientId`
  - [ ] `DELETE /api/admin/patients/:patientId`

- [ ] Appointments Management
  - [ ] `GET /api/patients/:patientId/appointments`
  - [ ] `POST /api/patients/:patientId/appointments`
  - [ ] `PUT /api/patients/:patientId/appointments/:appointmentId`
  - [ ] `DELETE /api/patients/:patientId/appointments/:appointmentId`

### 🔧 Infrastructure
- [ ] Setup WebSocket server
  - [ ] Install `ws` package
  - [ ] Configure WebSocket endpoints
  - [ ] Implement real-time event broadcasting

- [ ] Setup Redis
  - [ ] Install Redis
  - [ ] Configure caching layer
  - [ ] Implement session storage

- [ ] Setup Rate Limiting
  - [ ] Install rate limiting middleware
  - [ ] Configure limits per endpoint

- [ ] Input Validation
  - [ ] Install Zod
  - [ ] Create validation schemas
  - [ ] Add validation middleware

- [ ] RBAC Implementation
  - [ ] Create permission system
  - [ ] Implement role-based middleware
  - [ ] Add permission checks

### 📝 Documentation
- [ ] API Documentation
  - [ ] Setup Swagger/OpenAPI
  - [ ] Document all endpoints
  - [ ] Add request/response examples

- [ ] Create Postman Collection
  - [ ] Export all endpoints
  - [ ] Add test scripts
  - [ ] Share with team

### 🧪 Testing
- [ ] Unit Tests
  - [ ] Test all services
  - [ ] Test all controllers
  - [ ] Test utilities

- [ ] Integration Tests
  - [ ] Test API endpoints
  - [ ] Test database operations
  - [ ] Test authentication flow

---

## Quick Start Commands

### Frontend
```bash
cd frontend

# Install dependencies
npm install @tanstack/react-query axios

# Create service files
mkdir -p services/api hooks/api types/api

# Start development
npm run dev
```

### Backend
```bash
cd backend

# Update schema
npx prisma migrate dev --name add_all_tables

# Install new dependencies
npm install ws redis ioredis zod express-rate-limit

# Start development
npm run dev
```

---

**Priority Order:**
1. ⚡ Authentication & Authorization
2. 🏥 Patient Dashboard
3. 👨‍⚕️ Doctor Dashboard  
4. 🛡️ Admin Dashboard
5. 🔔 Notifications
6. 📋 Management APIs
7. 💬 Messaging & Chat
8. 📊 Analytics & Reports
