// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Set up the global hexo mock before loading the script
let registeredFilterCallback = null;

global.hexo = {
  extend: {
    filter: {
      register: (hookName, callback) => {
        if (hookName === 'after_post_render') {
          registeredFilterCallback = callback;
        }
      }
    }
  }
};

// Require the script which triggers the filter registration
require('../themes/leeboonstra/scripts/image.js');

describe('Hexo Responsive Image Picture Filter', () => {
  test('should register the after_post_render filter', () => {
    expect(registeredFilterCallback).toBeDefined();
    expect(typeof registeredFilterCallback).toBe('function');
  });

  test('should transform standard markdown image tag to picture with responsive sources', () => {
    const mockData = {
      content: '<p><img src="/images/banner.jpg" alt="Awesome Banner" /></p>'
    };

    registeredFilterCallback(mockData);

    // Verify transformation to <picture>
    expect(mockData.content).toContain('<picture type="image/webp">');
    expect(mockData.content).toContain('srcset="/images/large_banner.webp"');
    expect(mockData.content).toContain('srcset="/images/medium_banner.webp"');
    expect(mockData.content).toContain('srcset="/images/small_banner.webp"');
    expect(mockData.content).toContain('alt="Awesome Banner" title="Awesome Banner"');
  });

  test('should handle image tag without alt attributes gracefully', () => {
    const mockData = {
      content: '<p><img src="/images/illustration.png" /></p>'
    };

    registeredFilterCallback(mockData);

    expect(mockData.content).toContain('<picture type="image/webp">');
    expect(mockData.content).toContain('srcset="/images/large_illustration.webp"');
    expect(mockData.content).not.toContain('alt=');
  });
});
