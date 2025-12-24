# Doctor APIs - Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run Prisma Migration
```bash
npx prisma generate
npx prisma migrate dev --name add_doctor_models
```

### 3. Seed Sample Data (Optional)

Create a doctor user and profile for testing:

```typescript
// Run in Prisma Studio or create a seed script
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedDoctor() {
  // Create doctor user
  const hashedPassword = await bcrypt.hash('doctor123', 10);
  
  const doctorUser = await prisma.user.create({
    data: {
      email: 'doctor@hospital.com',
      password: hashedPassword,
      name: 'Dr. John Smith',
      phone: '+1234567890',
      role: {
        connectOrCreate: {
          where: { name: 'doctor' },
          create: { name: 'doctor', description: 'Doctor role' }
        }
      }
    }
  });

  // Create doctor profile
  const doctorProfile = await prisma.doctorProfile.create({
    data: {
      userId: doctorUser.id,
      specialty: 'Cardiology',
      experience: 15,
      rating: 4.8,
      license: 'MD-123456',
      phone: '+1234567890',
      status: 'active',
      bio: 'Experienced cardiologist with 15 years of practice'
    }
  });

  // Create sample schedule
  await prisma.doctorSchedule.createMany({
    data: [
      {
        doctorId: doctorProfile.id,
        dayOfWeek: 1, // Monday
        timeSlots: [
          { startTime: '09:00', endTime: '12:00', available: true },
          { startTime: '14:00', endTime: '17:00', available: true }
        ],
        fromDate: new Date(),
        isActive: true
      },
      {
        doctorId: doctorProfile.id,
        dayOfWeek: 3, // Wednesday
        timeSlots: [
          { startTime: '09:00', endTime: '12:00', available: true },
          { startTime: '14:00', endTime: '17:00', available: true }
        ],
        fromDate: new Date(),
        isActive: true
      }
    ]
  });

  console.log('Doctor seeded successfully!');
  console.log('Email:', doctorUser.email);
  console.log('Password: doctor123');
  console.log('Doctor ID:', doctorUser.id);
}

seedDoctor()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 4. Start the Server
```bash
npm run dev
```

## 🧪 Testing the APIs

### Login to get JWT token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@hospital.com",
    "password": "doctor123"
  }'
```

Save the token from response: `{ "token": "eyJhbGc..." }`

### Test Dashboard
```bash
curl http://localhost:3000/api/doctors/dashboard/<DOCTOR_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Test Patients List
```bash
curl "http://localhost:3000/api/doctors/<DOCTOR_ID>/patients?page=1&limit=20&sortBy=name" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Create Consultation
```bash
curl -X POST http://localhost:3000/api/doctors/<DOCTOR_ID>/consultations \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "<PATIENT_ID>",
    "diagnosis": "Hypertension",
    "notes": "Patient needs follow-up in 2 weeks",
    "prescriptions": [
      {
        "medication": "Lisinopril",
        "dosage": "10mg",
        "frequency": "Once daily",
        "duration": "30 days",
        "instructions": "Take in the morning with food"
      }
    ],
    "labOrders": [
      {
        "testType": "Blood pressure monitoring",
        "priority": "normal",
        "notes": "Check BP levels"
      }
    ],
    "nextAppointment": "2025-01-15T10:00:00Z"
  }'
```

### Update Schedule
```bash
curl -X PUT http://localhost:3000/api/doctors/<DOCTOR_ID>/schedule \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "schedules": [
      {
        "dayOfWeek": 1,
        "timeSlots": [
          { "startTime": "09:00", "endTime": "12:00", "available": true },
          { "startTime": "14:00", "endTime": "17:00", "available": true }
        ],
        "fromDate": "2025-01-01T00:00:00Z",
        "isActive": true
      }
    ]
  }'
```

### Send Message to Patient
```bash
curl -X POST http://localhost:3000/api/doctors/<DOCTOR_ID>/messages \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "<PATIENT_ID>",
    "content": "Hello, how are you feeling today? Any concerns?"
  }'
```

## 📊 Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors/dashboard/:doctorId` | Get dashboard with stats |
| GET | `/api/doctors/:doctorId/patients` | List all patients with filters |
| GET | `/api/doctors/:doctorId/patients/:patientId` | Get patient detail |
| GET | `/api/doctors/:doctorId/patients/:patientId/history` | Get patient medical history |
| GET | `/api/doctors/:doctorId/patients/:patientId/vitals` | Get patient vitals |
| GET | `/api/doctors/:doctorId/consultations/:consultationId` | Get consultation detail |
| POST | `/api/doctors/:doctorId/consultations` | Create new consultation |
| PUT | `/api/doctors/:doctorId/consultations/:consultationId` | Update consultation |
| GET | `/api/doctors/:doctorId/schedule` | Get doctor schedule |
| PUT | `/api/doctors/:doctorId/schedule` | Update schedule |
| GET | `/api/doctors/:doctorId/lab-orders` | List lab orders |
| POST | `/api/doctors/:doctorId/lab-orders/:orderId/approve` | Approve lab order |
| GET | `/api/doctors/:doctorId/lab-orders/:orderId/results` | Get lab results |
| GET | `/api/doctors/:doctorId/messages` | Get conversations |
| POST | `/api/doctors/:doctorId/messages` | Send message |
| GET | `/api/doctors/:doctorId/messages/:conversationId` | Get conversation messages |

## 🔐 Authentication & Authorization

All endpoints require:
1. **JWT Token**: Include in Authorization header as `Bearer <token>`
2. **Role Check**: 
   - Doctors can only access their own data
   - Admins can access any doctor's data
   - Patients cannot access doctor endpoints

## 🧪 Running Tests

### Unit Tests
```bash
npm test doctor.service.test
```

### Integration Tests
```bash
npm test doctor.api.test
```

### All Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

## 📝 Common Query Parameters

### Patients List
- `search`: Search by name or email
- `status`: Filter by status (active, inactive, critical)
- `priority`: Filter by risk level (low, medium, high)
- `gender`: Filter by gender (male, female, other)
- `sortBy`: Sort by (name, lastVisit, riskLevel, age)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

### Lab Orders
- `status`: Filter by status (pending, approved, inProgress, completed, cancelled)
- `priority`: Filter by priority (normal, urgent)
- `patientId`: Filter by specific patient
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

### Messages
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)
- `unreadOnly`: Show only unread conversations (true/false)

## 🐛 Debugging Tips

### Enable Debug Logging
Set environment variable:
```bash
DEBUG=doctor:* npm run dev
```

### Check Database
Use Prisma Studio:
```bash
npx prisma studio
```

### Common Issues

1. **404 Not Found**: Make sure routes are registered in `app.ts`
2. **401 Unauthorized**: Check JWT token is valid and not expired
3. **403 Forbidden**: Verify doctor is accessing their own data
4. **400 Bad Request**: Check request body matches validation schema

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Zod Validation](https://zod.dev/)
- [JWT Authentication](https://jwt.io/)
- [Express.js Guide](https://expressjs.com/)

## 🤝 Support

For issues or questions:
1. Check the implementation documentation: `DOCTOR_API_IMPLEMENTATION.md`
2. Review test files for usage examples
3. Check error logs in console

---

**Happy Coding! 🚀**
