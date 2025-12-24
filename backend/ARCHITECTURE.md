# Backend Architecture Guide

## 📋 Tổng Quan

Hệ thống backend được xây dựng theo kiến trúc **Layered Architecture** (kiến trúc phân lớp) với các nguyên tắc **Clean Code** và **SOLID principles**.

### Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript (strict mode)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Validation:** Zod
- **Logging:** Winston
- **WebSocket:** ws
- **Rate Limiting:** express-rate-limit

---

## 🏗️ Cấu Trúc Thư Mục

```
backend/
├── src/
│   ├── app.ts                      # Express app configuration
│   ├── server.ts                   # Server entry point
│   │
│   ├── config/                     # Configuration files
│   │   ├── env.ts                  # Environment variables (validated with Zod)
│   │   ├── database.ts             # Prisma client singleton
│   │   └── logger.ts               # Winston logger configuration
│   │
│   ├── controllers/                # Request handlers
│   │   ├── patientDashboardController.ts
│   │   ├── doctorController.ts
│   │   └── adminController.ts
│   │
│   ├── services/                   # Business logic layer
│   │   ├── patientDashboardService.ts
│   │   ├── appointmentService.ts
│   │   └── authService.ts
│   │
│   ├── repositories/               # Data access layer (optional)
│   │   └── patientRepository.ts
│   │
│   ├── routes/                     # API routes
│   │   ├── patientDashboard.ts
│   │   ├── auth.ts
│   │   └── doctors.ts
│   │
│   ├── middlewares/                # Express middleware
│   │   ├── authMiddleware.ts       # JWT authentication
│   │   ├── rbacMiddleware.ts       # Role-based access control
│   │   ├── validationMiddleware.ts # Zod validation
│   │   ├── errorHandler.ts         # Global error handler
│   │   └── rateLimitMiddleware.ts  # Rate limiting
│   │
│   ├── validators/                 # Zod validation schemas
│   │   ├── patientDashboard.validator.ts
│   │   └── auth.validator.ts
│   │
│   ├── utils/                      # Utility functions
│   │   ├── errors.ts               # Custom error classes
│   │   ├── response.ts             # Standardized API responses
│   │   └── asyncHandler.ts         # Async error wrapper
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── express.d.ts            # Express type extensions
│   │   └── common.types.ts
│   │
│   └── websocket/                  # WebSocket handlers
│       └── index.ts
│
├── prisma/
│   └── schema.prisma               # Database schema
│
├── logs/                           # Application logs (generated)
│   ├── error.log
│   └── combined.log
│
├── .env                            # Environment variables
├── .env.example                    # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📐 Kiến Trúc Phân Lớp

### 1. **Routes Layer** (Routing)
- **Chức năng:** Định nghĩa endpoints và áp dụng middleware
- **Không chứa:** Business logic, database queries
- **Ví dụ:**

```typescript
// src/routes/patientDashboard.ts
router.get(
  '/dashboard/:patientId',
  authenticate,                    // Middleware 1: Auth
  requireRoles('patient', 'doctor'), // Middleware 2: RBAC
  validate(patientIdParamSchema),   // Middleware 3: Validation
  checkPatientAccess,              // Middleware 4: Fine-grained access
  patientDashboardController.getDashboard // Controller
);
```

### 2. **Controllers Layer** (Request/Response Handling)
- **Chức năng:** 
  - Nhận request từ route
  - Gọi service layer để xử lý logic
  - Format và trả về response
- **Không chứa:** Business logic phức tạp, database queries
- **Pattern:** Sử dụng `asyncHandler` để bắt lỗi tự động

```typescript
// src/controllers/patientDashboardController.ts
export class PatientDashboardController {
  getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { patientId } = req.params;
    
    // Call service
    const data = await patientDashboardService.getDashboard(patientId);
    
    // Send response
    return sendSuccess(res, data, 'Dashboard retrieved successfully');
  });
}
```

### 3. **Services Layer** (Business Logic)
- **Chức năng:**
  - Chứa toàn bộ business logic
  - Orchestrate multiple operations
  - Call repositories/Prisma để access database
- **Single Responsibility:** Mỗi service phụ trách 1 domain cụ thể

```typescript
// src/services/patientDashboardService.ts
export class PatientDashboardService {
  async getDashboard(patientId: string): Promise<DashboardData> {
    // Business logic here
    const profile = await prisma.patientProfile.findUnique(...);
    
    // Parallel data fetching for performance
    const [vitals, appointments] = await Promise.all([
      this.getLatestVitals(userId),
      this.getUpcomingAppointments(patientId),
    ]);
    
    return { profile, vitals, appointments };
  }
}
```

### 4. **Repositories Layer** (Optional - Data Access)
- **Chức năng:** Abstract database operations
- **Khi nào dùng:** Khi có logic query phức tạp cần tái sử dụng
- **Note:** Với Prisma, layer này có thể bỏ qua cho các query đơn giản

```typescript
// src/repositories/patientRepository.ts
export class PatientRepository {
  async findByIdWithRelations(id: string) {
    return prisma.patientProfile.findUnique({
      where: { id },
      include: {
        user: true,
        doctorAssignments: true,
      },
    });
  }
}
```

---

## 🔒 Authentication & Authorization Flow

### 1. Authentication (JWT)

```typescript
// Middleware: authMiddleware.ts
export const authenticate = async (req, res, next) => {
  // 1. Get token from header
  const token = req.headers.authorization?.split(' ')[1];
  
  // 2. Verify token
  const decoded = jwt.verify(token, JWT_SECRET);
  
  // 3. Fetch user from database
  const user = await prisma.user.findUnique({ where: { id: decoded.userId }});
  
  // 4. Attach user to request
  req.user = user;
  next();
};
```

### 2. Authorization (RBAC)

```typescript
// Middleware: rbacMiddleware.ts

