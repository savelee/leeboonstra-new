---
name: start-app
description: Start the local Hexo server and compile SASS assets in development mode.
---

# Start Application Skill

This skill provides the instructions to prepare dependencies, pre-process image assets, and run the local development server for the Hexo static site.

## 🛠️ Pre-requisites
- Node.js (v18+ recommended)
- `npm` package manager

## 🚀 Step-by-Step Instructions

### 1. Install Dependencies
Ensure all required dependencies are installed in the root folder and inside the theme design directory:

```bash
# 1. Install root dependencies (Hexo, Jimp, devTools)
npm install

# 2. Install design dependencies (Sass, parcel-bundler)
cd themes/leeboonstra/design
npm install
cd ../../../
```

### 2. Pre-process Image Assets
Before running the development server, you must run the responsive image pre-processing script. This script resizes the raw images located in `source/images` and generates optimized size variants (`thumb`, `small`, `medium`, `large`) and responsive `.webp` placeholders under `public/images/` to prevent 404 asset errors:

```bash
npm run process-images
```

### 3. Start the Development Server
To compile CSS/JS assets and launch the local Hexo server, run:

```bash
npm run dev
```

This command will:
- Compile custom theme CSS/JS assets and place them into the theme folders.
- Start the Hexo server on port `4000`.

The application should be accessible locally at:
- **Hexo site:** [http://localhost:4000](http://localhost:4000)

### 4. Watch for Sass changes (Optional / Parallel)
If you are actively editing styling files in `themes/leeboonstra/design/src/sass/`, start the Sass watch compiler in a separate terminal session:

```bash
./dev-sass.sh
```
or:
```bash
cd themes/leeboonstra/design
npm run watch
```

## 🔍 Verification & Troubleshooting

- **Broken Images (404):** If the local site renders successfully but image assets are broken, verify that `npm run process-images` was executed and that the `public/images/` directory is populated with resized images (e.g., `small_filename.jpg`, `small_filename.webp`).
- **Jimp Memory Exceeded Error:** Jimp restricts image loading to `2048MB` max memory. Very large images (e.g., >7MB) will trigger a decoding error. The pre-processor handles this gracefully by falling back to copy the original file to the target paths so the site renders successfully without broken links.
- **Port already in use:** If port `4000` is occupied, you can specify a custom port:
  ```bash
  npx hexo server -p 8080
  ```
- **Asset compile errors:** If SASS compilation fails, make sure `node_modules` inside `themes/leeboonstra/design` is correctly installed.
