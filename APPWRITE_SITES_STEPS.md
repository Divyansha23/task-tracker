# Appwrite Sites - Step-by-Step Visual Guide

Deploy your Task Tracker to Appwrite Sites with **detailed instructions**.

---

## 📋 Overview

```
Your React App (dist/)
        ↓
   Appwrite CLI
        ↓
Appwrite Sites
        ↓
Live on Internet
(task-tracker.appwrite.io)
```

---

## Step 1️⃣: Prepare Your App

### Build for Production

```bash
cd /Users/divyanshadubey/task-tracker-2
npm run build
```

**What this does:**
- Optimizes your React code
- Creates `dist/` folder
- Ready for deployment

**Check success:**
```bash
ls dist/
# Should show: index.html, assets/, vite.svg, etc.
```

✅ **Done!** Your app is ready.

---

## Step 2️⃣: Create Appwrite Account

### Go to Appwrite Cloud

1. Visit: [cloud.appwrite.io](https://cloud.appwrite.io)
2. Click **"Sign Up"**
3. Choose:
   - GitHub login, OR
   - Google login, OR
   - Email + password
4. Verify email (if using email signup)

### Create a Project

1. Click **"Create Project"**
2. Enter name: `Task Tracker`
3. Select region closest to you
4. Click **"Create"**

### Get Your Credentials

In **Project Overview**, save:
- **Project ID** (e.g., `507f1f77bcf86cd799439011`)
- **API Endpoint**: `https://cloud.appwrite.io/v1`

```
Example:
Project ID: 507f1f77bcf86cd799439011
Endpoint: https://cloud.appwrite.io/v1
```

✅ **Done!** You have your Appwrite account.

---

## Step 3️⃣: Install Appwrite CLI

### Install the CLI Tool

```bash
npm install -g appwrite
```

**Verify installation:**
```bash
appwrite --version
# Should show: Appwrite CLI v5.x.x
```

✅ **Done!** CLI is installed.

---

## Step 4️⃣: Login to Appwrite

### Login Command

```bash
appwrite login
```

### Follow Prompts

```
? Appwrite Server URL: https://cloud.appwrite.io
? Appwrite API Key: [leave blank and press Enter]
? Appwrite username/email: your-email@gmail.com
? Appwrite password: ••••••••
```

**Enter:**
- Email: Your Appwrite account email
- Password: Your Appwrite password

### Select Project

```
? Choose a project: (Use arrow keys)
❯ Task Tracker (507f1f77bcf86cd799439011)
```

Select your project.

### Choose Region

```
? Choose a region:
❯ United States (us-east-1)
  Europe (eu-central-1)
  Asia (ap-southeast-1)
```

Choose the region closest to you.

✅ **Done!** You're logged in.

---

## Step 5️⃣: Deploy Your App

### Deploy Command

```bash
appwrite deploy web
```

**What it does:**
- Takes your `dist/` folder
- Uploads to Appwrite Sites
- Provisions HTTPS certificate
- Assigns domain
- Goes live!

### Watch for Output

```
📁 Uploading files...
✅ Uploaded 15 files
🔗 Provisioning domain...
✅ Domain ready
🌐 Site deployed!

Your site is live at:
https://task-tracker.appwrite.io
```

✅ **Done!** Your app is LIVE! 🎉

---

## Step 6️⃣: Configure Appwrite

### Required: CORS Origins

1. Go to **Appwrite Console** → **Settings** → **CORS**
2. Click **"Add Origin"**
3. Enter: `https://task-tracker.appwrite.io`
4. Click **"Save"**

**Why:** Allows your site to communicate with Appwrite backend.

### Required: Google OAuth (If using Google login)

1. Go to **Google Cloud Console** → **OAuth consent screen**
2. Edit your OAuth app
3. Update **Authorized redirect URIs:**
   ```
   https://task-tracker.appwrite.io/dashboard
   ```
4. Save

**Why:** Google needs to know where to send users after login.

### Required: Email SMTP (For email verification)

1. In **Appwrite Console** → **Settings** → **SMTP**
2. Enable SMTP
3. Configure:
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: your-gmail@gmail.com
   Password: [Google App Password]
   From: noreply@task-tracker.com
   ```

**How to get Gmail App Password:**
- Go to [myaccount.google.com](https://myaccount.google.com)
- Enable 2-Factor Authentication
- Go to App passwords
- Select "Mail" and "Windows Computer"
- Copy 16-character password
- Paste in SMTP settings

4. Test email with **"Test Email"** button

✅ **Done!** Configuration complete.

---

## Step 7️⃣: Test Your Site

### Open Your Site

Visit:
```
https://task-tracker.appwrite.io
```

### Test Features

1. **Registration**
   - Click Register
   - Enter email & password
   - Check inbox for verification email
   - Click verification link

2. **Login**
   - Use verified email
   - Login successfully
   - See dashboard

3. **Google OAuth** (if configured)
   - Click "Login with Google"
   - Should redirect to Google
   - Should login and return

4. **Create Task**
   - Click "Create Task"
   - Fill details
   - Should save instantly

5. **Real-time**
   - Open site in 2 browser tabs
   - Create task in one tab
   - Should appear instantly in other tab

✅ **Done!** All features working!

---

## Step 8️⃣: (Optional) Add Custom Domain

### Buy Domain

1. Visit **Namecheap.com** or **Freenom.com**
2. Search domain name
3. Register domain

### Configure in Appwrite

1. **Appwrite Console** → **Sites** → **Your Site**
2. Click **"Settings"**
3. Click **"Add Custom Domain"**
4. Enter domain: `yourdomain.com`

### Update DNS

1. Log into your domain registrar
2. Find **DNS Settings**
3. Add CNAME record:
   ```
   Name: @
   Type: CNAME
   Value: [Copy from Appwrite]
   ```
4. Save

### Wait for Propagation

- DNS updates take 24-48 hours
- After that, your site works at:
  ```
  https://yourdomain.com
  ```

✅ **Done!** Custom domain active!

---

## Summary

| Step | Time | Action |
|------|------|--------|
| 1 | 2 min | Build app |
| 2 | 3 min | Create Appwrite account |
| 3 | 1 min | Install CLI |
| 4 | 2 min | Login to Appwrite |
| 5 | 2 min | Deploy with CLI |
| 6 | 10 min | Configure Appwrite |
| 7 | 5 min | Test site |
| 8 | - | (Optional) Add custom domain |

**Total: ~25 minutes** ⏱️

---

## Complete Commands Reference

```bash
# Step 1: Build
npm run build

# Step 3: Install CLI
npm install -g appwrite

# Step 4: Login
appwrite login

# Step 5: Deploy
appwrite deploy web

# All at once:
npm run build && appwrite deploy web
```

---

## Result

```
✅ React app built
✅ Deployed to Appwrite Sites
✅ Live on internet
✅ HTTPS/SSL enabled
✅ Free domain assigned
✅ All features working
✅ Ready to share!
```

Your site is now live at:
```
🌐 https://task-tracker.appwrite.io
```

---

## Next Steps

1. **Share your site** with friends
2. **Add custom domain** (optional)
3. **Monitor usage** in Appwrite Console
4. **Update code** and redeploy as needed

---

## Update Your Site (After Deployment)

Whenever you want to update:

```bash
# Make changes in code
# Then run:
npm run build
appwrite deploy web

# Your site updates instantly!
```

Or set up **GitHub automatic deployments** (see separate guide).

---

## Troubleshooting

### Site shows blank page
- Open DevTools (F12)
- Check Console for errors
- Verify Appwrite endpoint is correct
- Check CORS is configured

### "Email not sending"
- Verify SMTP is configured
- Test with test button
- Check Gmail app password
- Allow less secure apps (if needed)

### "Login not working"
- Check CORS origins
- Verify OAuth URLs updated
- Check Google credentials
- Clear browser cache

### "Deployment failed"
- Verify `dist/` folder exists
- Check CLI is logged in
- Verify Project ID is correct
- Check network connection

---

## You're Done! 🎉

Your Task Tracker is **live on the internet** at:

```
🌐 https://task-tracker.appwrite.io
```

Share it with everyone!

**Congratulations!** 🎊
