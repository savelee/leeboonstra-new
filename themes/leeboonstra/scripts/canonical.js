/*
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
 * Custom Hexo helper that generates a clean HTML5-compliant canonical URL link.
 * Removes trailing slashes and handles index.html mapping natively.
 *
 * @param {Object} config Hexo site configuration options
 * @param {Object} page Current active Hexo page object context
 * @returns {string} Fully formed canonical link HTML element
 */
hexo.extend.helper.register('autoCanonical', function (config, page) {
  var base_url = config.url;
  if (config.url.charAt(config.url.length - 1) !== '/') {
    base_url += '/';
  }
  var path = (page.canonical_path || '')
    .replace('index.html', '')
    .toLowerCase();

  return '<link rel="canonical" href="' + base_url + path + '">';
});
