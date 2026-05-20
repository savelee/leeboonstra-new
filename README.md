# Lee Boonstra - Technical Portfolio & Personal Site

Welcome to the codebase for Lee Boonstra's technical blog and portfolio site. This project is a modern static site built using **Hexo**, styled with a custom **SASS/Parcel** presentation layer, optimized for **PWA Offline Caching** using Workbox, and deployed via **Firebase Hosting**.

---

## 📖 Documentation Site

This repository features a comprehensive developer documentation site built using **MkDocs** with the Material theme. 

### 🚀 How to Spin Up the Docs Site

You can view and edit the documentation locally in two ways:

#### Option A: MkDocs Interactive Development Server (Recommended for Editing)
To run the hot-reloading documentation server:
1. Initialize the Python virtual environment and install packages:
   ```bash
   uv venv
   source .venv/bin/activate
   uv pip install -r requirements.txt
   ```
2. Start the live-reloading MkDocs server:
   ```bash
   mkdocs serve
   ```
3. Open your browser and visit: `http://127.0.0.1:8000/`

#### Option B: Compiled Documentation via Hexo Local Server
To compile the MkDocs documentation directly into the Hexo source and serve it alongside the blog:
1. Compile the docs:
   ```bash
   source .venv/bin/activate
   mkdocs build
   ```
2. Run the Hexo development server:
   ```bash
   npm run dev
   ```
3. Access the compiled docs in the local blog at: `http://localhost:4000/docs/`

---

## 🤖 Developer Agentic Skills

This workspace is fully prepared for Spec-Driven Development using AI coding agents. It contains specialized agentic skills and developer manifest files located in the `.agents/` directory.

### 🛠️ How to Use Agentic Skills

When collaborating with a developer agent (like Jetski), you can instruct them to use specific workflows. The agent reads the instructions and execution manuals defined in these files to execute tasks safely and accurately.

The following project-specific skills are available:

| Skill Name | Description / Purpose | Key Commands Involved |
| :--- | :--- | :--- |
| **`start-app`** | Boots the local development environment, installs root & theme dependencies, pre-processes responsive images, and launches Hexo on port `4000`. | `npm install`, `npm run process-images`, `npm run dev` |
| **`deploy-app`** | Builds site assets, compiles the production site, minifies CSS/JS, compiles the Workbox service worker, and deploys static files to Firebase. | `npm run firebase:build` or `./deploy.sh` |
| **`generate-docs`** | Manages MkDocs compilation, environment setup (`uv venv`), and syncing compiled HTML into the Hexo theme assets for deployment. | `mkdocs build`, `mkdocs serve` |
| **`push-github`** | Ensures clean git staging, enforces Conventional Commits, generates chronological summaries, and handles/delegates branch pushes safely. | `git status`, `git add`, `git push` |

To invoke or refer an agent to these skills, simply ask the agent:
> *"Use the `start-app` skill to spin up the local server and verify the changes"*
> *"Run the `deploy-app` skill to compile and push the latest build to Firebase"*

For complete details on coding standards, architectural layouts, and the agent execution loop, review [.agents/AGENTS.md](file:///.agents/AGENTS.md).

---

## 📁 Repository Architecture & Setup Manuals

Detailed instructions regarding project dependencies, manual environment configuration, SASS stylesheet maintenance, and deployment pipelines are migrated to our official documentation site:
- Detailed Hexo & PWA Setup: [docs/pipeline_hexo.md](file:///docs/pipeline_hexo.md)
- Stylesheet SASS/JS Pipeline: [docs/pipeline_assets.md](file:///docs/pipeline_assets.md)
- Technical Design & Schema Specs: [specs/technical_design.md](file:///specs/technical_design.md)
