# 🚀 Quick Start Guide: Auth + RBAC Setup

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- Environment variables configured

## Step-by-Step Setup

### 1. Configure Environment Variables

Create or update `.env` file in `backend/` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/health_monitor"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_ACCESS_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# Email (Optional - for password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@healthmonitor.com"
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Run Prisma Migration

This will apply all database schema changes:

```bash
npx prisma migrate dev --name add_auth_rbac_system
```

**Expected Output:**
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema.
```

### 4. Seed Roles and Permissions

Populate database with default roles and permissions:

```bash
npx tsx src/scripts/seedRolesPermissions.ts
```

**Expected Output:**
```
🌱 Starting to seed roles and permissions...

📝 Creating permissions...
✅ Created/updated 100+ permissions

👥 Creating roles and assigning permissions...
  ✓ admin: 1 permissions assigned
  ✓ doctor: 25 permissions assigned
  ✓ patient: 20 permissions assigned
  ✓ staff: 10 permissions assigned

✅ Created/updated 4 roles

📊 Summary:
  • Total Permissions: 100+
  • Total Roles: 4

🎉 Seeding completed successfully!
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run Tests (Optional)

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- auth.test

# Run with coverage
npm test -- --coverage
```

### 7. Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
[INFO] Server is running on port 3001
[INFO] Database connected successfully
[INFO] Environment: development
```

## 🧪 Quick Test

### Test Registration

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "Password123!",
    "name": "Test Patient",
    "phone": "1234567890",
    "role": "patient"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "patient@test.com",
      "name": "Test Patient",
      "role": {
        "name": "patient"
      }
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Test Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "Password123!"
  }'
```

### Test Get Profile

```bash
# Save the accessToken from login response
TOKEN="your-access-token-here"

curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 🔍 Verify Setup

### Check Database Tables

```bash
npx prisma studio
```

This will open Prisma Studio in your browser. Verify:
- ✅ User table has the new user
- ✅ Role table has 4 roles (admin, doctor, patient, staff)
- ✅ Permission table has 100+ permissions
- ✅ RolePermission table has assignments
- ✅ PatientProfile table has entry for patient user

### Check Logs

Look for these success indicators in console:
- Database connection successful
- JWT configuration loaded
- Routes registered: `/api/auth/*`
- Middleware loaded: authentication, validation, RBAC

## ⚠️ Troubleshooting

### Migration Failed

**Error:** `Database connection failed`

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# Check DATABASE_URL in .env
echo $DATABASE_URL

# Try connecting manually
psql -d health_monitor -U your_username
```

### Prisma Client Not Found

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
npm install @prisma/client
npx prisma generate
```

### Port Already in Use

**Error:** `Port 3001 is already in use`

**Solution:**
```bash
# Find and kill the process
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=3002
```

### JWT Secret Not Set

**Error:** `JWT_SECRET is not defined`

**Solution:**
```bash
# Add to .env
JWT_SECRET="your-secret-key-minimum-32-characters-long"
```

### Test User Already Exists

**Error:** `Email already exists`

**Solution:**
```bash
# Clear test users
npx prisma studio
# Delete the test user manually

# Or use different email
```

## 📚 Next Steps

1. **Create Admin User:**
   - Register with role: `admin`
   - Use to manage system

2. **Test RBAC:**
   - Create users with different roles
   - Test permission checks
   - Try accessing restricted endpoints

3. **Integrate Frontend:**
   - Use auth endpoints in frontend
   - Store tokens securely (httpOnly cookies)
   - Implement protected routes

4. **Production Deployment:**
   - Change JWT_SECRET to strong random value
   - Set NODE_ENV=production
   - Enable HTTPS
   - Configure CORS properly
   - Set up email service for password reset

## 🎯 Common Use Cases

### Create Admin User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@healthmonitor.com",
    "password": "AdminPassword123!",
    "name": "System Administrator",
    "role": "admin"
  }'
```

### Create Doctor User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@healthmonitor.com",
    "password": "DoctorPass123!",
    "name": "Dr. Smith",
    "phone": "5551234567",
    "role": "doctor"
  }'
```

### Update Profile
```bash
TOKEN="your-access-token"

curl -X PUT http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phone": "9876543210",
    "avatar": "https://i.pravatar.cc/150"
  }'
```

### Change Password
```bash
TOKEN="your-access-token"

curl -X POST http://localhost:3001/api/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Password123!",
    "newPassword": "NewPassword123!",
    "confirmPassword": "NewPassword123!"
  }'
```

## ✅ Checklist

Before moving to production:

- [ ] All tests passing
- [ ] JWT_SECRET is strong and unique
- [ ] Database migrations applied
- [ ] Roles and permissions seeded
- [ ] Admin user created
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting configured
- [ ] Error monitoring setup
- [ ] Backup strategy in place

## 📞 Support

For issues or questions:
1. Check [AUTH_RBAC_IMPLEMENTATION.md](./AUTH_RBAC_IMPLEMENTATION.md)
2. Review test files for examples
3. Check Prisma logs: `npx prisma studio`
4. Enable debug logging: `DEBUG=* npm run dev`

---

**Ready to go!** 🎉 Your Auth + RBAC system is now fully operational.