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

# 📖 Distraction-Free Reader Mode for E-Readers (E-Ink)

This feature provides a dedicated distraction-free reading template for the blog. It is designed to format article posts and core resume details into print-like layouts optimized for reading on e-readers (like Kindle or Onyx Boox) and high-legibility screens.

## Features
1. **Physical E-Ink Auto-Detection**: Uses the CSS Media Queries Level 4 feature `@media (update: slow)` to instantly detect electronic paper displays and strip transition animations, sidebars, heavy grid colors, and other layout clutter.
2. **Dynamic Manual Trigger**: Standard screen readers can manually toggle between **Standard View** and **Reader View** via an interactive button at the top of long-form reading content.
3. **Legibility Optimization**: 
   - Restricts body text max-width to `680px` (`~65ch` characters) for natural vertical eye tracking.
   - Boosts font sizing using the pre-configured serif standard Google Font `Lora` at `18px` with a broad `1.75` line-spacing line block.
   - Formats technical syntax highlighting blocks into high-contrast flat backgrounds (resembling print pages) to prevent physical e-ink ghosting or excessive display updates.
4. **Persistent Preference**: Your state selection is securely persisted inside modern browser client configurations (`localStorage`) and mapped into URL routes via shareable query links (`?reader=1`).

## Tech Stack & Architecture
- **CSS Stylesheets**: SCSS Mixins (`themes/leeboonstra/design/src/sass/_ereader.scss`) loaded inline within the main presentation CSS pipeline.
- **Progressive Enhancement**: Modular EJS layouts (`themes/leeboonstra/layout/_partial/reader_toggle.ejs`) loading self-contained JS hooks safely on non-JS devices.

## How to Test it Locally

1. **Verify SASS compilation and rebuild standard assets**:
   ```bash
   npm run build:assets
   ```
2. **Launch the local development environment**:
   ```bash
   npm run dev
   ```
3. **Trigger the Toggle in Browser**: Click the **📖 Reader View** button at the top of a post to enter reader mode. Click it again to return.
4. **Target with Url Params**: Open the page with `?reader=1` appended to the URL query list to instantly render it in reader mode without layout shift flashes.
5. **Simulate physical E-Ink update triggers**:
   - Open **Chrome DevTools** (Cmd+Opt+I)
   - Open Command Panel (Cmd+Shift+P) and search for `Rendering` (Show Rendering)
   - Scroll down to the dropdown box labeled **Emulate CSS media feature update** and select **update: slow**.
