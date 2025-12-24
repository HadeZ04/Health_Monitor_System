# Backend Quick Reference Card

## 🚀 Start Development

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

---

## 📁 File Structure Pattern

```
src/
├── routes/moduleName.ts           # Define endpoints
├── controllers/moduleController.ts # Handle requests
├── services/moduleService.ts      # Business logic
├── validators/module.validator.ts # Zod schemas
```

---

## 🔧 Add New API Endpoint

### 1. Define Validator
```typescript
// src/validators/appointment.validator.ts
export const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().uuid(),
    date: z.string().datetime(),
  }),
});
```

### 2. Create Service
```typescript
// src/services/appointmentService.ts
export class AppointmentService {
  async create(data: CreateDto) {
    return prisma.appointment.create({ data });
  }
}
export const appointmentService = new AppointmentService();
```

### 3. Create Controller
```typescript
// src/controllers/appointmentController.ts
export class AppointmentController {
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = await appointmentService.create(req.body);
    return sendCreated(res, data, 'Created successfully');
  });
}
export const appointmentController = new AppointmentController();
```

### 4. Define Route
```typescript
// src/routes/appointments.ts
const router = Router();

router.post('/',
  authenticate,                    // Check JWT
  requireRoles('patient'),         // Check role
  validate(createAppointmentSchema), // Validate input
  appointmentController.create     // Handle request
);

export { router as appointmentRouter };
```

### 5. Register in App
```typescript
// src/app.ts
import { appointmentRouter } from './routes/appointments.js';
app.use('/api/appointments', appointmentRouter);
```

---

## 🔒 Middleware Cheat Sheet

```typescript
// Authentication
authenticate                    // Require valid JWT
optionalAuthenticate           // JWT optional

// Authorization
requireRoles('patient', 'doctor')  // Require specific roles
requireAdmin                       // Admin only
requireDoctor                      // Doctor or admin
checkPatientAccess                 // Resource ownership check

// Validation
validate(schema)               // Validate body + query + params
validateBody(schema)           // Validate body only
validateQuery(schema)          // Validate query only

// Rate Limiting
apiLimiter                     // General API limit
authLimiter                    // Strict auth limit (5/15min)
```

---

## 🚨 Error Throwing

```typescript
// In services, throw custom errors
throw new NotFoundError('Patient not found');
throw new BadRequestError('Invalid input');
throw new UnauthorizedError('Invalid token');
throw new ForbiddenError('Access denied');
throw new ConflictError('Already exists');
throw new ValidationError('Validation failed');
```

---

## 📤 Response Helpers

```typescript
// Success responses
sendSuccess(res, data, 'Message');
sendCreated(res, data, 'Created');
sendNoContent(res);

// Paginated response
sendPaginated(res, data, page, limit, total, 'Message');

// Error responses (auto handled by error middleware)
```

---

## 🗄️ Prisma Patterns

```typescript
// Find with relations
await prisma.patient.findUnique({
  where: { id },
  include: { doctor: true, vitals: true },
  select: { id: true, name: true }, // Limit fields
});

// Parallel queries
const [patients, count] = await Promise.all([
  prisma.patient.findMany({ where, take, skip }),
  prisma.patient.count({ where }),
]);

// Transactions
await prisma.$transaction(async (tx) => {
  await tx.patient.create({ data });
  await tx.appointment.create({ data });
});
```

---

## 📝 Logging

```typescript
import { logger } from './config/logger';

logger.info('Message', { userId, data });
logger.error('Error', { error: err.message });
logger.warn('Warning', { context });
logger.debug('Debug info', { details });
```

---

## 🔐 RBAC Permissions

```typescript
// Role hierarchy
admin    → Full access to everything
doctor   → Assigned patients, consultations
patient  → Own data only
staff    → Appointments, basic info

// Permission check
checkPermission('patients', 'read', getOwnerId)
```

---

## ⚡ Common Zod Patterns

```typescript
z.string()                    // String
z.string().uuid()             // UUID
z.string().email()            // Email
z.string().min(5).max(100)    // Length
z.string().datetime()         // ISO datetime
z.string().regex(/pattern/)   // Regex

z.number()                    // Number
z.number().int()              // Integer
z.number().min(0).max(100)    // Range

z.boolean()                   // Boolean
z.array(z.string())           // Array
z.object({ key: z.string() }) // Object
z.enum(['a', 'b', 'c'])       // Enum

.optional()                   // Optional field
.default('value')             // Default value
```

---

## 🧪 Testing Pattern

```typescript
// Unit test (service)
describe('AppointmentService', () => {
  it('should create appointment', async () => {
    const result = await service.create(mockData);
    expect(result).toHaveProperty('id');
  });
});

// Integration test (route)
describe('POST /api/appointments', () => {
  it('should create with auth', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    expect(res.status).toBe(201);
  });
});
```

---

## 🔍 Common Commands

```bash
# Development
npm run dev              # Start with hot reload
npm run build            # Build for production
npm start                # Start production

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open DB GUI

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode

# Code Quality
npm run lint             # Lint code
npm run format           # Format with Prettier
```

---

## 📚 Essential Files

- `ARCHITECTURE.md` - Complete architecture guide
- `BACKEND_API_PLAN.md` - API specification
- `README.md` - Setup & deployment
- `.env.example` - Environment variables

---

## 🐛 Debug Checklist

- ✅ Check `.env` file exists and has all variables
- ✅ Database is running (`psql -U postgres`)
- ✅ Prisma Client generated (`npm run prisma:generate`)
- ✅ Migrations applied (`npm run prisma:migrate`)
- ✅ JWT token is valid (check expiry)
- ✅ User has correct role/permissions
- ✅ Check logs in `logs/` folder

---

**Keep this card handy for quick reference!**
