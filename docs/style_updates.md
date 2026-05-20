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

# 🎨 Premium Visual Theme & Bento Card System

This document outlines the customized visual design layout built to attract high-end recruiters (OpenAI, Anthropic, Microsoft, Meta) while maintaining the unique magazine-style brand identity of Lee Boonstra.

## Key Elements

### 1. Signature Identity Typography
We retain the high-impact original serif and high-contrast display fonts to preserve identity branding:
* **Body & Paragraphs**: `'Source Serif Pro'`, Georgia, 'Times New Roman', serif (providing a warm, highly readable editorial tone).
* **Main Headers (H1)**: `'Roboto Slab'`, Georgia, serif.
* **Display Headers (H2, H3, H4)**: `'Bebas Neue'`, 'Arial Black', Arial, sans-serif (bold, high-impact, architectural uppercase titles).

### 2. Slate and White Color Scheme
To ground the magazine typography in modern aesthetics, we transitioned the layout to high-fidelity developer tones:
* **Main Background**: `#f8fafc` (Clean tailwind slate-50 off-white, replacing the legacy dusty `#e9ecef`).
* **Primary Text**: `#1f2937` (Charcoal grey) and `#0f172a` (Deep Slate grey) instead of pure high-contrast black.
* **Primary Paragraphs**: `#334155` (Soft Slate).

### 3. Premium Page Color Palette
We replaced legacy highly-saturated Google primary colors with high-fidelity, deeply rich variations that look incredible as solid header backgrounds and interactive elements:

| Page Section | Legacy Value | Upgraded Tech Scene Value |
|---|---|---|
| **Google Blue (`$blue` / `$primary`)** | `#4285F4` | `#2563eb` (Cobalt/Royal Blue) |
| **Google Red (`$red`)** (Biography / About) | `#EA4335` | `#e11d48` (Deep Crimson Rose) |
| **Google Yellow/Orange (`$orange`)** (Conferences) | `#FBBC04` | `#ea580c` (Warm Amber Orange) |
| **Google Green (`$green`)** (Videos / Abstracts) | `#34A853` | `#059669` (Deep Emerald Green) |
| **Light Blue (`$lightblue`)** (FAQ / FAQs / Contact) | `#4285F4` | `#3b82f6` (Elegant Sky Blue) |

### 4. Elevation-Responsive Bento Cards
Resume blocks are completely redesigned into modular, clickable bento card components:
* **Physical Layout**: Solid `#ffffff` backgrounds with rounded corners (`16px`) and subtle borders (`1px solid rgba(15, 23, 42, 0.08)`).
* **Active Interactions**: On hover, cards translate upwards by `-4px` and transition to an elegant, smooth shadow depth.
* **Pill Badges**: Customized date and type pills leverage highly-refined, semi-transparent color overlays matching the parent page theme for maximum elegance.
