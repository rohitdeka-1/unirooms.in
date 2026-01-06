# Backend Migration: Railway → Heroku

## ✅ Completed

Your backend has been successfully deployed to Heroku!

### New Backend URL:
```
https://unirooms-api-2026-be019c91a062.herokuapp.com
```

### What Was Updated:

1. **Client Environment Files:**
   - `/client/.env` - Updated API URL
   - `/client/.env.production` - Updated API URL
   
2. **Client Source Code:**
   - `/client/src/utils/api.js` - Updated fallback API URL

3. **Documentation:**
   - `/DEPLOYMENT_GUIDE.md` - Updated backend references

### Next Steps:

#### 1. Fix Phone Index (Run Once):
```bash
curl https://unirooms-api-2026-be019c91a062.herokuapp.com/api/test/fix-phone-index
```

#### 2. Test Backend:
```bash
# Test health endpoint
curl https://unirooms-api-2026-be019c91a062.herokuapp.com/api/v1/properties?limit=1

# Test email
curl -X POST https://unirooms-api-2026-be019c91a062.herokuapp.com/api/test/send-email \
  -H "Content-Type: application/json" \
  -d '{"email": "alkardorhd@gmail.com", "type": "login"}'
```

#### 3. Deploy Frontend (Vercel):

Update environment variable in Vercel:
- Go to https://vercel.com/your-project/settings/environment-variables
- Update `VITE_API_URL` to: `https://unirooms-api-2026-be019c91a062.herokuapp.com/api/v1`
- Redeploy frontend

Or push to GitHub (auto-deploys on Vercel):
```bash
cd /home/rhd/Desktop/Resume_Projects/PG_College
git add .
git commit -m "Update backend URL to Heroku"
git push origin main
```

#### 4. Update Google OAuth Redirect URIs:

Go to Google Cloud Console:
- https://console.cloud.google.com/
- APIs & Services → Credentials
- Edit OAuth 2.0 Client ID
- Add authorized redirect URI:
  ```
  https://unirooms-api-2026-be019c91a062.herokuapp.com/api/auth/google/callback
  ```

### Heroku Management Commands:

```bash
# View logs
heroku logs --tail -a unirooms-api-2026

# Restart app
heroku restart -a unirooms-api-2026

# Run commands
heroku run node src/scripts/fix-phone-index.js -a unirooms-api-2026

# Open app
heroku open -a unirooms-api-2026

# View config
heroku config -a unirooms-api-2026

# Set config
heroku config:set KEY=VALUE -a unirooms-api-2026
```

### Environment Variables Set on Heroku:

✅ MONGO_URI
✅ JWT_ACCESS_SECRET
✅ JWT_REFRESH_SECRET
✅ GMAIL_USER
✅ GMAIL_APP_PASSWORD
✅ FRONTEND_URL (https://unirooms.in)
✅ GOOGLE_CLIENT_ID
✅ CLOUDINARY credentials
✅ NODE_ENV=production

### Important Notes:

- **Heroku sleeps after 30 min of inactivity** (free tier)
- First request after sleep takes ~10-30 seconds to wake up
- Use UptimeRobot or Cron-job.org to keep it awake
- Gmail SMTP works on Heroku (unlike Railway!)
- MongoDB Atlas must allow connections from `0.0.0.0/0`

### Verification Checklist:

- [ ] Backend URL updated in all client files
- [ ] Phone index fixed (run the curl command)
- [ ] Frontend redeployed with new backend URL
- [ ] Google OAuth redirect URIs updated
- [ ] Test Google signup/login
- [ ] Test email sending
- [ ] Test property listing
- [ ] Test saved properties

## Migration Complete! 🎉

Your backend is now running on Heroku instead of Railway.
