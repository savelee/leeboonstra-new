# GEO Integration & Generative Search Optimization

This site integrates specialized semantic layouts to support **GEO (Generative Engine Optimization)**. This allows conversational AI search engines (such as Gemini, SearchGPT, and Perplexity) to effectively index our facts, assets, and write-ups.

## 1. Architectural Framework
Generative models require high-trust, low-noise sources of structured truth.
To implement GEO, we employ:
1. **Clean Content Stripping**: Exposing simplified content fields through automated scripts to bypass DOM scraping limits.
2. **Structured Metadata Links**: Connecting article nodes directly to our master profile ID to boost credibility indices.

---

## 2. Dynamic EJS Injection Design
The `<head>` of every compiled single article page contains a dynamic JSON-LD script:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "<%= page.title %>",
  "datePublished": "<%= page.date %>",
  "author": {
    "@type": "Person",
    "name": "Lee Boonstra",
    "@id": "https://www.leeboonstra.dev/#person"
  }
}
</script>
```
By using the `@id` tag, we signal to crawlers that the author is exactly the same entity described in the authoritative static global biography block, establishing high topical authority on topics like Conversational AI, NLP, and Prompt Engineering.
