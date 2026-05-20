# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# 📖 SKILL: MkDocs Generation and Compilation Pipeline

Use this skill to initialize, compile, and verify the project's Material MkDocs documentation.

## 🛠️ Operational Pre-requisites
- Python 3.10+
- Python Package Manager: `uv` (strongly preferred)

---

## 🚀 Step-by-Step Build Workflow

### 1. Initialize Python Virtual Environment (If not present)
If the virtual environment `.venv` is missing, initialize and install packages:
```bash
uv venv
uv pip install -r requirements.txt
```

### 2. Dynamic MkDocs Compilation
To compile documentation and copy the static HTML structure directly into the Hexo source tree:
```bash
source .venv/bin/activate
mkdocs build
```
*Note: Based on the configuration in `mkdocs.yml`, this automatically deposits compiled files in `themes/leeboonstra/source/docs/`.*

### 3. Clean Hexo Generation & Host Server
Regenerate the static blog including the compiled docs, and serve locally:
```bash
npx hexo clean
npm run dev
```
The documentation will be fully accessible at:
`http://localhost:4000/docs/`

### 4. Dynamic Interactive Live Editing
During documentation editing sessions, run the interactive live server:
```bash
source .venv/bin/activate
mkdocs serve
```
This starts a hot-reloading server at `http://127.0.0.1:8000/` to visualize changes instantly.
