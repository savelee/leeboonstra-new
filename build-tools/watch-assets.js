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
const { fork } = require('child_process');

const sassSourceDir = path.join(__dirname, '../themes/leeboonstra/design/src/sass');
const buildScript = path.join(__dirname, 'build-assets.js');

console.log(`👀 Watching for Sass changes in: ${sassSourceDir}`);

let timeoutId = null;

function triggerBuild() {
    console.log('\n🔄 Sass change detected. Recompiling assets...');
    const child = fork(buildScript, [], { stdio: 'inherit' });
    child.on('exit', (code) => {
        if (code === 0) {
            console.log('✨ Assets rebuilt and copied successfully!');
        } else {
            console.error('❌ Asset rebuild failed.');
        }
    });
}

// Recursive watch using standard fs.watch
fs.watch(sassSourceDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.scss')) {
        // Debounce triggers to handle multi-file saves or editors saving temporary files
        clearTimeout(timeoutId);
        timeoutId = setTimeout(triggerBuild, 200);
    }
});

// Perform an initial build on startup
triggerBuild();
