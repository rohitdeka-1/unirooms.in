# Production Deployment Configuration

## URLs
- **Frontend (Vercel):** https://unirooms-in.vercel.app
- **Backend (Railway):** https://uniroomsin-production.up.railway.app

---

## Backend (Railway) - Environment Variables

Add these environment variables in Railway Dashboard:

```bash
# Server
NODE_ENV=production
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pgcollege?retryWrites=true&w=majority

# JWT
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-minimum-32-characters
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-different-from-access
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Frontend URL (CORS)
FRONTEND_URL=https://unirooms-in.vercel.app

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Email (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-app-password
EMAIL_FROM_NAME=UniRooms

# Cashfree Payment
CASHFREE_APP_ID=your-cashfree-app-id
CASHFREE_SECRET_KEY=your-cashfree-secret-key
CASHFREE_ENVIRONMENT=PRODUCTION

# Google Maps (Optional)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# File Upload
MAX_FILE_SIZE=5242880
MAX_FILES=10
```

### Railway Deployment Steps:

1. **Push backend code to GitHub**
2. **Go to Railway Dashboard**
3. **New Project → Deploy from GitHub**
4. **Select your repository**
5. **Root Directory:** Set to `server`
6. **Add all environment variables above**
7. **Deploy!**

Your backend will be live at: `https://uniroomsin-production.up.railway.app`

---

## Frontend (Vercel) - Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Production API URL
VITE_API_URL=https://uniroomsin-production.up.railway.app/api/v1
```

### Vercel Deployment Steps:

1. **Push frontend code to GitHub**
2. **Go to Vercel Dashboard**
3. **New Project → Import from GitHub**
4. **Select your repository**
5. **Framework Preset:** Vite
6. **Root Directory:** Set to `client`
7. **Add environment variable:** `VITE_API_URL`
8. **Deploy!**

Your frontend will be live at: `https://unirooms-in.vercel.app`

---

## Testing Production Setup

### 1. Test Backend Health
```bash
curl https://uniroomsin-production.up.railway.app/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "API is healthy",
  "timestamp": "2026-01-04T..."
}
```

### 2. Test CORS
```bash
curl -H "Origin: https://unirooms-in.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://uniroomsin-production.up.railway.app/api/v1/properties
```

Should return CORS headers allowing the frontend.

### 3. Test Frontend
1. Visit: https://unirooms-in.vercel.app
2. Open browser DevTools → Network tab
3. Try to browse properties
4. Check API calls go to: `https://uniroomsin-production.up.railway.app/api/v1`

---

## Local Development Setup

### Backend (Local)
```bash
cd server
# Use local .env with localhost settings
npm run dev
```

### Frontend (Local)
```bash
cd client
# Will use .env.development (localhost:5000)
npm run dev
```

---

## Important Security Notes

### 1. MongoDB Atlas
- Whitelist Railway IP addresses (or use 0.0.0.0/0 for simplicity)
- Use strong database password

### 2. CORS
- Frontend URL must match exactly (no trailing slash)
- Backend CORS is set to: `https://unirooms-in.vercel.app`

### 3. Cookies & Sessions
- Ensure `credentials: true` in both frontend and backend
- Railway HTTPS is automatic ✅

### 4. Google OAuth
Update Google Console:
- **Authorized JavaScript Origins:**
  - `https://unirooms-in.vercel.app`
  - `https://uniroomsin-production.up.railway.app`
  
- **Authorized Redirect URIs:**
  - `https://unirooms-in.vercel.app/auth/google/callback`
  - `https://uniroomsin-production.up.railway.app/api/v1/auth/google/callback`

### 5. Cashfree Webhooks
Update webhook URL in Cashfree Dashboard:
- `https://uniroomsin-production.up.railway.app/api/v1/payments/webhook`

---

## Troubleshooting

### Frontend can't connect to backend
- Check Network tab for CORS errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Redeploy frontend after changing env vars

### Backend returns 500 errors
- Check Railway logs: Dashboard → Deployments → Logs
- Verify all environment variables are set
- Check MongoDB connection string

### CORS errors
- Ensure `FRONTEND_URL` matches exactly: `https://unirooms-in.vercel.app`
- No trailing slash
- Must include protocol (https://)

### Authentication not working
- Check cookies are being sent (credentials: true)
- Verify JWT secrets are set
- Check browser allows third-party cookies

---

## Post-Deployment Checklist

### Backend (Railway)
- [ ] Service deployed successfully
- [ ] Health check endpoint working
- [ ] MongoDB connection successful
- [ ] All environment variables set
- [ ] Logs show no errors
- [ ] CORS allows frontend URL

### Frontend (Vercel)
- [ ] Build successful
- [ ] Site loads without errors
- [ ] API calls reach backend
- [ ] Authentication works
- [ ] College search works
- [ ] Property listing works

### Third-Party Services
- [ ] MongoDB Atlas whitelist configured
- [ ] Google OAuth URLs updated
- [ ] Cashfree webhook URL updated
- [ ] Upstash Redis connected
- [ ] Email service configured

---

## Monitoring

### Railway
- Dashboard → Metrics
- Monitor memory, CPU, and request count
- Set up usage alerts

### Vercel
- Dashboard → Analytics
- Monitor page views and performance
- Set up Web Vitals alerts

### MongoDB Atlas
- Monitor → Performance
- Check connection count
- Monitor query performance

---

## Environment Variable Summary

### Backend (Railway) - Required
✅ MONGO_URI
✅ JWT_ACCESS_SECRET
✅ JWT_REFRESH_SECRET
✅ UPSTASH_REDIS_REST_URL
✅ UPSTASH_REDIS_REST_TOKEN
✅ FRONTEND_URL
✅ GMAIL_USER
✅ GMAIL_APP_PASSWORD

### Frontend (Vercel) - Required
✅ VITE_API_URL

---

**🚀 Your app is now production-ready!**

Frontend: https://unirooms-in.vercel.app
Backend: https://uniroomsin-production.up.railway.app
