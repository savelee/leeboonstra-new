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

### Optimized
- **SEO & GEO Structured Data Mappings**: Standardized all global and local structured schema blocks to reference the authoritative central `Person` identifier (`https://www.leeboonstra.dev/#person`).
- **Schema Graph Cleanup**: Removed redundant loop-nested Person and CreativeWork schema redeclarations inside `abstracts.ejs` and `article.ejs` to avoid redundant payloads.
- **Structured Schema Precision**: Shifted the biography layout in `about.ejs` to an accurate `AboutPage` schema structure, and connected `VideoObject` items in `videos.ejs` back to the author profile.

### Changed
- **Documentation Restructuring**: Cleaned up `README.md` to focus exclusively on Docs Site setup and Custom Developer Agentic Skills usage, removing legacy Travis CI configurations and setup details.
- **Hexo Operations Manual Migration**: Migrated complete Hexo setup, dependency installation, troubleshooting, and Workbox PWA caching commands from `README.md` to [docs/pipeline_hexo.md](file:///docs/pipeline_hexo.md).

### Added
- **Press Releases Updates**: Added Google Cloud blog post on AI code reviews ("When AI writes the code, who reviews it?") to the top of the Lee Boonstra Press Releases section.
- **Unified Build Script Automation**: Integrated the responsive image pre-processing (`process-images`) and asset minification into the standard `npm run build` workflow, ensuring consistent builds.
- **PWA Service Worker Precaching**: Verified robust service worker compilation using Workbox, caching core static assets for offline rendering capabilities.
- **Custom Developer Customizations & Agent Setup**: Scaffolding of `.agents/AGENTS.md`, `start-app` custom skill, `deploy-app` custom skill, `generate-docs` custom skill, and `push-github` custom skill.
- **Comprehensive Testing Suite**: Configured Jest with unit test coverage metrics targeting asset compilation, responsive image scaling, and fallbacks.
- **ESLint Syntax Verification**: Integrated a customized ESLint environment (`eslint.config.js`) to validate code styling and format conventions.
- **Architectural Blueprint**: Authored the complete architectural specifications and pipeline designs in `specs/technical_design.md`.
- **Page-Level XML Sitemap Ingestion**: Modified the sitemap generator template to loop through custom static pages (`/about/`, `/speaking/`, etc.), ensuring comprehensive search indexing.

### Fixed
- **High-Resolution Image Decoding**: Adjusted the Jimp memory boundary limit (`maxMemoryUsageInMB: 2048`) to prevent execution failures when decoding large photos.
- **Robust Failure Fallbacks**: Handled Jimp processing failures gracefully by falling back to copying raw original source images directly to their target paths and WebP equivalents.
- **Build Directory Resolution**: Added robust directory checks inside `build-assets.js` to create the destination `public/` output path when missing (e.g., on clean builds).
- **Unified Semantic Schema Graphs**: Cleaned and unified metadata schemas across `about.ejs`, `writing.ejs`, and `head.ejs`, using direct authoritative Person `@id` bindings to prevent duplications and resolve custom property warnings.
- **Video Indexing References**: Fixed invalid `page.youtube` references inside video layouts to map correct dynamic Youtube embed strings.
- **Service Worker Policies**: Restructured Workbox caching rules in `workbox-config.js` to include core offline fallbacks, `NetworkFirst` for navigation paths, and `CacheFirst` for multiple image formats.
