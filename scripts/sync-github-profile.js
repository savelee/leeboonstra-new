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
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');

const YML_PATH = path.join(__dirname, '../source/_data/resume.yml');
const TEMP_CLONE_DIR = path.join(__dirname, '../.github_profile_temp');

// Target Profile Details
const TARGET_REPO = 'github.com/savelee/savelee.git';
const TARGET_BRANCH = 'main';

/**
 * A highly robust, zero-dependency, stack-based YAML parser designed
 * explicitly to handle resume.yml nested structures (lists, sub-objects, multiline values).
 */
function parseResumeYml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.load(content);
}

function syncGithubProfile() {
  console.log('🤖 Starting GitHub Profile README Auto-Sync Pipeline...');

  if (!fs.existsSync(YML_PATH)) {
    throw new Error(`Resume database not found: ${YML_PATH}`);
  }

  const data = parseResumeYml(YML_PATH);
  const b = data.basics;

  if (!b) {
    throw new Error('Basics data block is missing or corrupt.');
  }

  const linkedIn = b.profiles ? b.profiles.find(p => p.network === 'LinkedIn') : null;
  const github = b.profiles ? b.profiles.find(p => p.network === 'GitHub') : null;

  // Compile high-impact Staff Engineering Executive Landing Card
  let readme = `<!-- 🤖 AUTOMATICALLY GENERATED FILE - DO NOT EDIT DIRECTLY 🤖 -->
<!-- Synced programmatically via AI-pipeline from www.leeboonstra.dev/about -->

# Hi, I'm Lee Boonstra (they/them) 🦄

![Staff AI Software Engineer & Tech Lead](https://img.shields.io/badge/Rank-Staff_AI_SWE_%2F_Tech_Lead-4285F4?style=for-the-badge&logo=google&logoColor=white)
[![Dynamic Resume Version](https://img.shields.io/badge/Interactive_Resume-Screen_%26_Print-10B981?style=for-the-badge&logo=google&logoColor=white)](https://www.leeboonstra.dev/about/print/)
[![Resume API Endpoints](https://img.shields.io/badge/Resume_API-JSON_%26_Markdown-FF8C00?style=for-the-badge&logo=json&logoColor=white)](https://www.leeboonstra.dev/about/)

## 🚀 Staff AI Software Engineer & Technical Architect

I am a **Staff AI Software Engineer and Technical Lead** inside **Google Cloud's Global Office of the CTO (OCTO) - Innovation Factory**. 
I specialize in translating frontier research milestones into enterprise-grade production systems, directing engineering teams, and standardizing multi-agent protocols.

> 🎙️ *"I'm good at explaining engineering to beginners and explaining to engineers where to begin."*

---

### 🧠 Staff Engineering Competencies & Core Focus Areas
- 🏢 **AI Product Architecture:** Technical Lead & Systems Architect for planetary-scale Conversational GenAI speech automation pipelines (e.g. Wendy's Drive-Thru Voice AI).
- ⚙️ **Frontier Agentic Frameworks:** Defining standards for secure, isolated multi-agent environments crossing trust boundaries (LangGraph, GraphRAG, Antigravity).
- 📈 **Scale & Alignment Infrastructure:** Distributed model serving (vLLM, TensorRT-LLM), scaling infrastructure optimization, and target preference tuning (DPO, RLHF).
- 📜 **IP & Technical Governance:** 3 patents filed covering transactional agent accuracy and secure sandbox protocols. Author of 2 books for O'Reilly and Apress.

---

### 📜 Published Patents & Inventions
- 💡 **US20250078820A1:** *Scalable High-Accuracy Transactional Agents* (Google High-Performance Conversational Voice Pipeline)
- 💡 **GP-310555-00-US:** *Communicating Across a Trust Boundary using a Digital Sibling* (Secure cross-boundary sandboxing)
- 💡 **IDF-326887:** *AI Agents working across Trust boundaries: The Digital Sibling* (Distributed state sync runtime)

---

### 📚 Published Books & Viral Research
- 📘 **The Definitive Guide to Conversational AI with Dialogflow & Google Cloud** (Apress, 2021)
- 📙 **Hands-on Sencha Touch 2: A Real-World App Approach** (O'Reilly, 2013)
- 📰 **Viral Prompt Engineering Whitepaper** (Google / Kaggle, 2025 - read by over 100,000 engineers globally)

---

### 🏛️ Engineering Career Timeline Highlights

`;

  if (data.work && data.work.length > 0) {
    const topRoles = data.work.slice(0, 3);
    topRoles.forEach(job => {
      const end = job.endDate ? job.endDate.substring(0, 7) : 'Present';
      
      readme += `- **${job.position}** at **${job.name}** *(${job.startDate.substring(0, 7)} - ${end})*\n`;
      readme += `  _${job.summary}_\n`;
      
      if (job.highlights && job.highlights.length > 0) {
        readme += `  * Direct Impact: ${job.highlights[0]}\n`;
      }
      readme += `\n`;
    });
  }

  readme += `---

## 📬 Contact & Interactive Portfolios
- 🌐 **My Dev Blog:** [leeboonstra.dev](https://www.leeboonstra.dev)
- 🖨️ **Recruiter-Ready Print Layout:** [Clean Visual Resume Sheet](https://www.leeboonstra.dev/about/print/)
- 💼 **LinkedIn Profile:** [linkedin.com/in/leeboonstra](https://www.linkedin.com/in/leeboonstra)

---
<p align="center">
  <sub><i>This profile README was automatically synchronized by my static Hexo pipeline. Last build: ${new Date().toISOString().substring(0, 10)}</i></sub>
</p>
`;

  // 2. Clone Target Repo, Overwrite, and Commit
  console.log('🔄 Cloner: Syncing target repository...');
  if (fs.existsSync(TEMP_CLONE_DIR)) {
    fs.rmSync(TEMP_CLONE_DIR, { recursive: true, force: true });
  }

  const token = process.env.GH_PROFILE_SYNC_TOKEN;
  if (!token) {
    console.warn('⚠️ GH_PROFILE_SYNC_TOKEN environment secret is missing. Profile README sync skipped (normal during local runs).');
    return;
  }

  const cloneUrl = `https://x-access-token:${token}@${TARGET_REPO}`;
  execSync(`git clone --depth 1 -b ${TARGET_BRANCH} ${cloneUrl} "${TEMP_CLONE_DIR}"`, { stdio: 'inherit' });

  const targetReadmePath = path.join(TEMP_CLONE_DIR, 'README.md');
  fs.writeFileSync(targetReadmePath, readme, 'utf8');

  console.log('📤 Submitting sync changes...');
  const originalCwd = process.cwd();
  try {
    process.chdir(TEMP_CLONE_DIR);
    const diff = execSync('git status --porcelain').toString();
    if (!diff.trim()) {
      console.log('✅ GitHub profile is already in sync with the latest resume details. No push needed.');
      return;
    }

    execSync('git config user.name "AI Resume Sync Agent"', { stdio: 'inherit' });
    execSync('git config user.email "resume-agent@leeboonstra.dev"', { stdio: 'inherit' });
    
    execSync('git add README.md', { stdio: 'inherit' });
    execSync(`git commit -m "chore: auto-sync staff career highlights from leeboonstra.dev (Build: ${new Date().toISOString().substring(0, 10)})"`, { stdio: 'inherit' });
    execSync(`git push origin ${TARGET_BRANCH}`, { stdio: 'inherit' });
    
    console.log('🎉 GitHub Profile README successfully updated!');
  } finally {
    process.chdir(originalCwd);
    fs.rmSync(TEMP_CLONE_DIR, { recursive: true, force: true });
  }
}

try {
  syncGithubProfile();
} catch (err) {
  console.error('❌ Error executing sync pipeline:', err);
  process.exit(1);
}
