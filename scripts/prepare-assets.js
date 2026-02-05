import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';
import { globSync } from 'glob';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT_DIR, 'skills');
const PUBLIC_DOWNLOADS_DIR = path.join(ROOT_DIR, 'public', 'downloads');
const PUBLIC_RAW_DIR = path.join(ROOT_DIR, 'public', 'raw');
const CONTENT_SKILLS_DIR = path.join(ROOT_DIR, 'src', 'content', 'skills');
const README_PATH = path.join(ROOT_DIR, 'README.md');

// Ensure directories exist
fs.ensureDirSync(PUBLIC_DOWNLOADS_DIR);
fs.ensureDirSync(PUBLIC_RAW_DIR);
fs.ensureDirSync(CONTENT_SKILLS_DIR);

// Clean up previous content to avoid stale files
fs.emptyDirSync(CONTENT_SKILLS_DIR);
fs.emptyDirSync(PUBLIC_DOWNLOADS_DIR);
fs.emptyDirSync(PUBLIC_RAW_DIR);

function parseReadmeMetadata() {
    const readme = fs.readFileSync(README_PATH, 'utf8');
    const metadataMap = {};

    // 1. Parse Table for Status
    // Match lines like: | **[git-commit-expert](./...)** | ⭐ **Featured** | ... |
    const tableRows = readme.match(/\| \*\*\[([^\]]+)\].*? \| (.*?) \|/g);
    if (tableRows) {
        tableRows.forEach(row => {
            const parts = row.split('|').map(p => p.trim());
            if (parts.length >= 3) {
                const nameMatch = parts[1].match(/\[([^\]]+)\]/);
                if (nameMatch) {
                    const name = nameMatch[1];
                    const statusRaw = parts[2];
                    metadataMap[name] = {
                        status: statusRaw.includes('Featured') ? 'Featured' : 'Curated'
                    };
                }
            }
        });
    }

    // 2. Parse Installation Section for GitHub URLs and Commands
    // Match lines like: npx skills add https://github.com/org/repo --skill name
    const installLinks = readme.match(/npx skills add (https:\/\/github\.com\/[^\s]+) --skill ([^\s\n]+)/g);
    if (installLinks) {
        installLinks.forEach(line => {
            const match = line.match(/npx skills add (https:\/\/github\.com\/[^\s]+) --skill ([^\s\n]+)/);
            if (match) {
                const fullCommand = match[0];
                const url = match[1];
                const name = match[2];
                if (metadataMap[name]) {
                    metadataMap[name].github_url = url;
                    metadataMap[name].install_command = fullCommand;
                }
            }
        });
    }

    return metadataMap;
}

async function main() {
    console.log('🔍 Scanning README for metadata...');
    const readmeMetadata = parseReadmeMetadata();
    console.log('🔍 Scanning for skills...');

    // Get all directories in skills folder
    const items = fs.readdirSync(SKILLS_DIR);

    for (const item of items) {
        const itemPath = path.join(SKILLS_DIR, item);
        const stats = fs.statSync(itemPath);

        // Skip non-directories and ignored folders
        if (!stats.isDirectory()) continue;

        const skillMdPath = path.join(itemPath, 'SKILL.md');

        if (fs.existsSync(skillMdPath)) {
            console.log(`📦 Processing skill: ${item}`);

            try {
                // 1. Validate Frontmatter (Optional but good for logging)
                const fileContent = fs.readFileSync(skillMdPath, 'utf8');
                const { data } = matter(fileContent);

                if (!data.name) {
                    console.warn(`⚠️  Warning: ${item}/SKILL.md is missing 'name' in frontmatter. Using directory name.`);
                }

                const skillName = data.name || item;

                // 2. Create ZIP
                const zip = new AdmZip();
                const skillFiles = globSync('**/*', {
                    cwd: itemPath,
                    ignore: ['node_modules/**', '.DS_Store', 'dist/**']
                });

                skillFiles.forEach(file => {
                    const filePath = path.join(itemPath, file);
                    const stat = fs.statSync(filePath);
                    if (stat.isFile()) {
                        zip.addLocalFile(filePath, path.dirname(file) === '.' ? '' : path.dirname(file));
                    }
                });

                const zipPath = path.join(PUBLIC_DOWNLOADS_DIR, `${skillName}.zip`);
                zip.writeZip(zipPath);
                console.log(`   ✅ Zip created: ${skillName}.zip`);

                // 3. Copy SKILL.md to src/content/skills with injected metadata
                const { data: parsedData, content } = matter(fileContent);
                const meta = readmeMetadata[skillName] || { status: 'Curated' };

                const newFrontmatter = {
                    ...parsedData,
                    name: skillName, // ensure consistency
                    status: meta.status,
                    github_url: meta.github_url,
                    install_command: meta.install_command || `npx skills add https://github.com/chiperman/agent-skills --skill ${skillName}`
                };

                const destPath = path.join(CONTENT_SKILLS_DIR, `${skillName}.md`);
                fs.writeFileSync(destPath, matter.stringify(content, newFrontmatter));
                console.log(`   ✅ Content synced to: src/content/skills/${skillName}.md (Status: ${meta.status})`);

                // 4. Copy SKILL.md to public/raw for client-side fetching
                const rawDestPath = path.join(PUBLIC_RAW_DIR, `${skillName}.md`);
                fs.copySync(skillMdPath, rawDestPath);
                console.log(`   ✅ Raw markdown synced to: public/raw/${skillName}.md`);

            } catch (err) {
                console.error(`❌ Error processing ${item}:`, err);
            }
        }
    }

    console.log('🎉 Asset preparation complete!');
}

main();
