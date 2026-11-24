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

const fs = require('fs');
const path = require('path');

/**
 * Lists all `.pdf` filenames inside the given source PDF directory.
 *
 * @param {string} pdfDir Absolute path to the `source/pdf` directory.
 * @returns {string[]} Sorted list of PDF filenames (e.g., `["deck.pdf"]`).
 */
function listPdfFiles(pdfDir) {
  if (!pdfDir || !fs.existsSync(pdfDir)) {
    return [];
  }

  return fs
    .readdirSync(pdfDir)
    .filter((fileName) => fileName.toLowerCase().endsWith('.pdf'))
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Validates and normalizes a requested PDF path to a safe same-origin `/pdf/*.pdf` URL.
 * Rejects external URLs, protocol-relative URLs, and path traversal attempts.
 *
 * @param {string} rawInput Raw `file` or `pdf` query parameter value.
 * @returns {string|null} Normalized `/pdf/<filename>.pdf` path or `null` if invalid.
 */
function resolvePdfUrl(rawInput) {
  if (typeof rawInput !== 'string') {
    return null;
  }

  const trimmed = rawInput.trim();
  if (!trimmed) {
    return null;
  }

  // Reject external schemes, protocol-relative paths, backslashes, or traversal
  if (
    /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed) ||
    trimmed.startsWith('//') ||
    trimmed.includes('\\') ||
    trimmed.includes('..')
  ) {
    return null;
  }

  let normalized = trimmed.replace(/^\/+/, '');
  if (normalized.startsWith('pdf/')) {
    normalized = normalized.slice(4);
  }

  // Allow nested subdirectories under /pdf/ as long as filename ends with .pdf
  if (!normalized || !/^[a-zA-Z0-9._\-/ ]+\.pdf$/i.test(normalized)) {
    return null;
  }

  return '/pdf/' + normalized;
}

/**
 * Hexo generator producing the hidden `/present/index.html` presentation viewer route.
 * Because it is registered as a generator route rather than a page in `source/`,
 * it is excluded from `sitemap.xml`, `llms.txt`, and site navigation.
 *
 * @param {string} sourceDir Hexo `source_dir` path.
 * @returns {Array<Object>} Hexo route definitions.
 */
function buildPresentRoutes(sourceDir) {
  const pdfDir = path.join(sourceDir, 'pdf');
  const pdfFiles = listPdfFiles(pdfDir);

  return [
    {
      path: 'present/index.html',
      layout: 'present',
      data: {
        title: 'Presentation Viewer',
        description: 'Fullscreen PDF presentation viewer',
        pdfFiles
      }
    }
  ];
}

if (typeof hexo !== 'undefined') {
  hexo.extend.generator.register('present_viewer', function () {
    const routes = buildPresentRoutes(hexo.source_dir);
    const templatePath = path.join(hexo.theme_dir, 'layout', 'present.ejs');

    return routes.map((route) => {
      const html = hexo.render.renderSync(
        { path: templatePath },
        { page: route.data, config: hexo.config }
      );
      return {
        path: route.path,
        data: html
      };
    });
  });
}

module.exports = {
  listPdfFiles,
  resolvePdfUrl,
  buildPresentRoutes
};
