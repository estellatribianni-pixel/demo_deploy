# Render Deployment Guide for MovieMate Backend

## Overview
This guide walks you through deploying your Node.js/Express backend on Render with PostgreSQL and Redis.

## Prerequisites
- Render account (https://render.com)
- GitHub repository with your code pushed
- TMDB API key
- Gmail/Email credentials for notifications

---

## Step 1: Create Render Services

### 1.1 Deploy PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `moviemate-db`
   - **Database**: `moviemate`
   - **User**: `moviemate` (or any name)
   - **Region**: Select closest to you
   - **Plan**: Free (for testing) or Starter (for production)
4. Click **"Create Database"**
5. ⚠️ **Copy the connection string** - you'll need this
6. Wait for database to initialize (~2 minutes)

### 1.2 Deploy Redis Instance

1. Click **"New +"** → **"Redis"**
2. Configure:
   - **Name**: `moviemate-redis`
   - **Region**: Same as PostgreSQL
   - **Plan**: Free (for testing) or Starter (for production)
3. Click **"Create Redis"**
4. ⚠️ **Copy the Redis connection string** - you'll need this
5. Wait for Redis to initialize (~2 minutes)

---

## Step 2: Add Required Files to Your Project

### 2.1 Create `.nvmrc` (Node version specification)
```
20
```

### 2.2 Create `.build` and `.start` script in package.json

Update your backend `package.json`:
```json
"scripts": {
  "dev": "nodemon src/server.js",
  "start": "node src/server.js",
  "build": "prisma generate"
}
```

### 2.3 Update `src/server.js` to use PORT from environment

Make sure your server accepts the PORT from environment variables. Render will assign a dynamic port. Your current setup looks good, but verify PORT defaults:

```javascript
import app from "./app.js";
import { PORT } from "./configenv.js";

app.listen(PORT || 5000, () => {
  console.log(`Server running on port ${PORT || 5000}`);
});
```

### 2.4 Update `src/configenv.js` to handle missing PORT gracefully

```javascript
export const PORT = process.env.PORT || 5000;
```

---

## Step 3: Create `render.yaml` Configuration (Optional but Recommended)

Create a `render.yaml` file in your project root:

```yaml
services:
  - type: web
    name: moviemate-backend
    env: node
    plan: free
    buildCommand: npm install && npx prisma migrate deploy && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

---

## Step 4: Deploy Backend Service

### 4.1 Push Your Code to GitHub

```bash
git add .
git commit -m "Add Render deployment files"
git push origin main
```

### 4.2 Create Web Service on Render

1. Click **"New +"** → **"Web Service"**
2. Choose **"Build and deploy from a Git repository"**
3. Search for your repo and connect it
4. Configure:
   - **Name**: `moviemate-backend`
   - **Environment**: `Node`
   - **Region**: Same as DB and Redis
   - **Branch**: `main`
   - **Build Command**: 
     ```
     npm install && npx prisma migrate deploy && npm run build
     ```
   - **Start Command**: 
     ```
     npm start
     ```
   - **Plan**: Free (for testing)

5. Click **"Create Web Service"**

---

## Step 5: Set Environment Variables on Render

### 5.1 Add Environment Variables

In the Render dashboard for your web service:

1. Go to **"Environment"** section
2. Add each variable:

```
DATABASE_URL = <PostgreSQL connection string from Step 1.1>
REDIS_URL = <Redis connection string from Step 1.2>
JWT_SECRET = your_super_secret_jwt_key_change_this
JWTEXPIRESIN = 10m
TMDB_APIKEY = your_tmdb_api_key_here
EMAIL_USER = your_email@gmail.com
EMAIL_PASS = your_app_password_or_token
CLIENT_URL = https://your-frontend-domain.com
NODE_ENV = production
PORT = will be auto-assigned by Render
```

⚠️ **Important**:
- For `DATABASE_URL`: Render provides a full PostgreSQL URL
- For `REDIS_URL`: Render provides a full Redis URL
- `EMAIL_PASS`: Use Gmail App Password, not your main password
- `CLIENT_URL`: Update with your actual frontend URL after frontend deployment

### 5.2 Example Values:
```
DATABASE_URL = postgresql://moviemate:password@dpg-xxxxx.render.com:5432/moviemate
REDIS_URL = redis://:password@redis-xxxxx.render.com:6379
JWT_SECRET = super_secret_key_min_32_chars_recommended
TMDB_APIKEY = your_tmdb_key
EMAIL_USER = your-email@gmail.com
EMAIL_PASS = your_16_char_app_password
CLIENT_URL = http://localhost:5173 (for local testing) or https://your-domain.com
```

---

## Step 6: Database Migration

### 6.1 Run Prisma Migrations on Render

The migrations will run automatically during the build process with the build command:
```
npx prisma migrate deploy
```

### 6.2 If Manual Migration Needed

In Render dashboard for your web service:
1. Go to **"Shell"** tab
2. Run:
   ```bash
   npx prisma migrate deploy
   ```

---

## Step 7: Verify Deployment

1. **Check Build Logs**:
   - Render dashboard → Your service → "Logs"
   - Look for: "Server running on port ..."

2. **Test API Endpoints**:
   ```bash
   curl https://your-backend-url.render.com/api/movies
   ```

3. **Check Redis Connection**:
   - Verify middleware logs work without errors

4. **Test Database**:
   - Make a request that queries the database
   - Check logs for connection success

---

## Step 8: Update Frontend Configuration

Update your frontend's API endpoint to point to Render backend:

In `frontend/src/services/apiHandler.js` or similar:
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'https://your-backend-url.render.com';
```

---

## Important Environment Variable Notes

| Variable | Source | Example |
|----------|--------|---------|
| DATABASE_URL | Render PostgreSQL service page | postgresql://user:pass@host:5432/db |
| REDIS_URL | Render Redis service page | redis://:password@host:6379 |
| JWT_SECRET | Generate yourself | `openssl rand -base64 32` |
| TMDB_APIKEY | TMDB account | Your TMDB API key |
| EMAIL_USER | Gmail address | your-email@gmail.com |
| EMAIL_PASS | Gmail App Password | 16-character password |
| CLIENT_URL | Your frontend URL | https://frontend.render.com |

---

## Common Issues & Solutions

### ❌ Build Fails: "Prisma Client Not Found"
**Solution**: Ensure build command includes `npx prisma generate`

### ❌ Database Connection Timeout
**Solution**: 
- Check DATABASE_URL format
- Ensure PostgreSQL service is running
- Verify network access

### ❌ Redis Connection Error
**Solution**:
- Check REDIS_URL format
- Ensure Redis service is running
- For free tier, Redis auto-suspends after 30 mins of inactivity

### ❌ Deployment Keeps Failing
**Solution**:
1. Check the build logs in Render dashboard
2. Verify all environment variables are set
3. Ensure `npm start` works locally
4. Check for Node version compatibility

---

## After Successful Deployment

1. ✅ Test all API endpoints
2. ✅ Verify email notifications work
3. ✅ Check rate limiting is active
4. ✅ Monitor logs for errors
5. ✅ Set up automatic redeploys on GitHub pushes

---

## Useful Commands (Run in Render Shell)

```bash
# Check database connection
psql $DATABASE_URL -c "SELECT NOW();"

# Verify Prisma setup
npx prisma validate

# Check migrations
npx prisma migrate status

# View logs
tail -f /app/logs/app.log
```

---

## Cost Estimation (as of 2026)
- **PostgreSQL**: Free tier available, $7-15/month for paid
- **Redis**: Free tier available, $7-15/month for paid  
- **Web Service**: $0.01/hour free tier, $12-50/month for paid
- **Total**: ~$0-80/month depending on tier

---

## Next Steps
1. Create Render account
2. Follow Steps 1-5 above
3. Test deployment
4. Deploy frontend
5. Monitor and optimize

Good luck with your deployment! 🚀
