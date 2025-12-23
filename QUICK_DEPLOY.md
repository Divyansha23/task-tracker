# Quick Start: Deploy to Appwrite in 5 Steps

## Step 1: Build Your App

```bash
cd /Users/divyanshadubey/task-tracker-2
npm run build
```

Output: `dist/` folder with your app ready to deploy.

---

## Step 2: Create Appwrite Cloud Account

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Sign up (GitHub or email)
3. Create a new project
4. **Save these values:**
   - Project ID
   - API Endpoint (usually `https://cloud.appwrite.io/v1`)

---

## Step 3: Install Appwrite CLI

```bash
npm install -g appwrite
```

---

## Step 4: Login & Deploy

```bash
# Login to Appwrite
appwrite login

# When prompted:
# - Enter your Appwrite Cloud email/password
# - Select your project
# - Choose region

# Deploy your app
appwrite deploy --all
```

---

## Step 5: Your App is Live! 🎉

Access at:
```
https://cloud.appwrite.io/v1/storage/buckets/...
```

Or configure custom domain in Appwrite Console.

---

## Configure Appwrite for Your App

### 1. Enable Auth Features

**Appwrite Console → Auth → Auth Methods:**
- ✅ Email/Password
- ✅ Email Verification
- ✅ OAuth2 (Google)

### 2. Set CORS Origins

**Appwrite Console → Settings → CORS:**
```
https://cloud.appwrite.io
your-custom-domain.com
```

### 3. Configure Google OAuth

In your Google Cloud Console, set:
```
Redirect URIs:
https://your-appwrite-domain/dashboard
```

### 4. Setup Email SMTP

**Appwrite Console → Settings → SMTP:**
- Provider: Gmail, SendGrid, or custom
- From Email: noreply@yourdomain.com
- Enable email verification

---

## Test Your Deployment

1. Open your Appwrite domain
2. Try to register
3. Verify email
4. Login
5. Create a task
6. Check real-time updates

---

## Add Custom Domain (Optional)

1. Buy domain (Freenom.com for free, or Namecheap)
2. **Appwrite Console → Settings → Domains**
3. Add your domain
4. Update DNS records per Appwrite instructions
5. Done!

---

## Troubleshooting

### "Build command failed"
```bash
# Ensure build works locally
npm run build
# Check dist/ folder exists
ls dist/
```

### "CORS error"
- Add your domain to Appwrite CORS origins
- Update Google OAuth URLs

### "Email not sending"
- Configure SMTP in Appwrite Settings
- Check email provider credentials

### "OAuth not working"
- Verify redirect URLs in Google Cloud Console
- Check Appwrite OAuth2 is enabled

---

## That's It!

Your entire React app + Appwrite backend is now live on Appwrite only! 🚀

No Vercel, no external hosting needed.

---

## Cost Summary

| Service | Cost |
|---------|------|
| Appwrite Cloud | Free |
| Domain (Freenom) | Free |
| Domain (Namecheap) | ~$10/year |
| SSL/HTTPS | Free |
| **Total** | **$0-10/year** |

---

## Commands Cheat Sheet

```bash
# Build
npm run build

# Install Appwrite CLI
npm install -g appwrite

# Login
appwrite login

# Deploy
appwrite deploy --all

# Check deployment status
appwrite projects get

# View logs
appwrite functions list
```

---

Done! Your task tracker is live on Appwrite! 🎉
