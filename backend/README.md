# Health Monitor Backend API

Backend API for Health Monitor System built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Update .env with your configuration
# Edit DATABASE_URL, JWT_SECRET, etc.

# 4. Generate Prisma Client
npm run prisma:generate

# 5. Run database migrations
npm run prisma:migrate

# 6. Start development server
npm run dev
```

Server will start at `http://localhost:4000`

### Available Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (DB GUI)
npm test                 # Run tests
npm run lint             # Lint code
npm run format           # Format code with Prettier
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── server.ts                 # Server entry point
│   ├── config/                   # Configuration files
│   ├── controllers/              # Request handlers
│   ├── services/                 # Business logic
│   ├── routes/                   # API routes
│   ├── middlewares/              # Express middleware
│   ├── validators/               # Zod validation schemas
│   ├── utils/                    # Utility functions
│   └── types/                    # TypeScript types
├── prisma/
│   └── schema.prisma             # Database schema
└── logs/                         # Application logs
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

---

## 🔑 Environment Variables

Required environment variables (see `.env.example`):

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development`, `production`, `test` |
| `PORT` | Server port | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Generate with crypto |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Patients
- `GET /api/patients/dashboard/:patientId` - Get patient dashboard
- `GET /api/patients/:patientId/vitals` - Get vitals history
- `GET /api/patients/:patientId/appointments` - Get appointments
- `POST /api/patients/:patientId/appointments` - Create appointment

### Doctors
- `GET /api/doctors/dashboard/:doctorId` - Get doctor dashboard
- `GET /api/doctors/:doctorId/patients` - Get doctor's patients
- `POST /api/doctors/:doctorId/consultations` - Create consultation

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/users` - Manage users
- `GET /api/admin/doctors` - Manage doctors
- `GET /api/admin/patients` - Manage patients

### Devices & IoT
- `GET /api/devices` - Get all devices
- `POST /api/devices` - Register new device
- `POST /api/devices/:deviceId/signals` - Submit device signals

### Monitoring & Analytics
- `GET /api/monitoring/dashboard` - Real-time monitoring
- `GET /api/analytics/overview` - Analytics overview

See [BACKEND_API_PLAN.md](../BACKEND_API_PLAN.md) for complete API specification.

---

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login Response
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "patient"
    }
  }
}
```

### Using Token
Include the token in the Authorization header:

```http
GET /api/patients/dashboard/patient-id
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🛡️ Authorization & RBAC

The system implements Role-Based Access Control (RBAC) with four main roles:

### Roles
- **Admin** - Full access to all resources
- **Doctor** - Access to assigned patients and medical records
- **Patient** - Access to own medical data
- **Staff** - Limited access to scheduling and basic patient info

### Permission Checking

Routes are protected with middleware:

```typescript
router.get(
  '/patients/:patientId/vitals',
  authenticate,                    // Check JWT token
  requireRoles('patient', 'doctor'), // Check user role
  checkPatientAccess,              // Check resource ownership
  controller.getVitals
);
```

---

## ✅ Request Validation

All requests are validated using Zod schemas:

```typescript
// Define schema
const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().uuid(),
    date: z.string().datetime(),
    reason: z.string().min(5).max(500),
  }),
});

// Apply to route
router.post('/', validate(createAppointmentSchema), controller.create);
```

Invalid requests return 422 with error details:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "errors": [
        {
          "field": "body.doctorId",
          "message": "Invalid UUID format"
        }
      ]
    }
  }
}
```

---

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Patient profile not found"
  },
  "timestamp": "2024-12-24T10:30:00Z"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 🗄️ Database

### Prisma Commands

```bash
# Generate Prisma Client after schema changes
npm run prisma:generate

# Create and apply migration
npm run prisma:migrate

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database
npx prisma db seed
```

### Database Schema

See `prisma/schema.prisma` for complete schema.

Key models:
- `User` - User accounts
- `Role` - User roles
- `PatientProfile` - Patient information
- `Device` - IoT devices
- `Signal` - Device signals (vitals)
- `Alert` - System alerts
- `DoctorPatient` - Doctor-patient relationships

---

## 🔌 WebSocket

WebSocket server is available for real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:4000');

ws.on('message', (data) => {
  console.log('Received:', data);
});

// Subscribe to patient vitals
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'vitals',
  patientId: 'patient-uuid'
}));
```

---

## 📊 Logging

The application uses Winston for structured logging.

### Log Levels
- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `debug` - Debug messages

### Log Files
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

### Usage in Code

```typescript
import { logger } from './config/logger';

logger.info('User logged in', { userId, email });
logger.error('Database error', { error: err.message });
logger.debug('Processing data', { data });
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- appointmentService.test.ts
```

### Test Structure

```
src/
├── services/
│   ├── appointmentService.ts
│   └── __tests__/
│       └── appointmentService.test.ts
└── routes/
    ├── appointments.ts
    └── __tests__/
        └── appointments.test.ts
```

---

## 🚀 Deployment

### Build for Production

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
NODE_ENV=production npm start
```

### Docker Deployment

```bash
# Build image
docker build -t health-monitor-backend .

# Run container
docker run -p 4000:4000 --env-file .env health-monitor-backend
```

### Environment Checklist
- ✅ Set `NODE_ENV=production`
- ✅ Use strong `JWT_SECRET` (min 32 chars)
- ✅ Configure proper `DATABASE_URL`
- ✅ Set appropriate `CORS_ORIGIN`
- ✅ Enable rate limiting
- ✅ Configure logging level
- ✅ Set up database backups

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch: `git checkout -b feature/new-feature`
2. Follow [ARCHITECTURE.md](./ARCHITECTURE.md) conventions
3. Write tests for new features
4. Run linter: `npm run lint`
5. Format code: `npm run format`
6. Commit changes: `git commit -m "Add new feature"`
7. Push and create PR

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Follow existing code patterns
- Write meaningful commit messages

---

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture guide
- [BACKEND_API_PLAN.md](../BACKEND_API_PLAN.md) - Complete API specification
- [Prisma Schema](./prisma/schema.prisma) - Database schema

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
psql -U postgres

# Test connection
npx prisma db pull
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Kill process on port 4000 (Linux/Mac)
lsof -ti:4000 | xargs kill -9

# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

---

## 📞 Support

For issues and questions:
- Check [ARCHITECTURE.md](./ARCHITECTURE.md)
- Review [BACKEND_API_PLAN.md](../BACKEND_API_PLAN.md)
- Create an issue on GitHub

---

## 📄 License

MIT License

---

**Last Updated:** December 24, 2024  
**Version:** 1.0.0
