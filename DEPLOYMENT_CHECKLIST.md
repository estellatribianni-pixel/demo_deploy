# Render Deployment Checklist

## Pre-Deployment ✓

- [ ] Create Render account at https://render.com
- [ ] Have your GitHub repository ready
- [ ] Have these credentials ready:
  - [ ] TMDB API Key
  - [ ] Gmail address + App Password
  - [ ] JWT Secret (generate: `openssl rand -base64 32`)

## Step 1: Create Database Services

- [ ] Create PostgreSQL database
  - Name: `moviemate-db`
  - Save connection string (looks like: `postgresql://user:pass@host:5432/db`)
  
- [ ] Create Redis instance
  - Name: `moviemate-redis`
  - Save connection string (looks like: `redis://:pass@host:6379`)

## Step 2: Deploy Backend (Web Service)

- [ ] Push code to GitHub (this includes the new files we created)
  ```bash
  git add .
  git commit -m "Add Render deployment config"
  git push
  ```

- [ ] Create Web Service on Render
  - Connect your GitHub repo
  - Build Command: `npm install && npx prisma migrate deploy && npm run build`
  - Start Command: `npm start`
  
- [ ] Set Environment Variables:
  ```
  NODE_ENV = production
  DATABASE_URL = <paste PostgreSQL URL from Step 1>
  REDIS_URL = <paste Redis URL from Step 1>
  JWT_SECRET = <your generated secret>
  JWTEXPIRESIN = 10m
  TMDB_APIKEY = <your API key>
  EMAIL_USER = <your Gmail>
  EMAIL_PASS = <Gmail App Password>
  CLIENT_URL = http://localhost:5173 (for now)
  ```

## Step 3: Verify Deployment

- [ ] Check build logs in Render dashboard
  - Should see: "Server running on port ..."
  - Should see: "Migrations completed"
  
- [ ] Get your deployed backend URL
  - Format: `https://moviemate-backend.onrender.com` (example)
  
- [ ] Test API endpoint:
  ```bash
  curl https://your-backend-url.onrender.com/api/movies
  ```

- [ ] Check PostgreSQL connected
  - Try an API that uses database
  
- [ ] Check Redis connected
  - Look for redis middleware logs

## Step 4: Update Frontend (Later)

- [ ] Update frontend environment variables to point to your Render backend URL
- [ ] Deploy frontend to Render as static site

## Environment Variables Reference

| Name | Source | Instructions |
|------|--------|---|
| DATABASE_URL | Render PostgreSQL page | Copy full connection string |
| REDIS_URL | Render Redis page | Copy full connection string |
| JWT_SECRET | Generate | Run: `openssl rand -base64 32` |
| TMDB_APIKEY | TMDB website | Get from your TMDB account |
| EMAIL_USER | Gmail | Your full email address |
| EMAIL_PASS | Gmail | Go to myaccount.google.com → Security → App passwords |
| CLIENT_URL | Your frontend | Will update after frontend deploys |

## Troubleshooting

### Build fails?
- Check build logs in Render
- Ensure PostgreSQL/Redis are ready first
- Verify all env vars are set

### Can't connect to database?
- Copy DATABASE_URL exactly as shown in Render
- Format should start with `postgresql://`
- Don't modify the URL

### Redis not working?
- Check REDIS_URL format
- Should start with `redis://` or `rediss://`
- Free tier may auto-pause after 30 mins

### Port errors?
- Render auto-assigns PORT
- Don't hardcode port, use `process.env.PORT`
- Already fixed in your code ✓

## Files Created/Modified

✓ Created: `.nvmrc` - Specifies Node version 20
✓ Created: `render.yaml` - Render deployment config
✓ Modified: `package.json` - Added start and build scripts
✓ Modified: `src/server.js` - Added PORT fallback
✓ Modified: `src/configenv.js` - Added PORT fallback

All files are ready for deployment!
