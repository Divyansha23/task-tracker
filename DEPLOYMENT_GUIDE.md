# Task Tracker - Deployment Guide

## Quick Deployment Options

### Option 1: Vercel (RECOMMENDED) ⭐

**Best for:** React apps, automatic deployments, free HTTPS

#### Prerequisites:
- GitHub account (free)
- Vercel account (free)

#### Steps:

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git
   git branch -M main
   git push -u origin main
   ```

2. **Sign up at [vercel.com](https://vercel.com)**
   - Click "Sign up"
   - Choose "Continue with GitHub"

3. **Import your repository**
   - Click "New Project"
   - Select your `task-tracker` repository
   - Vercel auto-detects Vite settings
   - Click "Deploy"

4. **Configure Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add your Appwrite configuration:
     ```
     VITE_APPWRITE_ENDPOINT=https://your-appwrite-instance.com/v1
     VITE_APPWRITE_PROJECT_ID=your_project_id
     VITE_APPWRITE_API_KEY=your_api_key (if needed)
     ```

5. **Your app is live!**
   - Free domain: `task-tracker.vercel.app`
   - Auto-deploys on every push to main
   - Free HTTPS certificate

#### Optional: Connect Custom Domain
- Buy domain from: Namecheap, GoDaddy, etc.
- In Vercel: Settings → Domains → Add your domain
- Follow DNS setup instructions

---

### Option 2: Netlify

**Similar to Vercel, equally good**

#### Steps:

1. **Push to GitHub** (same as above)

2. **Sign up at [netlify.com](https://netlify.com)**
   - Click "Sign up with GitHub"

3. **New site from Git**
   - Select your repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

4. **Your app is live!**
   - Free domain: `your-app-name.netlify.app`

---

### Option 3: Get a Free Custom Domain

#### Using Freenom (Free Domains)

⚠️ **Note:** Freenom domains (`.tk`, `.ml`, `.ga`) work but have lower reputation. Better to use paid domains.

1. **Visit [freenom.com](https://freenom.com)**
2. Search for domain name
3. Register (completely free)
4. In Vercel/Netlify settings, add as custom domain
5. Update Freenom nameservers to point to Vercel/Netlify

#### Or Buy Cheap Domains
- Namecheap: `.com` from ~$0.99/year
- GoDaddy: `.com` from ~$1-2/year
- Both integrate with Vercel easily

---

## Important Configuration Before Deploying

### 1. Update Appwrite CORS Settings

Your Appwrite instance needs to allow requests from your deployed domain:

```
In Appwrite Console:
Settings → Domains
Add: https://task-tracker.vercel.app
```

### 2. Update OAuth2 Redirect URLs

If using Google OAuth:

```
Google Cloud Console:
- Authorized redirect URIs:
  - https://task-tracker.vercel.app/dashboard
  - https://task-tracker.vercel.app/login
```

### 3. Check Environment Variables

Make sure your `.env.local` or build configuration includes:
- `VITE_APPWRITE_ENDPOINT`
- `VITE_APPWRITE_PROJECT_ID`

---

## Build Before Deploying

Test your production build locally:

```bash
npm run build
npm run preview
```

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel/Netlify connected
- [ ] Environment variables set in deployment platform
- [ ] Appwrite CORS updated with new domain
- [ ] Google OAuth redirect URLs updated
- [ ] Build completes successfully
- [ ] App works on deployed domain

---

## After Deployment

### Monitor your app:
- Vercel: Analytics dashboard (built-in)
- Netlify: Analytics in site settings

### Enable auto-deployments:
- Already enabled by default
- Deploy on every push to `main` branch

### Troubleshooting:

**App won't load:**
- Check browser console for errors
- Verify Appwrite CORS settings
- Check environment variables in deployment settings

**Backend not working:**
- Verify Appwrite endpoint in env variables
- Check Appwrite is accessible from your domain
- Check firewall/CORS settings

**OAuth not working:**
- Update redirect URLs in Google Cloud
- Verify OAuth credentials in Appwrite

---

## FREE DOMAIN + APPWRITE SETUP

### Option A: Vercel Free Subdomain (Easiest) ⭐

Your app gets a **free domain** automatically:
```
https://task-tracker-2.vercel.app
```

**No additional steps needed!** Just deploy and you have a working domain.

### Option B: Free Domain from Freenom + Vercel

**Get a free domain:**
1. Go to [freenom.com](https://freenom.com)
2. Search for your domain name
3. Choose `.tk`, `.ml`, `.ga`, or `.cf` extension
4. Click "Get it now"
5. Complete checkout (FREE for 1 year)
6. Renew yearly to keep it free

**Connect to Vercel:**
1. In Vercel dashboard → Project → Settings → Domains
2. Add your Freenom domain (e.g., `mytasktracker.tk`)
3. Add the DNS records Vercel provides to Freenom
4. In Freenom → Domain → Management Tools → Nameservers
5. Set to Vercel's nameservers or add A records
6. Wait 24-48 hours for DNS to propagate
7. Access at `https://mytasktracker.tk`

