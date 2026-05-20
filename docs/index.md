# Home - System Architecture Docs

Welcome to the technical documentation for the Hexo Static Site and Assets Pipeline.

## Project Hub
- **Source Site**: [leeboonstra.dev](https://www.leeboonstra.dev)
- **Target Deployments**: Hosted on Firebase CDN (`leeboonstra-dev-7d578`)
- **Agent Rules Manifest**: Refer to [AGENTS.md](file:///Users/leeboonstra/Documents/Github/leeboonstra-new/.agents/AGENTS.md)

## Primary Subsystems
1. **Assets Pipelines**: SASS compiling, bundling (Parcel), and image processing.
2. **SEO / GEO Structuring**: JSON-LD semantic tags and RAG-friendly text feeds.
3. **PWA Integration**: Workbox Service Worker caching and offline access.
