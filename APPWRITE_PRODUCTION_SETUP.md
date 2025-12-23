# Appwrite Production Setup Guide

Complete guide to configure Appwrite for your deployed Task Tracker app.

---

## 1. CORS Configuration

### Why CORS?
When your React app (on Vercel) calls Appwrite APIs, browsers need to allow cross-origin requests.

### Steps:

1. **Open Appwrite Console**
   - Go to your Appwrite instance
   - Login with your credentials

2. **Navigate to CORS Settings**
   - Click **Settings** → **CORS**

3. **Add Your Domain**
   - Click **Add Domain**
   - Enter: `https://task-tracker-2.vercel.app`
   - (If using custom domain, add that too: `https://mytasktracker.tk`)

4. **Save**
   - Click **Save Settings**

### Example CORS Entries:
```
https://task-tracker-2.vercel.app
https://mytasktracker.tk
https://localhost:5173  (for development)
```

---

## 2. OAuth2 Configuration (Google)

### Prerequisites:
- Google Cloud Project with OAuth credentials
- Client ID and Secret already generated

### Update Appwrite OAuth Settings:

1. **Go to Appwrite Console**
   - Click **Auth** → **OAuth2 Providers**

2. **Select Google**
   - Find Google OAuth provider
   - Click to edit

3. **Update Redirect URLs**
   - Success URL: `https://task-tracker-2.vercel.app/dashboard`
   - Failure URL: `https://task-tracker-2.vercel.app/login?error=oauth_failed`
   - (Update with your custom domain if used)

4. **Save**

### Update Google Cloud Console:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)

2. **Authorized JavaScript origins:**
   ```
   https://task-tracker-2.vercel.app
   https://mytasktracker.tk
   ```

3. **Authorized redirect URIs:**
   ```
   https://task-tracker-2.vercel.app/dashboard
   https://mytasktracker.tk/dashboard
   https://your-appwrite-instance.com/v1/account/sessions/oauth2/callback/google
   ```

4. **Save Changes**

---

## 3. Email Configuration (SMTP)

### Why?
For email verification and password recovery.

### Setup SMTP:

1. **Appwrite Console** → **Settings** → **SMTP**

2. **Configure Email Provider**

#### Option A: Gmail SMTP (Free)

