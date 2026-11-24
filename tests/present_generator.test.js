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
const os = require('os');
const path = require('path');

const {
  listPdfFiles,
  resolvePdfUrl,
  buildPresentRoutes
} = require('../themes/leeboonstra/scripts/present_generator');

describe('Presentation Viewer Generator & Security Helpers', () => {
  test('resolvePdfUrl normalizes valid filenames and /pdf/ paths', () => {
    expect(resolvePdfUrl('talk.pdf')).toBe('/pdf/talk.pdf');
    expect(resolvePdfUrl('/pdf/talk.pdf')).toBe('/pdf/talk.pdf');
    expect(resolvePdfUrl('pdf/2026/keynote-deck.PDF')).toBe('/pdf/2026/keynote-deck.PDF');
    expect(resolvePdfUrl('  slides.pdf  ')).toBe('/pdf/slides.pdf');
  });

  test('resolvePdfUrl rejects external URLs, traversal, and non-PDFs', () => {
    expect(resolvePdfUrl('https://evil.com/deck.pdf')).toBeNull();
    expect(resolvePdfUrl('http://evil.com/deck.pdf')).toBeNull();
    expect(resolvePdfUrl('//evil.com/deck.pdf')).toBeNull();
    expect(resolvePdfUrl('javascript:alert(1)')).toBeNull();
    expect(resolvePdfUrl('../secrets.pdf')).toBeNull();
    expect(resolvePdfUrl('..\\secrets.pdf')).toBeNull();
    expect(resolvePdfUrl('index.html')).toBeNull();
    expect(resolvePdfUrl('')).toBeNull();
    expect(resolvePdfUrl(null)).toBeNull();
  });

  test('listPdfFiles returns sorted .pdf files and ignores non-pdf files', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hexo-pdf-test-'));
    try {
      fs.writeFileSync(path.join(tmpDir, '.gitkeep'), '');
      fs.writeFileSync(path.join(tmpDir, 'notes.txt'), 'ignore');
      fs.writeFileSync(path.join(tmpDir, 'z-talk.pdf'), '%PDF-1.4');
      fs.writeFileSync(path.join(tmpDir, 'a-keynote.PDF'), '%PDF-1.4');

      expect(listPdfFiles(tmpDir)).toEqual(['a-keynote.PDF', 'z-talk.pdf']);
      expect(listPdfFiles(path.join(tmpDir, 'missing'))).toEqual([]);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test('buildPresentRoutes emits /present/index.html with present layout', () => {
    const tmpSource = fs.mkdtempSync(path.join(os.tmpdir(), 'hexo-src-test-'));
    try {
      const pdfDir = path.join(tmpSource, 'pdf');
      fs.mkdirSync(pdfDir);
      fs.writeFileSync(path.join(pdfDir, 'demo.pdf'), '%PDF-1.4');

      const routes = buildPresentRoutes(tmpSource);
      expect(routes).toHaveLength(1);
      expect(routes[0].path).toBe('present/index.html');
      expect(routes[0].layout).toBe('present');
      expect(routes[0].data.pdfFiles).toEqual(['demo.pdf']);
    } finally {
      fs.rmSync(tmpSource, { recursive: true, force: true });
    }
  });

  test('present.ejs enforces noindex, nofollow robots meta tags', () => {
    const templatePath = path.join(
      __dirname,
      '../themes/leeboonstra/layout/present.ejs'
    );
    const template = fs.readFileSync(templatePath, 'utf8');
    expect(template).toContain('<meta name="robots" content="noindex, nofollow">');
    expect(template).toContain('<meta name="googlebot" content="noindex, nofollow">');
  });

  test('robots.txt disallows /present/ and /pdf/', () => {
    const robotsPath = path.join(
      __dirname,
      '../themes/leeboonstra/source/robots.txt'
    );
    const robots = fs.readFileSync(robotsPath, 'utf8');
    expect(robots).toContain('Disallow: /present/');
    expect(robots).toContain('Disallow: /pdf/');
  });
});
