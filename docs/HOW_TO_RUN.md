# How to Run FindPartAutopartes Backend

## Prerequisites

- Node.js 18+ installed
- Docker & Docker Compose installed
- PostgreSQL (via Docker or local)

---

## Quick Start

### 1. Clone & Setup Environment

```bash
cd FindAutoPart
cp .env.example .env
```

Edit `.env` if needed (default values work for development).

---

### 2. Start Infrastructure Services

```bash
# Start only the infrastructure (no backend/frontend containers yet)
docker-compose up -d postgres redis meilisearch minio mailhog traefik
```

Wait for services to be healthy (~30 seconds):

```bash
docker-compose ps
```

All services should show as "healthy" or "running".

---

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install all NestJS dependencies, Prisma, and other packages.

---

### 4. Generate Prisma Client & Run Migrations

```bash
# Generate Prisma Client based on schema.prisma
npx prisma generate

# Create database tables
npx prisma migrate dev --name init
```

You should see migrations applied successfully.

---

### 5. (Optional) Seed Database with Test Data

Create a seed file if you want test data:

```bash
npm run prisma:seed
```

*(Note: Seed script needs to be created with sample users, talleres, tiendas, etc.)*

---

### 6. Start Backend Development Server

```bash
npm run start:dev
```

You should see:
```
🚀 Backend is running on: http://localhost:4000
📚 API Docs available at: http://localhost:4000/api/docs
```

---

## Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **Backend API** | http://localhost:4000 | - |
| **Swagger Docs** | http://localhost:4000/api/docs | - |
| **PostgreSQL** | localhost:5432 | findpart / findpart_password |
| **MailHog (Email)** | http://localhost:8025 | - |
| **MinIO Console** | http://localhost:9001 | minio_access_key / minio_secret_key |
| **Meilisearch** | http://localhost:7700 | API Key: masterKey123 |
| **Traefik Dashboard** | http://localhost:8080 | - |

---

## Testing the API

### Option 1: Swagger UI

1. Go to http://localhost:4000/api/docs
2. Click "Authorize" and enter your JWT token (after login)
3. Test endpoints interactively

### Option 2: cURL

```bash
# Register a new taller user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "taller@example.com",
    "password": "Password123!",
    "role": "TALLER"
  }'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "taller@example.com",
    "password": "Password123!"
  }'

# Use the returned accessToken for authenticated requests
```

### Option 3: Postman/Insomnia

Import the OpenAPI spec from: http://localhost:4000/api/docs-json

---

## Development Commands

```bash
# Start with watch mode (auto-reload)
npm run start:dev

# Build production bundle
npm run build

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

---

## Database Management

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 4000
netstat -ano | findstr :4000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Database Connection Issues

```bash
# Check if PostgreSQL container is running
docker ps | findstr postgres

# Restart PostgreSQL
docker-compose restart postgres

# View logs
docker-compose logs postgres
```

### Prisma Client Errors

```bash
# Regenerate Prisma Client
npx prisma generate

# If schema changed, create migration
npx prisma migrate dev
```

---

## Next Steps

- Create seed data script
- Set up notification queue with BullMQ
- Implement Meilisearch indexing
- Add unit and integration tests
- Build frontend application
