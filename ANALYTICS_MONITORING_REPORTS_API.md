# Analytics, Monitoring & Reports APIs - Implementation Guide

## 📋 Overview

Đã implement thành công 3 modules chính:
- **Analytics APIs**: Phân tích dữ liệu patients, doctors, appointments
- **Monitoring APIs**: Theo dõi hệ thống real-time với WebSocket
- **Reports APIs**: Quản lý báo cáo y tế với share links

---

## 🗄️ Prisma Schema Updates

### Report Model
```prisma
enum ReportType {
  medical
  lab
  consultation
  summary
  custom
}

model ReportModel {
  id          String     @id @default(uuid())
  patient     PatientProfile @relation(fields: [patientId], references: [id], onDelete: Cascade)
  patientId   String
  type        ReportType
  title       String
  description String?
  fileUrl     String?
  metadata    Json?
  createdBy   String
  shareToken  String?    @unique
  sharedAt    DateTime?
  expiresAt   DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([patientId])
  @@index([createdBy])
  @@index([shareToken])
  @@index([createdAt])
}
```

### PatientProfile Updates
- Added `reports` relation to `ReportModel[]`

### Migration Required
```bash
cd database
npx prisma generate
npx prisma db push
# or
npx prisma migrate dev --name add_reports_and_analytics
```

---

## 🔌 Analytics APIs

### Base URL: `/api/analytics`

**Authentication**: Required (JWT)  
**Authorization**: Admin, Doctor roles only

### Endpoints

#### 1. Get Overview Analytics
```http
GET /api/analytics/overview?from=2024-01-01&to=2024-12-31&type=general
```

**Query Parameters:**
- `from` (optional): Start date (ISO format)
- `to` (optional): End date (ISO format)
- `type` (optional): Analytics type

**Response:**
```json
{
  "overview": {
    "totalPatients": 150,
    "activePatients": 120,
    "totalDoctors": 25,
    "activeDoctors": 20,
    "totalAppointments": 500,
    "completedAppointments": 450,
    "totalConsultations": 300,
    "highRiskPatients": 15
  },
  "trends": {
    "appointments": [
      { "date": "2024-01-01", "count": 5 }
    ],
    "consultations": [
      { "date": "2024-01-01", "count": 3 }
    ]
  },
  "period": {
    "from": "2024-01-01T00:00:00.000Z",
    "to": "2024-12-31T23:59:59.999Z"
  }
}
```

#### 2. Get Patient Analytics
```http
GET /api/analytics/patients
```

**Response:**
```json
{
  "riskDistribution": [
    { "riskLevel": "low", "count": 80 },
    { "riskLevel": "medium", "count": 50 },
    { "riskLevel": "high", "count": 20 }
  ],
  "genderDistribution": [
    { "gender": "male", "count": 75 },
    { "gender": "female", "count": 75 }
  ],
  "ageDistribution": [
    { "range": "0-18", "count": 20 },
    { "range": "19-30", "count": 40 },
    { "range": "31-50", "count": 50 },
    { "range": "51-70", "count": 30 },
    { "range": "71+", "count": 10 }
  ],
  "monthlyNewPatients": [
    { "month": "2024-01", "count": 15 }
  ],
  "topConditions": [
    { "condition": "Diabetes", "count": 25 },
    { "condition": "Hypertension", "count": 30 }
  ]
}
```

#### 3. Get Doctor Analytics
```http
GET /api/analytics/doctors
```

**Response:**
```json
{
  "specialtyDistribution": [
    { "specialty": "Cardiology", "count": 10 },
    { "specialty": "Neurology", "count": 8 }
  ],
  "topDoctors": [
    {
      "doctorId": "abc-123",
      "doctorName": "Dr. Smith",
      "specialty": "Cardiology",
      "consultationCount": 50,
      "rating": 4.8
    }
  ],
  "avgRatingBySpecialty": [
    { "specialty": "Cardiology", "avgRating": 4.7 }
  ],
  "workload": [
    { "doctorId": "abc-123", "activeConsultations": 5 }
  ]
}
```

#### 4. Get Appointment Analytics
```http
GET /api/analytics/appointments
```

**Response:**
```json
{
  "statusDistribution": [
    { "status": "confirmed", "count": 300 },
    { "status": "pending", "count": 50 },
    { "status": "cancelled", "count": 20 }
  ],
  "dayOfWeekDistribution": [
    { "day": "Monday", "count": 45 },
    { "day": "Tuesday", "count": 50 }
  ],
  "specialtyDistribution": [
    { "specialty": "Cardiology", "count": 100 }
  ],
  "dailyTrend": [
    { "date": "2024-01-01", "count": 15 }
  ],
  "avgPerDay": 12.5
}
```

---

## 📊 Monitoring APIs

### Base URL: `/api/monitoring`

