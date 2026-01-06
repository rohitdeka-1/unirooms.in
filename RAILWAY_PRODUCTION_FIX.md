# Railway Production Issues - Quick Fix Guide

## Issue 1: Google OAuth Phone Index Error

### Error:
```
E11000 duplicate key error collection: PG_Finder.users index: phone_1 dup key: { phone: null }
```

### Quick Fix:

**Call this endpoint ONCE after deployment:**

```bash
curl https://your-app.railway.app/api/test/fix-phone-index
```

Or visit in browser:
```
https://your-app.railway.app/api/test/fix-phone-index
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Created new sparse unique index.",
  "indexes": [...]
}
```

**After running, Google OAuth signup will work!**

---

## Issue 2: Email Connection Timeout

### Error:
```
Email service connection failed: Connection timeout
Error code: ETIMEDOUT
```

### Why This Happens:

Railway (and some other hosting providers) **block outbound SMTP connections on port 587** to prevent spam. Gmail's SMTP server is being blocked.

### Solution Options:

#### Option A: Use SendGrid (Recommended for Production) ✅

SendGrid is free for 100 emails/day and works well with Railway.

**1. Sign up for SendGrid:**
- Go to https://sendgrid.com/
- Create a free account
- Verify your email
- Create an API key

**2. Add environment variables to Railway:**
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=UniRooms
```

**3. Install SendGrid:**
```bash
npm install @sendgrid/mail
```

**4. I'll create a SendGrid email service for you below**

#### Option B: Try Port 465 (SSL)

Sometimes port 465 works when 587 doesn't.

**Add to Railway environment variables:**
```
GMAIL_USE_SSL=true
```

**Code already handles this** - the updated email service will use port 465 with SSL if this is set.

#### Option C: Use Mailgun

Another reliable option:
```
MAILGUN_API_KEY=your-key
MAILGUN_DOMAIN=your-domain
```

---

## Quick Deployment Steps

### Step 1: Fix Phone Index

```bash
# After deploying to Railway, run once:
curl https://your-app.railway.app/api/test/fix-phone-index
```

### Step 2: Fix Email Timeout

**Choose SendGrid (recommended):**

1. Sign up at https://sendgrid.com/
2. Get your API key
3. Add to Railway:
   - `SENDGRID_API_KEY=SG.your_api_key`
   - `USE_SENDGRID=true`
4. Redeploy

### Step 3: Test

```bash
# Test email (using SendGrid)
curl -X POST https://your-app.railway.app/api/test/send-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com", "type": "login"}'

# Test Google OAuth signup
# Use your frontend to sign up with Google
```

---

## Alternative: Gmail with Port 465

If you want to keep using Gmail, try this:

**1. Add to Railway environment variables:**
```
GMAIL_USER=unirooms.in@gmail.com
GMAIL_APP_PASSWORD=dlzgxitvlypkjhqx
GMAIL_USE_SSL=true
```

**2. The code will automatically use port 465 with SSL**

**3. If still timeout, Gmail is blocked - use SendGrid instead**

---

## Environment Variables Checklist for Railway

Make sure these are set in Railway dashboard:

### Required:
- ✅ `MONGO_URI` - Your MongoDB connection string
- ✅ `JWT_ACCESS_SECRET` - Long random string
- ✅ `JWT_REFRESH_SECRET` - Different long random string
- ✅ `FRONTEND_URL` - Your frontend URL (e.g., https://unirooms.in)

### Email (Choose one):
**Option 1 - SendGrid (Recommended):**
- ✅ `USE_SENDGRID=true`
- ✅ `SENDGRID_API_KEY=SG.xxxxx`
- ✅ `EMAIL_FROM=noreply@yourdomain.com`
- ✅ `EMAIL_FROM_NAME=UniRooms`

**Option 2 - Gmail (if it works):**
- ✅ `GMAIL_USER=unirooms.in@gmail.com`
- ✅ `GMAIL_APP_PASSWORD=dlzgxitvlypkjhqx` (no spaces!)
- ✅ `GMAIL_USE_SSL=true` (optional, try if port 587 fails)

### Optional:
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `CLOUDINARY_CLOUD_NAME` - For image uploads
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `UPSTASH_REDIS_REST_URL` - For Redis
- `UPSTASH_REDIS_REST_TOKEN`

---

## Verify Everything Works

### 1. Check Deployment Logs
```
✅ MongoDB Connected
✅ Email service is ready to send emails
✅ Sending from: unirooms.in@gmail.com
```

OR if using SendGrid:
```
✅ SendGrid email service is ready
✅ Sending from: noreply@yourdomain.com
```

### 2. Fix Phone Index
```bash
curl https://your-app.railway.app/api/test/fix-phone-index
# Should return: "success": true
```

### 3. Test Google OAuth
- Go to your frontend
- Click "Sign up with Google"
- Should work without phone index error

### 4. Test Email
```bash
curl -X POST https://your-app.railway.app/api/test/send-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com", "type": "login"}'
```

---

## Troubleshooting

### Gmail still timing out?
➡️ **Use SendGrid** - Gmail SMTP is blocked by Railway

### Phone index error still happening?
➡️ Make sure you called `/api/test/fix-phone-index` endpoint

### SendGrid emails not sending?
➡️ Check API key is correct
➡️ Verify sender email in SendGrid dashboard

### Emails going to spam?
➡️ Add SPF/DKIM records (SendGrid will guide you)
➡️ Verify sender domain in SendGrid

---

## After Everything Works

**Remove the test endpoints** for security:

In `server/src/Routes/index.js`, comment out:
```javascript
// if (config.NODE_ENV !== "production") {
//     router.use("/test", testRoute);
// }
```

Or keep them for future debugging (they're already restricted to non-production).
