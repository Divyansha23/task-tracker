# Appwrite Configuration for Production

Complete checklist and configuration steps for deploying on Appwrite.

---

## Pre-Deployment Checklist

### Code Preparation
- [ ] All features tested locally
- [ ] No console errors
- [ ] Build completes: `npm run build`
- [ ] Git code committed (optional but recommended)

### Environment Setup
- [ ] Node.js installed
- [ ] npm updated
- [ ] Appwrite CLI installed: `npm install -g appwrite`
- [ ] GitHub account (for OAuth testing, optional)

---

## Appwrite Cloud Setup

### 1. Create Account

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Click "Sign Up"
3. Create account with:
   - Email and password, OR
   - GitHub account, OR
   - Google account

### 2. Create Project

1. Click "Create Project"
2. Enter name: `Task Tracker`
3. Select region closest to you
4. Click "Create"

### 3. Get Project Credentials

In **Project Overview:**
- Copy your **Project ID**
- Copy your **API Endpoint**: `https://cloud.appwrite.io/v1`
- Create **API Key** (Settings → API Keys → Create API Key)
  - Permissions: Select all for development
  - Copy the key

**Save these safely!**

---

## Configure Authentication

### Email/Password Auth

1. Go to **Auth** tab
2. Under "Auth Methods" → **Email/Password**
3. Toggle ON ✅
4. Keep defaults or adjust:
   - Allow user registration: ON
   - User email verification: ON (required for your app)
   - Force password verification: ON

### Email Verification Setup

1. In **Auth** → **Email Templates**
2. Edit "Email Verification" template
3. Set verification link to:
   ```
   {REDIRECT_LINK}?userId={userId}&secret={secret}
   ```
4. Your app's email verification page will handle `userId` and `secret` params

### Password Recovery

1. In **Auth** → **Email Templates**
2. Edit "Password Recovery" template
3. This is already set up for your password recovery feature

---

## Setup SMTP Email Sending

**Critical for email verification!**

### Option A: Use Gmail (Easiest)

1. Go to **Settings** → **SMTP**
2. Enable SMTP
3. Configure:
   - **From Email:** `noreply@yourdomain.com` or your Gmail address
   - **From Name:** `Task Tracker`
   - **Host:** `smtp.gmail.com`
   - **Port:** `587`
   - **Username:** Your Gmail address
   - **Password:** Your Gmail app password (not regular password)
   
4. To get Gmail app password:
   - Enable 2FA on Google Account
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Generate app password for "Mail"
   - Copy 16-character password
   - Use that in SMTP settings

5. Click "Test Email"

### Option B: Use SendGrid (Free tier)

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Verify sender email
3. Get API key
4. In Appwrite Settings → SMTP:
   - Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: Your SendGrid API key

### Option C: Use Mailgun

