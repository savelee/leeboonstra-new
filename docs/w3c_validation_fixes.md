# W3C HTML5 Validation Standards & Trailing Slash Fixes

This documentation outlines the specific architecture standard applied to ensure the website is fully compliant with the modern W3C HTML5 specifications, focusing on the correct rendering of void elements.

## Rationale
In HTML5, elements that cannot have any child contents are classified as **void elements** (e.g., `<meta>`, `<link>`, `<img>`, `<input>`, `<br>`). 
According to strict HTML5 standards:
* A trailing slash (`/`) on a void element is treated as trailing syntax and has no operational effect.
* The W3C markup validator flags these trailing slashes with parser informational warnings.
* Having a trailing slash right next to an unquoted attribute value can cause major string token parsing errors.

To address these warnings and secure uniform compliance across templates, we replaced external modules and manually cleaned legacy configurations.

## Implementation Details

### 1. Native Canonical URL Generation (`autoCanonical`)
We uninstalled the legacy `hexo-auto-canonical` npm module, replacing it with a localized lightweight rendering module under `themes/leeboonstra/scripts/canonical.js`:

* **Module Design**: Standardized as an immediate drop-in replacement registering the identical helper ID name (`autoCanonical`).
* **HTML5 Compatibility**: The resulting link tag prints without an XML-like trailing slash:
  ```html
  <link rel="canonical" href="https://www.leeboonstra.dev/some-post">
  ```

### 2. Surgical Head Template Cleanup
Open Graph metadata tags within `themes/leeboonstra/layout/_partial/head.ejs` were restructured:
* Changed `<meta property="og:title" content="..." />` to `<meta property="og:title" content="...">`.
* Changed `<meta property="og:site_name" content="..." />` to `<meta property="og:site_name" content="...">`.
* Changed `<meta property="og:description" content="..." />` to `<meta property="og:description" content="...">`.

### 3. Core Image Element Standardizations
* **Profile Headshot (`profile.ejs`)**: Sanitized the avatar rendering image block to exclude self-closing trailing notation.
* **Biography Headshot (`about.ejs`)**: Sanitized the main grid bento biography picture markup tag.
* **Responsive Image Filter Script (`image.js`)**: Updated standard markdown translation pipelines parsing dynamic posts content, outputting standard HTML5 tags.

### 4. Resume Print Layout Meta Adjustments (`print_resume_layout.ejs`)
Cleaned page viewport controls, crawler constraints, and target metadata descriptions to maintain perfect schema metrics.

## Validation & Quality Checks
To ensure compliance during development, build the site locally and run the generated static output through the W3C markup parser:
```bash
# 1. Clean the current build cache and compile files
npm run clean
npm run build

# 2. Spin up a local server to test the public output
npm run dev
```
