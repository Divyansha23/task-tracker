# Quick Deployment Checklist ⚡

## Pre-Deployment (5 minutes)

- [ ] Code is pushed to GitHub
- [ ] No console errors: `npm run build`
- [ ] `.env` file is in `.gitignore`
- [ ] Your Appwrite instance is accessible

---

## Step 1: Deploy to Vercel (2 minutes)

```bash
# If not already on GitHub:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git
git push -u origin main
```

1. Go to **[vercel.com](https://vercel.com)**
2. Click **Sign Up** → Choose **GitHub**
3. Authorize GitHub access
4. Click **New Project**
5. Select your `task-tracker` repository
6. Click **Deploy**
7. Wait 2-3 minutes... ✨ **Done!**

**Your app is now live at:** `https://task-tracker-2.vercel.app`

---

## Step 2: Configure Appwrite (3 minutes)

### Update CORS Settings
1. Open **Appwrite Console**
2. Go to **Settings → CORS**
3. Add: `https://task-tracker-2.vercel.app`
4. Click **Save**

### Update OAuth URLs
1. Go to **Auth → OAuth2 Providers → Google**
2. Update redirect URLs:
   - Success: `https://task-tracker-2.vercel.app/dashboard`
   - Failure: `https://task-tracker-2.vercel.app/login`
3. Click **Save**

### Add Environment Variables in Vercel
1. In Vercel dashboard → **Settings → Environment Variables**
2. Add:
   - `VITE_APPWRITE_ENDPOINT` = Your Appwrite URL
   - `VITE_APPWRITE_PROJECT_ID` = Your Project ID
3. **Redeploy** (Vercel will auto-deploy)

---

## Step 3: Add Free Domain (Optional, 5 minutes)

### Option A: Use Vercel's Free Subdomain
**Already done!** You have `task-tracker-2.vercel.app`

### Option B: Add Free Domain from Freenom

1. Go to **[freenom.com](https://freenom.com)**
2. Search for domain name (e.g., `mytasktracker`)
3. Choose `.tk`, `.ml`, `.ga`, or `.cf`
4. Click **Get it now**
5. Complete checkout (FREE)
6. In Vercel → **Settings → Domains** → **Add Domain**
7. Enter your Freenom domain
8. Copy the **DNS records** Vercel provides
9. In Freenom → **Domain Management** → **Manage Nameservers**
10. Add Vercel's nameservers
11. Wait 24-48 hours for DNS

**Your app is now at:** `https://mytasktracker.tk`

---

## Step 4: Test Everything (2 minutes)

### Register
- [ ] Open app URL
- [ ] Click "Register"
- [ ] Enter email and password
- [ ] Check inbox for verification email
- [ ] Click verification link

### Login
- [ ] Email verified? Login with email/password
- [ ] Try Google OAuth login
- [ ] Can access dashboard

### Create Task
- [ ] Create a new task
- [ ] Assign to a user
- [ ] Set due date
- [ ] Check if real-time updates work

### Notifications
- [ ] Create task with today's due date
- [ ] Check if notification appears

---

## Final Checklist

- [ ] App loads at domain
- [ ] No 404 or 500 errors
- [ ] Registration works
- [ ] Email verification works
- [ ] Login works
- [ ] Google OAuth works
- [ ] Can create tasks
- [ ] Real-time works
- [ ] Notifications appear
- [ ] Custom domain works (if added)

---

## Troubleshooting Quick Fixes

### "App shows blank page"
→ Check Vercel build logs for errors

### "Backend not working"
→ Verify Appwrite endpoint in Vercel env variables

### "OAuth gives error"
→ Update redirect URLs in Appwrite + Google Cloud

### "Emails not sending"
→ Configure SMTP in Appwrite Console → Settings

### "Domain not working"
→ Wait 24-48 hours, or check DNS settings

---

## Share Your App! 🎉

Your live app URL:
```
https://task-tracker-2.vercel.app
```

Or custom domain:
```
https://mytasktracker.tk
```

**Share with friends and colleagues!**

---

## Next Steps (Optional)

- [ ] Add more team members
- [ ] Configure email templates
- [ ] Set up analytics
- [ ] Add password recovery
- [ ] Customize branding
- [ ] Set up automated backups

---

## Support

- **Vercel Issues?** → https://vercel.com/support
- **Appwrite Issues?** → https://appwrite.io/discord
- **Domain Issues?** → https://freenom.com/support

**You're all set! 🚀**
