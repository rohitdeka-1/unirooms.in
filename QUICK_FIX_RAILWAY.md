# Quick Fix for Railway Production

## 🚨 Two Issues to Fix:

### 1. Google OAuth Phone Error
### 2. Email Timeout Error

---

## ⚡ Quick Fix Steps (5 minutes)

### Step 1: Deploy Current Changes

```bash
cd /home/rhd/Desktop/Resume_Projects/PG_College
git add .
git commit -m "Fix production email and phone index issues"
git push
```

Wait for Railway to deploy (~2 minutes)

### Step 2: Fix Phone Index (Run Once)

Open in browser or use curl:

```
https://your-app.railway.app/api/test/fix-phone-index
```

**You should see:**
```json
{"success": true, "message": "Created new sparse unique index."}
```

✅ **Google OAuth signup now works!**

### Step 3: Fix Email Timeout

**The Problem:** Railway blocks Gmail SMTP (port 587)

**The Solution:** Use SendGrid (free, 100 emails/day)

**Steps:**

1. **Sign up:** https://signup.sendgrid.com/
2. **Create API Key:**
   - Dashboard → Settings → API Keys
   - Click "Create API Key"
   - Name: "Railway Production"
   - Full Access
   - Copy the key: `SG.xxxxxxxxx`

3. **Add to Railway:**
   - Go to your Railway project
   - Click on your service
   - Go to "Variables" tab
   - Add:
     ```
     USE_SENDGRID=true
     SENDGRID_API_KEY=SG.your_actual_key_here
     EMAIL_FROM=unirooms.in@gmail.com
     ```
   - Click "Deploy" (Railway auto-redeploys)

4. **Install SendGrid package:**
   ```bash
   cd server
   npm install @sendgrid/mail
   git add package.json package-lock.json
   git commit -m "Add SendGrid for production emails"
   git push
   ```

✅ **Emails now work in production!**

---

## 🧪 Test Everything

### Test 1: Google OAuth Signup
- Go to https://unirooms.in
- Click "Sign up with Google"
- ✅ Should work without phone index error

### Test 2: Email Sending
```bash
curl -X POST https://your-app.railway.app/api/test/send-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com", "type": "login"}'
```
✅ Should receive email

---

## ❓ If Still Not Working

### Gmail Timeout Still Happening?
➡️ Make sure `USE_SENDGRID=true` is set in Railway
➡️ Verify SendGrid API key is correct
➡️ Check Railway logs for "SendGrid email service is ready"

### Phone Index Error Still Happening?
➡️ Make sure you called `/api/test/fix-phone-index`
➡️ Check response shows `"success": true`

### SendGrid Not Working?
➡️ Verify API key in SendGrid dashboard
➡️ Check SendGrid has "Full Access" permission
➡️ Verify sender email in SendGrid

---

## ✅ Success Indicators

### In Railway Logs:
```
✅ MongoDB Connected
✅ SendGrid email service is ready
📧 Sending from: unirooms.in@gmail.com
```

### When Testing:
- Google OAuth signup works ✅
- Verification emails arrive ✅
- Login notification emails arrive ✅

---

## 📝 Summary

1. **Deploy code** ← Current changes include fixes
2. **Fix phone index** ← Call `/api/test/fix-phone-index` once
3. **Setup SendGrid** ← Add API key to Railway
4. **Install package** ← `npm install @sendgrid/mail`
5. **Test** ← Try Google signup and emails

**Total time: ~5 minutes**

---

## 🔧 Environment Variables Needed in Railway

```bash
# Database
MONGO_URI=mongodb+srv://...

# JWT
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Frontend
FRONTEND_URL=https://unirooms.in

# Email (SendGrid - Recommended)
USE_SENDGRID=true
SENDGRID_API_KEY=SG.your_key_here
EMAIL_FROM=unirooms.in@gmail.com
EMAIL_FROM_NAME=UniRooms

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Redis (if using)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

---

Need help? Check the detailed guide: `RAILWAY_PRODUCTION_FIX.md`
