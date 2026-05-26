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

# Sitemap Index Exclusions

This document outlines the architectural rationale, configuration, and build guidelines for excluding index and tag archive pages from the canonical `sitemap.xml` file.

## 1. SEO Rationale

To maintain a high-quality search engine footprint and optimize crawl budgets, it is critical to limit indexed pages to primary content assets (posts and static pages) while excluding low-value taxonomies (tag and category list pages).

### Duplication & Crawl Waste
Tag and category indices (e.g., `/tags/chatbots/` or `/categories/abstract/`) represent aggregate list formats of existing content. Allowing these pages to be crawled and parsed in the primary XML sitemap results in:
* **Duplicate Content Flagging**: Search engine bots encounter identical text and page blocks at both the post’s main page and the collection pages, raising low-quality alerts or "Duplicate without user-selected canonical" exceptions in Google Search Console.
* **Crawl Budget Dilution**: High-frequency scrapers expend crawling priority parsing paginated post indexes rather than discovering newly updated deep-dive content.
* **Redundant Indexation**: Preventing tag pages from landing in the XML sitemap signals to search engines that they should discover content through primary post links and structural pathways rather than index-level loops.

## 2. Configuration Settings

The exclusion rules are applied directly within the main compiler settings:

### Generator Configuration (`_config.yml`)
The `hexo-generator-sitemap` plugin parameters are adjusted to enforce strict exclusion:
```yaml
sitemap:
    path: sitemap.xml
    rel: true
    template: sitemap_template.xml
    tags: false
    categories: false
```

### Template Customizations (`sitemap_template.xml`)
Custom loop blocks targeting tags (`{% for tag in tags %}`) and categories (`{% for cat in categories %}`) have been completely removed from the XML layout grid to guarantee zero accidental tags rendering, even if values are passed down.

### Dynamic HTML Robots Meta Tags (`head.ejs`)
To ensure that search engines do not index these collection pages even if they are discovered via standard external or layout-level hyperlinks, a dynamic robots meta tag conditional block is added inside the shared `<head>` partial template:

```html
<% if (is_tag() || is_category() || is_archive()) { %>
<meta name="robots" content="noindex, follow">
<% } else { %>
<meta name="robots" content="all">
<% } %>
```
This dynamic EJS logic flags all:
* Tag index directories (`/tags/*`)
* Category index directories (`/categories/*`)
* Archive indices (`/archives/*` and chronological lists)

With the safety instruction `noindex, follow` which forces crawl agents to discard the duplicate indices pages from search outcomes while allowing them to parse and route rank to the individual deep post hypermedia links inside them.

## 3. Local Verification

To verify that the exclusions are processed successfully and no duplicate URLs or taxonomy indexes are output:

1. Clean the current build cache and compile the public distribution static site:
   ```bash
   npm run clean
   npm run build
   ```

2. Run the programmatic checking script to analyze the generated sitemap output for duplicates or `/tags/` and `/categories/` links:
   ```bash
   python3 .gemini/jetski/brain/87f0bb70-470c-49d1-811a-b559a21816b8/scratch/check_sitemap.py
   ```

3. Confirm that the total URL count is optimized (reduced from 313 to ~105) and no items are reported under the duplicates or taxonomy indices logs.
