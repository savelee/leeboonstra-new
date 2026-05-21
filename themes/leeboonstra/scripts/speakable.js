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

'use strict';

/**
 * Filter to automatically add CSS styling targets matching Speakable voice-search specifications
 * to standard markdown paragraphs containing Summaries or Key Takeaways.
 */
hexo.extend.filter.register('after_post_render', data => {
  // Regex matches standard bold paragraphs starting with Summary or Key Takeaway
  // Example: <p><strong>Summary:</strong> text...</p>
  const summaryRegex = /<p>(<strong>\s*(Summary|Key\s+Takeaways?)\s*:\s*<\/strong>\s*[\s\S]*?)<\/p>/gi;

  data.content = data.content.replace(summaryRegex, (match, inner, keyword) => {
    const isSummary = keyword.toLowerCase().includes('summary');
    const className = isSummary ? 'speakable-summary' : 'speakable-takeaways';
    
    // Inject the targeted markup attributes for Google voice AI search selectors
    return `<p class="${className}">${inner}</p>`;
  });

  return data;
});
