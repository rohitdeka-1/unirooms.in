# CORS Fix - Railway Deployment

## ⚠️ IMPORTANT: Add Environment Variables to Railway

The CORS error occurs because Railway doesn't have the environment variables set.

### Steps to Fix:

1. **Go to Railway Dashboard**
   - Open your project: `uniroomsin-production`
   - Click on your service

2. **Go to Variables Tab**
   - Click "Variables" in the left sidebar

3. **Add This Variable:**
   ```
   FRONTEND_URL=https://unirooms-in.vercel.app
   ```

4. **Redeploy**
   - Railway should automatically redeploy
   - Or click "Deploy" → "Redeploy"

5. **Verify**
   - Check logs to ensure it's using the correct origin
   - Test the frontend again

---

## Quick Test After Deployment

```bash
# Test CORS preflight
curl -i -X OPTIONS \
  -H "Origin: https://unirooms-in.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  https://uniroomsin-production.up.railway.app/api/v1/auth/google/login
```

Should see:
```
Access-Control-Allow-Origin: https://unirooms-in.vercel.app
Access-Control-Allow-Credentials: true
```

---

## Code Changes Made

Updated `server/src/app.js` to:
- ✅ Use explicit allowedOrigins array
- ✅ Handle preflight OPTIONS requests
- ✅ Allow both production and localhost for development
- ✅ Expose Set-Cookie header for authentication

---

## After Adding Environment Variable

1. **Commit and push:**
   ```bash
   git add .
   git commit -m "Fix CORS for production"
   git push
   ```

2. **Railway will auto-deploy**

3. **Test your frontend:**
   - Visit: https://unirooms-in.vercel.app
   - Try Google login
   - Should work without CORS errors ✅

---

## If Still Getting Errors

Check Railway logs:
```
Railway Dashboard → Deployments → Logs
```

Look for startup logs showing:
```
CORS allowed origins: https://unirooms-in.vercel.app
```

---

**The key issue:** Railway environment variables aren't set yet!
