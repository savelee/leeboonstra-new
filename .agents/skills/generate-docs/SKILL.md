<!--
 Copyright 2026 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->

# Custom Skill: MkDocs Generation and Docstring Extraction

This skill guides the agent to initialize, compile, and synchronize project documentation using **MkDocs**, **mkdocs-material**, and **mkdocstrings** to automatically generate API references directly from Python docstrings.

---

## 📋 Requirements
- Python environment with `mkdocs`, `mkdocs-material`, and `mkdocstrings[python]` installed.
- Valid Google-style docstrings in all public Python modules.

---

## 📂 Architectural Directory Conventions
When generating documentation, establish the following standard structures:

```text
docs/
├── api/
│   ├── core/          <-- Configurations & Global states
│   ├── models/        <-- Data Schemas & Plain Classes
│   ├── routes/        <-- Routes & Controllers
│   ├── services/      <-- Core Business Logic
│   └── views/         <-- Templates & Presentation Helpers
├── SETUP.md           <-- Local installation instructions
└── README.md          <-- Standalone feature guides
mkdocs.yml             <-- Configuration entrypoint
```

---

## 🚀 Step-by-Step Instructions

### 1. Setup MkDocs Configuration
If `mkdocs.yml` does not exist, create it in the root with the Material theme and python docstring parser enabled:

```yaml
site_name: Project Documentation
theme:
  name: material
  palette:
    primary: indigo
    accent: blue

plugins:
  - search
  - mkdocstrings:
      default_handler: python
      handlers:
        python:
          paths: [src]
          options:
            show_source: true
            show_root_heading: true

nav:
  - Home: README.md
  - Setup: SETUP.md
  - API Reference:
    - Core: api/core/index.md
    - Models: api/models/index.md
    - Routes: api/routes/index.md
    - Services: api/services/index.md
```

### 2. Documenting Public Modules via Markdown
For each Python file inside the `src/` directory, map it to its corresponding layer inside `docs/api/`.
Create a `.md` file containing a `mkdocstrings` directive. 

For example, to extract docstrings from `src/routes/agent_routes.py`, create `docs/api/routes/agent_routes.md`:

```markdown
# Agent Routes API

::: src.routes.agent_routes
```

### 3. Maintain navigation in `mkdocs.yml`
Ensure every new markdown file is registered under the `nav` section in `mkdocs.yml` matching the architectural layer folder structure.

### 4. Build and Verify
Execute the documentation server locally to verify the pages render and docstrings extract without warning:

```bash
# Serve the docs site locally
mkdocs serve -a localhost:8000
```
Validate that:
- Python classes, parameters, return structures, and exceptions are correctly extracted and styled.
- Internal links and navigation structures resolve cleanly.