### Option C: Using Appwrite Cloud Hosting

Appwrite Cloud also provides hosting and domains:

1. **Sign up:** [appwrite.io/cloud](https://appwrite.io/cloud)
2. **Create project** on Appwrite Cloud
3. **Deploy React app** as Cloud Function or static files
4. **Get domain:** `your-project.appwrite.io`
5. **Update your app** to use cloud Appwrite endpoint

---

## APPWRITE CONFIGURATION FOR PRODUCTION

### 1. Update Appwrite CORS Settings

In **Appwrite Console → Settings → CORS:**

Add your domain:
```
https://task-tracker-2.vercel.app
https://mytasktracker.tk
https://your-custom-domain.com
```

### 2. Update OAuth Redirect URLs

In **Appwrite Console → Auth → OAuth2 Providers → Google:**

Update URLs:
- Success: `https://task-tracker-2.vercel.app/dashboard`
- Failure: `https://task-tracker-2.vercel.app/login?error=oauth_failed`

### 3. Configure Email Sending

In **Appwrite Console → Settings → SMTP:**

Set up email for verification and recovery:
- SMTP Server: Your email provider (Gmail, SendGrid, etc.)
- From Email: noreply@your-domain.com
- Test email sending

### 4. Update Environment Variables

In **Vercel → Project Settings → Environment Variables:**

```
VITE_APPWRITE_ENDPOINT=https://your-appwrite-instance.com/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
```

Or use Appwrite Cloud:
```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_appwrite_cloud_id
```

---

## COMPLETE DEPLOYMENT STEPS

### Step 1: Prepare Your Code
```bash
cd /Users/divyanshadubey/task-tracker-2
npm run build  # Test build locally
```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select `task-tracker-2` repo
5. Click "Deploy"
6. Wait for deployment to complete
7. Click "Visit" to see your live app

### Step 4: Configure Appwrite
1. Update CORS settings
2. Update OAuth URLs
3. Configure SMTP for emails
4. Test login/register/email verification

### Step 5: (Optional) Add Custom Domain
1. In Vercel → Domains → Add
2. Paste your Freenom domain
3. Update DNS settings in Freenom
4. Wait for propagation

---

## VERIFICATION CHECKLIST

- [ ] App accessible at Vercel domain
- [ ] Can access Appwrite from deployed domain
- [ ] Registration works
- [ ] Email verification emails send
- [ ] Login works with verified email
- [ ] Google OAuth login works
- [ ] Can create/edit/delete tasks
- [ ] Real-time notifications work
- [ ] Custom domain working (if added)
- [ ] HTTPS certificate active

---

## APPWRITE + VERCEL INTEGRATION SUMMARY

```
┌─────────────────────────────────────────────────┐
│              Your Task Tracker App              │
│     Deployed on Vercel (React Frontend)         │
│      Domain: task-tracker-2.vercel.app          │
│              (or custom domain)                 │
└────────────────┬────────────────────────────────┘
                 │ HTTPS API Calls
                 ↓
┌─────────────────────────────────────────────────┐
│          Appwrite Backend (Database)            │
│   - User Authentication & Email Verification   │
│   - Task Database & Real-time Updates          │
│   - Google OAuth Integration                   │
│   - File Storage & Cloud Functions             │
└─────────────────────────────────────────────────┘
```

---

## IMPORTANT: Update OAuth in Google Cloud Console

After deployment, update your OAuth URLs in Google Cloud:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Select your project
3. Go to APIs & Services → Credentials
4. Click your OAuth 2.0 Client ID
5. Update Authorized JavaScript origins:
   ```
   https://task-tracker-2.vercel.app
   https://mytasktracker.tk
   ```
6. Update Authorized redirect URIs:
   ```
   https://task-tracker-2.vercel.app/dashboard
   https://mytasktracker.tk/dashboard
   ```
7. Save changes

---

## FREE HOSTING STACK SUMMARY

✅ **Frontend Hosting:** Vercel (Free)
✅ **Backend/Database:** Appwrite (Free tier available)
✅ **Domain:** Freenom or Vercel's `.vercel.app`
✅ **SSL/HTTPS:** Free (included)
✅ **Email:** Appwrite SMTP (free with your email account)
✅ **OAuth:** Google (free)

**Total Monthly Cost: $0**

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Appwrite Docs: https://appwrite.io/docs
- Freenom Support: https://freenom.com/en/faq.html
