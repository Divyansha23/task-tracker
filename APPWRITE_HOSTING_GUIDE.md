# Deploy Your Task Tracker on Appwrite Only

Host your entire React application on Appwrite with a free domain - no Vercel, no external hosting needed.

---

## Overview

```
Your React App + Appwrite Backend
         ↓
   Appwrite Hosting
         ↓
   Free Domain (*.appwrite.io)
         ↓
   Live Application
```

---

## Prerequisites

1. **Appwrite Account** (Cloud or Self-hosted)
   - [Appwrite Cloud](https://cloud.appwrite.io) - Easiest (Free tier available)
   - Or self-hosted Appwrite instance

2. **Node.js & npm** (Already installed)

3. **Your React app** (Already built)

---

## OPTION 1: Appwrite Cloud (Recommended) ⭐

### Step 1: Create Appwrite Cloud Project

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Sign up with GitHub or email
3. Create a new project
4. Get your:
   - **Project ID**
   - **API Endpoint** (usually `https://cloud.appwrite.io/v1`)

### Step 2: Build Your React App for Production

```bash
cd /Users/divyanshadubey/task-tracker-2
npm run build
```

This creates a `dist/` folder with all static files.

### Step 3: Deploy React App to Appwrite Static Files

Appwrite Cloud supports hosting static files. Here's how:

#### Option A: Using Appwrite CLI (Easiest)

1. **Install Appwrite CLI**
   ```bash
   npm install -g appwrite
   ```

2. **Login to Appwrite**
   ```bash
   appwrite login
   ```
   - Enter your Appwrite Cloud credentials
   - Select your project

3. **Deploy Static Files**
   ```bash
   appwrite deploy --all
   ```
   
   Or manually deploy the `dist` folder:
   ```bash
   # In your project root
   appwrite deploy bucket --source dist --target-bucket-id react-app
   ```

#### Option B: Upload via Appwrite Console

1. Go to [Appwrite Cloud Console](https://cloud.appwrite.io)
2. Open your project
3. Go to **Storage** → **Buckets**
4. Create a new bucket called `react-app`
5. Configure bucket settings:
   - Allow file extensions: `*`
   - Max file size: `100MB` (or more)
   - Enable public access

6. Upload files from `dist/` folder:
   - Open the bucket
   - Drag & drop all files from `dist/`
   - Upload `index.html`, `assets/`, etc.

### Step 4: Make Files Public

In Appwrite Console:

1. Go to Storage → Your bucket
2. Set bucket permissions to **public**
3. Files can now be accessed publicly

### Step 5: Access Your App

Your app is now live at:
```
https://cloud.appwrite.io/v1/storage/buckets/{bucket-id}/files/{index-html-file-id}
```

Or configure a custom domain (see below).

---

## OPTION 2: Self-Hosted Appwrite + Static Files

If you're running your own Appwrite server:

### Step 1: Build React App

```bash
npm run build
```

### Step 2: Deploy Using Docker

Create a `docker-compose.yml` for your entire stack:

```yaml
version: '3.8'

services:
  appwrite:
    image: appwrite/appwrite:latest
    ports:
      - "80:80"
      - "443:443"
    environment:
      - _APP_ENV=production
      - _APP_DOMAIN=yourdomain.com
      - _APP_REDIS_HOST=redis
      - _APP_DB_HOST=mariadb
    depends_on:
      - mariadb
      - redis
    volumes:
      - ./data/uploads:/storage/uploads
      - ./data/cache:/storage/cache
      - ./data/config:/storage/config
      - ./dist:/var/www/html/public
    networks:
      - appwrite

  mariadb:
    image: mariadb:10.7
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: appwrite
    volumes:
      - ./data/mysql:/var/lib/mysql
    networks:
      - appwrite

  redis:
    image: redis:7-alpine
    networks:
      - appwrite

networks:
  appwrite:
    driver: bridge

volumes:
  mysql:
  redis:
```

### Step 3: Deploy

```bash
docker-compose up -d
```

Your app is live on your server domain.

---

## OPTION 3: Use Appwrite Cloud Functions to Serve Static Files

If you want to serve your React app via Cloud Functions:

### Step 1: Build App

```bash
npm run build
```

### Step 2: Create Cloud Function

1. In Appwrite Console → Functions
2. Create new function
3. Runtime: `Node.js`
4. Add code to serve static files

```javascript
// Example Cloud Function (index.js)
const fs = require('fs');
const path = require('path');

export default async (req, res) => {
  // Serve index.html for all routes (SPA routing)
  const indexPath = path.join('/mnt/code/dist/index.html');
  const content = fs.readFileSync(indexPath, 'utf-8');
  
  res.send(content, 200, {
    'Content-Type': 'text/html'
  });
};
```

### Step 3: Deploy Assets

Upload `dist/` assets to Appwrite Storage and link from Cloud Function.

---

## CUSTOM DOMAIN WITH APPWRITE

### For Appwrite Cloud:

1. **Register Domain** (Free or Paid)
   - Freenom: Free `.tk`, `.ml`, `.ga` domains
   - Namecheap: Cheap `.com` domains
   - GoDaddy: Popular domain registrar

2. **Configure in Appwrite Console**
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS instructions

3. **Update DNS Records**
   - In your domain registrar:
   - Add `CNAME` record pointing to Appwrite
   - Or update nameservers

4. **Access Your App**
   ```
   https://yourdomain.com
   ```

---

## ENVIRONMENT VARIABLES FOR APPWRITE HOSTING

Update your app's environment variables:

Create `.env.production`:
```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_API_KEY=your_api_key
```

### Or in Appwrite Cloud Functions:

Set environment variables in function settings:
```
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
```

---

## COMPLETE DEPLOYMENT PROCESS

### Step 1: Prepare Your App

```bash
cd /Users/divyanshadubey/task-tracker-2

# Install dependencies
npm install

# Build for production
npm run build

# Verify build was successful
ls -la dist/
```

### Step 2: Create Appwrite Cloud Project

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create account
3. Create project
4. Note your Project ID and Endpoint

### Step 3: Configure App Settings

In your app (`src/lib/appwrite.js`):

```javascript
export const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite Cloud endpoint
  .setProject('YOUR_PROJECT_ID');
```

### Step 4: Deploy to Appwrite

**Using Appwrite CLI:**

```bash
# Install CLI
npm install -g appwrite

# Login
appwrite login

# Deploy
appwrite deploy --all
```

**Or manually upload `dist/` folder to Storage.**

### Step 5: Test Your App

1. Access at Appwrite Cloud domain
2. Test all features:
   - Registration
   - Email verification
   - Login
   - Task creation
   - Real-time updates
   - Google OAuth

### Step 6: Add Custom Domain (Optional)

1. Buy domain (Freenom or Namecheap)
2. Add to Appwrite Console → Domains
3. Update DNS records
4. Access at your custom domain

---

## APPWRITE CONFIGURATION

### Enable Required Features

In Appwrite Console → Auth:

✅ Email/Password authentication
✅ Email verification
✅ OAuth2 (Google)
✅ SMTP Email sending

### Set CORS Origins

In Appwrite Console → Settings → CORS:

Add your domain:
```
https://yourdomain.com
https://yourproject.appwrite.io
```

### Update OAuth Redirect URLs

Google Cloud Console → OAuth Credentials:

```
Authorized JavaScript origins:
https://yourdomain.com
https://yourproject.appwrite.io

Authorized redirect URIs:
https://yourdomain.com/dashboard
https://yourproject.appwrite.io/dashboard
```

### Configure Email SMTP

Appwrite Console → Settings → SMTP:

Set up email sending:
- SMTP Server: Gmail, SendGrid, or custom
- From Email: noreply@yourdomain.com
- Test email sending

---

## FILE STRUCTURE FOR APPWRITE HOSTING

```
task-tracker-2/
├── dist/                    # Build output (upload this)
│   ├── index.html          # Main HTML file
│   ├── assets/
│   │   ├── style.*.css
│   │   └── index.*.js
│   └── vite.svg
├── src/                     # Source code
├── package.json
├── vite.config.js
└── appwrite.json           # Appwrite config (if using CLI)
```

Upload entire `dist/` folder to Appwrite Storage or Static Hosting.

---

## TROUBLESHOOTING

### App loads but shows blank page

**Solution:**
1. Check browser console for errors
2. Verify all assets loaded correctly
3. Check Appwrite CORS settings
4. Verify environment variables

### Can't access Appwrite from app

**Solution:**
1. Check Appwrite endpoint is correct
2. Verify project ID matches
3. Check CORS origins in Appwrite
4. Verify API key if needed

### Email verification not working

**Solution:**
1. Configure SMTP in Appwrite
2. Verify email provider settings
3. Check email is being sent from correct address

### OAuth not working

**Solution:**
1. Update OAuth URLs in Google Cloud Console
2. Verify redirect URIs match your domain
3. Check client ID and secret in Appwrite

---

## COMPLETE ARCHITECTURE

```
┌──────────────────────────────────────┐
│      Your React Task Tracker        │
│   (Built from src/ → dist/ folder)  │
└────────────────┬─────────────────────┘
                 │
                 ↓ (HTTP/HTTPS)
┌──────────────────────────────────────┐
│    Appwrite Cloud Hosting             │
│  - Serves static files (dist/)        │
│  - Manages backend (database, auth)   │
│  - Real-time API                     │
│  - File storage                      │
│  - Cloud functions                   │
└──────────────────────────────────────┘
                 ↓
        yourproject.appwrite.io
         (or custom domain)
```

---

## DEPLOYMENT CHECKLIST

- [ ] Code ready and tested locally
- [ ] `npm run build` completes successfully
- [ ] Appwrite Cloud account created
- [ ] Project ID and endpoint noted
- [ ] Environment variables configured
- [ ] `dist/` folder uploaded to Appwrite
- [ ] CORS origins added to Appwrite
- [ ] OAuth URLs updated in Google Cloud
- [ ] SMTP email configured in Appwrite
- [ ] App accessible at Appwrite domain
- [ ] All features tested (register, login, tasks, etc.)
- [ ] Custom domain added (optional)

---

## APPWRITE CLOUD FREE TIER INCLUDES

✅ 1GB Bandwidth
✅ 1GB File Storage
✅ Real-time API
✅ Email Support
✅ Community Support
✅ 50 Cloud Functions
✅ Unlimited Users
✅ Unlimited Databases

**Perfect for your task tracker app!**

---

## FINAL DEPLOYMENT COMMAND

Once everything is configured:

```bash
npm run build && appwrite deploy --all
```

Your entire app is now live on Appwrite! 🚀

---

## COSTS

- **Domain:** Free (Freenom) or ~$10/year (Namecheap)
- **Hosting:** Free (Appwrite Cloud free tier)
- **SSL/HTTPS:** Free (included)
- **Database:** Free (Appwrite included)
- **Email:** Free (if using Gmail SMTP)

**Total Monthly Cost: $0**

---

## Next Steps

1. Create Appwrite Cloud account
2. Build your app
3. Deploy to Appwrite
4. Test everything
5. Add custom domain (optional)
6. Share your live app!

Need any specific help? Let me know! 🎉
