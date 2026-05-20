# Hexo Site Operations and Deployment

This document explains the core directories, layouts, and execution scripts used to run, build, and deploy the Hexo-based blog.

## 1. Core Subsystem Folders
- **`source/_posts/`**: Raw article source files written in Markdown.
- **`themes/leeboonstra/layout/`**: EJS layout templates defining DOM structure:
  - `layout.ejs`: Root HTML wrapper.
  - `_partial/head.ejs`: The head element containing responsive styling links, preconnect declarations, and JSON-LD SEO/GEO schemas.
  - `_partial/article.ejs`: Post rendering layout.

---

## 2. Local Running and Testing
To run the complete hot-reloading blog server locally:
```bash
# From the repository root
npm run dev
```
This script:
1. Compiles styles and JavaScript bundles.
2. Starts the Hexo Dev Server at `http://localhost:4000`.
3. Enables instant reloading when Markdown files or templates are changed.

---

## 3. Production Build & Optimization Pipeline
When preparing for production, run:
```bash
npm run build
```
This initiates a highly optimized, serial build pipeline:
1. **Asset Assembly**: Compiles and packages CSS/JS (`node build-tools/build-assets.js`).
2. **Hexo Render**: Generates static HTML pages inside the `public/` folder (`hexo generate`).
3. **Responsive Image Builder**: Automatically resizes raw assets and outputs WebP formats (`node build-scripts/process-images.js`).
4. **Post-Render Minification**: Compresses CSS and JS bundles (`node scripts/minify-assets.js`).

---

## 4. Hosting Deployment
Our static site is hosted on **Firebase Hosting**. To compile and deploy in a single command:
```bash
npm run firebase:build
```
This builds the site, builds the Workbox PWA caching manifest (`workbox generateSW`), and uploads assets to Firebase Hosting.
