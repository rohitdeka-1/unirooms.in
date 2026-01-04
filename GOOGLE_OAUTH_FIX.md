# Google OAuth Origin Error - Quick Fix

## The Error
```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
Failed to load resource: the server responded with a status of 403
```

## Your Google Client ID
```
1094535447252-1tbclnb8gu84ph2j1uc348ptk3c1fv7j.apps.googleusercontent.com
```

## Fix Steps (5 minutes)

### 1. Go to Google Cloud Console
🔗 **Direct Link**: https://console.cloud.google.com/apis/credentials

### 2. Find Your OAuth Client
- Look for: `1094535447252-1tbclnb8gu84ph2j1uc348ptk3c1fv7j`
- Click the **pencil icon (✏️)** to edit it

### 3. Add Authorized JavaScript Origins
In the **"Authorized JavaScript origins"** section, click **"+ ADD URI"** and add:

```
http://localhost:5173
```

**Also add these for better compatibility:**
```
http://127.0.0.1:5173
http://localhost:5174
```

### 4. Save
- Click **"SAVE"** at the bottom
- ⏰ **Wait 5-10 minutes** for changes to propagate

### 5. Test
- Clear browser cache (Ctrl+Shift+Delete)
- Go to http://localhost:5173/login
- Click "Sign in with Google"
- Should work now! ✅

## Visual Guide

When editing the OAuth client, you should see:

```
Authorized JavaScript origins
━━━━━━━━━━━━━━━━━━━━━━━━━━━
URI 1    http://localhost:5173        [Remove]
         + ADD URI

Authorized redirect URIs
━━━━━━━━━━━━━━━━━━━━━━━━━━━
(Leave this empty or add if needed)
```

## Still Not Working?

1. **Check Client ID matches** in both:
   - Server: `/server/.env` → `GOOGLE_CLIENT_ID`
   - Client: `/client/.env` → `VITE_GOOGLE_CLIENT_ID`

2. **Clear everything and restart**:
   ```bash
   # Stop all servers (Ctrl+C)
   # Clear browser cache
   # Start server
   cd server && npm run dev
   
   # In new terminal, start client
   cd client && npm run dev
   ```

3. **Wait longer**: Google's cache can take up to 10 minutes

---

## ✅ What I've Already Fixed

1. ✅ CORS configuration (allows localhost:5173)
2. ✅ Phone validation for Google OAuth users
3. ✅ API routes working correctly
4. ✅ Environment variables configured

**Only thing left**: Add origin in Google Cloud Console! 🎯
