# GitHub Push - 5 Minute Guide

Get your Task Tracker on GitHub fast!

---

## Step 1: Create GitHub Repository (2 minutes)

1. Go to [github.com/new](https://github.com/new)
2. **Repository name:** `task-tracker`
3. **Description:** Task Tracker with Appwrite
4. Choose **Public** or **Private**
5. **Don't add README** (you already have one)
6. Click **"Create repository"**

---

## Step 2: Copy Commands

After creating, you'll see a page with this section:

**"...or push an existing repository from the command line"**

It shows commands like:
```bash
git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git
git branch -M main
git push -u origin main
```

**Copy these commands**

---

## Step 3: Run Commands (2 minutes)

```bash
cd /Users/divyanshadubey/task-tracker-2

# Paste the 3 commands from GitHub
git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## Step 4: Enter Credentials

When prompted:
- **Username:** Your GitHub username
- **Password:** Personal access token (NOT your password)

### Get Personal Access Token:

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Name it: `appwrite-deploy`
4. Check: `repo` and `workflow`
5. Click "Generate"
6. **Copy the token**
7. Use token as password

---

## Step 5: Verify (1 minute)

Go to your GitHub repository:
```
https://github.com/YOUR_USERNAME/task-tracker
```

You should see all your files!

---

## Done! 🎉

Your code is now on GitHub!

---

## Next: Auto-Deploy to Appwrite Sites

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Open your project
3. Go to **Sites** → **Create Site**
4. Select **GitHub**
5. Authorize & select repository
6. Configure:
   - Branch: `main`
   - Build: `npm run build`
   - Output: `dist`
7. Deploy!

**Every future push auto-deploys!** 🚀

---

## Quick Commands

```bash
# After making changes:
git add .
git commit -m "Your message"
git push

# That's it! Appwrite deploys automatically.
```

---

Done! Your app auto-deploys from GitHub to Appwrite! ✨
