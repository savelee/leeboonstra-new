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

# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- **Resume Skills Taxonomy**: Split the combined Frontier/Open-Source LLM skill tag into two separate, cleaner tags: `"Frontier LLMs (Gemini, Claude, GPT)"` and `"Open Source LLMs (Gemma, Llama, Gwen, Mistral, Phi)"`.
- **Resume Unit Tests**: Updated `tests/resume_api.test.js` to verify the new split LLM tags.

### Fixed
- **About Page Sidebar Book Sizing**: Standardized all book download images in the `/about` page sidebar to be exactly `197px` by `255px` (matching the prompt engineering cover size) and enforced `object-fit: cover` to prevent image distortion.
- **Biography Card Image Spacing**: Added `30px` left and right margins to the `<picture>` element inside `.author-bio-card` in standard mode, providing elegant spacing and breathing room around the profile image.
- **Sidebar Books 2x2 Grid Layout**: Migrated the `.books` container in `main.scss` from a horizontal flex row to a structured CSS Grid (`repeat(2, 70px)`), stacking the 4 books as a 2x2 grid to fit perfectly in the narrow homepage sidebar.
- **Book Cover Aspect Ratio Correction**: Enforced `height: auto !important` on all `.books` images to prevent the 2nd book cover (and others) from stretching or distorting due to conflicting inline HTML height attributes.
- **Standard Mode Biography Card Column Alignment**: Constrained the `.author-bio-card` in `main.scss` to `48rem` (`100ch` on >= 1400px) and centered it, aligning its boundaries perfectly with the body text column.
- **Biography Card Spacing Synchronization**: Updated standard mode column paddings inside `.author-bio-card` to match reader mode exactly (`0 1.25rem 0 0` on the image column, and `0` on the text column), correcting the loose spacing between the profile image and the biography text.
- **Standard Mode Author Bio Card Layout**: Standardized the `.author-bio-card` in `main.scss` to always maintain a horizontal flex layout on all screen sizes (no stacking on mobile). Enforced a `100px` by `100px` round profile image on the left, and overridden the biography heading (`h4`) to align at `left: 0`, preventing the desktop hanging outdent.
- **Reader Mode Border Cleanups**: Removed gray borders, padding, and background frames from images, code blocks (`figure.highlight`, `pre`, `code`), and horizontal rules (`hr`) in reader mode, creating a cleaner, book-like E-ink interface.
- **Reader Mode Author Bio Card**: Implemented comprehensive overrides for `.author-bio-card` inside the reader-mode mixin, ensuring the profile image stays on the left (as a small, round, borderless circle), the card background renders as gray (`#f1f5f9`) without borders, and action buttons maintain their blue background, white text, and underline-free styling.
- **Code Block Centering**: Corrected the `figure.highlight` SASS rule from `margin: 2rem 0 !important` to `margin: 2rem auto !important` in `main.scss`, resolving the issue where code blocks were left-aligned on large screens.
- **Author Bio Card Text Alignment**: Implemented SASS overrides in `main.scss` for `.author-bio-card` child text elements (`p`, `h1`-`h6`) to reset their `max-width` and `margin-left`/`margin-right`, ensuring they align perfectly with the card's action buttons rather than inheriting global reading-column centering constraints.
- **Code Block and Typography Alignment**: Standardized the maximum width of all editorial elements (paragraphs, headings, lists, blockquotes, and code blocks/highlights) to `100ch` inside `.blogcontent` on large viewports (>= 1400px). This ensures code blocks and other text elements align perfectly with the reading column rather than expanding to the full container width.
- **Author Bio Card Compactness & Styling**: Refined the "About the Author" card in the post footer to align with the `100ch` reading column. Reduced the padding to `p-3`, scaled the profile image down by 50% (to `50px`), and adjusted the grid layout to a tighter `2/10` split. Standardized the action buttons to use the premium `.btn-custom-action` class, matching the exact styling, hover effects, and category-active highlights of the `READER VIEW` button.
- **Resume Skills Taxonomy and Unit Tests**: Updated `resume.yml` to include new AI/ML keywords (`JAX`, `Model Tuning`, `Deep Reinforcement Learning (RL)`, `MuJoCo`), modernized the LLM and vLLM terms, and migrated frontend frameworks (`React`, `Angular`, `Ext JS`, `Sencha Touch`) along with `NumPy` into the Programming Languages section. Updated `resume_api.test.js` to synchronize assertions and maintain a passing test suite.

