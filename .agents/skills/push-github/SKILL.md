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

# Custom Skill: Clean Staging, Conventional Committing, and Github Pushes

This skill guides the agent in preparing clean git commits, validating ignored outputs, composing conventional descriptions, and executing or delegating remote GitHub pushes.

---

## 🚀 Step-by-Step Instructions

### 1. Clean Git Status Verification
Always check the unstaged and untracked files before staging:
```bash
git status
```
Verify that:
- Temporary test files, coverage reports (`coverage/`), compilation logs (`*.log`), and dependency node folders (`node_modules/`) are **not** marked as unstaged/untracked.
- If these files show up, update `.gitignore` to exclude them before staging.

### 2. Targeted Staging
Stage only the required and appropriate files. Never run a blind `git add .` unless you are certain all untracked files are safe and intended for the commit.
```bash
git add file1.py path/to/folder/
```

### 3. Composing Conventional Commit Messages
Compose a clear, high-quality commit message that conforms to standard formatting conventions:

- **Format**: `<type>(<scope>): <short_description>`
- **Types**: `feat` (features), `fix` (bug fixes), `docs` (documentation), `style` (formatting), `refactor` (code restructuring), `test` (adding/refactoring tests), `chore` (maintenance).
- **Body**: Detail the Observation, Impact, and Proposal of the change.
- **Governance Tags**: Always append these two tags at the **very bottom** of the commit description:
  - `TAG=agy`
  - `CONV=<conversation_id>` (include if conversation ID is available)

#### Commit Template Example:
```text
feat(auth): integrate Vertex AI authentication credentials

Uses Application Default Credentials (ADC) to retrieve token scopes securely, replacing hardcoded API keys.

TAG=agy
CONV=54f4804e-1c3f-42a1-84d2-25659152a8de
```

### 4. Push and Verification
Attempt to push the commit to the remote repository:
```bash
git push origin <branch_name>
```

> [!WARNING]
> **Handling Permission Restrictions**: If the agent shell responds with a command permission restriction (e.g., `permission denied for command(git push...)`), do **not** retry. You must gracefully delegate the push operation to the user by presenting the exact sequence of git push commands they should execute in their local terminal.