1. Enable 2FA on Gmail account
2. Create App Password: https://myaccount.google.com/apppasswords
3. In Appwrite:
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 465 (TLS)
   SMTP Username: your-email@gmail.com
   SMTP Password: (use App Password, not regular password)
   From Email: noreply@yourdomain.com
   From Name: Task Tracker
   ```

#### Option B: SendGrid SMTP (Free tier: 100 emails/day)

1. Sign up at https://sendgrid.com
2. Get SMTP credentials
3. In Appwrite:
   ```
   SMTP Host: smtp.sendgrid.net
   SMTP Port: 587 (TLS)
   SMTP Username: apikey
   SMTP Password: (your SendGrid API key)
   From Email: noreply@yourdomain.com
   From Name: Task Tracker
   ```

#### Option C: Mailgun SMTP (Free tier: 100 emails/day)

1. Sign up at https://mailgun.com
2. Get SMTP credentials
3. In Appwrite:
   ```
   SMTP Host: smtp.mailgun.org
   SMTP Port: 587 (TLS)
   SMTP Username: postmaster@...
   SMTP Password: (your password)
   From Email: noreply@yourdomain.com
   From Name: Task Tracker
   ```

3. **Test Email**
   - Click "Send Test Email"
   - Enter your email
   - Check inbox

4. **Save**

---

## 4. Database Permissions (Important!)

### Verify Collection Permissions:

1. **Go to Database** → **Collections** → **tasks**

2. **Check Permissions:**
   - Make sure authenticated users can read/write
   - Or set specific role-based permissions

3. **For each field:**
   - Users should be able to create documents
   - Assign to their own user ID

---

## 5. User Email Verification

### Already Configured in Your App

Your `user.jsx` already handles:
- ✅ Sending verification email on first login
- ✅ Requiring email verification before access
- ✅ Blocking unverified users

### Test It:

1. Register new account
2. Check inbox for verification email from Appwrite
3. Click verification link
4. Verify email in UI
5. Try to login

---

## 6. API Keys (Optional)

### For IoT or Server Access:

1. **Settings** → **API Keys**
2. **Create Key**
3. Give it a name: `mobile-app` or `iot-device`
4. Select scopes needed
5. Copy API Key (save securely)

### Use in Code:
```javascript
const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);  // For API Key auth
```

---

## 7. Environment Variables

### In Your Vercel Deployment:

Go to **Vercel Dashboard** → **Project Settings** → **Environment Variables**

Add:
```
VITE_APPWRITE_ENDPOINT=https://your-appwrite-instance.com/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
```

### If using Appwrite Cloud:
```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_cloud_project_id
```

### Check Your Current Config:

**File: `src/lib/appwrite.js`**
```javascript
export const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
```

✅ This is correct! It uses environment variables.

---

## 8. Backups & Security

### Enable Backups:
- Appwrite Cloud: Automatic backups included
- Self-hosted: Configure backup schedule in settings

### Security Best Practices:
1. ✅ HTTPS enabled (Vercel handles this)
2. ✅ CORS restricted to your domains
3. ✅ API Keys secure (never commit to Git)
4. ✅ Email verification required
5. ✅ OAuth scopes limited

---

## 9. Monitoring & Logs

### Check Appwrite Logs:

1. **Appwrite Console** → **Settings** → **Logs**
2. View API requests
3. Check for errors
4. Monitor rate limits

### Check Vercel Logs:

1. **Vercel Dashboard** → **Deployments**
2. Click latest deployment
3. View build and runtime logs

---

## 10. Testing Checklist

- [ ] Register works
- [ ] Verification email arrives
- [ ] Email verification link works
- [ ] Can login with verified email
- [ ] Google OAuth works
- [ ] Can create tasks
- [ ] Can edit tasks
- [ ] Can delete tasks
- [ ] Real-time updates work
- [ ] Notifications work
- [ ] No CORS errors in console
- [ ] No 500 errors

---

## Troubleshooting

### CORS Error: "Access-Control-Allow-Origin"

**Solution:**
1. Check CORS is configured in Appwrite
2. Verify exact domain is added
3. Rebuild Vercel deployment
4. Clear browser cache

### Email Not Sending

**Check:**
1. SMTP configured correctly
2. From email is valid
3. Credentials are correct
4. No rate limiting

### OAuth Error

**Check:**
1. Redirect URLs match exactly
2. Client ID/Secret correct
3. Domain added to Google Cloud Console
4. CORS enabled in Appwrite

### "Project not found" Error

**Check:**
1. Project ID correct
2. Endpoint URL correct
3. Appwrite instance running
4. No typos in environment variables

---

## Production Checklist

- [ ] CORS configured with Vercel domain
- [ ] SMTP configured for emails
- [ ] OAuth redirect URLs updated
- [ ] Database permissions set correctly
- [ ] API Keys created (if needed)
- [ ] Environment variables in Vercel
- [ ] Backups enabled
- [ ] Logs monitored
- [ ] All features tested
- [ ] Ready for users!

---

## Support Resources

- **Appwrite Docs:** https://appwrite.io/docs
- **Appwrite Discord:** https://appwrite.io/discord
- **SMTP Providers:** 
  - Gmail: https://support.google.com/mail
  - SendGrid: https://sendgrid.com/docs
  - Mailgun: https://documentation.mailgun.com

---

## Next: Deploy & Share! 🚀

Your app is now fully configured and ready for production users!

1. Test thoroughly
2. Share URL with team
3. Monitor logs
4. Gather feedback
5. Iterate & improve

**Congrats on deploying! 🎉**