**Authentication**: Required (JWT)  
**Authorization**: Admin, Doctor roles only

### REST Endpoints

#### 1. Get Monitoring Dashboard
```http
GET /api/monitoring/dashboard
```

**Response:**
```json
{
  "metrics": {
    "totalPatients": 150,
    "activePatients": 120,
    "totalDoctors": 25,
    "activeDoctors": 20,
    "ongoingConsultations": 5,
    "todayAppointments": 30,
    "pendingAppointments": 10,
    "completedAppointments": 20,
    "recentAlerts": 3,
    "highRiskPatients": 15
  },
  "recentActivity": [
    {
      "id": "log-1",
      "action": "CREATE_USER",
      "user": "Admin",
      "targetType": "User",
      "severity": "info",
      "timestamp": "2024-12-24T10:00:00.000Z"
    }
  ],
  "systemHealth": {
    "status": "healthy",
    "uptime": 86400,
    "memory": {
      "used": 512,
      "total": 2048,
      "percentage": 25
    },
    "database": "connected"
  },
  "timestamp": "2024-12-24T10:00:00.000Z"
}
```

#### 2. Get Current Metrics
```http
GET /api/monitoring/metrics
```

#### 3. Get Alert Statistics
```http
GET /api/monitoring/alerts/statistics?days=7
```

#### 4. Get Device Statistics
```http
GET /api/monitoring/devices/statistics
```

### WebSocket Real-Time Monitoring

**Endpoint**: `ws://localhost:5000/monitoring/stream?token=<JWT_TOKEN>`

#### Connection
```javascript
const token = "your-jwt-token-here";
const ws = new WebSocket(`ws://localhost:5000/monitoring/stream?token=${token}`);

ws.onopen = () => {
  console.log("Connected to monitoring stream");
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case "connected":
      console.log("Welcome message:", data.message);
      break;
      
    case "metrics":
      console.log("System metrics:", data.data);
      // Update dashboard UI with real-time metrics
      break;
      
    case "alert":
      console.log("New alert:", data.data);
      // Show alert notification
      break;
  }
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

ws.onclose = () => {
  console.log("Disconnected from monitoring stream");
};
```

#### Client Messages
```javascript
// Ping
ws.send(JSON.stringify({ type: "ping" }));

// Subscribe to channel
ws.send(JSON.stringify({ 
  type: "subscribe", 
  channel: "alerts" 
}));

// Unsubscribe
ws.send(JSON.stringify({ 
  type: "unsubscribe", 
  channel: "alerts" 
}));
```

#### Server Messages

**Metrics Update (every 5 seconds)**
```json
{
  "type": "metrics",
  "data": {
    "timestamp": "2024-12-24T10:00:00.000Z",
    "activeUsers": 50,
    "activePatients": 45,
    "activeDoctors": 5,
    "ongoingConsultations": 3,
    "pendingAlerts": 2,
    "systemLoad": {
      "cpu": 45.5,
      "memory": 60.2
    }
  }
}
```

**Alert Broadcast**
```json
{
  "type": "alert",
  "data": {
    "id": "alert-123",
    "type": "critical",
    "severity": "high",
    "patientId": "patient-456",
    "message": "Abnormal heart rate detected",
    "timestamp": "2024-12-24T10:00:00.000Z"
  }
}
```

---

## 📄 Reports APIs

### Base URL: `/api/reports`

**Authentication**: Required (except shared reports)

### Endpoints

#### 1. Get Reports by Patient
```http
GET /api/reports/:patientId
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "report-123",
    "type": "lab",
    "title": "Blood Test Results",
    "description": "Complete blood count analysis",
    "fileUrl": "https://storage.example.com/reports/blood-test.pdf",
    "metadata": { "testType": "CBC" },
    "createdBy": "doctor-456",
    "createdByName": "Dr. Smith",
    "createdAt": "2024-12-24T10:00:00.000Z",
    "updatedAt": "2024-12-24T10:00:00.000Z"
  }
]
```

#### 2. Get Single Report
```http
GET /api/reports/detail/:reportId
Authorization: Bearer <token>
```

#### 3. Create Report
```http
POST /api/reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": "patient-123",
  "type": "medical",
  "title": "Annual Checkup Report",
  "description": "Routine health examination",
  "fileUrl": "https://storage.example.com/reports/annual-2024.pdf",
  "metadata": {
    "year": 2024,
    "checkupType": "annual"
  }
}
```

**Response:**
```json
{
  "id": "report-789",
  "patientId": "patient-123",
  "type": "medical",
  "title": "Annual Checkup Report",
  "description": "Routine health examination",
  "fileUrl": "https://storage.example.com/reports/annual-2024.pdf",
  "metadata": { "year": 2024 },
  "createdBy": "doctor-456",
  "createdAt": "2024-12-24T10:00:00.000Z"
}
```

#### 4. Update Report
```http
PUT /api/reports/:reportId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Report Title",
  "description": "Updated description"
}
```

#### 5. Delete Report
```http
DELETE /api/reports/:reportId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Report deleted successfully"
}
```

#### 6. Download Report
```http
GET /api/reports/:reportId/download
Authorization: Bearer <token>
```

**Response:**
```json
{
  "fileUrl": "https://storage.example.com/reports/file.pdf",
  "title": "Report Title",
  "type": "lab"
}
```

#### 7. Share Report (Generate Share Link)
```http
POST /api/reports/:reportId/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "expiresInHours": 48
}
```

**Response:**
```json
{
  "shareToken": "a1b2c3d4e5f6...",
  "shareUrl": "http://localhost:3000/api/reports/shared/a1b2c3d4e5f6...",
  "expiresAt": "2024-12-26T10:00:00.000Z"
}
```

#### 8. Access Shared Report (Public - No Auth)
```http
GET /api/reports/shared/:shareToken
```

**Response:**
```json
{
  "id": "report-123",
  "type": "lab",
  "title": "Blood Test Results",
  "description": "Complete blood count",
  "fileUrl": "https://storage.example.com/reports/file.pdf",
  "metadata": {},
  "createdAt": "2024-12-24T10:00:00.000Z",
  "patient": {
    "name": "John Doe",
    "code": "P12345678",
    "age": 35,
    "gender": "male"
  }
}
```

#### 9. Revoke Share Link
```http
DELETE /api/reports/:reportId/share
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Share link revoked successfully"
}
```

---

## 🔐 Authorization Rules

### Analytics & Monitoring
- **Allowed Roles**: `admin`, `doctor`
- Provides system-wide analytics and monitoring

### Reports
- **Admin**: Full access to all reports
- **Doctor**: Access to reports of assigned patients and consultations
- **Patient**: Access to own reports only
- **Public**: Access via share token (if not expired)

---

## 🧪 Testing

### Test Analytics APIs
```bash
# Get overview
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/analytics/overview?from=2024-01-01&to=2024-12-31"

