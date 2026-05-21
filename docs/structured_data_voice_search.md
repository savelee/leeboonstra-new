# Dynamic Technical Structured Data & Speakable Voice Search Integration

This module governs the high-fidelity structured SEO data representation and Voice-Search readiness specifications for the portfolio site. It ensures absolute compatibility with Google Assistant and Gemini-enabled voice devices while qualifying deep-dive articles for specialized search carousels.

---

## 🛠️ TechArticle vs. BlogPosting

The layout engine dynamically decides the target Schema representation for post files depending on front-matter mappings or keywords:

*   **`BlogPosting`**: Default format for logs, general announcements, and standard summaries.
*   **`TechArticle`**: Automatically triggered for technical deep-dives (such as Dialogflow and Gemini guides) to appear in Google's "Learning" or "Technical Tutorial" carousels.

### Enhancing Front-matter

To override defaults and supply specific prerequisites or learning target metrics, append these dynamic parameters directly inside your post's YAML block:

```yaml
---
title: Advanced Dialogflow Agent Validation Architectures
description: A complete architectural breakdown of CI/CD-driven chatbot validation...
categories:
  - Chatbots
tags:
  - Dialogflow
  - Machine Learning
# Learning Carousel enhancements:
dependencies: Dialogflow CX API, basic Node.js SDK familiarity
proficiencyLevel: Advanced
---
```

If these metrics are not defined but the post maps to a technical category or tag, the pipeline triggers **smart fallbacks**:
*   `dependencies` defaults to matching main technology tags (e.g. `Dialogflow`, `Gemini`, `PyTorch`).
*   `proficiencyLevel` defaults to `Intermediate`.

---

## 🗣️ "Speakable" Voice AI Integration

To make your posts readable by Google Assistant or Gemini voice engines, you must highlight specific sections formatted to be read aloud (concise 2-3 sentence summaries/takeaways).

### Standard Automated Tagging

Simply write standard bold summary or takeaway blocks inside your Markdown articles:

```markdown
**Summary:** This technical deep dive explains how to establish automated validation pipelines for conversational AI agents.

**Key Takeaway:** Correcting model warnings prior to production deploy prevents runtime failure states and optimizes model servings.
```

The pipeline automatically compiles these patterns into targeted HTML containing classes `.speakable-summary` and `.speakable-takeaways`, adding their selectors directly to the page’s primary `speakable` specification block!

### Explicit HTML Control

If you require precise paragraph wrapping for custom summaries, you can write raw HTML straight inside your Markdown file:

```html
<div class="speakable-summary">
Dialogflow agent validation results are available automatically whenever agent training is completed. Correcting these warnings is critical to ensure high chatbot quality.
</div>
```

If neither of the classes exist on the page, the schema gracefully falls back to querying the page header's title and metadata description (ensuring absolute GSC verification).
