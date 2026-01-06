# Fix Email Issues in Production (Render)

## Problem
Emails work locally but not in production because environment variables are not set on Render.

## Solution

### Step 1: Set Environment Variables on Render

1. **Go to Render Dashboard:** https://dashboard.render.com/
2. **Select your service** (e.g., `pgcollege-api`)
3. **Click on "Environment"** in the left sidebar
4. **Add the following environment variables:**

```
GMAIL_USER=unirooms.in@gmail.com
GMAIL_APP_PASSWORD=dlzgxitvlypkjhqx
EMAIL_FROM_NAME=UniRooms
```

**IMPORTANT:** 
- The `GMAIL_APP_PASSWORD` must be **without spaces** (use `dlzgxitvlypkjhqx` not `dlzg xitv lypk jhqx`)
- Make sure you're using a Gmail App Password, not your regular Gmail password
- If you don't have an App Password, follow Step 2 below

5. **Click "Save Changes"**
6. Render will automatically redeploy your service

### Step 2: Generate Gmail App Password (if needed)

If you need to create a new App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Enable **2-Step Verification** if not already enabled
4. Search for "App passwords" or go to: https://myaccount.google.com/apppasswords
5. Click "Generate" and select:
   - **App:** Mail
   - **Device:** Other (Custom name) - Type "Render Production"
6. Google will generate a 16-character password like: `abcd efgh ijkl mnop`
7. **Remove the spaces:** `abcdefghijklmnop`
8. Use this password for `GMAIL_APP_PASSWORD` in Render

### Step 3: Verify Deployment

After Render redeploys:

1. **Check the deployment logs** on Render
2. Look for these messages:
   - ✅ `Email service is ready to send emails`
   - ✅ `Sending from: unirooms.in@gmail.com`
3. **If you see errors:**
   - ❌ `EMAIL CONFIGURATION ERROR` - Environment variables not set
   - ❌ `Email service connection failed` - Wrong credentials or App Password issue

### Step 4: Test Email in Production

Use your production API to test:

```bash
# Register a test user
curl -X POST https://your-app.onrender.com/api/auth/register/student \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-test-email@gmail.com",
    "phone": "1234567890",
    "password": "Test@123"
  }'
```

You should receive a verification email at the provided email address.

## Common Issues & Solutions

### Issue 1: "Invalid login" error
**Cause:** App Password is incorrect or has spaces
**Fix:** 
- Regenerate App Password
- Ensure no spaces in the password
- Copy-paste the password directly into Render

### Issue 2: "Less secure app access" error
**Cause:** Trying to use regular password instead of App Password
**Fix:** Generate and use an App Password (see Step 2)

### Issue 3: Emails go to spam
**Cause:** Gmail's spam filters
**Fix:** 
- Add unirooms.in@gmail.com to your contacts
- Check spam folder
- Mark as "Not Spam"

### Issue 4: Rate limiting
**Cause:** Sending too many emails too quickly
**Fix:** 
- Gmail free accounts limit: ~500 emails/day
- Add delays between bulk emails
- Consider upgrading to Google Workspace

## Alternative: Using SMTP Environment Variables

If you prefer to use generic SMTP variable names, the code now supports fallbacks:

```
EMAIL_USER=unirooms.in@gmail.com
EMAIL_PASSWORD=dlzgxitvlypkjhqx
```

or

```
SMTP_USER=unirooms.in@gmail.com
SMTP_PASS=dlzgxitvlypkjhqx
```

The application will automatically use these if `GMAIL_USER` and `GMAIL_APP_PASSWORD` are not set.

## Verify Local Changes

Before deploying, test locally:

```bash
cd server
npm start
```

Check the startup logs for:
- ✅ `Email service is ready to send emails`
- ✅ `Sending from: unirooms.in@gmail.com`

## Deploy to Production

```bash
git add .
git commit -m "Fix email configuration for production"
git push origin main
```

Render will automatically deploy your changes.

## Need Help?

If emails still don't work:
1. Check Render logs for specific error messages
2. Verify App Password is correct (try regenerating)
3. Ensure 2-Step Verification is enabled on Gmail
4. Test with a different email service (SendGrid, Mailgun, etc.)