# Get patient analytics
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/analytics/patients"
```

### Test Monitoring WebSocket
```javascript
// In browser console or Node.js
const token = "your-jwt-token";
const ws = new WebSocket(`ws://localhost:5000/monitoring/stream?token=${token}`);

ws.onmessage = (event) => {
  console.log("Received:", JSON.parse(event.data));
};
```

### Test Reports APIs
```bash
# Create report
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"patientId":"patient-123","type":"medical","title":"Test Report"}' \
  http://localhost:5000/api/reports

# Share report
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"expiresInHours":24}' \
  http://localhost:5000/api/reports/<reportId>/share

# Access shared report (no auth)
curl http://localhost:5000/api/reports/shared/<shareToken>
```

---

## 📁 File Structure

```
backend/src/
├── services/
│   ├── analytics.service.ts       # Analytics aggregations
│   ├── monitoring.service.ts      # Monitoring metrics
│   └── reports.service.ts         # Reports management
├── controllers/
│   └── analytics-monitoring-reports.controller.ts
├── routes/
│   ├── analytics.routes.ts
│   ├── monitoring.routes.ts
│   └── reports.routes.ts
├── websocket/
│   └── monitoringWS.ts           # WebSocket server
├── app.ts                         # Routes integration
└── server.ts                      # WebSocket initialization
```

---

## 🚀 Deployment Notes

### Environment Variables
```env
BASE_URL=https://your-domain.com
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://...
```

### Production Considerations

1. **Analytics Performance**
   - Add database indexes for faster aggregations
   - Consider caching for frequently accessed analytics
   - Use Redis for caching dashboard metrics

2. **WebSocket Scaling**
   - Use Redis Pub/Sub for multi-instance WebSocket
   - Implement connection pooling
   - Add rate limiting for WebSocket connections

3. **Report Storage**
   - Integrate with S3/CloudStorage for file uploads
   - Implement file size limits
   - Add virus scanning for uploaded files
   - Set up CDN for faster report delivery

4. **Security**
   - Implement CORS properly
   - Add rate limiting on all endpoints
   - Validate share token expiry strictly
   - Audit all report access

---

## ✅ Implementation Complete

Đã hoàn thành:
- ✅ Prisma schema cho Reports
- ✅ Analytics Service với aggregations
- ✅ Monitoring Service với EventEmitter
- ✅ WebSocket Server cho real-time monitoring
- ✅ Reports Service với share links
- ✅ Controllers cho 3 modules
- ✅ Routes với authentication/authorization
- ✅ Integration vào app.ts và server.ts

Tất cả APIs đã sẵn sàng để test và deploy! 🎉
