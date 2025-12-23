# Appwrite Sites - Quick Deploy Guide

Deploy your Task Tracker to Appwrite Sites in **3 commands** ⚡

---

## 🚀 Fastest Way (3 Commands)

### Command 1: Build Your App
```bash
npm run build
```

### Command 2: Login to Appwrite
```bash
appwrite login
```
- Enter email/password
- Select your project
- Choose region

### Command 3: Deploy
```bash
appwrite deploy web
```

**Done!** Your site is live! 🎉

---

## 📍 Your Site URL

After deployment:
```
https://task-tracker.appwrite.io
```

Or your custom domain if configured.

---

## ✅ What Happens Automatically

✅ Your `dist/` folder uploaded
✅ HTTPS/SSL certificate provisioned
✅ Site goes live instantly
✅ Domain assigned
✅ CDN enabled

---

## 🔧 Post-Deployment (Required)

### 1. CORS Configuration (5 min)

**Appwrite Console → Settings → CORS**

Add:
```
https://task-tracker.appwrite.io
```

### 2. OAuth URLs (5 min)

**Google Cloud Console → OAuth**

Update redirect URIs:
```
https://task-tracker.appwrite.io/dashboard
```

### 3. SMTP Email (5 min)

**Appwrite Console → Settings → SMTP**

Configure:
- Host: `smtp.gmail.com`
- Port: `587`
- Username: Your Gmail
- Password: Gmail app password

---

## 🧪 Test Your Site

1. Open `https://task-tracker.appwrite.io`
2. Try to register
3. Check email for verification
4. Login
5. Create a task
6. Test all features

---

## 🌍 Add Custom Domain (Optional)

1. Buy domain (Freenom or Namecheap)
2. **Appwrite Console → Sites → Settings**
3. Add custom domain
4. Update DNS records
5. Wait 24-48 hours
6. Done!

---

## 📊 Checklist

Before deploying:
- [ ] `npm run build` works
- [ ] `dist/` folder exists
- [ ] Appwrite CLI installed
- [ ] Logged into Appwrite

After deploying:
- [ ] Site loads at Appwrite domain
- [ ] CORS configured
- [ ] OAuth URLs updated
- [ ] SMTP configured
- [ ] All features tested

---

## 🆘 Troubleshooting

**Site shows blank page?**
- Check browser console (F12)
- Verify Appwrite endpoint is correct
- Check CORS origins

**Email not sending?**
- Configure SMTP in Appwrite
- Test with test button
- Check Gmail app password

**OAuth not working?**
- Update redirect URLs in Google Cloud
- Verify Client ID/Secret
- Clear browser cache

---

## 🔄 Update Your Site

After initial deployment, to update:

**Using CLI:**
```bash
npm run build
appwrite deploy web
```

**Using GitHub (Automatic):**
1. Make changes
2. Push to GitHub
3. Appwrite auto-deploys
4. Done!

---

## 💰 Cost

✅ Appwrite Sites: FREE
✅ Domain: FREE (appwrite.io) or ~$10/year (custom)
✅ SSL/HTTPS: FREE
✅ CDN: FREE

**Total: $0-10/year**

---

## 🎯 You're Done!

Your Task Tracker is now live on:
```
https://task-tracker.appwrite.io
```

**Share the link with everyone!** 🌐

---

## Quick Commands

```bash
# Full deployment
npm run build && appwrite deploy web

# Just deploy (if already built)
appwrite deploy web

# Deploy from GitHub (set up once)
# Then just push code, it auto-deploys!
```

---

**Deployed successfully!** ✨