### Added
- **Image Containment Utility Class**: Introduced the `.img-contain` SASS/CSS class to allow specific high-fidelity diagrams and charts to bypass global cropping (`object-fit: cover`) and height caps. Applied the class to the topological network graph, semantic vector space, and virtual shrink simulator diagrams in the DSM-5 vector space blog post by wrapping them in `<div class="chart-container img-contain">`, ensuring they render fully without distortion while preserving the responsive image asset pipeline.
- **DSM-5 Vector Space Blog Post Image Integration**: Standardized all visual assets to use standard Markdown image syntax (`![alt text](url)`) to enable automatic responsive WebP transcoding, and removed the comorbidity loop Mermaid diagram. Implemented a self-contained `.chart-container` wrapping class and local `<style>` block directly inside `dsm5-vector-space.md` to enforce `object-fit: contain !important` and remove height caps, ensuring the technical charts scale to their full, natural proportions without affecting global site layouts.
- Two new video posts covering the Kaggle "5-Day AI Agents: Intensive Vibe Coding Course with Google" event: "DAY 5 Livestream" and "Whitepaper Companion Podcast: Spec-Driven Production Grade Development in the Age of Vibe Coding".
- Elite Networking & Strategic Horizons callout section in biography sidebar on screen.
- Philanthropy (volunteer) details to the resume database (`source/_data/resume.yml`), template renders, and static text/markdown API generation.
- The Dutch State of AI in Advertising speaking event for 2026 to `source/speaking/index.md`.
- Button linking to `/videos` page inside the speaking page introduction.
- Custom `.btn-custom-action` SASS classes and `.historical-events` wrapping layouts to align and compress older timeline sections.
- "Lee's Biography" link button next to watch videos link in speaking page introduction.
- Author Bio Card component in article layout footer (`article.ejs`) with custom links to about and speaking pages.