// Role-based access
export const requireRoles = (...roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role.name)) {
      throw new ForbiddenError('Access denied');
    }
    next();
  };
};

// Permission-based access
export const checkPermission = (resource: string, action: string) => {
  return async (req, res, next) => {
    const hasPermission = await checkUserPermission(
      req.user.role.name,
      resource,
      action
    );
    
    if (!hasPermission) {
      throw new ForbiddenError('Insufficient permissions');
    }
    next();
  };
};
```

### 3. Resource Ownership Check

```typescript
// Check if user can access specific patient data
export const checkPatientAccess = async (req, res, next) => {
  const { patientId } = req.params;
  const { id: userId, role } = req.user;
  
  if (role === 'admin') return next(); // Admin access all
  
  if (role === 'patient') {
    // Patient can only access own data
    const isOwner = await isPatientOwner(patientId, userId);
    if (!isOwner) throw new ForbiddenError();
  }
  
  if (role === 'doctor') {
    // Doctor can access assigned patients
    const isAssigned = await isDoctorAssigned(userId, patientId);
    if (!isAssigned) throw new ForbiddenError();
  }
  
  next();
};
```

---

## ✅ Request Validation (Zod)

### Schema Definition

```typescript
// src/validators/patientDashboard.validator.ts
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().uuid(),
    date: z.string().datetime(),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    reason: z.string().min(5).max(500),
  }),
});
```

### Apply Validation

```typescript
// In route
router.post(
  '/appointments',
  authenticate,
  validate(createAppointmentSchema), // Validate before controller
  controller.createAppointment
);
```

---

## 🚨 Error Handling

### 1. Custom Error Classes

```typescript
// src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}
```

### 2. Global Error Handler

```typescript
// src/middlewares/errorHandler.ts
export const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);
  
  // Known AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }
  
  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }
  
  // Default error
  return res.status(500).json({
    success: false,
    error: { message: 'Internal server error' },
  });
};
```

### 3. Async Error Handling

```typescript
// src/utils/asyncHandler.ts
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage in controller
export const getPatient = asyncHandler(async (req, res) => {
  // Any error thrown here will be caught and passed to error handler
  const patient = await patientService.getById(req.params.id);
  return sendSuccess(res, patient);
});
```

---

## 📤 Standardized API Responses

### Success Response

```typescript
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": { ... },
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "timestamp": "2024-12-24T10:30:00Z"
}
```

### Error Response

```typescript
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Patient not found",
    "details": { ... } // Only in development
  },
  "timestamp": "2024-12-24T10:30:00Z"
}
```

### Helper Functions

```typescript
// src/utils/response.ts
export const sendSuccess = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (res, message, statusCode, code) => {
  return res.status(statusCode).json({
    success: false,
    error: { code, message },
    timestamp: new Date().toISOString(),
  });
};
```

---

## 🔧 Configuration Management

### Environment Variables (Zod Validation)

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REDIS_URL: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export const config = {
  port: parseInt(env.PORT),
  isDevelopment: env.NODE_ENV === 'development',
  database: { url: env.DATABASE_URL },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
};
```

### Database Configuration

```typescript
// src/config/database.ts
import { PrismaClient } from '@prisma/client';

// Singleton pattern
export const prisma = global.prisma || new PrismaClient({
  log: config.isDevelopment ? ['query', 'info', 'warn', 'error'] : ['error'],
});

if (config.isDevelopment) {
  global.prisma = prisma;
}
```

---

## 📝 Coding Conventions

### 1. **TypeScript Strict Mode**
- Enable all strict options in `tsconfig.json`
- No `any` types unless absolutely necessary
- Use proper type inference

### 2. **Naming Conventions**
- **Files:** camelCase (e.g., `patientDashboardService.ts`)
- **Classes:** PascalCase (e.g., `PatientDashboardService`)
- **Functions:** camelCase (e.g., `getDashboard`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `JWT_SECRET`)
- **Interfaces:** PascalCase with `I` prefix optional (e.g., `DashboardData`)

### 3. **Async/Await**
- Always use async/await, never use callbacks
- Wrap async handlers with `asyncHandler`
- Handle errors with try/catch or let error handler catch

### 4. **Error Handling**
- Throw custom errors from services
- Never send response from services
- Let controllers handle responses

