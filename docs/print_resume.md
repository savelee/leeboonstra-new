# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# 🖨️ Professional Resume Print System SPEC

This document describes the physical architecture, geometric configurations, and styles engineered to reformat the web biography page (`/about/`) into a standard corporate resume layout upon browser printing or PDF saving.

## Architectural Features

### 1. Print-Only Resume Header (Dynamic & Dynamic Meta)
To ensure the printed CV contains essential contact handles without adding bloat to the screen layout, a custom two-column print-only block is injected at the very top of `about.ejs`:
* **Interactive Elements**: Fully hidden on desktop and mobile screens (`display: none !important;` under screen media, via `print.css`).
* **Render-Time Layout Isolation**: Wrapped inside an EJS layout selector wrapper (`<% if (page.layout === 'about' || page.layout === 'bio') { %>`), preventing the node from rendering inside pages utilizing non-biography layouts (e.g. speaking, contact).
* **Header Structure**:
  * **Left Column**: High-impact bold name (`Lee Boonstra`), job subtitle dynamically rendered using EJS variables (`<%= page.subtitle %>`), pronouns/current location, and Lee's detailed **Birth Metadata** (`Born: 16 June 1983, Apeldoorn, Netherlands`).
  * **Right Column**: Direct professional contact references:
    * **Web**: `www.leeboonstra.dev`
    * **LinkedIn**: `linkedin.com/in/leeboonstra`
    * **GitHub**: `github.com/savelee`
    * **Email**: `lee[at]leeboonstra.com`
* **Redundant Title Mitigation**: The standard web h1 title (`Biography of AI Engineer Lee Boonstra`) is completely suppressed on print to prevent duplicates.

### 2. High-Performance Point Typography Sizing
Traditional screen pixel units (`px`) scale and warp on varying physical desktop print engines and margins. We transitioned the typography properties under `print.css` to physically static typographical points (`pt`):
* **Body Text**: `10pt` (Optimal corporate text size; highly readable, fitting substantial content onto two standard sheets).
* **Section Titles (H2)**: `12.5pt` bold.
* **Job Titles (H4)**: `10.5pt` bold.
* **Contact Details (Right Header Column)**: Specifically scaled down to **`7.5pt`** (with a compact `1.4` line-height) to offer an exceptionally distinct, premium, and space-efficient sidebar column visual presentation.
* **Subtext & Metadata**: `9.5pt` regular.
* **Dates & Tech Badges**: `8pt` bold.
* **Line Height**: `1.45` to prevent text overlaps and vertical bleeding.

### 3. Chronological Vertical Sequence Layout
Recruiters and search engines expect a linear vertical chronological flow for work experience to map experience durations easily:
* **Grid Overrides**: Standard screen multi-column grids (`col-md-6`) for work experience, patents, and publications are suppressed.
* **Vertical Timeline**: Columns are forced to span exactly `100%` of page width (`width: 100% !important; max-width: 100% !important; flex: 0 0 100% !important;`).
* **Horizontal Balance Exceptions**: The **Technical Skills** categories remain in a tidy 3-column layout (`col-md-4` forced to `width: 31% !important; max-width: 33% !important;`) and align horizontally in print, conserving physical paper space.

### 4. High-Contrast Print-Proof Badging
Standard HTML colors print poorly. We customized printable tag badges utilizing print-color-adjust tags:
* **Skill Badges**: Styled in high-fidelity slate colors (`background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; border-radius: 4px; padding: 0.15rem 0.35rem;`).
* **Color Preservation**: Added `-webkit-print-color-adjust: exact; print-color-adjust: exact;` to ensure exact background renders.

### 5. Page-Break & Margins Geometry Management
To prevent paragraph truncation, orphan headers, or margin bleeding:
* **Strict Browser Page Margins**: Direct browser-level paged dimensions are enforced via `@page { size: A4; margin: 20mm !important; }`, yielding layout boundary sizing cleanly and symmetrically to standard metric margins.
* **Vertical Spacing & Rhythm**: A balanced vertical head spacer is attached on print (`.print-only-header { margin-top: 0.5rem !important; }`), ensuring the name block sits proportional and professional below A4 margin top limits.
* **Split Prevention**: Integrated `break-inside: avoid !important;` and `page-break-inside: avoid !important;` to all chips (`.experience-chip`, `.education-chip`, `.publications-chip`, `.skill-chip`, and `.language-item`). Individual experiences or publications are never cut in half across print sheets.
* **Flow Controls**: Added `break-after: avoid;` and `page-break-after: avoid;` to headings, preventing orphan resume headers at the bottom of sheets.

