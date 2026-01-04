# Deploying Backend to Render

## Prerequisites
- GitHub account
- Render account (free tier available)
- MongoDB Atlas database
- All environment variables ready

## Step 1: Prepare Your Repository

1. **Commit all changes:**
   ```bash
   cd server
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

## Step 2: Create MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with password
4. Whitelist all IP addresses (0.0.0.0/0) for Render
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/pgcollege?retryWrites=true&w=majority
   ```

## Step 3: Deploy on Render

### Option A: Using Render Dashboard (Recommended)

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**
   - Select your PG_College repository
   - Or use public repo URL

4. **Configure the service:**
   - **Name:** `pgcollege-api` (or your choice)
   - **Region:** Oregon (or closest to you)
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. **Add Environment Variables:**
   Click "Advanced" and add these:
   
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pgcollege
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   JWT_REFRESH_SECRET=your-refresh-secret-different-from-jwt
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d
   COOKIE_EXPIRE=7
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   EMAIL_FROM=noreply@pgcollege.com
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   CASHFREE_APP_ID=your-cashfree-app-id
   CASHFREE_SECRET_KEY=your-cashfree-secret-key
   CASHFREE_API_VERSION=2023-08-01
   CASHFREE_MODE=production
   UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-upstash-token
   CLIENT_URL=https://your-frontend.vercel.app
   LISTING_FEE=99
   ```

6. **Click "Create Web Service"**

7. **Wait for deployment** (usually 2-3 minutes)

8. **Your API URL will be:** `https://pgcollege-api.onrender.com`

### Option B: Using render.yaml

1. **Use the render.yaml file** already created in the server directory

2. **Create new Web Service from Blueprint:**
   - Dashboard → New + → Blueprint
   - Connect repository
   - Render will detect render.yaml
   - Add environment variables in dashboard

## Step 4: Verify Deployment

Test your deployed API:

```bash
# Health check
curl https://pgcollege-api.onrender.com/api/v1/health

# Root endpoint
curl https://pgcollege-api.onrender.com/

# Test properties endpoint
curl https://pgcollege-api.onrender.com/api/v1/properties
```

## Step 5: Update Frontend

Update your frontend API URL:

**client/src/utils/api.js:**
```javascript
const API_BASE_URL = import.meta.env.PROD 
    ? 'https://pgcollege-api.onrender.com/api/v1'
    : 'http://localhost:5000/api/v1';
```

Or use environment variable:

**client/.env.production:**
```
VITE_API_URL=https://pgcollege-api.onrender.com/api/v1
```

**client/src/utils/api.js:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
```

## Important Notes

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- 750 hours/month free (enough for 1 service running 24/7)

### Cold Start Solution
Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your API every 10 minutes:
- Ping URL: `https://pgcollege-api.onrender.com/api/v1/health`
- Interval: 10 minutes

### CORS Configuration
Make sure CLIENT_URL matches your deployed frontend URL exactly (no trailing slash).

### Database Indexes
Render will automatically create indexes on first run. Monitor MongoDB Atlas to ensure geospatial indexes are created:
- Properties collection should have `location` 2dsphere index

### Monitoring
- Check logs in Render dashboard: Service → Logs
- Set up alerts in Render dashboard: Service → Settings → Notifications

## Troubleshooting

### Build Fails
- Check Node version: Add `"engines": { "node": ">=18.0.0" }` in package.json ✅ (Already added)
- Check all dependencies are in package.json
- Verify ROOT_DIRECTORY is set to `server`

### Database Connection Fails
- Verify MongoDB Atlas connection string
- Ensure IP whitelist includes 0.0.0.0/0
- Check database user has read/write permissions

### Environment Variables Not Working
- Go to Environment tab in Render dashboard
- Click "Generate" to regenerate
- Make sure no quotes around values

### API Returns 500 Errors
- Check Render logs for detailed errors
- Verify all required environment variables are set
- Test endpoints locally first

## Next Steps

1. **Set up Upstash Redis** for rate limiting:
   - Go to [Upstash](https://upstash.com/)
   - Create free Redis database
   - Get REST URL and token
   - Add to Render environment variables

2. **Configure Google OAuth:**
   - Add Render URL to Google Console authorized domains
   - Update redirect URIs

3. **Set up Cashfree:**
   - Switch to production mode
   - Update webhook URLs to Render URL

4. **Monitor performance:**
   - Set up New Relic or similar APM
   - Monitor response times
   - Track error rates

## Deployment Checklist

- [ ] All code committed and pushed to GitHub
- [ ] MongoDB Atlas database created and configured
- [ ] All environment variables documented
- [ ] Render service created and deployed
- [ ] Health check endpoint working
- [ ] Database connection successful
- [ ] Frontend updated with production API URL
- [ ] CORS configured correctly
- [ ] Google OAuth configured (if using)
- [ ] Payment gateway tested (if using)
- [ ] Cold start mitigation set up (UptimeRobot)

---

**Your Backend is now live! 🚀**

Test URL: `https://pgcollege-api.onrender.com`
