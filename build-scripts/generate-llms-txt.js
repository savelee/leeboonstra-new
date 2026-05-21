/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const path = require('path');

console.log('🤖 Starting LLM Context Files Generation...');

const rootDir = path.join(__dirname, '..');
const postsDir = path.join(rootDir, 'source', '_posts');
const outputLlmsFile = path.join(rootDir, 'source', 'llms.txt');
const outputLlmsFullFile = path.join(rootDir, 'source', 'llms-full.txt');

// 1. Write core llms.txt content
const llmsContent = `# Lee Boonstra

> Lee Boonstra is a Developer Advocate, Applied AI engineer, and technical author specializing in conversational AI, LLMs, and voice architectures.

## Core Resources
- [About Me](https://leeboonstra.dev/about) - Professional background and bio.
- [Blog](https://leeboonstra.dev/blog) - Technical articles on AI, architecture, and development.
- [Projects](https://leeboonstra.dev/projects) - Open-source AI tools and code repositories.
- [Speaking](https://leeboonstra.dev/speaking) - Upcoming events and past conference presentations.

## Full Content Map
- [Full Sitemap](https://leeboonstra.dev/sitemap.xml) - Complete list of all text assets.
- [Full Blog Posts Aggregation](https://leeboonstra.dev/llms-full.txt) - The full plain-text raw markdown of all blog posts for zero-friction ingestion by AI scraping bots.
`;

fs.writeFileSync(outputLlmsFile, llmsContent);
console.log('✅ Created: source/llms.txt');

// 2. Generate llms-full.txt by scanning and concatenating posts
function extractFrontMatter(fileContent) {
  const fmRegex = /^---\r?\n([\s\S]+?)\r?\n---/;
  const match = fileContent.match(fmRegex);
  if (!match) {
    return { metadata: {}, body: fileContent };
  }

  const fmText = match[1];
  const body = fileContent.slice(match[0].length).trim();
  const metadata = {};

  const lines = fmText.split('\n');
  let currentKey = null;
  let currentArray = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line starts an array element
    if (trimmed.startsWith('-')) {
      if (currentArray) {
        // Strip out optional quotes surrounding array items
        const val = trimmed.slice(1).trim().replace(/^['"]|['"]$/g, '');
        currentArray.push(val);
      }
      continue;
    }

    const colIndex = trimmed.indexOf(':');
    if (colIndex === -1) continue;

    const key = trimmed.slice(0, colIndex).trim();
    let value = trimmed.slice(colIndex + 1).trim();

    // Remove surrounding quotes if present
    value = value.replace(/^['"]|['"]$/g, '');

    if (value === 'true') {
      metadata[key] = true;
      currentKey = key;
      currentArray = null;
    } else if (value === 'false') {
      metadata[key] = false;
      currentKey = key;
      currentArray = null;
    } else if (value === '') {
      // Potential start of nested object or list
      metadata[key] = [];
      currentKey = key;
      currentArray = metadata[key];
    } else {
      metadata[key] = value;
      currentKey = key;
      currentArray = null;
    }
  }

  return { metadata, body };
}

function cleanMarkdownBody(body) {
  let cleaned = body;

  // Replace Hexo liquid tags like {% gist gist_id#file-name %} or {% gist gist_id %}
  cleaned = cleaned.replace(/\{%\s*gist\s+([a-zA-Z0-9_-]+)(?:#[a-zA-Z0-9_-]+)?\s*%\}/g, (match, gistId) => {
    return `[GitHub Gist](https://gist.github.com/${gistId})`;
  });

  // Replace Hexo liquid tags like {% youtube video_id %}
  cleaned = cleaned.replace(/\{%\s*youtube\s+([a-zA-Z0-9_-]+)\s*%\}/g, (match, videoId) => {
    return `[YouTube Video](https://www.youtube.com/watch?v=${videoId})`;
  });

  // Strip JSON-LD / HTML application script blocks
  cleaned = cleaned.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

  // Strip very large inline base64 image strings from <img> tags, but preserve the alt tag if present
  cleaned = cleaned.replace(/<img\s+[^>]*src=["']data:image\/[^;]+;base64,[^"']+["'][^>]*>/gi, (match) => {
    const altMatch = match.match(/alt=["']([^"']+)["']/i);
    const altText = altMatch ? altMatch[1] : 'Embedded Image';
    return `*[Image: ${altText} (Base64 source stripped for token efficiency)]*`;
  });

  // Convert relative URLs to absolute URLs
  // Matches relative links: [Link text](/path/to/page)
  cleaned = cleaned.replace(/\]\(\/([^)]+)\)/g, '](https://leeboonstra.dev/$1)');

  // Matches relative src tags: src="/path/to/image"
  cleaned = cleaned.replace(/\bsrc=["']\/([^"']+)["']/g, 'src="https://leeboonstra.dev/$1"');

  return cleaned;
}

try {
  const files = fs.readdirSync(postsDir);
  const posts = [];

  for (const file of files) {
    if (path.extname(file) !== '.md') continue;

    const fullPath = path.join(postsDir, file);
    const rawContent = fs.readFileSync(fullPath, 'utf8');

    const { metadata, body } = extractFrontMatter(rawContent);

    // Skip pages explicitly flagged as hidden to preserve focus on core technical articles
    if (metadata.hidden === true) {
      continue;
    }

    // Determine the post date for sorting
    let postDate = new Date();
    if (metadata.date) {
      postDate = new Date(metadata.date);
    } else {
      // Try to parse from filename if named in YYYY-MM-DD pattern
      const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        postDate = new Date(dateMatch[1]);
      }
    }

    posts.push({
      title: metadata.title || path.basename(file, '.md'),
      description: metadata.description || '',
      date: postDate,
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      categories: Array.isArray(metadata.categories) ? metadata.categories : [],
      body: cleanMarkdownBody(body)
    });
  }

  // Sort posts descending (newest first)
  posts.sort((a, b) => b.date - a.date);

  // Build the llms-full.txt document
  let llmsFullContent = `# Lee Boonstra Dev Blog - Full Aggregated Contents

> This file contains the complete, aggregated plain-text raw markdown contents of all published blog posts on leeboonstra.dev, optimized for zero-friction scraping and ingestion by AI agents.

---

`;

  for (const post of posts) {
    const formattedDate = post.date.toISOString().split('T')[0];
    const tagsString = post.tags.length > 0 ? `*Tags: ${post.tags.join(', ')}*` : '';
    const categoriesString = post.categories.length > 0 ? `*Categories: ${post.categories.join(', ')}*` : '';

    llmsFullContent += `## ${post.title}\n\n`;
    llmsFullContent += `*Published: ${formattedDate}*\n`;
    if (categoriesString) llmsFullContent += `${categoriesString}\n`;
    if (tagsString) llmsFullContent += `${tagsString}\n`;
    if (post.description) llmsFullContent += `\n> ${post.description}\n`;
    llmsFullContent += `\n---\n\n`;
    llmsFullContent += `${post.body}\n\n`;
    llmsFullContent += `\n---\n\n`;
  }

  fs.writeFileSync(outputLlmsFullFile, llmsFullContent);
  console.log(`| Technical Posts Found | Added to llms-full.txt | Location |`);
  console.log(`| --- | --- | --- |`);
  console.log(`| ${files.length} markdown files found | ${posts.length} verified | source/llms-full.txt |`);

} catch (error) {
  console.error('❌ Error generating llms-full.txt:', error.message);
  process.exit(1);
}
