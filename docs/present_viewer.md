<!--
 Copyright 2026 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->

# Hidden PDF Presentation Viewer (`/present/`)

The Hexo site includes an unlisted, non-indexed fullscreen PDF presentation viewer at `/present/` for presenting slide decks hosted in `source/pdf/`.

## Usage

1. Place your `.pdf` slide deck inside `source/pdf/` (for example, `source/pdf/keynote-2026.pdf`).
2. Build or run the site (`npm run dev` or `npm run build`). Hexo copies `source/pdf/` to `public/pdf/`.
3. Open the presentation directly via:
   - `https://www.leeboonstra.dev/present/?file=keynote-2026.pdf`
   - Or open `/present/` without query parameters to select from available PDFs in `source/pdf/` or preview a local PDF file.

## Presentation Controls

- **Next Slide**: Click anywhere on the slide, `Enter`, `Space`, `ArrowRight`, `ArrowDown`, or `PageDown`
- **Previous Slide**: `ArrowLeft`, `ArrowUp`, `PageUp`, or `Backspace`
- **First / Last Slide**: `Home` / `End`
- **Fullscreen**: `F` key or the **Fullscreen** button in the auto-hiding HUD (`Esc` to exit)

## Search Engine & Crawler Exclusion

- **Route Isolation**: `themes/leeboonstra/scripts/present_generator.js` registers `/present/index.html` as a standalone Hexo generator route rather than a Markdown page, excluding it from `sitemap.xml`, `llms.txt`, `llms-full.txt`, and navigation menus.
- **HTML Meta Directives**: `themes/leeboonstra/layout/present.ejs` sets `<meta name="robots" content="noindex, nofollow">` and `<meta name="googlebot" content="noindex, nofollow">`.
- **Robots Exclusion**: `themes/leeboonstra/source/robots.txt` includes `Disallow: /present/` and `Disallow: /pdf/`.
- **Path Validation**: `resolvePdfUrl()` restricts `?file=` / `?pdf=` parameters to same-origin `/pdf/*.pdf` paths, rejecting external URLs and path traversal.
