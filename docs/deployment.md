# Deployment with EasyPanel

This directory contains everything needed to deploy FindAutoPart to production using EasyPanel.

## Quick Start

1. **Read the full guide:** See artifacts brain directory for `easypanel_deployment_guide.md`

2. **Prepare repository:**
   ```bash
   git add .
   git commit -m "Add production deployment files"
   git push origin main
   ```

3. **Generate JWT secrets:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Deploy on EasyPanel:**
   - Create PostgreSQL and Redis services
   - Deploy backend from `backend/Dockerfile.prod`
   - Deploy frontend from `frontend/Dockerfile.prod`
   - Configure environment variables from `.env.production.example`

5. **Run migrations:**
   ```bash
   # In EasyPanel backend console
   npx prisma migrate deploy
   ```

## Files

- `backend/Dockerfile.prod` - Production backend image
- `frontend/Dockerfile.prod` - Production frontend image
- `.env.production.example` - Environment variables template
- `docs/DEPLOYMENT.md` - This file

## Architecture

```
┌─────────────────┐
│  Frontend       │
│  (Next.js)      │  Port 3000
│  Standalone     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │
│  (NestJS)       │  Port 4000
└────────┬────────┘
         │
         ├──────► PostgreSQL (Database)
         ├──────► Redis (Cache/Queues)
         ├──────► Meilisearch (Search)  *Optional
         └──────► MinIO (S3 Storage)    *Optional
```

## Important Notes

- **Database Migration:** Run `npx prisma migrate deploy` after first backend deployment
- **Environment Variables:** Never commit real secrets to Git
- **SSL/HTTPS:** EasyPanel handles this automatically
- **Domain:** Configure your domain DNS to point to your VPS IP

## Support

For issues, check:
- EasyPanel logs for deployment errors
- Backend health: `https://api.yourdomain.com/health`
- Frontend accessibility: `https://yourdomain.com` 
