# Deploy to Appwrite Sites - Complete Guide

Host your Task Tracker on **Appwrite Sites** - the easiest way to deploy your React app.

---

## What is Appwrite Sites?

Appwrite Sites is a **static hosting service** built into Appwrite Cloud that lets you:

✅ Deploy your React app with one command
✅ Get automatic HTTPS/SSL
✅ Access via free `*.appwrite.io` domain
✅ Add custom domains
✅ Deploy from GitHub (automatic)
✅ No additional cost (included in free tier)

---

## Prerequisites

1. **Appwrite Cloud Account** → [cloud.appwrite.io](https://cloud.appwrite.io)
2. **Appwrite CLI** → `npm install -g appwrite`
3. **Built React app** → `npm run build` (creates `dist/` folder)
4. **GitHub account** (optional, for automatic deployments)

---

## Method 1: Deploy Using Appwrite CLI (Fastest) ⚡

### Step 1: Build Your App

```bash
cd /Users/divyanshadubey/task-tracker-2
npm run build
```

### Step 2: Install & Login to Appwrite CLI

```bash
# Install Appwrite CLI (if not already installed)
npm install -g appwrite

# Login to Appwrite
appwrite login
```

When prompted:
- Enter your Appwrite Cloud email/password
- Select your project
- Choose your region

### Step 3: Deploy to Appwrite Sites

```bash
# Deploy your built app to Appwrite Sites
appwrite deploy web
```

Or deploy specific folder:

```bash
# Deploy the dist folder to Sites
appwrite deploy web --source dist
```

### Step 4: Get Your Domain

After deployment, you'll get:

```
✅ Your Site is live!
🌐 Domain: https://yourproject.appwrite.io
```

**Done!** Your app is live! 🎉

---

## Method 2: Deploy via GitHub (Automatic) 🔄

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git
git branch -M main
git push -u origin main
```

### Step 2: Connect GitHub in Appwrite Console

1. Go to **Appwrite Console** → **Sites**
2. Click **"Create Site"** or **"+ New Site"**
3. Select **"GitHub"** as source
4. Authorize Appwrite with GitHub
5. Select your `task-tracker` repository
6. Configure:
   - **Branch:** `main`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
7. Click **"Deploy"**

### Step 3: Automatic Deployments

Every push to `main` branch automatically:
- Builds your app
- Deploys to Appwrite Sites
- Updates your live site

**That's it!** Just push code and it deploys automatically! 🚀

---

## Method 3: Deploy via Web Console

### Step 1: Build Your App

```bash
npm run build
```

### Step 2: Upload to Appwrite Console

1. Go to **Appwrite Console** → **Sites**
2. Click **"Create Site"**
3. Choose **"Upload files"**
4. Drag & drop your `dist/` folder
5. Click **"Upload"**

### Step 3: Configure

- Site name: `task-tracker`
- Domain: Auto-generated

Your site is live! 🎉

---

## Your Deployed Site

### Access Points

**Free Appwrite Domain:**
```
https://task-tracker.appwrite.io
```

**Custom Domain (Optional):**
```
https://yourdomain.com
```

Both work perfectly!

---

## Configure Your App for Appwrite Sites

### 1. Check Appwrite Configuration

Your app needs to know about your Appwrite instance.

In `src/lib/appwrite.js`:

```javascript
import { Client } from 'appwrite';

export const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite Cloud endpoint
  .setProject('YOUR_PROJECT_ID');                // Your Project ID
```

### 2. Set Environment Variables

Create `.env.production`:

```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
```

### 3. Update in Code

Ensure `vite.config.js` includes environment variables:

```javascript
export default {
  // ... other config
  define: {
    'process.env': JSON.stringify(import.meta.env)
  }
}
```

---

## Post-Deployment Configuration

### 1. Update CORS Origins

In **Appwrite Console → Settings → CORS**, add:

```
https://task-tracker.appwrite.io
https://yourdomain.com (if using custom)
```

### 2. Update OAuth Redirect URLs

In **Google Cloud Console → OAuth**, update:

```
Authorized JavaScript origins:
https://task-tracker.appwrite.io
https://yourdomain.com

Authorized redirect URIs:
https://task-tracker.appwrite.io/dashboard
https://yourdomain.com/dashboard
```

### 3. Configure SMTP for Emails

In **Appwrite Console → Settings → SMTP**:

- **Host:** `smtp.gmail.com`
- **Port:** `587`
- **Username:** Your Gmail address
- **Password:** Gmail app password
- **From:** `noreply@yourdomain.com`

### 4. Test Email Sending

In SMTP settings → Click "Test Email"

---

## Complete Deployment Checklist

### Before Deployment
- [ ] App tested locally (`npm run dev`)
- [ ] Build successful (`npm run build`)
- [ ] `dist/` folder exists with all files
- [ ] Appwrite account created
- [ ] Project ID saved
- [ ] GitHub account ready (if using GitHub)

### During Deployment
- [ ] CLI installed and logged in
- [ ] Deployment command executed
- [ ] Site deployed successfully
- [ ] Domain assigned

### After Deployment
- [ ] CORS origins configured
- [ ] OAuth URLs updated
- [ ] SMTP email configured
- [ ] App loads at Appwrite domain
- [ ] All features tested:
  - [ ] Registration
  - [ ] Email verification
  - [ ] Login
  - [ ] Google OAuth
  - [ ] Create task
  - [ ] Edit task
  - [ ] Delete task
  - [ ] Real-time updates
  - [ ] Notifications

---

## Testing Your Deployed Site

### 1. Basic Access Test

```bash
# Open in browser
https://task-tracker.appwrite.io
```

Should load without errors.

### 2. Feature Test

- [ ] Registration works
- [ ] Verification email arrives
- [ ] Login successful
- [ ] Dashboard loads
- [ ] Google OAuth button works
- [ ] Can create tasks
- [ ] Real-time updates work

### 3. Check Browser Console

Open DevTools (F12) → Console

Should have no errors, only info logs.

---

## Troubleshooting

### Site Shows Blank Page

**Solution:**
1. Check browser console (F12)
2. Check Appwrite endpoint is correct
3. Verify Project ID matches
4. Check CORS settings

### Build Failed During Deployment

**Solution:**
1. Test build locally: `npm run build`
2. Check `dist/` folder exists
3. Verify all dependencies installed
4. Check build logs in console

### Can't Access Appwrite Backend

**Solution:**
1. Verify Appwrite endpoint in app
2. Check CORS origins configured
3. Verify Project ID is correct
4. Check network in browser DevTools

### Email Not Sending

**Solution:**
1. Configure SMTP in Appwrite
2. Test SMTP with test button
3. Verify Gmail app password
4. Check "From" email is correct

### OAuth Not Working

**Solution:**
1. Update redirect URIs in Google Cloud
2. Verify Client ID and Secret
3. Check OAuth is enabled in Appwrite
4. Clear browser cookies/cache

---

## Advanced: Add Custom Domain

### Step 1: Buy Domain

Options:
- **Free:** Freenom.com (`.tk`, `.ml`, `.ga`)
- **Cheap:** Namecheap (~$8/year)
- **Popular:** GoDaddy, Bluehost

### Step 2: Configure in Appwrite

1. **Appwrite Console → Sites → Your Site → Settings**
2. Click **"Add Custom Domain"**
3. Enter domain: `yourdomain.com`
4. Add DNS records (CNAME or A record)
5. Wait for DNS propagation (24-48 hours)

### Step 3: Update DNS

In your domain registrar:

**Option A: CNAME (Easier)**
```
Name: @
Type: CNAME
Value: appwrite-cloud.yourdomain.com
```

**Option B: A Record**
```
Name: @
Type: A
Value: [IP from Appwrite console]
```

### Step 4: SSL Certificate

Appwrite automatically provisions SSL certificate.
Your domain now works with HTTPS!

```
https://yourdomain.com
```

---

## Deployment Methods Comparison

| Method | Speed | GitHub | Automatic | Easiest |
|--------|-------|--------|-----------|---------|
| CLI | ⚡ 2 min | ❌ Manual | ❌ No | ✅ Yes |
| GitHub | 🔄 Auto | ✅ Auto | ✅ Yes | ✅ Yes |
| Console | ⏱️ 5 min | ❌ Manual | ❌ No | ❌ No |

**Recommended:** GitHub (automatic deployments)

---

## Automatic Deployments with GitHub

Once set up, your workflow is:

```
1. Make changes locally
   ↓
2. Push to GitHub
   ↓
3. Appwrite automatically:
   - Pulls code
   - Runs: npm run build
   - Deploys dist/ folder
   - Updates live site
   ↓
4. Check your site (instantly live!)
```

**No manual deployment needed!**

---

## Commands Reference

```bash
# Build
npm run build

# Install Appwrite CLI
npm install -g appwrite

# Login
appwrite login

# Deploy to Sites
appwrite deploy web

# Deploy specific folder
appwrite deploy web --source dist

# Check deployment status
appwrite projects get

# View sites
appwrite sites list
```

---

## Architecture

```
Your React Code
    ↓
GitHub Repository
    ↓
Appwrite Cloud (webhook triggered)
    ↓
Build Process (npm run build)
    ↓
dist/ folder
    ↓
Appwrite Sites
    ↓
Live on Internet
    ↓
task-tracker.appwrite.io
```

---

## Cost

| Service | Price |
|---------|-------|
| Appwrite Cloud | FREE |
| Appwrite Sites | FREE (included) |
| Domain (Freenom) | FREE |
| Domain (Namecheap) | ~$8-10/year |
| SSL/HTTPS | FREE (included) |
| **Total** | **$0-10/year** |

---

## Next Steps

### Option 1: Quick Deploy Now
```bash
npm run build
appwrite deploy web
```

### Option 2: Set Up Automatic Deployments
1. Push to GitHub
2. Connect GitHub in Appwrite Console
3. Done! Auto-deploys on every push

### Option 3: Add Custom Domain
1. Buy domain
2. Add to Appwrite Sites settings
3. Update DNS records
4. Done!

---

## Support

**Having issues?**

1. **Check browser console** (F12)
2. **Review logs** in Appwrite Console
3. **Verify configuration** (CORS, OAuth, etc.)
4. **Check Appwrite docs:** https://appwrite.io/docs

---

## Success Checklist

After deployment:

- [ ] Site accessible at Appwrite domain
- [ ] No console errors
- [ ] Can register/login
- [ ] Email verification works
- [ ] Google OAuth works
- [ ] Can create/edit/delete tasks
- [ ] Real-time updates work
- [ ] Notifications display
- [ ] All features responsive

**You're live!** 🎉

---

## Ready to Deploy?

Choose your method:

1. **CLI Deploy** → Run `appwrite deploy web`
2. **GitHub Deploy** → Connect GitHub in console
3. **Web Upload** → Upload `dist/` via console

**Pick one and deploy now!** 🚀

---

## Quick Reference

```bash
# The 3-command deployment
npm run build              # Build
appwrite login             # Login
appwrite deploy web        # Deploy

# Your site is now live!
# https://task-tracker.appwrite.io
```

---

**Deployed successfully!** ✨
