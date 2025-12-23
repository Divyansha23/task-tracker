# Push Your Project to GitHub

Your project is now ready to be pushed to GitHub! Follow these steps.

---

## Step 1: Create a GitHub Repository

### Option A: Using GitHub Web Interface (Easiest)

1. Go to [github.com](https://github.com)
2. Log in to your account
3. Click **"+"** icon (top right) → **"New repository"**
4. Fill in:
   - **Repository name:** `task-tracker` (or any name you prefer)
   - **Description:** "Task Tracker App with Appwrite Backend"
   - **Visibility:** Choose **Public** (for Appwrite Sites auto-deploy) or **Private**
   - **Don't add** README, .gitignore, or license (you already have these)
5. Click **"Create repository"**

### After Creation

You'll see a page with instructions. Copy the commands from the section:
```
"...or push an existing repository from the command line"
```

It will look like:
```bash
git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git
git branch -M main
git push -u origin main
```

---

## Step 2: Push Your Project to GitHub

Copy and run the commands from Step 1 in your terminal:

```bash
cd /Users/divyanshadubey/task-tracker-2

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git

# Rename branch to main
git branch -M main

# Push all files to GitHub
git push -u origin main
```

When prompted for password, use your GitHub personal access token (not your password):

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "Appwrite Sites Deploy"
4. Check these scopes:
   - `repo` (full control of private repositories)
   - `workflow`
5. Click "Generate token"
6. Copy the token (you won't see it again!)
7. Use this token as your password when pushing

---

## Step 3: Verify on GitHub

After pushing:

1. Go to your repository on GitHub
2. You should see all your files
3. Check the main branch is selected
4. All files should be there!

---

## Step 4: Set Up Automatic Deployments to Appwrite Sites

### In Appwrite Console:

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Open your project
3. Go to **Sites** tab
4. Click **"+ Create Site"**
5. Choose **GitHub** as source
6. Authorize Appwrite to access GitHub
7. Select your `task-tracker` repository
8. Configure:
   - **Branch:** `main`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
9. Click **Deploy**

---

## Now Automatic Deployments Work!

Whenever you push code to GitHub:

```
Push code → GitHub receives → Appwrite webhook triggered
→ Appwrite builds your app → Deploys to Sites → Live!
```

**No manual deployment needed!**

---

## Git Commands Cheat Sheet

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest from GitHub
git pull

# Check remote
git remote -v

# View commit history
git log --oneline
```

---

## Your Complete Workflow Now

```
1. Make changes locally
   ↓
2. Test with: npm run dev
   ↓
3. Commit: git add . && git commit -m "message"
   ↓
4. Push: git push
   ↓
5. Appwrite automatically:
   - Detects the push
   - Runs: npm run build
   - Deploys to Sites
   - Updates your live site
   ↓
6. Check your site live!
```

---

## Verification

After pushing to GitHub, verify:

```bash
# Check git is connected
cd /Users/divyanshadubey/task-tracker-2
git remote -v

# Should show:
# origin  https://github.com/YOUR_USERNAME/task-tracker.git (fetch)
# origin  https://github.com/YOUR_USERNAME/task-tracker.git (push)
```

---

## Done!

Your project is now:
✅ Tracked with Git
✅ Pushed to GitHub
✅ Ready for Appwrite auto-deploy
✅ Live on Appwrite Sites

**Next:** Connect GitHub to Appwrite Sites for automatic deployments!

---

## Troubleshooting

### "Permission denied (publickey)"

Use personal access token instead of password:
1. Generate token at github.com/settings/tokens
2. Use token as password when pushing

### "Remote already exists"

Remove and re-add:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git
```

### "Authentication failed"

Make sure you're using personal access token, not password.

### "Changes not reflected"

Run:
```bash
git status  # Check uncommitted changes
git add .
git commit -m "message"
git push
```

---

## Your GitHub Repository URL

Once created, access at:
```
https://github.com/YOUR_USERNAME/task-tracker
```

Share this link with others to show your work!

---

**Ready to deploy to Appwrite Sites?**

See: APPWRITE_SITES_DEPLOYMENT.md
