# Appwrite Sites + GitHub - Automatic Deployments

Set up **automatic deployments** so your site updates every time you push to GitHub.

---

## Benefits

✅ Push code to GitHub
✅ Appwrite automatically:
   - Pulls code
   - Builds your app
   - Deploys to Sites
✅ Your site updates instantly
✅ No manual deployment needed

---

## Prerequisites

1. **Appwrite Cloud Account** → [cloud.appwrite.io](https://cloud.appwrite.io)
2. **GitHub Account** → [github.com](https://github.com)
3. **Your code on GitHub** (see Step 1)

---

## Step 1: Push Code to GitHub

### Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Enter repo name: `task-tracker`
3. Description: `Task Tracker App`
4. Choose Public or Private
5. Click **"Create repository"**

### Push Your Code

```bash
cd /Users/divyanshadubey/task-tracker-2

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Task Tracker app"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Verify:**
- Go to your GitHub repo
- Should see all your files

✅ **Done!** Code is on GitHub.

---

## Step 2: Connect GitHub in Appwrite

### Go to Appwrite Sites

1. **Appwrite Console** → **Sites**
2. Click **"Create Site"** or **"+ New Site"**

### Choose GitHub

1. Select **"GitHub"** as source
2. Click **"Connect with GitHub"**
3. **Authorize Appwrite** (follow GitHub prompts)

### Select Repository

1. Choose your **`task-tracker`** repository
2. Select **Branch**: `main`

### Configure Build

```
Build command: npm run build
Output directory: dist
```

**Why:**
- `npm run build` creates optimized production build
- `dist` folder contains files to serve

### Deploy

Click **"Deploy"**

Appwrite will:
- ✅ Clone your repo
- ✅ Run `npm run build`
- ✅ Deploy `dist/` folder
- ✅ Go live

✅ **Done!** GitHub is connected.

---

## Step 3: Test Automatic Deployment

### Make a Change

1. Open your code locally
2. Make a small change (e.g., change a color)
3. Save file

### Push to GitHub

```bash
git add .
git commit -m "Updated site colors"
git push
```

### Watch It Deploy

1. Go to **Appwrite Console** → **Sites**
2. Click your site
3. See **Deployments** tab
4. Should show new deployment in progress
5. Wait for ✅ "Deployment successful"

### Verify Live Site

1. Visit your site: `https://task-tracker.appwrite.io`
2. Refresh page (Ctrl+F5 for hard refresh)
3. Should see your changes

✅ **Done!** Automatic deployments work!

---

## How It Works

```
┌─────────────────────────────────────┐
│   You make changes locally          │
│   git add . && git commit && git push
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   GitHub receives push              │
│   Triggers Appwrite webhook         │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   Appwrite:                         │
│   - Clones repo                     │
│   - Runs: npm run build             │
│   - Creates: dist/ folder           │
│   - Deploys to Sites                │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   Your site updates live!           │
│   https://task-tracker.appwrite.io  │
└─────────────────────────────────────┘
```

---

## Workflow After Setup

### Your Daily Workflow

```bash
# 1. Make changes
# Edit files in VS Code

# 2. Test locally
npm run dev

# 3. Push to GitHub
git add .
git commit -m "Updated feature X"
git push

# 4. Site auto-updates!
# Appwrite deploys automatically
# Check live site in 1-2 minutes
```

That's it! No manual deployment needed.

---

## Multiple Branches

### Deploy Different Branches

You can set up multiple sites for different branches:

1. **Main branch** → Production site
   ```
   https://task-tracker.appwrite.io
   ```

2. **Dev branch** → Staging site
   ```
   https://task-tracker-dev.appwrite.io
   ```

### Set Up Dev Site

1. **Appwrite Console** → **Create Site** (second one)
2. Connect GitHub again
3. Select **Branch**: `dev`
4. Deploy

Now:
- Push to `main` → updates production
- Push to `dev` → updates staging

---

## Troubleshooting

### Deployment Failed

**Check the logs:**
1. **Appwrite Console** → **Sites** → **Your Site** → **Deployments**
2. Click the failed deployment
3. View logs to see error

**Common issues:**
- `npm install` failed → Check `package.json`
- `npm run build` failed → Test build locally first
- Files not found → Check file paths

### GitHub Not Connected

**Solution:**
1. **Appwrite Console** → **Settings** → **GitHub Integration**
2. Re-authorize Appwrite with GitHub
3. Try deploying again

### Site Not Updating

**Solution:**
1. Check deployment status in Appwrite
2. Verify `git push` succeeded
3. Hard refresh browser: `Ctrl+Shift+R`
4. Wait 1-2 minutes for deployment

---

## Best Practices

### Commit Messages

Use clear commit messages:
```bash
# Good
git commit -m "Add dark mode feature"
git commit -m "Fix login button styling"
git commit -m "Update task list UI"

# Less helpful
git commit -m "changes"
git commit -m "fix"
```

### Test Locally First

Always test before pushing:
```bash
npm run dev
# Test features locally
# Then push when working
```

### Use Branches

For big features:
```bash
# Create feature branch
git checkout -b new-feature

# Make changes and test
# Then merge to main
git checkout main
git merge new-feature
git push
```

### Keep dist/ Out of Git

Add to `.gitignore` (already done):
```
dist/
node_modules/
.env.local
```

---

## Monitoring Deployments

### View Deployment History

1. **Appwrite Console** → **Sites** → **Your Site**
2. Click **"Deployments"** tab
3. See all past deployments
4. Click to view logs

### Check Deployment Status

```bash
# Via CLI
appwrite sites list
appwrite deployments list
```

---

## Performance Tips

### Before Deploying

```bash
# Remove console logs
# Optimize images
# Check bundle size

npm run build
# Check dist/ size
du -sh dist/
```

### Monitor Performance

1. **Appwrite Console** → **Analytics**
2. View traffic and performance
3. Optimize if needed

---

## Security Notes

✅ Keep `.env` files out of GitHub (use `.gitignore`)
✅ Don't commit API keys or secrets
✅ Use environment variables for sensitive data
✅ Keep GitHub repo private if needed

---

## What Gets Deployed

Every time you push:

```
src/          → Used to build
public/       → Copied to dist/
dist/         → Deployed to Sites
node_modules/ → NOT deployed (rebuilt from package.json)
.env.local    → NOT deployed (not tracked)
```

---

## Stop Automatic Deployment

If you want to pause automatic deployments:

1. **Appwrite Console** → **Sites** → **Settings**
2. Toggle **"Auto-deploy"** OFF
3. Deploy manually with CLI when needed

---

## Complete Setup Checklist

- [ ] Code pushed to GitHub
- [ ] GitHub account connected to Appwrite
- [ ] Site created with GitHub source
- [ ] Build command set to `npm run build`
- [ ] Output directory set to `dist`
- [ ] First deployment successful
- [ ] Site loads at Appwrite domain
- [ ] CORS configured in Appwrite
- [ ] OAuth URLs updated
- [ ] SMTP email configured
- [ ] Test automatic deployment
- [ ] Verified site updated from GitHub push

---

## Summary

| Task | When | Command |
|------|------|---------|
| Connect GitHub | Once | Via console |
| Make changes | Always | Edit code |
| Commit changes | When ready | `git commit -m "..."`|
| Push to GitHub | Ready to deploy | `git push` |
| Site auto-updates | 1-2 min after push | Automatic |

---

## You Now Have

✅ Automatic deployments
✅ Staging and production options
✅ Deployment history
✅ Easy rollback (push old code)
✅ Team collaboration ready

---

## Next Steps

1. **Set up GitHub** (this guide)
2. **Make changes** to your code
3. **Push to GitHub** with `git push`
4. **Site updates automatically!**
5. **Repeat step 2-4** forever

---

## Workflow Example

```bash
# Day 1: Initial setup
git init
git add .
git commit -m "Initial commit"
git push origin main
# Appwrite auto-deploys

# Day 2: Add new feature
git checkout -b add-categories
# Make changes
npm run dev  # Test
git add .
git commit -m "Add task categories"
git push origin add-categories
git checkout main
git merge add-categories
git push origin main
# Appwrite auto-updates production! 🚀

# Day 3: Fix bug
# Make changes
npm run dev  # Test
git add .
git commit -m "Fix login redirect"
git push origin main
# Site updated in 1-2 minutes! ✅
```

---

## You're All Set! 🎉

Your deployment pipeline is complete:

```
Code → GitHub → Appwrite Sites → Live!
```

Just push and your site updates automatically! 🚀

**No more manual deployments!**
