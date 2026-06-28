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

# Image Containment Utility Class (.img-contain)

## Overview
The `.img-contain` utility class is designed to override the global, opinionated image styles in the Hexo theme. By default, images within blog posts are styled with `object-fit: cover` and have responsive `max-height` limits to maintain grid alignment. However, this crops and distorts technical diagrams, charts, and screenshots.

The `.img-contain` class restores the natural proportions of these assets by enforcing `object-fit: contain` and removing height restrictions.

## Usage

To apply this behavior while preserving the Hexo responsive image pipeline (which requires standard Markdown image syntax), wrap the image in a `div` containing both the `.chart-container` and `.img-contain` classes:

```markdown
<div class="chart-container img-contain">

![Alt Text](/images/diagram.png)

</div>
```

## CSS Specification
The class is defined in `themes/leeboonstra/design/src/sass/main.scss` as:
```scss
.img-contain,
.img-contain img,
.img-contain picture,
.img-contain picture img,
img.img-contain,
picture.img-contain,
picture.img-contain img {
    object-fit: contain !important;
    max-height: none !important;
    height: auto !important;
    display: block !important;
}
```
