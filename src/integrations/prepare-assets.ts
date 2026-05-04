import type { AstroIntegration } from 'astro';
import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';
import { globSync } from 'glob';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

/**
 * Simple binary check based on NULL byte and common extensions
 */
function isBinaryFile(filePath: string): boolean {
  const BINARY_EXTENSIONS = new Set(['.zip', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.exe', '.dll', '.so', '.dylib']);
  if (BINARY_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
    return true;
  }
  
  const buffer = fs.readFileSync(filePath);
  return buffer.slice(0, 1024).includes(0);
}


interface SkillMetadata {
  name: string;
  type: 'personal' | 'reference';
  description: string;
  github_url?: string;
  install_command?: string;
  [key: string]: any;
}

export default function prepareAssetsIntegration(): AstroIntegration {
  return {
    name: 'prepare-assets-integration',
    hooks: {
      'astro:config:setup': async ({ config, logger }) => {
        const rootDir = fileURLToPath(config.root);
        const paths = {
          skills: path.join(rootDir, '.agents', 'skills'),
          publicDownloads: path.join(rootDir, 'public', 'downloads'),
          publicRaw: path.join(rootDir, 'public', 'raw'),
          publicApi: path.join(rootDir, 'public', 'api', 'skills'),
          searchIndex: path.join(rootDir, 'public', 'api', 'search-index.json'),
          contentSkills: path.join(rootDir, 'src', 'content', 'skills'),
          skillsJson: path.join(rootDir, 'src', 'data', 'skills.json'),
          repoUrl: 'https://github.com/chiperman/agent-skills'
        };

        logger.info('🚀 Initializing asset preparation...');

        // 1. Setup Directories
        [paths.publicDownloads, paths.publicRaw, paths.publicApi, paths.contentSkills].forEach(dir => {
          fs.ensureDirSync(dir);
          fs.emptyDirSync(dir);
        });

        if (!fs.existsSync(paths.skillsJson)) {
          logger.error(`❌ Registry not found: ${paths.skillsJson}`);
          return;
        }

        const rawSkills: SkillMetadata[] = JSON.parse(fs.readFileSync(paths.skillsJson, 'utf8'));
        const processedSkills: SkillMetadata[] = [];

        // 2. Process Individual Skills
        for (const skill of rawSkills) {
          const processed = processSkill(skill, paths, logger);
          processedSkills.push(processed);
        }

        // 3. Generate Search Index
        generateSearchIndex(processedSkills, paths.searchIndex);
        logger.info(`🔍 Search index generated with ${processedSkills.length} entries.`);

        // 4. Sync Documentation
        syncReadmeFiles(processedSkills, rootDir, paths.repoUrl);
        
        logger.info(`✅ Successfully processed ${processedSkills.length} skills.`);
      }
    }
  };
}

/**
 * Handles ZIP generation, API metadata, and content sync for a single skill
 */
function processSkill(skill: SkillMetadata, paths: any, logger: any): SkillMetadata {
  const { name, type, github_url } = skill;
  const skillDirPath = path.join(paths.skills, name);
  const hasLocalSource = fs.existsSync(skillDirPath);

  let content = '';
  let frontmatter = { ...skill };

  if (hasLocalSource) {
    const skillMdPath = path.join(skillDirPath, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      const fileContent = fs.readFileSync(skillMdPath, 'utf8');
      const parsed = matter(fileContent);
      content = parsed.content;
      frontmatter = { ...frontmatter, ...parsed.data };

      // Create ZIP
      const zip = new AdmZip();
      const skillFiles = globSync('**/*', {
        cwd: skillDirPath,
        ignore: ['node_modules/**', '.DS_Store', 'dist/**', '.git/**']
      });

      skillFiles.forEach(file => {
        const filePath = path.join(skillDirPath, file);
        if (fs.statSync(filePath).isFile()) {
          zip.addLocalFile(filePath, path.dirname(file) === '.' ? '' : path.dirname(file));
        }
      });
      zip.writeZip(path.join(paths.publicDownloads, `${name}.zip`));

      // Copy Raw
      fs.copySync(skillMdPath, path.join(paths.publicRaw, `${name}.md`));

      // Collect all files for display
      const allFiles: any[] = [];
      skillFiles.forEach(file => {
        const filePath = path.join(skillDirPath, file);
        if (fs.statSync(filePath).isFile() && file !== 'SKILL.md') {
          const isBinary = isBinaryFile(filePath);
          allFiles.push({
            path: file,
            content: isBinary ? null : fs.readFileSync(filePath, 'utf8'),
            isBinary
          });
        }
      });

      // Group by category
      frontmatter.files = {
        scripts: allFiles.filter(f => f.path.startsWith('scripts/')),
        resources: allFiles.filter(f => f.path.startsWith('resources/')),
        examples: allFiles.filter(f => f.path.startsWith('examples/')),
        others: allFiles.filter(f => !f.path.startsWith('scripts/') && !f.path.startsWith('resources/') && !f.path.startsWith('examples/'))
      };
    }
  }

  // Fallback defaults
  if (!frontmatter.install_command && (type === 'personal' || github_url)) {
    const sourceUrl = type === 'personal' ? paths.repoUrl : github_url;
    frontmatter.install_command = `npx skills add ${sourceUrl} --skill ${name}`;
  }

  if (type === 'personal' && !frontmatter.github_url) {
    frontmatter.github_url = paths.repoUrl;
  }

  // Write content and API JSON
  fs.writeFileSync(path.join(paths.contentSkills, `${name}.md`), matter.stringify(content, frontmatter));
  fs.writeFileSync(path.join(paths.publicApi, `${name}.json`), JSON.stringify(frontmatter, null, 2));

  return frontmatter;
}

/**
 * Generates a lightweight search index for client-side filtering
 */
function generateSearchIndex(skills: SkillMetadata[], outputPath: string) {
  const index = skills.map(s => ({
    id: s.name,
    n: s.name.toLowerCase(),
    d: s.description.toLowerCase(),
    t: s.type
  }));
  fs.ensureDirSync(path.dirname(outputPath));
  fs.writeFileSync(outputPath, JSON.stringify(index));
}

/**
 * Robust README sync for multiple languages
 */
function syncReadmeFiles(skills: SkillMetadata[], rootDir: string, repoUrl: string) {
  const readmeFiles = globSync('README*.md', { cwd: rootDir });
  
  for (const filename of readmeFiles) {
    const filePath = path.join(rootDir, filename);
    const isZh = filename.includes('.zh');
    let readme = fs.readFileSync(filePath, 'utf8');
    
    // 1. Update Table
    const tableHeader = isZh 
      ? '| 技能 | 类别 | 描述 |\n| :--- | :--- | :--- |'
      : '| Skill | Category | Description |\n| :--- | :--- | :--- |';
    
    const tableRows = skills.map(s => {
      const category = (s.type === 'personal') ? (isZh ? '个人' : 'Personal') : (isZh ? '参考' : 'Reference');
      
      // Securely determine link target: prioritize local paths, fallback to registry
      const localSkillPath = path.join('.agents/skills', s.name, 'SKILL.md');
      const hasLocalFile = fs.existsSync(path.join(rootDir, localSkillPath));
      const link = hasLocalFile ? `./${localSkillPath}` : (s.github_url || 'https://skills.sh');
      
      return `| **[${s.name}](${link})** | ${category} | ${s.description} |`;
    }).join('\n');
    
    readme = updateSection(readme, 'SKILLS_TABLE', `${tableHeader}\n${tableRows}`);

    // 2. Update Installation Section
    const installCommands = skills.map(s => s.install_command).filter(Boolean).join('\n');
    const collectionText = isZh ? '# 安装此集合' : '# Install this collection';
    const specificText = isZh ? '# 安装特定技能' : '# Install specific skills';

    const installSection = `\`\`\`bash\n${collectionText}\nnpx skills add ${repoUrl}\n\n${specificText}\n${installCommands}\n\`\`\``;
    readme = updateSection(readme, 'INSTALL_SECTION', installSection);
    
    fs.writeFileSync(filePath, readme);
  }
}

/**
 * Helper to replace content between markers
 */
function updateSection(content: string, key: string, newContent: string): string {
  const startMarker = `<!-- ${key}_START -->`;
  const endMarker = `<!-- ${key}_END -->`;
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) return content;
  
  return content.slice(0, startIdx + startMarker.length) + 
         '\n' + newContent + '\n' + 
         content.slice(endIdx);
}
