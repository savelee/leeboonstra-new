# Custom Script Functions and Image Pipelines

Our workspace utilizes custom Node.js build tools and Hexo rendering hooks to achieve rapid loading speeds, responsive image scaling, and robust optimization.

## 1. Custom Assets Post-Processor (`build-tools/build-assets.js`)
- **Purpose**: Bridges the local theme design folder (`themes/leeboonstra/design`) and the main Hexo compilation tree.
- **Workflow**: Triggers SASS and JS compilers inside the design folder, catches build exceptions, and copies output assets to `themes/leeboonstra/source/` (to be picked up by Hexo) and `/public/`.

---

## 2. Responsive Image Builder (`build-scripts/process-images.js`)
- **Purpose**: Processes source images to reduce bandwidth footprint and generate multiple viewport targets.
- **Workflow**: Reads images from `source/images/`, resizes them into four standard boundaries, and creates high-speed WebP replicas.
- **Configuration**:
  - `thumb`: 150x150 (square aspect)
  - `small`: 640x800
  - `medium`: 1024x1280
  - `large`: 1800x2250
- **Fallback Recovery**: If Jimp memory bounds are exceeded (even with a 2048MB heap allocation), the script falls back to copying the raw file, preventing 404 errors in production.

---

## 3. Responsive Image Post-Render Filter (`themes/leeboonstra/scripts/image.js`)
- **Purpose**: Intercepts EJS post content before file writing and injects optimized responsive markup.
- **Workflow**: Matches raw Markdown `<img>` tags using regex and wraps them within an HTML5 `<picture>` schema:
  ```html
  <picture>
    <source srcset="/images/large_image.webp" media="(min-width: 1000px)" type="image/webp">
    <source srcset="/images/medium_image.webp" media="(min-width: 500px)" type="image/webp">
    <source srcset="/images/small_image.webp" media="(max-width: 499px)" type="image/webp">
    <img src="/images/small_image.jpg" alt="Alt description" />
  </picture>
  ```

---

## 4. Client Bundle Compressor (`scripts/minify-assets.js`)
- **Purpose**: Minifies JS and CSS files inside `/public/` post-generation.
- **Workflow**:
  - **JavaScript**: Employs **Terser** to strip comments, drop debug statement nodes, and minify bundles.
  - **CSS**: Employs **Clean-CSS** to parse and compress styles with aggressive Level-2 optimizations.
