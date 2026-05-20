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

# 🤖 RUNTIME MANIFEST FOR DEVELOPER AGENTS

Welcome, Developer Agent. This workspace is designed for Spec-Driven Development. Adhere strictly to the configurations, schemas, and conventions outlined below.

---

## 1. Repository Architectural Layout

- `source/_posts/`: Uncompiled raw Markdown blog posts.
- `themes/leeboonstra/`: Core Presentation theme.
  - `layout/`: Templating engine layouts driven by EJS.
  - `scripts/`: Local Hexo extensions and pipeline filter modules.
  - `source/`: Compiled stylesheet (`main.css`) and scripts location.
  - `design/`: Source folder for style assets, comprising modular SASS files (`src/sass/`) and client-side scripts (`src/js/`).
- `build-tools/build-assets.js`: The central asset compilation script. Handles Dart Sass compilation and JS packaging.
- `build-scripts/process-images.js`: Jimp-based image pre-processor. Generates responsive scaled variants and WebP replicas inside `public/images/`.
- `scripts/minify-assets.js`: Post-generation pipeline optimizer. Runs Terser (JS) and Clean-CSS (CSS) to compress client bundles.

---

## 2. Execution Commands Manual

Always trigger workflows using these native npm scripts defined in `package.json`:
- **Clean Build Assets**: `npm run clean`
- **Local Development Server**: `npm run dev`
- **Compile CSS/JS Assets**: `npm run build:assets`
- **Responsive Image Generation**: `npm run process-images`
- **Production Compiler Pipeline**: `npm run build`
- **Production Firebase Deploy**: `npm run firebase:build`

---

## 3. Coding & Style Standards

- **Python Standards**: Strictly comply with PEP 8 (4-space indents, max line length of 79 characters). Always execute commands within a virtual environment initialized by `uv venv`.
- **TypeScript/JS Standards**: Follow Upper Camel Case (`PascalCase`) for components, interfaces, and classes. Use `camelCase` for methods and variables.
- **Document All Public Interfaces**: Write JSDoc annotations for TypeScript/JS blocks and Google Style Docstrings for Python scripts.
- **Licensing**: Every new file MUST begin with the standard Apache 2.0 License Boilerplate.

---

## 4. The Agent Operational Loop

When executing non-trivial tasks, follow this step-by-step loop:
1. **Read `TODO.md`**: Review current objectives and task lists.
2. **Create Technical Plan**: Outline target files, design specs, and code architectures in a professional Proposal structure.
3. **Seek Confirmation**: Wait for human verification before modifying code or executing terminal actions.
4. **Implement Contiguous Edits**: Complete surgical code edits, writing thorough unit tests.
5. **Document Changes**: Write a `docs/` README page for new features and append a changelog entry to `CHANGELOG.md` (Unreleased).
