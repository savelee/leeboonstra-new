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

// Require the script triggering the target mock registration hook
require('../themes/leeboonstra/scripts/speakable.js');

describe('Hexo Speakable Section Tagging Filter', () => {
  test('should register the after_post_render filter callback', () => {
    expect(registeredFilterCallback).toBeDefined();
    expect(typeof registeredFilterCallback).toBe('function');
  });

  test('should tag strong summary paragraphs with speakable-summary class name', () => {
    const mockData = {
      content: '<p><strong>Summary:</strong> This article covers the advanced validation capabilities of Dialogflow CX.</p>'
    };

    registeredFilterCallback(mockData);

    expect(mockData.content).toBe('<p class="speakable-summary"><strong>Summary:</strong> This article covers the advanced validation capabilities of Dialogflow CX.</p>');
  });

  test('should tag strong key takeaway paragraphs with speakable-takeaways class name', () => {
    const mockData = {
      content: '<p><strong>Key Takeaway:</strong> Pre-testing conversational agents prevents runtime failure states.</p>'
    };

    registeredFilterCallback(mockData);

    expect(mockData.content).toBe('<p class="speakable-takeaways"><strong>Key Takeaway:</strong> Pre-testing conversational agents prevents runtime failure states.</p>');
  });

  test('should handle irregular spacing and casing in Summary and Key Takeaways tags', () => {
    const mockData = {
      content: '<p><strong> Key Takeaways : </strong> Multi-agent systems provide linear scaling bounds.</p>'
    };

    registeredFilterCallback(mockData);

    expect(mockData.content).toBe('<p class="speakable-takeaways"><strong> Key Takeaways : </strong> Multi-agent systems provide linear scaling bounds.</p>');
  });

  test('should leave non-targeted bold paragraphs completely untouched', () => {
    const mockData = {
      content: '<p><strong>Important Note:</strong> Never expose production API keys.</p>'
    };

    registeredFilterCallback(mockData);

    expect(mockData.content).toBe('<p><strong>Important Note:</strong> Never expose production API keys.</p>');
  });
});
