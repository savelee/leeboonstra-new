# Stylesheet and Client JS Maintenance

Our styles and client-side scripts are managed using a modular design workflow isolated inside the theme directory.

## 1. Design Directory Structure
The styles and scripts source lives in:
`themes/leeboonstra/design/`

- **`/src/sass/`**: Modular SASS files compiled into the core stylesheet.
  - `main.scss`: Root stylesheet importing Bootstrap variables and custom layers.
- **`/src/js/`**: ES6 client scripts.
  - `index.js`: Entry point initializing menu hooks and service workers.
- **`/dist/`**: Output destination for compiled static assets.

---

## 2. Local Design Sandbox
You can run and test styles in isolation without compiling the full Hexo blog.

1. Navigate to the design directory:
   ```bash
   cd themes/leeboonstra/design
   ```
2. Start the isolated design sandbox:
   ```bash
   npm run dev
   ```
   This compiles SASS, bundles JS with **Parcel**, and launches a hot-reloading dev server pointing to the local `index.html` layout file.

---

## 3. Style Watcher Compilation
To watch for CSS changes and compile them instantly during post writing:
```bash
cd themes/leeboonstra/design
npm run watch
```
Whenever a SASS file under `/src/sass/` is modified, the watcher automatically executes the SASS compiler (`sass-to-css.js`) to rebuild `dist/main.css`.

---

## 4. Main Site Compilation
During production builds, the root compiler script (`build-tools/build-assets.js`) orchestrates compilation:
1. Commands SASS compile inside the design folder.
2. Compiles and bundles Javascript to `dist/bundle.js`.
3. Copies the compiled stylesheet from `design/dist/main.css` to `themes/leeboonstra/source/main.css`.
4. Copies compiled script bundles directly to `public/`.
