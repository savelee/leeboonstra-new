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

# Modern Outline Icon System for Main Navigation

This document details the transition and specifications of the modernized menu/navigation bar icons.

## Architectural Design

- **Stroke-based Modern Aesthetics**: Swapped traditional heavy solid 32x32 pixel maps with pixel-perfect 24x24 single-stroke modern outline shapes (similar to Lucide and Feather vector systems).
- **Separation of Concerns**: Isolated modern lines from legacy solid brand assets (GitHub, LinkedIn, RSS, StackOverflow) which are bound to official silhouette shapes.
- **Dynamic CSS Classes**: Defined the `.icon-modern` subclass modifier to globally force vector line properties without polluting global `.icon` fill rules:
  ```css
  .icon.icon-modern {
    fill: none !important;
    stroke: currentColor !important;
    stroke-width: 2px !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
  }
  ```

## Icon Roster

| Menu Link | Modern Symbol | Visual Representation | Key Coordinates |
| :--- | :--- | :--- | :--- |
| **Home** | `icon-iHome` | Clean line house with door | Modern 24x24 lines structure |
| **Bio** | `icon-iBio` | Sleek minimal user shoulders + head circles | Standard dual paths |
| **Speaking** | `icon-iSpeaking` | Sleek outline mic with single-stroke stand | Multi-path coordinate set |
| **Writing** | `icon-iWriting` | Elegant vector feather quill | Artistic feather outline |
| **Videos** | `icon-iVideos` | Modern vector movie camera outline | Clean camera rectangle + visual arrow |
| **Abstracts** | `icon-iAbstracts` | Clean list document sheet with lines | Standard text document |
| **Chat** | `icon-iChat` | Minimal conversation square | Clean speech bubble shape |
| **FAQs** | `icon-iFAQs` | Question mark inside smooth circle outline | Modern dual-path query emblem |
| **Hamburger** | `icon-menu` | Modern 3-line panel drawer trigger | Standard 3-line grid |
| **Close** | `icon-close` | Minimal diagonal cross 'X' trigger | Dual-line crisp intersections |
