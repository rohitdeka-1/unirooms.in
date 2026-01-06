# Heroku Deployment Guide for UniRooms Backend

## Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- Git repository

## Step 1: Install Heroku CLI

```bash
# Install Heroku CLI (if not already installed)
curl https://cli-assets.heroku.com/install.sh | sh

# Login to Heroku
heroku login
```

## Step 2: Create Heroku App

```bash
cd /home/rhd/Desktop/Resume_Projects/PG_College/server

# Create a new Heroku app
heroku create unirooms-api

# Or if you want a specific name:
# heroku create your-custom-name
```

## Step 3: Set Environment Variables

```bash
# Database
heroku config:set MONGO_URI="mongodb+srv://pencilpandaofficial_db_user:uNAdS9h59olXA49j@cluster0.wclkkjd.mongodb.net/PG_Finder"

# JWT Secrets
heroku config:set JWT_ACCESS_SECRET="akjsdnakjsdn1798219827398213akjhdskjahskdjhskjdhakjsbdjabsdj7126y3187263182y71jh312j3b1j2h3bn21v3nb21v3bnnbnbvn2"
heroku config:set JWT_REFRESH_SECRET="refresh_secret_key_ACess_IS_different/News><different_from_access_should_be_very_long_and_secure_random_string_hereNEWdataandFASTMAE"
heroku config:set JWT_ACCESS_EXPIRE="15m"
heroku config:set JWT_REFRESH_EXPIRE="7d"

# Gmail (Email Service)
heroku config:set GMAIL_USER="unirooms.in@gmail.com"
heroku config:set GMAIL_APP_PASSWORD="dlzgxitvlypkjhqx"
heroku config:set EMAIL_FROM_NAME="UniRooms"

# Frontend URL (update this after deploying frontend)
heroku config:set FRONTEND_URL="https://unirooms.in"

# Google OAuth
heroku config:set GOOGLE_CLIENT_ID="1094535447252-1tbclnb8gu84ph2j1uc348ptk3c1fv7j.apps.googleusercontent.com"

# Cloudinary
heroku config:set CLOUDINARY_CLOUD_NAME="dg0qpcdcy"
heroku config:set CLOUDINARY_API_KEY="657956641882283"
heroku config:set CLOUDINARY_API_SECRET="VL9NVYlfmdGqLUSoHdyPRz1YjmU"

# Cashfree (if you have real credentials, update these)
heroku config:set CASHFREE_APP_ID="your_cashfree_app_id"
heroku config:set CASHFREE_SECRET_KEY="your_cashfree_secret_key"
heroku config:set CASHFREE_ENVIRONMENT="TEST"

# Upstash Redis (if you have it, otherwise get free tier from upstash.com)
heroku config:set UPSTASH_REDIS_REST_URL="your_upstash_redis_rest_url"
heroku config:set UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_rest_token"

# Node Environment
heroku config:set NODE_ENV="production"
```

## Step 4: Add Git Remote (if needed)

```bash
# Check if heroku remote exists
git remote -v

# If not, add it:
heroku git:remote -a unirooms-api
```

## Step 5: Deploy to Heroku

```bash
# Make sure you're in the server directory
cd /home/rhd/Desktop/Resume_Projects/PG_College/server

# Initialize git if needed
git init

# Add files
git add .

# Commit
git commit -m "Deploy to Heroku"

# Push to Heroku
git push heroku main

# Or if your branch is master:
# git push heroku master
```

## Step 6: Scale the Dyno

```bash
# Make sure at least one dyno is running
heroku ps:scale web=1
```

## Step 7: Open Your App

```bash
# Open the app in browser
heroku open

# Or check logs
heroku logs --tail
```

## Step 8: Fix Phone Index Issue

After deployment, run this ONCE:

```bash
# Get your Heroku app URL (e.g., https://unirooms-api.herokuapp.com)
curl https://your-app.herokuapp.com/api/test/fix-phone-index
```

## Verify Deployment

Your API will be available at:
```
https://unirooms-api.herokuapp.com
```

Test endpoints:
```bash
# Health check
curl https://unirooms-api.herokuapp.com/api/v1/health

# Test email
curl -X POST https://unirooms-api.herokuapp.com/api/test/send-email \
  -H "Content-Type: application/json" \
  -d '{"email": "alkardorhd@gmail.com", "type": "login"}'
```

## Update Frontend

Update your frontend to use the new Heroku API URL:
```javascript
// In client/.env or vite config
VITE_API_URL=https://unirooms-api.herokuapp.com
```

## Useful Heroku Commands

```bash
# View logs
heroku logs --tail

# View config
heroku config

# Restart app
heroku restart

# Run commands
heroku run node src/scripts/fix-phone-index.js

# Open bash shell
heroku run bash

# View app info
heroku apps:info
```

## Update CORS

Make sure your CORS settings allow your frontend URL. The code already handles this via `FRONTEND_URL` env variable.

## MongoDB Atlas Network Access

1. Go to MongoDB Atlas
2. Network Access
3. Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - This allows Heroku's dynamic IPs to connect

## Troubleshooting

### App crashes on startup
```bash
heroku logs --tail
# Check for missing environment variables
```

### Database connection fails
- Verify MongoDB Atlas allows connections from `0.0.0.0/0`
- Check MONGO_URI is correct

### Email timeout
- Heroku supports Gmail SMTP (port 587 works!)
- Verify GMAIL_APP_PASSWORD is correct (no spaces)

### Phone index error
- Run: `curl https://your-app.herokuapp.com/api/test/fix-phone-index`

## Free Tier Limitations

Heroku free tier:
- Sleeps after 30 min of inactivity
- Takes ~10-30 seconds to wake up
- 550-1000 dyno hours/month

To keep app awake, use a service like:
- UptimeRobot (free pings)
- Cron-job.org

## Production Checklist

- ✅ All environment variables set
- ✅ MongoDB allows Heroku IPs
- ✅ Frontend URL updated in env
- ✅ Google OAuth redirect URIs updated
- ✅ Phone index fixed
- ✅ Test all endpoints
- ✅ Test Google OAuth signup/login
- ✅ Test email sending

## Done!

Your backend is now deployed on Heroku! 🎉
