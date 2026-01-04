# Google OAuth Setup Guide

## Problem Summary
Your Google OAuth is failing due to:
1. ✅ **FIXED**: CORS misconfiguration (now properly configured)
2. ⚠️ **ACTION REQUIRED**: Google OAuth client not configured for localhost
3. ⚠️ **ACTION REQUIRED**: Missing Google Client ID in environment

## Step-by-Step Fix

### 1. Configure Google Cloud Console

Go to [Google Cloud Console](https://console.cloud.google.com/)

#### A. Enable Google OAuth API
1. Select your project (or create a new one)
2. Go to **APIs & Services** → **OAuth consent screen**
3. Choose **External** user type
4. Fill in required fields:
   - App name: `PG Finder` (or your app name)
   - User support email: Your email
   - Developer contact: Your email
5. Click **Save and Continue**
6. Skip scopes (click **Save and Continue**)
7. Add test users if needed (your Gmail account)
8. Click **Save and Continue**

#### B. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Choose **Web application**
4. Name it: `PG Finder Web Client`
5. **Add Authorized JavaScript origins**:
   ```
   http://localhost:5173
   http://localhost:5174
   http://127.0.0.1:5173
   ```
6. **Add Authorized redirect URIs** (if needed later):
   ```
   http://localhost:5173
   http://localhost:5173/login
   ```
7. Click **Create**
8. **COPY YOUR CLIENT ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)

### 2. Update Environment Variables

#### Server (.env file in `/server` folder):
```env
# Add or update this line
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE

# Make sure you also have:
FRONTEND_URL=http://localhost:5173
```

#### Client (.env file in `/client` folder):
Create a `.env` file if it doesn't exist:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

**IMPORTANT**: Use the **SAME** Client ID for both server and client!

### 3. Restart Both Servers

After adding the environment variables:

```bash
# Terminal 1 - Stop and restart server
cd server
npm run dev

# Terminal 2 - Stop and restart client
cd client
npm run dev
```

### 4. Verify Setup

1. Open browser DevTools (F12)
2. Go to http://localhost:5173/login
3. Click on Google Sign In button
4. You should see Google's OAuth popup (no more 403 errors)

## Common Issues & Solutions

### Issue: "The given origin is not allowed"
- ✅ **Solution**: Make sure you added `http://localhost:5173` to **Authorized JavaScript origins** in Google Console
- Wait 5-10 minutes after adding origins for changes to propagate

### Issue: "No 'Access-Control-Allow-Origin' header"
- ✅ **Solution**: Already fixed in server CORS configuration
- Make sure server is restarted

### Issue: "Cross-Origin-Opener-Policy"
- ℹ️ **Note**: This is a warning, not an error. It won't block OAuth
- These warnings appear in console but shouldn't affect functionality

### Issue: Still getting 403
- Check that `VITE_GOOGLE_CLIENT_ID` in client `.env` matches the one in Google Console
- Verify the Client ID doesn't have extra spaces or quotes
- Clear browser cache and restart

## Testing Checklist

- [ ] Google Cloud Console OAuth consent screen configured
- [ ] Authorized JavaScript origins include `http://localhost:5173`
- [ ] Client ID copied from Google Console
- [ ] Server `.env` has `GOOGLE_CLIENT_ID`
- [ ] Client `.env` has `VITE_GOOGLE_CLIENT_ID`
- [ ] Both use the **same** Client ID
- [ ] Both servers restarted
- [ ] No CORS errors in browser console
- [ ] Google Sign In button appears
- [ ] Clicking button shows Google popup

## Need Help?

If you're still having issues:
1. Check browser console for specific error messages
2. Verify environment variables are loaded: `console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)` in client
3. Make sure you're using the correct Google account (one added as test user)