1. Create account at [mailgun.com](https://mailgun.com)
2. Get SMTP credentials
3. Configure in Appwrite SMTP settings

---

## Setup OAuth2 (Google Login)

### Step 1: Google Cloud Console Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project or select existing
3. Search "OAuth consent screen"
4. Click **OAuth consent screen**
5. Choose "External" app type
6. Click "Create"
7. Fill required fields:
   - App name: `Task Tracker`
   - User support email: Your email
   - Developer contact: Your email
8. Click "Save and Continue"

### Step 2: Create OAuth Credentials

1. Go to **Credentials**
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `Task Tracker Appwrite`
5. Under "Authorized JavaScript origins" add:
   ```
   https://cloud.appwrite.io
   https://yourdomain.com (if using custom domain)
   http://localhost:3000 (for local testing)
   ```
6. Under "Authorized redirect URIs" add:
   ```
   https://cloud.appwrite.io/v1/auth/oauth2/callback
   https://yourdomain.com/dashboard (if using custom domain)
   ```
7. Click "Create"
8. Copy your **Client ID** and **Client Secret**

### Step 3: Configure in Appwrite

1. In Appwrite Console → **Auth** → **OAuth2 Providers**
2. Click **Google**
3. Enter:
   - **Client ID:** From Google Cloud Console
   - **Client Secret:** From Google Cloud Console
4. Click "Update"

---

## Configure CORS

**Important for frontend to communicate with Appwrite!**

1. In Appwrite Console → **Settings** → **CORS**
2. Add origins:
   ```
   https://cloud.appwrite.io
   https://yourdomain.com
   https://yourdomain.com:*
   https://*.yourdomain.com
   http://localhost:* (for local testing)
   ```
3. Save

---

## Configure Domains

If using custom domain:

1. Go to **Settings** → **Domains**
2. Click "Add Domain"
3. Enter your domain: `yourdomain.com`
4. Follow DNS setup instructions:
   - Add CNAME record pointing to Appwrite's server
   - Or update nameservers to Appwrite's nameservers
5. Wait 24-48 hours for DNS propagation
6. Appwrite will automatically provision SSL certificate

---

## Application Configuration

### Update Environment Variables

In your app (`src/lib/appwrite.js`), ensure:

```javascript
export const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite Cloud endpoint
  .setProject('your-project-id-here');           // Your Project ID
```

### For Local Development

Create `.env.local`:
```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
```

### For Production

Same as above, but Vercel/Netlify would load from deployment settings.
Since you're using Appwrite hosting, config stays the same.

---

## Pre-Deployment Testing

### 1. Test Locally

```bash
npm run dev
```

- Register with email
- Verify email (check your email inbox)
- Login
- Create task
- Test Google OAuth
- Test real-time updates

### 2. Build for Production

```bash
npm run build
ls dist/  # Verify build output exists
```

### 3. Test Production Build Locally

```bash
npm run preview
```

Test all features again.

---

## Deployment

### Using Appwrite CLI

```bash
# Install CLI
npm install -g appwrite

# Login
appwrite login
# Follow prompts to authenticate

# Deploy
appwrite deploy --all

# Or deploy specific files
appwrite deploy bucket --source dist --target task-tracker
```

### Manual Upload via Console

1. Appwrite Console → **Storage** → **Buckets**
2. Create bucket `react-app`
3. Configure:
   - **Enable public access**: ON
   - **Maximum file size**: 100MB
4. Upload all files from `dist/` folder
5. Get public URL for accessing app

---

## Post-Deployment Verification

### 1. Access Your App

At Appwrite Cloud domain or custom domain

### 2. Test Core Features

- [ ] Page loads without errors
- [ ] Can register (receives verification email)
- [ ] Can verify email
- [ ] Can login
- [ ] Can create task
- [ ] Can edit task
- [ ] Can delete task
- [ ] Real-time updates work
- [ ] Google OAuth login works
- [ ] Logout works

### 3. Check Browser Console

- No JavaScript errors
- No CORS errors
- All API calls successful

### 4. Check Email Delivery

- Verification email arrives
- Email looks professional
- Links in email work

---

## Common Issues & Solutions

### Issue: "CORS error"

**Solution:**
1. Check Appwrite CORS settings
2. Add your domain to CORS origins
3. Verify API endpoint is correct

### Issue: "Email not sending"

**Solution:**
1. Verify SMTP is enabled and configured
2. Test SMTP with test email button
3. Check email provider (Gmail, SendGrid)
4. Check "From" email is verified

### Issue: "OAuth not working"

**Solution:**
1. Verify redirect URIs in Google Cloud Console
2. Check Client ID and Secret in Appwrite
3. Ensure OAuth is enabled in Auth settings

### Issue: "App loads but shows blank page"

**Solution:**
1. Check browser console for errors
2. Verify all assets in `dist/` loaded
3. Check Appwrite endpoint is correct
4. Verify Project ID matches

### Issue: "Real-time updates not working"

**Solution:**
1. Check Appwrite real-time is enabled
2. Verify subscription is correct in code
3. Check Network tab in browser DevTools

---

## Security Checklist

- [ ] API key not exposed in frontend code
- [ ] Appwrite endpoint is HTTPS
- [ ] CORS origins are specific (not `*`)
- [ ] OAuth credentials stored securely
- [ ] Email verification enabled
- [ ] Password recovery enabled
- [ ] User permissions configured
- [ ] Database rules set (if needed)

---

## Monitoring & Maintenance

### Monitor Performance

1. Appwrite Console → **Logs**
2. Check for errors
3. Monitor API usage

### Backup Data

1. Appwrite Console → **Backups**
2. Schedule regular backups
3. Download backups if needed

### Update Appwrite

Appwrite Cloud automatically updates.
If self-hosted, keep Docker images updated.

---

## Support Resources

- **Appwrite Docs:** https://appwrite.io/docs
- **Appwrite Community:** https://discord.gg/appwrite
- **GitHub Issues:** https://github.com/appwrite/appwrite
- **Your App Repo:** Document your setup

---

## Configuration Summary

```
PROJECT SETUP:
✅ Project created on Appwrite Cloud
✅ Project ID: [saved]
✅ API Endpoint: https://cloud.appwrite.io/v1

AUTHENTICATION:
✅ Email/Password enabled
✅ Email verification enabled
✅ SMTP configured for email sending
✅ Google OAuth configured

DEPLOYMENT:
✅ Code built (npm run build)
✅ dist/ folder ready
✅ Deployed to Appwrite
✅ Custom domain configured (optional)

VERIFICATION:
✅ App accessible
✅ All features working
✅ Real-time updates working
✅ Emails sending

LIVE:
🚀 Your app is live!
```

---

## Next Steps

1. ✅ Create Appwrite Cloud account
2. ✅ Configure all above settings
3. ✅ Build your app: `npm run build`
4. ✅ Deploy: `appwrite deploy --all`
5. ✅ Test thoroughly
6. ✅ Add custom domain (optional)
7. ✅ Monitor and maintain

**You're done! Your app is live on Appwrite!** 🎉