### Changed
- Rewrote speaking page introduction to focus on high-impact keynotes and developer audiences.
- Rewrote writing page title and introduction copy to establish authorship and showcase publication result metrics.
- Styled watch videos links to use `.btn-custom-action` and wrapped in `<p>` tags for exact alignment.
- Restructured `/writing/` page layout (`_partial/writing.ejs`) to use a two-column about page layout with the full profile sidebar (including social and author links) while dynamically looping through books and writing posts as portfolio cards.
- Upgraded book cover image quality on the `/writing/` page, referencing high-resolution source files (O'Reilly, Apress, and Kaggle Whitepaper) instead of compressed thumbnails.
- Added SASS overrides for `.portfolio-card` inside `main.scss` to disable global header outdents (`left: 0 !important`), scale card headers down to `1.25rem`, scale body text to `0.85rem`, and align list content horizontally with card headers by removing list margins and bullets.
- Hidden duplicate *External Blogs & Articles* block from `/writing/` index by shifting `write-blogs.md` to `ExternalBlogs` category.
- Wrapped major content sections (Core Topics, timeline years, and archives) on `/speaking/` inside responsive `.portfolio-card` containers to harmonize visual patterns with biography sections.
- Restructured `about.ejs` sidebar layout to restrict social links, Amazon author profile, and prompt engineering whitepaper download elements to biography/about layouts, keeping generic pages focused.
- Changed "Past speaking events" links inside biography sidebar to target `/speaking/` instead of `/speaker`.
- Refined professional experience bullets to be highly result-focused while preserving existing multi-agent leadership context.
- Restructured technical skills taxonomy in `resume.yml` into 5 high-impact categories: AI & Machine Learning (preserving all original keywords and appending new ones), GenAI Architectures & Orchestration, Databases, Data & Cloud Infrastructure, and Programming Languages.
- Combined and updated publication metrics (downloads, views, online accesses, citations) inside the book and whitepaper summaries.
- Updated `tests/resume_api.test.js` to assert the 5-group skills structure while preserving original AI/ML assertions.

### Removed
- Large intro profile photo from the speaking page (`source/speaking/index.md`).
- Large author book cover photo from the top of the `/writing/` page introduction (`source/writing/index.md`).
- Book cover image from the O'Reilly book post (`source/_posts/write-oreilly.md`).

### Fixed
- Hid "Reader View" toggle and utility metadata wrappers from physical prints and PDF generations inside `print.css`.
- Hid "About the Author" bio cards from physical prints and PDF generations inside `print.css`.
- Fixed list item bullet overlap styling on speaking page timeline headers by resetting native list offsets.
- Sanitized trailing slashes (`/`) from core void elements (`<meta>`, `<link>`, `<img>`) inside layout modules (`head.ejs`, `profile.ejs`, `about.ejs`, `print_resume_layout.ejs`) to strictly satisfy modern W3C HTML5 standards.
- Replaced third-party legacy package `hexo-auto-canonical` with a clean, lightweight native helper script (`themes/leeboonstra/scripts/canonical.js`) to generate HTML5-compliant trailing-slash-free canonical link elements.
- Refactored responsive markdown image generator utility (`themes/leeboonstra/scripts/image.js`) to parse and write valid standard-compliant image tags.
- Fixed YouTube player click event listener on the `/videos/` page to prevent anchor navigation and handle event target mismatches.

### Added
- Added standard architectural documentation under `docs/w3c_validation_fixes.md` detailing code rationale, and registered it within the documentation navigation menu (`mkdocs.yml`).
- Added two new Hexo posts in the Videos category for "5-Days of AI Agents: Intensive Vibe Coding Course With Google" and "Whitepaper Companion Podcast: Spec-Driven Production Grade Development in the Age of Vibe Coding".


### Added
- **Dynamic Social Sharing Previews (Open Graph & Twitter Cards)**: Configured dynamic social sharing calculations inside the theme's core `<head>` template (`head.ejs`). Automatically computes correct `og:type` (`article` for posts, `website` for pages), resolves canonical `og:url` dynamically, crops plaintext descriptions to exact lengths for social snippets, and serves high-resolution article-specific featured images (`large_*.webp`) to social previews. Introduced explicit `summary_large_image` Twitter card metadata blocks for premium, wide visual preview display cards on X. Synchronized the post JSON-LD schema's key visual block target with the dynamic featured banner.
- **Modern Outline Icon System**: Overhauled dynamic navigation bar and functional UI symbols (Home, Bio, Speaking, Writing, Videos, Abstracts, Chat, FAQs, Hamburger, and Close) from old solid silhouette shapes to pixel-perfect 24x24 single-stroke vector coordinates. Built a dynamic `.icon-modern` styling wrapper class to establish line thickness/stroke parameters cleanly, preventing interference with brand-specific solid media icons (GitHub, LinkedIn, RSS, StackOverflow). Documented system in `docs/style_updates_modern_icons.md` and registered navigation target within `mkdocs.yml`.
- **Adaptive PWA Maskable Icons**: Integrated responsive maskable launch icons (`web-app-manifest-192x192.png` and `web-app-manifest-512x512.png`) inside `manifest.json` for custom adaptive design adjustments in modern mobile platforms launcher grids.
- **E-Reader Optimized Reader Mode**: Developed a distraction-free **Reader View** optimized for low-refresh-rate e-readers (Onyx Boox, etc.) and high-legibility book-like reading. Uses modern CSS `@media (update: slow)` to automatically detect physical e-ink displays and strip sticky headers, sidebars, social buttons, and animations.
- **Progressive Enhancement Reader Toggle**: Added an interactive **Reader View** button right above single post and biography titles, managing responsive UI shifts instantly via JS class-toggling (`force-ereader`), and synchronizing state across page navigation using client `localStorage` and shared URL queries (`?reader=1`).
- **Flat Light High-Contrast Code Highlight Overrides**: Overlaid custom CSS overrides inside reader mode to transform dark Prism syntax highlight containers into clean, light-gray blocks with sharp solid borders and high-contrast typography, preventing e-ink ghosting/flashing.
- **Unified Printed Sheets Layout**: Synchronized print styles with distraction-free reader mode layouts for all standard blog documents (excluding the specific multi-column resume page), dynamically serving elegant book-style fonts, centered spacing, and clean grayscale syntax coding structures to paper and PDF print workflows, while hiding manual screen interactive buttons.
- **New Blog Post: Learning the Hard Way**: Authored a high-density, first-person technical article (`source/_posts/learning-the-hard-way-when-agents-build-agents.md`) analyzing the transition to human-agent hybrid teams at Google's CTO Office, featuring GFM-compatible dynamic Mermaid.js sequence diagrams, key career and geographic SEO anchors, specific models versions (Gemini 3.5 Flash), and using the newly processed `cartoon1` image as the primary responsive featured asset.
- **Modern Article Typography & Design Overhaul**: Implemented an elegant, highly readable reading-column layout inside the article template SASS rules, constraining narrative blocks (`p`, `ul`, `ol`, headers, blockquotes) to a high-comfort, font-size independent width (`48rem` / 768px) with auto-centering to maximize legibility. Added a premium hanging outdent shift (`left: -1.5rem`) on desktop viewports for section subheaders (`h2`-`h6`) to create clean visual section anchors. Overhauled standard lists with generous `1.7` line-heights, unified slate-colors, safe recursive nestings, and elegant padding. Rebuilt data tables with a sleek modern card aesthetic (rounded corners, slate borders, light gray headers, hover highlight states, alternating zebra rows) and native mobile horizontal touch scroll wrappers.
- **Uniform Card Top Image Grid Heights & Top Focus Crop**: Overhauled the card top image structures (`.card-img-top` SASS selectors) globally across the index and archives grids, replacing squished `max-height` and `height: auto` properties with exact, fixed responsive heights (e.g., standard cards at `220px` desktop) to guarantee perfect horizontal column alignment. Swapped focal positioning from `center` to `top` (`object-position: top !important;`) to display card graphic assets cleanly from their top bounds. Built custom overrides (`380px` desktop) for the top lead showcase card (`.card.tall`) to retain visual impact.
- **Optimized Google Fonts Loading Speed (FCP/LCP -200ms)**: Decommissioned the synchronous SASS `@import` fonts bottleneck rule inside `_fonts.scss` and transitioned web font definitions to parallel-loading HTML `<link>` tags combined with active DNS `preconnect` key target pre-handshakes inside `head.ejs`. This enables initial user agent connections to download Google Fonts assets in parallel alongside your main stylesheet, saving up to 200ms to 400ms on initial page render paint intervals.
- **Unified Global Paragraph & Lead Fonts**: Overhauled the global body paragraph and introduction text styles (`p, .lead` SASS block configurations) from the hardcoded Georgia/Source Serif Pro stack to the standard base site typography stack (`$font-family-base`, thus `'BreveText', 'Lora', helvetica, sans-serif`), establishing clean global font coordination.
- **Synchronized Homepage Card Fonts**: Swapped out the hardcoded Georgia/Source Serif Pro stack on standard index card preview paragraphs (`.card-text` inside highlight and archive list components) for the global site base typography stack (`$font-family-base`, thus `'BreveText', 'Lora', helvetica, sans-serif`), guaranteeing full typographical harmony between page listings and actual deep-dive detail articles.
- **Restored PWA Service Worker Registration Loop**: Injected a robust, uncompiled Service Worker registration block inside the footer layout template (`footer.ejs`) equipped with a dynamic browser-level `controllerchange` event monitor. This forces returning client browsers to run an auto-refresh cycle the instant a new Service Worker takes control in the background, successfully hot-swapping older cached pages and instantly delivering fresh visual updates and new blog posts without requiring manual hard reloads.
- **Refined Index Card Heading Dimensions**: Scaled down the font-size of standard card body headings (`.card-body h2`) globally inside SASS from `1.7rem` to a more balanced `1.4rem` to prevent aggressive text lines wrapping inside grid cards.
- **Protected Profile Headshot Dimensions**: Appended strict high-specificity overrides inside SASS targeting the sidebar profile headshot wrapper (`.profile .headshot`), its embedded `<picture>` elements, and the `img.card-img-top` child elements, guaranteeing it remains an isolated, circular `100px` by `100px` headshot with your precise custom crop parameters on all grid screens.
- **Interactive Index Grid Card Titles**: Resolved a link target selector bug in [title.ejs](file:///Users/leeboonstra/Documents/Github/leeboonstra-new/themes/leeboonstra/layout/_partial/post/title.ejs#L20), redirecting standard index list posts from non-functional external `post.link` targets to their actual internal local post path `post.path`. This guarantees that card titles on the homepage are fully interactive links that lead directly to the corresponding articles instead of relying solely on the "Continue Reading" button widget.
- **Fixed Ternary Syntax in GitHub Profile Sync Script**: Resolved a missing trailing expression colon syntax crash on line 55 of `scripts/sync-github-profile.js` to ensure error-free runtime asset packaging.

### Changed
- **Sitemap XML Duplicate Indexing Exclusions & Dynamic Robots Meta Rules**: Configured sitemap generator settings (`_config.yml`) to set `tags: false` and `categories: false`, and surgically stripped Nunjucks tag/category loops from the custom `sitemap_template.xml` file to keep low-value duplicate tag and category list paths out of the sitemap. Added a dynamic EJS block in the `<head>` partial template (`head.ejs`) to inject `<meta name="robots" content="noindex, follow">` on all tag, category, and chronological archive pages. This stops engines from indexing duplicate lists while allowing them to discover and pass authority to actual post URLs. Created a system manual page `docs/sitemap_exclusions.md` and registered it within the documentation navigation menu (`mkdocs.yml`).
- **Footer Disclaimer Contrast & Typography**: Refactored the bottom disclaimer styling (`.disclaimer` SASS properties) to use the signature `Lora` serif font, reduced font size to `0.85rem` for subtext balancing, and updated text color to standard Slate-gray (`#475569`) to improve readability and contrast on standard screen backdrops.
- **Design Authorship Attribution**: Appended a design credit string ("Hexo Blog Design by Lee Boonstra") separated by a clean bullet element inside the shared footer layout template (`footer.ejs`).
- **Responsive Grid Layout and Sidebar Breakpoints for Portrait Monitors**: Configured responsive mobile-stacking override selectors to cover all viewports under `992px` OR portrait orientations under `1200px` to resolve cramped column formatting and word-wrapping on vertical monitors. Standardized all portrait list pages and video containers in these bounds to render as a balanced **2-column grid** (allowing standard 4 secondary cards to sit as a perfectly balanced 2x2 layout instead of a 3+1 design, while maintaining a clean flat line of 4 columns on landscape desktops). Updated the central visual design specifications in `docs/style_updates.md`.
- **Individualized Category Badges & Spacing**: Refactored category lists by removing solid single-bar blue background wrappers in favor of modern semantic individual tag pill badges, and styled `.badge-primary-link` to separate category tags with explicit horizontal and vertical margins, preventing them from bleeding together as "one blue line".
- **Sidebar Header Color Sync**: Set the main sidebar profile bio header ("LEE BOONSTRA") to align with the primary theme color ($primary cobalt blue) to establish global brand harmony.
- **Wide Vertical Portrait Layout**: Optimized vertical responsive screen layouts to force single-column portrait stacking on all display viewports currently in portrait orientation, including modern high-res vertical screens and tablets wider than 768px.
- **Consolidated PWA Manifest Pipeline**: Upgraded EJS structures to prune the duplicate `/site.webmanifest` link, set the unified `/manifest.json` block as the sole authoritative manifest file, and synchronized its `name` and `short_name` properties to correctly render as "Lee's Tech Blog" on user mobile homescreens.
- **Semantic HTML5 Landmark Boundaries**: Replaced regular container divs with explicit, logical `<main>` tags inside the main templates to ensure optimal page outline accessibility.
- **Corrected Heading Sequence Mappings**: Converted footer widget containers and career Bento cards in `about.ejs` from `<h4>` down to sequential `<h3>` nodes, completely correcting WCAG skipping sequence rules, while adapting global SASS styles inside `main.scss`.
- **LCP Speed Optimization and Lazy Loading**: Accelerated LCP discovery times by assigning high loading priority (`fetchpriority="high"`) to the lead highlight featured image, and deferred offscreen list images using the native `loading="lazy"` standard property.
- **Restructured Firebase Cache Directives**: Re-ordered header matching declarations inside `firebase.json` so the generic `.css` rule evaluates first while assigning immutable lifetime headers (`max-age=31557600, immutable`) specifically for static Prism scripts.
- **Modernized Google Analytics tracking architecture**: Relocated the tracking scripts from the footer template `footer.ejs` to the end of the `<head>` block in `head.ejs` to capture high-bounce bounces and compute accurate initial page interaction metrics. Added dynamic configurations loading the tag ID from the root `_config.yml` settings (`config.google_analytics`). Injected programmatical loop-environment filtering to disable analytics on local domains (`localhost`, `127.0.0.1`, and local loop hostnames). Upgraded GTM and GA network links to high-priority `preconnect` sockets.
- **Biography Experience Update**: Updated Google experience duration from eight to ten years in the global profile biography layout and video index metadata description.
- **Biography Prompt Engineering Paper Interaction**: Linked the prompt engineering paper thumbnail image in the profile sidebar to the actual published whitepaper PDF.

### Fixed
- **Homepage Highlight Card Category Badge Spacing**: Surgical correction of SASS overrides inside `.tall .card-header .badge` that stripped standard right margins. Set a safe, target-specific right margin spacing of `0.6rem !important` (retaining `0` margin for the trailing child to keep perfect alignment with other elements), restoring visual whitespace between category tags on the homepage lead card.
- **Static Open Graph Targets & Trailing Space Title Bug**: Resolved bug where `og:url` was hardcoded to the homepage, which routed or misattributed social metrics to the global domain root. Fixed global fallback of `og:image` where posts shared standard branding screens instead of specific post featured images. Resolved an accidental trailing whitespace in page HTML `<title>` strings.
- **Shared Layout Resume Leak**: Integrated robust EJS conditional routing (`<% if (page.layout === 'about' || page.layout === 'bio') { %>`) in the shared partial `about.ejs` template, completely isolating the print resume CTA button, print-only header block, and career timeline bento grid from non-biography layouts (speaking, contact). This guarantees that other informational pages remain lightweight on desktop and print natively utilizing raw markdown margins without injecting employment profiles.
- **Formalized Resume Headers**: Promoted the standard career timeline landmark section heading inside EJS templates from 'Experience' to 'Professional Experience' for enhanced recruitment presentation harmony.

### Added
- **Structured Schema-Driven Resume Core**: Integrated centralized career milestone database inside `source/_data/resume.yml` following the industry-standard JSON Resume schema using human-readable YAML configurations.
- **Multi-Format Static Career APIs**: Formulated custom Hexo generator plugin `themes/leeboonstra/scripts/resume_endpoints_generator.js` to automatically compile high-density `/about/resume.json` (JSON Resume), `/about/resume.md` (RAG-ready Markdown), and `/about/resume.txt` (Ultra-compatible plain text) endpoints during compiling.
- **Clean Visual Resume Page Endpoint**: Added custom HTML resume route `/about/print/index.html` generating a clean virtual paper page directly on-screen, forcing `print.css` styling rules globally.
- **Clean Visual Resume Template Layout**: Formulated custom page wrapper `themes/leeboonstra/layout/print_resume_layout.ejs` loading unified styling bounds, custom physical margins, floating print actions widgets, and compiling using template reuse on EJS partial frameworks.
- **Agentic GitHub Profile Sync Pipeline**: Created Git-sync pipeline script `scripts/sync-github-profile.js` and automated workflow `.github/workflows/github_profile_sync.yml` to automatically rebuild, format, and deploy updated technical resume landing cards to the `savelee/savelee` GitHub profile README page on every push.
- **Global Robots AI Crawler Authorizations**: Configured explicit allow-listing for major AI indexing crawlers (`GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, and `PerplexityBot`) inside the base `robots.txt` template to eliminate discoverability blocks.
- **Core Briefing Index (`llms.txt`)**: Integrated a highly curated machine-readable markdown briefing file at the site source root, directing scrapers to portfolio pathways and aggregated indices.
- **Corpus Compiler (`generate-llms-txt.js`)**: Implemented a resilient Node.js preprocessor script that parses markdown posts, ignores hidden pages, handles liquid tag replacements (Gists and YouTube URLs), strips base64 assets to save tokens, normalizes relative URLs to absolute links, and builds a consolidated aggregated body log.
- **AI Integration Manual**: Created [docs/ai_crawlers_ingestion.md](file:///docs/ai_crawlers_ingestion.md) detailing compiler subsystems, asset cleaning, sitemaps, and Cloudflare WAF bot settings.

### Changed
- **Refactored Biography EJS Layout**: Dynamic-looped experiences, patents, publications, academic credentials, and skill categories using the custom dynamic functions mapping `site.data.resume`, resolving structural code debt inside `about.ejs` while preserving signature visual branding.
- **Refocused Sourcing Career Positioning**: Refined resume summary, roles headlines, technical capability arrays, and timeline landmarks inside the resume database `resume.yml` to highlight **Staff and Technical Leadership (L6+)** core competencies (systems architecture, framework governance, engineering pod direction, patents filings, and organizational impact metrics).
- **Sitemap References**: Streamlined the dynamic sitemap declaration links inside `robots.txt` to align with root canonical mappings.
- **Pipeline Operations Hook**: Configured core `package.json` compilation tasks to trigger automated context indexing before standard Hexo compiler generations.
- **Documentation Registry**: Registered the new AI Ingestion handbook inside the `Local Run Manuals` index of `mkdocs.yml`.

### Added
- **Professional Print Resume Template**: Integrated dynamic print-only header card inside the biography layout (`about.ejs`), mapping dynamic front-matter subtitle and essential professional anchors (GitHub, LinkedIn, Website, Location).
- **Resume Birth Metadata & Email Contact Headers**: Appended detailed birth parameters (Born: 16 June 1983, Apeldoorn, Netherlands) to the print header, and inserted contact email (lee@leeboonstra.com) to the top printed anchors card.
- **Repeating Print Resume Page Footer**: Appended print-only page repeating footers displaying "Lee Boonstra | AI Engineering | lee[at]leeboonstra.com - Page <number>" centered at the bottom of every page, formatted using W3C page counter elements.
- **Print Resume CTA Button**: Injected a premium outlined, hover-animated 'Print My Resume' button widget (utilizing browser window.print() triggers) into the sidebar, replacing the legacy PDF download anchor.
- **Resume Print System Documentation**: Created spec sheet `docs/print_resume.md` describing the geometric parameters, page margins, points-scaling system, and page-break optimization blocks.
- **Structured Data & Voice AI Tagging manual**: Created [docs/structured_data_voice_search.md](file:///docs/structured_data_voice_search.md) detailing settings and syntax markup guidelines.
- **Auto-tagging speakable filter script**: Formulated Hexo filter (`themes/leeboonstra/scripts/speakable.js`) and Jest testing suite (`tests/speakable_filter.test.js`) to target key takeaway sections dynamically.

### Changed
- **Resume Screen-Hide & Page Margins Overhaul**: Implemented screen display none overrides to suppress print resume blocks when viewing standard web pages, configured browser-level physical page dimensions (`@page` layout margins), specifically calibrated bottom margins padding (25mm) for repeating footer buffers, and attached vertical margins top spacing.
- **Scaled Print Contact Anchors**: Scaled down the printed contact column anchors inside print.css to 7.5pt with custom leading gaps for professional balancing.
- **Overhauled Resume Print Stylesheet**: Completely refactored `print.css` targeting `@media print` with maximum specificity overrides. Hides site-wide navigation/footers, flattens card frames/shadows, forces 100% vertical chronology on experience blocks, formats horizontal skill sections into clean slate badges, and disables raw inline URL appending to prevent blocky sentence structures.
- **Registered Documentation Navs**: Appended the new Print Resume manual page inside the `Local Run Manuals` catalog of `mkdocs.yml` configuration.
- **Print Stylesheet Cache-Busting**: Upgraded print stylesheet loading links in `head.ejs` to use dynamic version metadata parameters, ensuring absolute instant loading of layout updates.
- **SEO Schema Separation**: Upgraded `head.ejs` to dynamically split `TechArticle` from `BlogPosting` representing standard logs and technical tutorials, resolving dependencies and proficiency targets with fallbacks.
- **Duplicate Schema Cleanup**: Removed duplicate body-level `BlogPosting`, incorrect `Chatbots` post mappings, and nested `WebPage` with speakable bindings from `article.ejs` layout block.
- **FAQ Decommissioning**: Deleted deprecated search layout markup blocks inside EJS layouts.

### Added
- **Bento Visual System Manual**: Created `docs/style_updates.md` detailing typographic rules, premium color palettes, and interactive card animations for the developer profile.

### Changed
- **Modern Bento Resume Chip Overhaul**: Redesigned core resume boxes (experience, education, skills, publications, and languages) into rounded white bento card modules featuring active hover translations and smooth CSS shadow transitions.
- **Refined Color Schemes**: Swapped highly-saturated primary colors with high-fidelity, sophisticated tech-scene palettes (Cobalt, Deep Rose Crimson, Warm Amber, Emerald).
- **Typographic Identity Restorations**: Reverted base and heading font-families to signature identity serif layouts (`Source Serif Pro`, `Bebas Neue`, `Roboto Slab`) while fully retaining the new slate-colored styling properties.

### Added
- **Cross-Platform SASS Asset Watcher**: Implemented a recursive, debounced asset-watching script (`build-tools/watch-assets.js`) that detects changes in SASS source files and automatically compiles and deploys them to the theme static source folder.

### Fixed
- **Asset Pipeline Parcel Sass Compiler Crash**: Resolved compilation failure in Parcel bundler by removing the redundant `@import` statement in the client script, ensuring 100% successful JavaScript asset packaging.
- **Cross-Platform Path Script Compatibility**: Replaced Windows-specific shell commands (`copy`) in root asset scripts with platform-agnostic Node.js utilities to guarantee seamless execution on macOS and Linux environments.

### Optimized
- **SEO Targeting for AI/ML Careers**: Enhanced central `Person` schema metadata in `head.ejs`, injecting high-priority ML search terms (`Staff Machine Learning Engineer`, `PyTorch`, `vLLM`, `RLHF`, `DPO`, `Agentic Workflows`, `LangChain`, `GraphRAG`, `Antigravity`, `Vibe Coding`, `Gemini`, `OpenAI GPT`, `Claude`) to target recruiters at Meta, Microsoft, OpenAI, and Anthropic.
- **Schema.org Job Mapping**: Re-focused global job titles from general relations to advanced applied engineering architectures.
- **SEO & GEO Structured Data Mappings**: Standardized all global and local structured schema blocks to reference the authoritative central `Person` identifier (`https://www.leeboonstra.dev/#person`).
- **Schema Graph Cleanup**: Removed redundant loop-nested Person and CreativeWork schema redeclarations inside `abstracts.ejs` and `article.ejs` to avoid redundant payloads.
- **Structured Schema Precision**: Shifted the biography layout in `about.ejs` to an accurate `AboutPage` schema structure, and connected `VideoObject` items in `videos.ejs` back to the author profile.
- **About Page Resume Enrichment**: Expanded the technical skills inventory and professional experience details in `about.ejs` to include modern agentic architectures (`LangChain`, `LangGraph`, `GraphRAG`), internal tools (`Antigravity`), and paradigm models, while fully preserving legacy listings.

### Changed
- **Documentation Restructuring**: Cleaned up `README.md` to focus exclusively on Docs Site setup and Custom Developer Agentic Skills usage, removing legacy Travis CI configurations and setup details.
- **Hexo Operations Manual Migration**: Migrated complete Hexo setup, dependency installation, troubleshooting, and Workbox PWA caching commands from `README.md` to [docs/pipeline_hexo.md](file:///docs/pipeline_hexo.md).

### Added
- **Advanced Mermaid Diagram Support**: Integrated dynamic client-side rendering of Mermaid diagrams in blog posts with robust multi-line text extraction and HTML entity decoding, successfully parsing both standard and fallback code blocks.
- **Post Composition & Formatting Manual**: Added a comprehensive Markdown guide [docs/post_formatting.md](file:///Users/leeboonstra/Documents/Github/leeboonstra-new/docs/post_formatting.md) explaining Prism code syntax highlighting and interactive Mermaid diagram usage, and registered it in `mkdocs.yml`.
- **Technical Agent Blog Post**: Authored `source/_posts/vibe-coding-graphrag-workflows.md` which focuses on Vibe Coding, GraphRAG, and multi-agent systems utilizing Gemini, Claude, and OpenAI GPT models.
- **Press Releases Updates**: Added Google Cloud blog post on AI code reviews ("When AI writes the code, who reviews it?") to the top of the Lee Boonstra Press Releases section.
- **Unified Build Script Automation**: Integrated the responsive image pre-processing (`process-images`) and asset minification into the standard `npm run build` workflow, ensuring consistent builds.
- **PWA Service Worker Precaching**: Verified robust service worker compilation using Workbox, caching core static assets for offline rendering capabilities.
- **Custom Developer Customizations & Agent Setup**: Scaffolding of `.agents/AGENTS.md`, `start-app` custom skill, `deploy-app` custom skill, `generate-docs` custom skill, and `push-github` custom skill.
- **Comprehensive Testing Suite**: Configured Jest with unit test coverage metrics targeting asset compilation, responsive image scaling, and fallbacks.
- **ESLint Syntax Verification**: Integrated a customized ESLint environment (`eslint.config.js`) to validate code styling and format conventions.
- **Architectural Blueprint**: Authored the complete architectural specifications and pipeline designs in `specs/technical_design.md`.
- **Page-Level XML Sitemap Ingestion**: Modified the sitemap generator template to loop through custom static pages (`/about/`, `/speaking/`, etc.), ensuring comprehensive search indexing.

### Fixed
- **Sidebar Header Specificity Conflict**: Fixed SASS specificity conflict where general card body heading rules (`.card-body h2`) overrode the circular profile bio header (`.profile h2`), restoring its intended color (`$primary` brand cobalt blue) and font size (`1.65rem`).
- **Broken RSS/Atom Feed Generation**: Installed and configured `hexo-generator-feed` to dynamically compile `public/atom.xml` on every build, resolving the broken `/atom.xml` link and restoring standard feed discoverability.
- **High-Resolution Image Decoding**: Adjusted the Jimp memory boundary limit (`maxMemoryUsageInMB: 2048`) to prevent execution failures when decoding large photos.
- **Robust Failure Fallbacks**: Handled Jimp processing failures gracefully by falling back to copying raw original source images directly to their target paths and WebP equivalents.
- **Build Directory Resolution**: Added robust directory checks inside `build-assets.js` to create the destination `public/` output path when missing (e.g., on clean builds).
- **Unified Semantic Schema Graphs**: Cleaned and unified metadata schemas across `about.ejs`, `writing.ejs`, and `head.ejs`, using direct authoritative Person `@id` bindings to prevent duplications and resolve custom property warnings.
- **Video Indexing References**: Fixed invalid `page.youtube` references inside video layouts to map correct dynamic Youtube embed strings.
- **Service Worker Policies**: Restructured Workbox caching rules in `workbox-config.js` to include core offline fallbacks, `NetworkFirst` for navigation paths, and `CacheFirst` for multiple image formats.
