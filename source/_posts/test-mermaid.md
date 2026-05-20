---
title: Mermaid Diagram Verification Post
date: 2026-05-20 13:30:00
tags:
  - Testing
  - Architecture
---

# Mermaid Diagram Verification Post

This is a temporary test post to verify that Mermaid diagram support has been successfully integrated into the Hexo blog posts.

## Simple Flowchart

```mermaid
graph TD
    A[Write Markdown Post] --> B{Has Mermaid Blocks?}
    B -- Yes --> C[Extract Raw Graph Code]
    C --> D[Load Mermaid.js from CDN]
    D --> E[Render Interactive SVG Diagram]
    B -- No --> F[Render Plain Post with Zero Latency]
```

## Sequence Diagram

```mermaid
sequenceDiagram
    actor Author
    participant Hexo
    participant Theme as Theme Layouts
    participant Browser
    participant CDN
    
    Author->>Hexo: Run hexo generate
    Hexo->>Theme: Compile post template
    Theme-->>Hexo: Compiled HTML
    Hexo-->>Browser: Serve plain HTML
    Note over Browser: initMermaidDiagrams() runs on DOMContentLoaded
    Browser->>Browser: Detects figure.highlight.mermaid
    Browser->>Browser: Replaces code block with <div class="mermaid">
    Browser->>CDN: Request mermaid.min.js
    CDN-->>Browser: Return script bundle
    Browser->>Browser: Render SVG graphic
```
