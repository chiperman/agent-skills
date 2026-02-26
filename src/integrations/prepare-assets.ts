import type { AstroIntegration } from 'astro';
import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';
import { globSync } from 'glob';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

export default function prepareAssetsIntegration(): AstroIntegration {
  return {
    name: 'prepare-assets-integration',
    hooks: {
      'astro:config:setup': async ({ config, logger }) => {
        const rootDir = fileURLToPath(config.root);
        const SKILLS_DIR = path.join(rootDir, 'skills');
        const PUBLIC_DOWNLOADS_DIR = path.join(rootDir, 'public', 'downloads');
        const PUBLIC_RAW_DIR = path.join(rootDir, 'public', 'raw');
        const PUBLIC_API_DIR = path.join(rootDir, 'public', 'api', 'skills');
        const CONTENT_SKILLS_DIR = path.join(rootDir, 'src', 'content', 'skills');
        const SKILLS_JSON_PATH = path.join(rootDir, 'src', 'data', 'skills.json');
        const README_PATH = path.join(rootDir, 'README.md');
        const MY_REPO_URL = 'https://github.com/chiperman/agent-skills';

        logger.info('🚀 Starting asset preparation...');

        // Ensure directories exist and clean them
        [PUBLIC_DOWNLOADS_DIR, PUBLIC_RAW_DIR, PUBLIC_API_DIR, CONTENT_SKILLS_DIR].forEach(dir => {
          fs.ensureDirSync(dir);
          fs.emptyDirSync(dir);
        });

        if (!fs.existsSync(SKILLS_JSON_PATH)) {
          logger.error(`❌ SKILLS_JSON_PATH not found at ${SKILLS_JSON_PATH}`);
          return;
        }

        const skills = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, 'utf8'));
        const processedSkills = [];

        for (const skill of skills) {
          const { name, type, github_url } = skill;
          const skillDirPath = path.join(SKILLS_DIR, name);
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
                const stat = fs.statSync(filePath);
                if (stat.isFile()) {
                  zip.addLocalFile(filePath, path.dirname(file) === '.' ? '' : path.dirname(file));
                }
              });

              const zipPath = path.join(PUBLIC_DOWNLOADS_DIR, `${name}.zip`);
              zip.writeZip(zipPath);

              // Copy SKILL.md to public/raw
              const rawDestPath = path.join(PUBLIC_RAW_DIR, `${name}.md`);
              fs.copySync(skillMdPath, rawDestPath);
            }
          }

          if (!frontmatter.install_command) {
            const repoUrl = type === 'personal' ? MY_REPO_URL : github_url;
            if (repoUrl) {
              frontmatter.install_command = `npx skills add ${repoUrl} --skill ${name}`;
            }
          }

          if (type === 'personal' && !frontmatter.github_url) {
            frontmatter.github_url = MY_REPO_URL;
          }

          const destPath = path.join(CONTENT_SKILLS_DIR, `${name}.md`);
          fs.writeFileSync(destPath, matter.stringify(content, frontmatter));
          
          // Generate AI-readable JSON metadata
          const apiDestPath = path.join(PUBLIC_API_DIR, `${name}.json`);
          fs.writeFileSync(apiDestPath, JSON.stringify(frontmatter, null, 2));

          processedSkills.push(frontmatter);
        }

        // Robust README.md Update using markers
        if (fs.existsSync(README_PATH)) {
          let readme = fs.readFileSync(README_PATH, 'utf8');
          
          // 1. Update Table
          const tableHeader = '| Skill | Category | Description |\n| :--- | :--- | :--- |';
          const tableRows = processedSkills.map(s => {
            const isPersonal = s.type === 'personal';
            const link = isPersonal ? `./skills/${s.name}/SKILL.md` : s.github_url;
            const category = isPersonal ? 'Personal' : 'Reference';
            return `| **[${s.name}](${link})** | ${category} | ${s.description} |`;
          }).join('\n');
          
          const tableStartMarker = '<!-- SKILLS_TABLE_START -->';
          const tableEndMarker = '<!-- SKILLS_TABLE_END -->';
          const tableStartIdx = readme.indexOf(tableStartMarker);
          const tableEndIdx = readme.indexOf(tableEndMarker);

          if (tableStartIdx !== -1 && tableEndIdx !== -1) {
            const newTableSection = `${tableStartMarker}\n${tableHeader}\n${tableRows}\n${tableEndMarker}`;
            readme = readme.slice(0, tableStartIdx) + newTableSection + readme.slice(tableEndIdx + tableEndMarker.length);
          }

          // 2. Update Installation Section
          const installCommands = processedSkills
            .map(s => s.install_command)
            .filter(Boolean)
            .join('\n');
          
          const installStartMarker = '<!-- INSTALL_SECTION_START -->';
          const installEndMarker = '<!-- INSTALL_SECTION_END -->';
          const installStartIdx = readme.indexOf(installStartMarker);
          const installEndIdx = readme.indexOf(installEndMarker);

          if (installStartIdx !== -1 && installEndIdx !== -1) {
            const newInstallSection = `${installStartMarker}\n\`\`\`bash\n# Install this collection (includes all local copies)\nnpx skills add ${MY_REPO_URL}\n\n# OR install specific skills from their official sources (Recommended for latest updates)\n${installCommands}\n\`\`\`\n${installEndMarker}`;
            readme = readme.slice(0, installStartIdx) + newInstallSection + readme.slice(installEndIdx + installEndMarker.length);
          }
          
          fs.writeFileSync(README_PATH, readme);
        }

        logger.info(`✅ Asset preparation complete! ${processedSkills.length} skills processed.`);
      }
    }
  };
}
