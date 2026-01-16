# GitHub Pages Deployment Guide

This guide explains how to deploy the demo to GitHub Pages.

## 🚀 Automatic Deployment (Recommended)

The repository is configured with GitHub Actions for automatic deployment. Every push to the `main` branch will automatically build and deploy the demo.

### Setup Steps:

1. **Enable GitHub Pages in Repository Settings**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: Select **GitHub Actions**
   - Save the settings

2. **Push Your Code**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

3. **Wait for Deployment**
   - Go to the **Actions** tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow run
   - Once completed, your demo will be live at:
     `https://yangcheng0121.github.io/react-virtual-masonry/`

## 📦 Manual Deployment

If you prefer to deploy manually using the `gh-pages` package:

1. **Build the Demo**
   ```bash
   npm run build:demo
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages**
   - Go to **Settings** → **Pages**
   - Source: Select **Deploy from a branch**
   - Branch: Select **gh-pages** and **/ (root)**
   - Save

The demo will be available at: `https://yangcheng0121.github.io/react-virtual-masonry/`

## 🔧 Configuration Files

The following files are configured for GitHub Pages deployment:

- **vite.config.ts**: Sets `base: "/react-virtual-masonry/"` for correct asset paths
- **.github/workflows/deploy.yml**: GitHub Actions workflow for automatic deployment
- **package.json**: Contains `build:demo` and `deploy` scripts

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `demo` folder with your domain name
2. Configure DNS settings with your domain provider
3. Enable "Enforce HTTPS" in GitHub Pages settings

## 🐛 Troubleshooting

### Assets Not Loading
- Verify the `base` path in `vite.config.ts` matches your repository name
- Check that the repository name is correct: `/react-virtual-masonry/`

### Deployment Fails
- Check the Actions tab for error logs
- Ensure GitHub Pages is enabled in repository settings
- Verify the workflow has proper permissions (Settings → Actions → General → Workflow permissions)

### 404 Error
- Make sure GitHub Pages source is set to "GitHub Actions"
- Wait a few minutes after deployment for DNS propagation
- Clear browser cache and try again

## 📝 Notes

- The demo is built from the `demo` folder
- Build output goes to `dist-demo` folder
- The `dist-demo` folder is gitignored (not committed to the repository)
- GitHub Actions automatically builds and deploys on every push to main