### 6. Interactive "Print My Resume" CTA Button
To provide direct recruitment interactivity, the legacy static PDF download link is decommissioned and replaced with a premium dynamic trigger:
* **Visual Presentation**: Placed under the profile photo inside `.photocol` (sidebar) on the webpage.
* **Typographical Harmony**: Implements the signature display header font `'Bebas Neue'` with exact capitalizations and letter-spacings.
* **Premium Theme Styling**: Outline-styled in specific applied Google Rose Red (`$red` / `#e11d48`) with custom ease-in-out transition dynamics.
* **Hover Interaction**: On hover, translates upwards (`translateY(-2px)`), drops a soft rose-red elevation shadow, transitions to a solid rose-red background with high-contrast white text, and micro-scales the inline SVG vector printer icon.
* **JavaScript Action**: Triggers native browser print mechanisms (`window.print()`) instantly on click.
* **Print Decoupling**: Automatically hidden in print configurations (`display: none !important;` via `.print-resume-btn` / `.photocol`).
* **Page Layout Isolation**: Embedded render-time EJS conditional wrapper constraints so the button is completely excluded from the generated HTML document for all non-biography layouts, preventing visual clutter on unrelated static pages.

### 7. Obfuscated Anti-Spam Email Protection
Harvest bots automatically scrape website HTML search lists and contact indices. To protect the professional domain while maintaining complete recruiter reachability:
* **Dynamic Obfuscation**: Dynamically processes the resume database field using standard EJS string overrides: `<%= site.data.resume.basics.email.replace('@', '[at]') %>`.
* **Harvest Protection**: The email is rendered strictly as plain text (e.g. `lee[at]leeboonstra.com`) inside the print header block, and all direct clickable HTML `mailto:` anchors are stripped. Crawling robots find **zero raw address records** in the public generated site output.

### 8. Pristine Natural-Flow Page Breaks (The Professional Executive Choice)
Rigid physical-height block dividers (e.g. static `.print-page` blocks) and absolute overlay footnotes represent a highly fragile hack on dynamically populated, schema-driven portfolios:
* **The Dynamic Height Fragility**: Whenever experience description bullets, patents, or skills list counts are modified in the `resume.yml` database, layout heights grow or shrink. A hardcoded margins block is guaranteed to stretch beyond physical viewports on some engines, forcing absolute positioned custom overlays onto subsequent pages where they overlap natural texts!
* **Dynamic Page numbering Blocker**: Modern browser print layout drivers strictly restrict CSS page counting (`counter(page)`) to paged margin boxes. Body HTML tags evaluate to a constant `0`.
* **Pristine Flow Architecture**: 
  - Decommissioned all dynamic fixed heights and blocked custom repeating bottom footnote cards from prints.
  - Sized parent container grids dynamically: `.container, .row, .main { height: auto !important; }` reset under print.
  - Depopulated all website bento card box drop-shadows, gray paddings, and borders. The resume experience text lays flat, crisp, and high-fidelity on standard physical white sheets.
  - Enforced strict breaks isolation:
    ```css
    .experience-chip,
    .education-chip,
    .skill-chip,
    .language-item {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }
    ```
    This guarantees that **no individual job description bullet list is ever split in half!** If a specific chip doesn't fit on the current page, the print driver automatically pushes the whole chip to the top of the next physical page.
  - Enforced headings protection:
    ```css
    .resume-section h2 {
        page-break-after: avoid !important;
        break-after: avoid !important;
    }
    ```
    Orphan title headers are prevented from sitting alone at the bottom of pages.
  - Recruiter/reader lets standard page counts numbering print natively via standard browser settings check ("Headers and Footers"), which fits perfectly at standard metric margins (`20mm` symmetric) bounds.
  - **Pruned Dynamic Generation**: The resume section is dynamically ignored during page-render stage on non-biography views (`speaking`, `contact`), guaranteeing that standard browser-level printed pages flow natively and elegantly utilizing only actual page markdown body lines.
  - **100% Scalable & Robust**: If the database grows dynamically, the prints flow organically across sheets with immaculate vertical alignment and visual perfection!