### 5. **Database Operations**
- Use Prisma's type-safe queries
- Prefer transactions for multi-table operations
- Use `select` to limit returned fields

```typescript
// ✅ Good
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, role: true },
});

// ❌ Bad - returns all fields including password
const user = await prisma.user.findUnique({ where: { id } });
```

### 6. **Logging**
- Use Winston logger, not console.log
- Log levels: error, warn, info, debug
- Include context in logs

```typescript
logger.info('User logged in', { userId, email });
logger.error('Database error', { error: err.message, query });
```

---

## 🚀 Cách Thêm Module Mới

### Bước 1: Define Database Schema

```prisma
// database/schema.prisma
model Appointment {
  id          String   @id @default(uuid())
  patientId   String
  doctorId    String
  date        DateTime
  time        String
  status      String
  reason      String
  createdAt   DateTime @default(now())
  
  patient     User     @relation("PatientAppointments", fields: [patientId], references: [id])
  doctor      User     @relation("DoctorAppointments", fields: [doctorId], references: [id])
}
```

```bash
npx prisma migrate dev --name add_appointments
```

### Bước 2: Create Validator

```typescript
// src/validators/appointment.validator.ts
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().uuid(),
    date: z.string().datetime(),
    time: z.string(),
    reason: z.string().min(5).max(500),
  }),
});
```

### Bước 3: Create Service

```typescript
// src/services/appointmentService.ts
export class AppointmentService {
  async create(data: CreateAppointmentDto) {
    return prisma.appointment.create({ data });
  }
  
  async getByPatientId(patientId: string) {
    return prisma.appointment.findMany({
      where: { patientId },
      include: { doctor: { select: { id: true, email: true } } },
    });
  }
}

export const appointmentService = new AppointmentService();
```

### Bước 4: Create Controller

```typescript
// src/controllers/appointmentController.ts
export class AppointmentController {
  createAppointment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = req.body;
    const appointment = await appointmentService.create(data);
    return sendCreated(res, appointment, 'Appointment created');
  });
  
  getPatientAppointments = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { patientId } = req.params;
    const appointments = await appointmentService.getByPatientId(patientId);
    return sendSuccess(res, appointments);
  });
}

export const appointmentController = new AppointmentController();
```

### Bước 5: Create Routes

```typescript
// src/routes/appointments.ts
const router = Router();

router.post(
  '/',
  authenticate,
  requireRoles('patient', 'admin'),
  validate(createAppointmentSchema),
  appointmentController.createAppointment
);

router.get(
  '/patient/:patientId',
  authenticate,
  checkPatientAccess,
  appointmentController.getPatientAppointments
);

export { router as appointmentRouter };
```

### Bước 6: Register Route in App

```typescript
// src/app.ts
import { appointmentRouter } from './routes/appointments.js';

app.use(`${API_PREFIX}/appointments`, appointmentRouter);
```

---

## 🧪 Testing Strategy

### Unit Tests (Services)

```typescript
// src/services/__tests__/appointmentService.test.ts
describe('AppointmentService', () => {
  it('should create appointment', async () => {
    const data = { doctorId: '...', patientId: '...', date: '...' };
    const result = await appointmentService.create(data);
    expect(result).toHaveProperty('id');
  });
});
```

### Integration Tests (Routes)

```typescript
// src/routes/__tests__/appointments.test.ts
describe('POST /api/appointments', () => {
  it('should create appointment with auth', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ ... });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

---

## 📊 Performance Best Practices

### 1. Database Query Optimization

```typescript
// ❌ Bad - N+1 query problem
const patients = await prisma.patient.findMany();
for (const patient of patients) {
  const doctor = await prisma.user.findUnique({ where: { id: patient.doctorId } });
}

// ✅ Good - Use include/select
const patients = await prisma.patient.findMany({
  include: { doctor: { select: { id: true, name: true } } },
});
```

### 2. Parallel Operations

```typescript
// ✅ Good - Parallel fetching
const [vitals, appointments, medications] = await Promise.all([
  getVitals(patientId),
  getAppointments(patientId),
  getMedications(patientId),
]);
```

### 3. Caching (với Redis - TODO)

```typescript
// Cache expensive operations
const cacheKey = `patient:${patientId}:dashboard`;
let data = await redis.get(cacheKey);

if (!data) {
  data = await fetchDashboardData(patientId);
  await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5 min cache
}
```

---

## 🔐 Security Checklist

- ✅ JWT token validation on protected routes
- ✅ Password hashing with bcrypt (min 10 rounds)
- ✅ Input validation with Zod
- ✅ SQL injection protection (Prisma ORM)
- ✅ Rate limiting on all routes
- ✅ CORS configuration
- ✅ Helmet.js for security headers
- ✅ Role-based access control (RBAC)
- ✅ Resource ownership validation
- ⏳ XSS protection (sanitize input)
- ⏳ CSRF protection (for cookies)

---

## 📚 References

- [BACKEND_API_PLAN.md](./BACKEND_API_PLAN.md) - Complete API specification
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

**Last Updated:** December 24, 2024  
**Maintained by:** Backend Team
