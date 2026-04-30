# Quick Reference: Setting Up Render Services

## 1. PostgreSQL Setup (5 minutes)

**On Render Dashboard:**
1. Click "New +" → "PostgreSQL"
2. Fill in:
   - Name: `moviemate-db`
   - Database: `moviemate`
   - User: `moviemate`
   - Region: Select closest to you
   - Plan: Free (for testing)
3. Click "Create Database"
4. Wait 2-3 minutes for initialization
5. Copy the connection string (you'll see it on the service page)
   - Looks like: `postgresql://moviemate:xxxxx@dpg-xxxx.render.com:5432/moviemate`

## 2. Redis Setup (5 minutes)

**On Render Dashboard:**
1. Click "New +" → "Redis"
2. Fill in:
   - Name: `moviemate-redis`
   - Region: Same as PostgreSQL
   - Plan: Free (for testing)
3. Click "Create Redis"
4. Wait 2-3 minutes for initialization
5. Copy the Redis connection string
   - Looks like: `redis://:xxxxx@redis-xxxx.render.com:6379`

## 3. Web Service Setup (Deployment)

**Prerequisites:**
- Your code pushed to GitHub
- Database & Redis created

**On Render Dashboard:**
1. Click "New +" → "Web Service"
2. Select "Build and deploy from a Git repository"
3. Connect your GitHub repo
4. Configuration:
   ```
   Name: moviemate-backend
   Environment: Node
   Region: Same as databases
   Branch: main
   Build Command: npm install && npx prisma migrate deploy && npm run build
   Start Command: npm start
   Plan: Free
   ```
5. Click "Create Web Service"
6. Deployment starts automatically

## 4. Environment Variables (Critical!)

**After Web Service is created:**
1. Go to Service page → "Environment" section
2. Add these variables:

```
DATABASE_URL
(from PostgreSQL service page)

REDIS_URL
(from Redis service page)

NODE_ENV
production

PORT
(Render auto-assigns, don't manually set)

JWT_SECRET
openssl rand -base64 32
(run this in terminal to generate)

JWTEXPIRESIN
10m

TMDB_APIKEY
(from your TMDB account)

EMAIL_USER
your-email@gmail.com

EMAIL_PASS
(Gmail App Password - see below)

CLIENT_URL
http://localhost:5173
(update after frontend deployment)
```

## 5. Getting Gmail App Password

**Steps:**
1. Go to https://myaccount.google.com/
2. Click "Security" (left menu)
3. Enable "2-Step Verification" if not done
4. Search for "App passwords"
5. Select "Mail" and "Windows Computer"
6. Copy the 16-character password
7. Use that in EMAIL_PASS

## 6. Getting TMDB API Key

**Steps:**
1. Go to https://www.themoviedb.org/settings/api
2. Create an API key for your app
3. Accept terms and submit
4. Copy your API key

## 7. Checking Deployment Status

**Real-time logs:**
1. Go to your Web Service on Render
2. Click "Logs" tab
3. Watch build and startup messages
4. Look for: "Server running on port ..."

**Successful build includes:**
```
Server running on port 10000
prisma migrations completed
Redis connected
```

## 8. Testing After Deployment

**Get your URL:**
- Format: `https://[your-service-name].onrender.com`
- Example: `https://moviemate-backend.onrender.com`

**Test API:**
```bash
curl https://your-service-name.onrender.com/api/movies
```

**Expected responses:**
- ✓ 200 OK with movie data (DB working)
- ✓ Rate limit headers (Redis working)
- ✓ Proper CORS headers (configured in app.js)

## Common Port Issues Explained

- **Render assigns dynamic port**: 10000, 10001, 10002, etc.
- **Your code must accept any port**: Already done! ✓
- **Don't hardcode port**: Use `process.env.PORT`
- **Local testing**: Still uses 5000 (fallback value)

## Free Tier Limitations

- **PostgreSQL**: Auto-pauses after 15 days of inactivity
- **Redis**: Auto-pauses after 30 mins of inactivity
- **Web Service**: Auto-spins down after 15 mins of inactivity
- **Important**: All services auto-wake when accessed

**Workaround**: Set up a monitor to ping your service every 15 mins

## Upgrade Path (When needed)

| Service | Free Cost | Starter Cost | When to upgrade |
|---------|-----------|---|---|
| PostgreSQL | Free | $7/mo | When you need persistent data |
| Redis | Free | $7/mo | When you need caching across restarts |
| Web | $0.01/hr | $12/mo | When traffic increases |

## Quick Deployment Command (Git)

```bash
# 1. Make changes
# 2. Commit
git add .
git commit -m "Add Render deployment files"

# 3. Push
git push origin main

# 4. Render auto-deploys!
# 5. Check Render dashboard for build logs
```

## Helpful Commands (Run in Render Shell)

After deployment, you can SSH into Render and run:

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT NOW();"

# Check Prisma setup
npx prisma validate

# Check migrations status
npx prisma migrate status

# Restart app (if needed)
# Just disconnect from Render Shell and reconnect
```

## Still Having Issues?

1. Check Render Logs (Service → Logs tab)
2. Verify all environment variables are set
3. Make sure DATABASE_URL and REDIS_URL formats are correct
4. Ensure services are in same region
5. For database issues, check PostgreSQL service status
6. For Redis issues, check if it's awake (free tier auto-pauses)

---

**You're all set!** Follow the steps above and your backend will be live on Render. 🚀
