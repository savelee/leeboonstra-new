# Agent-Based Development Spec

This workspace utilizes autonomous AI agents to build, maintain, and deploy code.

## 1. Custom Skills
Custom agent instructions are stored inside:
`.agents/skills/`

- **`deploy-app`**: Coordinates hexo builds, image resizing, and firebase hosting deploys.
- **`generate-docs`**: Compiles and runs the local Material MkDocs server.

---

## 2. Context Rules Manifest
Developer environments are governed by:
- **`.agents/AGENTS.md`**: Declares our tech stack, standard directory parameters, and development loops.
- **`.cursorrules`**: IDE configuration giving agents context on local npm execution commands.
