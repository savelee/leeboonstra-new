---
name: deploy-app
description: Build the static site assets and deploy to Firebase hosting.
---

# Deploy Application to Firebase Skill

This skill provides the instructions to build, optimize, and deploy the Hexo site to Firebase static hosting.

## 🛠️ Pre-requisites
- Firebase CLI installed (`npm install -g firebase-tools` or locally as devDependency).
- Authentic credentials for Firebase (verify with `firebase login`).
- Correct target project: `leeboonstra-dev-7d578` (configured in `package.json` scripts).

## 🚀 Step-by-Step Instructions

### 1. Prepare Local Environment & Authenticate
Make sure you are logged into the Firebase CLI:
```bash
npm run firebase:login
```

### 2. Build, Optimize & Deploy
You can deploy the application using either the pre-configured npm script (recommended) or the manual shell script.

#### Option A: Pre-configured npm build & deploy script (Recommended)
Run:
```bash
npm run firebase:build
```
This single script automatically coordinates:
1. Building design assets (`node build-tools/build-assets.js`)
2. Clean build and static site generation (`hexo generate`)
3. Minification of output CSS/JS (`node scripts/minify-assets.js`)
4. Workbox service worker generation (`npx workbox generateSW workbox-config.js`)
5. Deployment of the optimized `./public` folder to Firebase Hosting.

#### Option B: Deploy Script (Interactive / Step-by-step)
Alternatively, execute the custom deploy script:
```bash
./deploy.sh
```

## 🔍 Verification
Once the command finishes successfully:
1. Verify the production deployment by visiting the URL provided in the command output (e.g., `https://leeboonstra-dev-7d578.web.app` or similar custom domains).
2. Verify that the Workbox Service Worker starts correctly in the browser console (`Application -> Service Workers` tab in Chrome DevTools).
