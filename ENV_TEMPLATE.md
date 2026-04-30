# Environment Variables for Render Deployment
# Copy this format into Render Environment Settings

## Database Configuration
DATABASE_URL=postgresql://moviemate:YOUR_PASSWORD@dpg-xxxxx.render.com:5432/moviemate

## Redis Configuration  
REDIS_URL=redis://:YOUR_PASSWORD@redis-xxxxx.render.com:6379

## Application Configuration
NODE_ENV=production
PORT=3000

## JWT Configuration
JWT_SECRET=YOUR_JWT_SECRET_HERE
JWTEXPIRESIN=10m

## Third-party API Keys
TMDB_APIKEY=YOUR_TMDB_API_KEY_HERE

## Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=YOUR_GMAIL_APP_PASSWORD

## CORS Configuration
CLIENT_URL=https://your-frontend-domain.com

## Optional: Monitoring
LOG_LEVEL=info


### INSTRUCTIONS FOR EACH VARIABLE:

### DATABASE_URL
# 1. Go to your PostgreSQL service on Render
# 2. Copy the "Database URL" from the service page
# 3. Paste the entire URL here
# Example: postgresql://moviemate:abc123def456@dpg-xxxxxxx.render.com:5432/moviemate

### REDIS_URL
# 1. Go to your Redis service on Render
# 2. Copy the "Connection String" from the service page
# 3. Paste the entire URL here
# Example: redis://:abc123def456@redis-xxxxxxx.render.com:6379

### JWT_SECRET
# Generate a strong secret:
# Option 1 (Terminal): openssl rand -base64 32
# Option 2: Use any long random string (min 32 chars recommended)
# Example: YourVeryLongRandomSecretStringHere1234567890

### TMDB_APIKEY
# 1. Go to https://www.themoviedb.org/settings/api
# 2. Create API key for your application
# 3. Copy your API key
# Example: abc123def456ghi789jkl012mno345pqr

### EMAIL_USER & EMAIL_PASS
# For Gmail:
# 1. Go to https://myaccount.google.com/security
# 2. Enable 2-Step Verification (if not done)
# 3. Search for "App passwords"
# 4. Select "Mail" and "Windows Computer" (or your OS)
# 5. Copy the 16-character password generated
# EMAIL_USER: your-email@gmail.com
# EMAIL_PASS: xxxx xxxx xxxx xxxx (16 chars, remove spaces)

### CLIENT_URL
# This is your frontend URL after deployment
# Update this after deploying frontend to Render
# Examples:
# - Local testing: http://localhost:5173
# - After deployment: https://moviemate-frontend.onrender.com

### NODE_ENV
# Set to 'production' for Render deployment
# Never set to 'development' on production

### PORT
# Render auto-assigns this (usually 3000-10000+)
# Don't manually set unless needed
# Your code already handles dynamic ports ✓
