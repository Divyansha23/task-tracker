# Deploy in 10 Minutes ⚡

Fastest way to get your Task Tracker live with a free domain.

---

## What You'll Get

✅ Live app at: `https://task-tracker-2.vercel.app`  
✅ Free hosting (Vercel)  
✅ Free domain (Vercel's `.vercel.app` OR free `.tk` from Freenom)  
✅ Auto-deploy on every code push  
✅ HTTPS/SSL included  
✅ All connected to your Appwrite backend  

---

## 5-Minute Setup

### Minute 1-2: GitHub

```bash
cd /Users/divyanshadubey/task-tracker-2

# First time only:
git init
git add .
git commit -m "Deploy to production"
git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git
git branch -M main
git push -u origin main
```

(Replace `YOUR_USERNAME` with your GitHub username)

### Minute 3: Vercel

1. Go to **[vercel.com](https://vercel.com)**
2. Click **Sign Up** → **GitHub**
3. Authorize GitHub
4. Click **New Project**
5. Select `task-tracker` repo
6. Click **Deploy**

**Wait 2 minutes...**

Your app is live! 🎉

### Minute 4-5: Configure Appwrite

**Get your Vercel URL:**
- Go back to Vercel
- Copy your app URL (something like `task-tracker-2.vercel.app`)

**Update Appwrite:**
1. Open Appwrite Console
2. Go to **Settings → CORS**
3. Add: `https://task-tracker-2.vercel.app`
4. Click Save
5. Go to **Auth → OAuth2 Providers → Google**
6. Update URLs with your Vercel domain
7. Click Save

---

## Optional: Add Free Custom Domain (5 more minutes)

### Get Domain
1. Go to **[freenom.com](https://freenom.com)**
2. Search domain (e.g., `mytasktracker`)
3. Pick `.tk` or `.ml` extension
4. Click **Get it now**
5. Checkout (it's FREE)

### Connect to Vercel
1. In Vercel → **Settings → Domains**
2. Add your Freenom domain
3. Copy the DNS records
4. In Freenom → Manage Domain → Nameservers
5. Add Vercel's nameservers
6. Wait 24 hours ⏳

Done! Your app is at: `https://mytasktracker.tk`

---

## Quick Test

1. Open your Vercel app URL
2. Register with email
3. Check inbox for verification email
4. Verify email and login
5. Try Google login
6. Create a task
7. Everything should work! ✅

---

## If Something Goes Wrong

### App shows blank page?
- Check Vercel deployment logs
- Look for build errors

### Backend not working?
- Make sure Appwrite CORS is updated
- Check endpoint in Vercel env variables

### OAuth not working?
- Update redirect URLs in Appwrite
- Update Google Cloud Console
- Update CORS in Appwrite

### Emails not sending?
- Configure SMTP in Appwrite Console
- Try SendGrid or Gmail

---

## You're Done! 🎉

Your app is now:
- ✅ Live on the internet
- ✅ Has a free domain
- ✅ Using Appwrite backend
- ✅ Auto-deploys on code changes
- ✅ Has email verification
- ✅ Has Google OAuth

**Share your link with anyone!**

```
https://task-tracker-2.vercel.app
```

or

```
https://mytasktracker.tk
```

---

## For Future Updates

Every time you update code:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Vercel automatically deploys within seconds! ⚡

---

## Full Guides

- Detailed deployment: See `DEPLOYMENT_GUIDE.md`
- Appwrite setup: See `APPWRITE_PRODUCTION_SETUP.md`
- Full checklist: See `QUICK_DEPLOY_CHECKLIST.md`

---

**Enjoy your deployed app!** 🚀
