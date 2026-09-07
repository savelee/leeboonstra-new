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

const YML_PATH = path.join(__dirname, '../source/_data/resume.yml');

/**
 * Robust, zero-dependency, stack-based YAML parser replicated
 * directly from scripts/sync-github-profile.js to assert parser precision.
 */
function parseResumeYml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const root = {};
  
  const stack = [{ indent: -1, container: root, key: null, type: 'object' }];
  
  let inMultiline = false;
  let multilineVal = '';
  let multilineIndent = 0;
  let multilineTarget = null;
  let multilineKey = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim().startsWith('#') && !inMultiline) continue;
    if (line.trim() === '' && !inMultiline) continue;

    if (inMultiline) {
      const indentMatch = line.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1].length : 0;
      
      if (currentIndent > multilineIndent || line.trim() === '') {
        multilineVal += (line.trim() === '' ? '\n' : line.substring(multilineIndent) + '\n');
        continue;
      } else {
        inMultiline = false;
        multilineTarget[multilineKey] = multilineVal.trim();
        multilineVal = '';
      }
    }

    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;
    const trimmedLine = line.trim();

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    
    const parent = stack[stack.length - 1];

    if (trimmedLine.startsWith('-')) {
      const bulletContent = trimmedLine.substring(1).trim();
      
      // Safety fix: If target exists but is not an actual array, force-overwrite it as a clean list array wrapper
      if (!parent.container[parent.key] || !Array.isArray(parent.container[parent.key])) {
        parent.container[parent.key] = [];
      }
      const targetArray = parent.container[parent.key];
      
      const colonIndex = bulletContent.indexOf(':');
      if (colonIndex !== -1 && !bulletContent.startsWith('"') && !bulletContent.startsWith("'")) {
        const k = bulletContent.substring(0, colonIndex).trim();
        let v = bulletContent.substring(colonIndex + 1).trim();
        v = v.replace(/^["']|["']$/g, '');
        if (v === 'null') v = null;
        
        const obj = {};
        obj[k] = v;
        targetArray.push(obj);
        
        stack.push({ indent: indent, container: obj, key: null, type: 'object_item' });
      } else {
        let val = bulletContent.replace(/^["']|["']$/g, '');
        targetArray.push(val);
      }
      continue;
    }

    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex !== -1) {
      const k = trimmedLine.substring(0, colonIndex).trim();
      let v = trimmedLine.substring(colonIndex + 1).trim();
      
      let targetObj = parent.container;
      if (parent.type === 'object') {
        if (parent.key) {
          if (!parent.container[parent.key] || typeof parent.container[parent.key] !== 'object') {
            parent.container[parent.key] = {};
          }
          targetObj = parent.container[parent.key];
        }
      } else if (parent.type === 'object_item') {
        targetObj = parent.container;
      }

      if (v === '|') {
        inMultiline = true;
        multilineKey = k;
        multilineIndent = indent + 2;
        multilineVal = '';
        multilineTarget = targetObj;
        continue;
      }

      v = v.replace(/^["']|["']$/g, '');
      if (v === 'null') v = null;

      if (v === '') {
        targetObj[k] = {};
        stack.push({ indent: indent, container: targetObj, key: k, type: 'object' });
      } else {
        targetObj[k] = v;
      }
      continue;
    }
  }
  
  if (inMultiline) {
    multilineTarget[multilineKey] = multilineVal.trim();
  }

  return root;
}

describe('Resume YAML Data Integrity & Compiles Verification', () => {
  test('Verify resume.yml exists and has structured keys', () => {
    expect(fs.existsSync(YML_PATH)).toBe(true);
    
    const data = parseResumeYml(YML_PATH);
    
    expect(data).toHaveProperty('basics');
    expect(data.basics).toHaveProperty('name', 'Lee Boonstra');
    expect(data.basics).toHaveProperty('label');
    expect(data.basics.label).toContain('AI Software Engineer');
    
    expect(data).toHaveProperty('work');
    expect(data.work.length).toBeGreaterThan(0);
    
    expect(data).toHaveProperty('skills');
    expect(data.skills.length).toBe(5); // AI & ML, GenAI & Orchestration, Languages, Infra, Databases
    
    expect(data).toHaveProperty('volunteer');
    expect(data.volunteer.length).toBeGreaterThan(0);
    expect(data.volunteer[0].organization).toBe('Stichting Meer Dan Gewenst');
  });

  test('Verify chronological milestones and structured details', () => {
    const data = parseResumeYml(YML_PATH);
    
    const staffJob = data.work[0];
    expect(staffJob.position).toContain('AI Software Engineer');
    expect(staffJob.startDate).toBe('2022-10-01');
    expect(staffJob.endDate).toBe(null);
    expect(staffJob.name).toBe('Google');
    expect(staffJob.highlights.some(h => h.includes('Real2Sim') && h.includes('Blender'))).toBe(true);
    expect(staffJob.highlights.some(h => h.includes('Spanner Property Graphs') || h.includes('Graph Query Language'))).toBe(true);
    
    expect(data).toHaveProperty('publications');
    const patents = data.publications.filter(p => p.type === 'patent');
    expect(patents.length).toBeGreaterThanOrEqual(3);
    expect(patents[0].name).toContain('Scalable High-Accuracy Transactional Agents');
    
    const whitepapers = data.publications.filter(p => p.type === 'whitepaper');
    expect(whitepapers.some(p => p.name.includes('Spec-Driven Development'))).toBe(true);
  });

  test('Verify Technical Skills taxonomies target Leadership and Physical AI keywords', () => {
    const data = parseResumeYml(YML_PATH);
    
    const physicalGroup = data.skills.find(s => s.name === 'Physical AI, Robotics & Simulation');
    expect(physicalGroup).toBeDefined();
    expect(physicalGroup.keywords).toContain('Reinforcement Learning (RL)');
    expect(physicalGroup.keywords).toContain('MuJoCo (MJCF)');
    expect(physicalGroup.keywords).toContain('MJWarp Simulator');
    expect(physicalGroup.keywords).toContain('Blender (Computational Geometry & Python API)');
    expect(physicalGroup.keywords).toContain('Agibot');
    
    const leadershipGroup = data.skills.find(s => s.name === 'AI & Machine Learning');
    expect(leadershipGroup).toBeDefined();
    expect(leadershipGroup.keywords).toContain('Technical Leadership');
    expect(leadershipGroup.keywords).toContain('Team Mentorship');
    expect(leadershipGroup.keywords).toContain('Frontier LLMs (Gemini, Claude, GPT)');
    expect(leadershipGroup.keywords).toContain('Open Source LLMs (Gemma, Llama, Gwen, Mistral, Phi)');
    
    const genaiGroup = data.skills.find(s => s.name === 'GenAI Architectures & Orchestration');
    expect(genaiGroup).toBeDefined();
    expect(genaiGroup.keywords).toContain('LangGraph Architectures');
    expect(genaiGroup.keywords).toContain('Spec-Driven Development');
    
    const infraGroup = data.skills.find(s => s.name === 'Data & Cloud Infrastructure');
    expect(infraGroup).toBeDefined();
    expect(infraGroup.keywords).toContain('Google Cloud Spanner (Graph / GQL)');
    expect(infraGroup.keywords).toContain('Vector Search (pgvector, ChromaDB)');
  });
});
