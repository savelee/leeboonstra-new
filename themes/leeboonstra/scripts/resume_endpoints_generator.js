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

/**
 * Custom Hexo generator that builds structured static files from source/_data/resume.yml
 * Exposes:
 *  - /about/resume.json (JSON Resume standard)
 *  - /about/resume.md (RAG-ready high-density markdown)
 *  - /about/resume.txt (Standard plain text)
 *  - /about/print/index.html (Clean physical preview resume sheet on screen)
 *  - /css/print-screen.css (Globalized forced print styles without @media boundary)
 */
hexo.extend.generator.register('resume_api_endpoints', function(locals) {
  const resume = locals.data && locals.data.resume;
  if (!resume) {
    hexo.log.warn('⚠️ Resume database source/_data/resume.yml not found. Skipping static career APIs generation.');
    return;
  }

  const routes = [];

  // 1. JSON Resume Endpoint (/about/resume.json)
  routes.push({
    path: 'about/resume.json',
    data: JSON.stringify(resume, null, 2)
  });

  // 2. High-Density Markdown Resume Endpoint (/about/resume.md)
  let md = `<!-- Copyright 2026 Google LLC -->\n`;
  md += `# Resume - ${resume.basics.name}\n\n`;
  md += `## PROFILE OVERVIEW\n\n`;
  md += `**Title:** ${resume.basics.label}\n`;
  md += `**Pronouns:** ${resume.basics.pronouns}\n`;
  md += `**Location:** ${resume.basics.location.city}, ${resume.basics.location.country}\n`;
  md += `**Email:** ${resume.basics.email}\n`;
  md += `**Web:** ${resume.basics.url}\n`;
  
  const linkedIn = resume.basics.profiles.find(p => p.network === 'LinkedIn');
  const github = resume.basics.profiles.find(p => p.network === 'GitHub');
  if (linkedIn) md += `**LinkedIn:** ${linkedIn.url}\n`;
  if (github) md += `**GitHub:** ${github.url}\n`;
  md += `\n**Executive Summary:**\n${resume.basics.summary}\n\n`;

  md += `## PROFESSIONAL EXPERIENCE\n\n`;
  resume.work.forEach(job => {
    const end = job.endDate ? job.endDate.substring(0, 7) : 'Present';
    md += `### ${job.position}\n`;
    md += `**Company:** [${job.name}](${job.url}) | **Period:** ${job.startDate.substring(0, 7)} - ${end}\n`;
    md += `*Summary:* ${job.summary}\n`;
    md += `*Key Engineering Contributions:*\n`;
    job.highlights.forEach(high => {
      md += `- ${high}\n`;
    });
    md += `\n`;
  });

  md += `## PATENTS & INVENTIONS\n\n`;
  const patents = resume.publications.filter(p => p.type === 'patent');
  patents.forEach(pat => {
    md += `### ${pat.name}\n`;
    md += `**Status:** ${pat.name.includes('US2025') ? 'Published' : 'Filed'} | **Date:** ${pat.releaseDate}\n`;
    if (pat.url) md += `**Source URL:** ${pat.url}\n`;
    md += `*Abstract:* ${pat.summary}\n\n`;
  });

  md += `## KEY PUBLICATIONS & BOOKS\n\n`;
  const keyPubs = resume.publications.filter(p => p.type !== 'patent');
  keyPubs.forEach(pub => {
    md += `### ${pub.name}\n`;
    md += `**Publisher:** ${pub.publisher} (${pub.releaseDate}) | **URL:** ${pub.url}\n`;
    md += `*Description:* ${pub.summary}\n\n`;
  });

  md += `### Technical Skills\n\n`;
  resume.skills.forEach(skill => {
    md += `* **${skill.name}:** ${skill.keywords.join(', ')}.\n`;
  });
  md += `\n`;

  md += `## EDUCATION\n\n`;
  resume.education.forEach(edu => {
    md += `- **${edu.studyType} in ${edu.area}**\n  Institution: ${edu.institution} | Dates: ${edu.startDate} - ${edu.endDate}\n`;
  });
  md += `\n`;

  md += `## SPOKEN LANGUAGES\n\n`;
  resume.languages.forEach(lang => {
    md += `- **${lang.language}:** ${lang.fluency}\n`;
  });

  routes.push({
    path: 'about/resume.md',
    data: md
  });

  // 3. Ultra-Compatible Plain Text Resume Endpoint (/about/resume.txt)
  let txt = `======================================================================\n`;
  txt += `RESUME: ${resume.basics.name.toUpperCase()}\n`;
  txt += `Title: ${resume.basics.label}\n`;
  txt += `Email: ${resume.basics.email}\n`;
  txt += `Web: ${resume.basics.url}\n`;
  txt += `LinkedIn: ${linkedIn ? linkedIn.url : ''}\n`;
  txt += `GitHub: ${github ? github.url : ''}\n`;
  txt += `Location: ${resume.basics.location.city}, ${resume.basics.location.country}\n`;
  txt += `======================================================================\n\n`;
  
  txt += `SUMMARY:\n`;
  txt += `${resume.basics.summary}\n\n`;

  txt += `PROFESSIONAL EXPERIENCE:\n\n`;
  resume.work.forEach(job => {
    const end = job.endDate ? job.endDate.substring(0, 7) : 'Present';
    txt += `* ${job.position.toUpperCase()} at ${job.name.toUpperCase()}\n`;
    txt += `  Period: ${job.startDate.substring(0, 7)} to ${end}\n`;
    txt += `  Company URL: ${job.url}\n`;
    txt += `  Scope: ${job.summary}\n`;
    txt += `  Bullet Points:\n`;
    job.highlights.forEach(high => {
      txt += `    - ${high}\n`;
    });
    txt += `\n`;
  });

  txt += `PATENTS & INVENTIONS:\n\n`;
  const txtPatents = resume.publications.filter(p => p.type === 'patent');
  txtPatents.forEach(pat => {
    txt += `* PATENT: "${pat.name}"\n`;
    txt += `  Date: ${pat.releaseDate}\n`;
    if (pat.url) txt += `  Link: ${pat.url}\n`;
    txt += `  Details: ${pat.summary}\n\n`;
  });

  txt += `PUBLICATIONS & BOOKS:\n\n`;
  const txtPubs = resume.publications.filter(p => p.type !== 'patent');
  txtPubs.forEach(pub => {
    txt += `* PUBLICATION: "${pub.name}"\n`;
    txt += `  Published: ${pub.publisher} on ${pub.releaseDate}\n`;
    if (pub.url) txt += `  Link: ${pub.url}\n`;
    txt += `  Summary: ${pub.summary}\n\n`;
  });

  txt += `TECHNICAL SKILLS INVENTORY:\n\n`;
  resume.skills.forEach(skill => {
    txt += `* ${skill.name}:\n  ${skill.keywords.join(', ')}\n\n`;
  });

  txt += `EDUCATION BACKGROUND:\n\n`;
  resume.education.forEach(edu => {
    txt += `* ${edu.studyType} in ${edu.area.toUpperCase()}\n`;
    txt += `  University: ${edu.institution} (${edu.startDate} - ${edu.endDate})\n\n`;
  });

  txt += `SPOKEN LANGUAGES:\n\n`;
  resume.languages.forEach(lang => {
    txt += `* ${lang.language}: ${lang.fluency}\n`;
  });

  routes.push({
    path: 'about/resume.txt',
    data: txt
  });

  // 4. Clean Virtual Print Resume Endpoint (/about/print/index.html)
  const aboutPage = locals.pages.findOne({layout: 'about'}) || locals.pages.findOne({path: 'about/index.md'});
  const compiledBioHtml = aboutPage ? aboutPage.content : '';

  routes.push({
    path: 'about/print/index.html',
    layout: 'print_resume_layout', // Custom visual template layout
    data: {
      title: 'Resume | ' + resume.basics.name + ' - Staff AI Engineer',
      subtitle: resume.basics.label,
      description: 'Clean visual A4 sheet preview for ' + resume.basics.name,
      content: compiledBioHtml,
      layout: 'about'
    }
  });

  // 5. Dynamic CSS Compiles: Forces print media rules globally in on-screen displays
  const fs = require('fs');
  const path = require('path');
  const printCssPath = path.join(hexo.theme_dir, 'source/print.css');
  
  if (fs.existsSync(printCssPath)) {
    const cssContent = fs.readFileSync(printCssPath, 'utf8');
    
    // Locate print media boundaries to strip block constraints dynamically
    const mediaQueryIndex = cssContent.indexOf('@media print {');
    if (mediaQueryIndex !== -1) {
      const lastBracketIndex = cssContent.lastIndexOf('}');
      if (lastBracketIndex !== -1) {
        const prefix = cssContent.substring(0, mediaQueryIndex);
        const nestedPrintStyles = cssContent.substring(mediaQueryIndex + '@media print {'.length, lastBracketIndex);
        const suffix = cssContent.substring(lastBracketIndex + 1);
        
        const globalizedCss = prefix + nestedPrintStyles + suffix;
        
        routes.push({
          path: 'css/print-screen.css',
          data: globalizedCss
        });
        hexo.log.info('🎨 Dynamically globalized print.css rules inside route: /css/print-screen.css');
      }
    }
  } else {
    hexo.log.warn('⚠️ print.css source assets missing. Skipping globalizer compilation.');
  }

  return routes;
});
