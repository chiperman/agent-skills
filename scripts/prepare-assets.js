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
const SKILLS_JSON_PATH = path.join(ROOT_DIR, 'src', 'data', 'skills.json');
const README_PATH = path.join(ROOT_DIR, 'README.md');

// Ensure directories exist
fs.ensureDirSync(PUBLIC_DOWNLOADS_DIR);
fs.ensureDirSync(PUBLIC_RAW_DIR);
fs.ensureDirSync(CONTENT_SKILLS_DIR);

// Clean up previous content to avoid stale files
fs.emptyDirSync(CONTENT_SKILLS_DIR);
fs.emptyDirSync(PUBLIC_DOWNLOADS_DIR);
fs.emptyDirSync(PUBLIC_RAW_DIR);

function updateReadme(skills) {
    let readme = fs.readFileSync(README_PATH, 'utf8');

    // 1. Update Skills Table
    const tableHeader = '| Skill | Category | Description |\n| :--- | :--- | :--- |';
    const tableRows = skills.map(s => {
        // Link to local path if personal, otherwise link to external GitHub
        const isPersonal = s.type === 'personal';
        const link = isPersonal ? `./skills/${s.name}/SKILL.md` : s.github_url;
        const category = isPersonal ? 'Personal' : 'Reference';
        return `| **[${s.name}](${link})** | ${category} | ${s.description} |`;
    }).join('\n');
    
    // Find the table starting with "| Skill" and ending after all table rows
    const tableRegex = /\| Skill.*\| Category.*\| Description.*\|\n\| :?---.*\| :?---.*\| :?---.*\|\n(\| .* \|\n)*/;
    readme = readme.replace(tableRegex, `${tableHeader}\n${tableRows}\n`);

    // 2. Update Installation Commands
    const installCommands = skills.map(s => s.install_command).join('\n');
    
    // We want to keep the header and structure but replace the command list
    const newInstallSection = "```bash\n" + 
        "# Install this collection (includes all local copies)\n" +
        "npx skills add https://github.com/chiperman/agent-skills\n\n" +
        "# OR install specific skills from their official sources (Recommended for latest updates)\n" +
        installCommands + "\n" +
        "```";
    
    const startMarker = '### Remote (Recommended)';
    const endMarker = '## Usage';
    const sectionRegex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);
    
    readme = readme.replace(sectionRegex, `${startMarker}\n\nInstall skills directly using [Skills CLI](https://skills.sh):\n\n${newInstallSection}\n\n${endMarker}`);

    fs.writeFileSync(README_PATH, readme);
    console.log('✅ README.md updated with latest skills data.');
}

async function main() {
    console.log('🔍 Reading skills configuration...');
    const skills = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, 'utf8'));

    for (const skill of skills) {
        const { name, description, type, github_url, install_command } = skill;
        const skillDirPath = path.join(SKILLS_DIR, name);
        const hasLocalSource = fs.existsSync(skillDirPath);

        console.log(`📦 Processing skill: ${name} (${hasLocalSource ? 'Local' : 'External'})`);

        let content = '';
        let frontmatter = {
            name,
            description,
            type,
            github_url,
            install_command
        };

        if (hasLocalSource) {
            const skillMdPath = path.join(skillDirPath, 'SKILL.md');
            if (fs.existsSync(skillMdPath)) {
                // 1. Parse local SKILL.md
                const fileContent = fs.readFileSync(skillMdPath, 'utf8');
                const parsed = matter(fileContent);
                content = parsed.content;
                frontmatter = { ...frontmatter, ...parsed.data };

                // 2. Create ZIP
                const zip = new AdmZip();
                const skillFiles = globSync('**/*', {
                    cwd: skillDirPath,
                    ignore: ['node_modules/**', '.DS_Store', 'dist/**']
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
                console.log(`   ✅ Zip created: ${name}.zip`);

                // 3. Copy SKILL.md to public/raw for client-side fetching
                const rawDestPath = path.join(PUBLIC_RAW_DIR, `${name}.md`);
                fs.copySync(skillMdPath, rawDestPath);
                console.log(`   ✅ Raw markdown synced to: public/raw/${name}.md`);
            }
        }

        // 4. Sync to src/content/skills
        const destPath = path.join(CONTENT_SKILLS_DIR, `${name}.md`);
        fs.writeFileSync(destPath, matter.stringify(content, frontmatter));
        console.log(`   ✅ Content collection synced: src/content/skills/${name}.md`);
    }

    updateReadme(skills);
    console.log('🎉 Asset preparation complete!');
}

main();