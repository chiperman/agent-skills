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

const MY_REPO_URL = 'https://github.com/chiperman/agent-skills';

// Ensure directories exist
fs.ensureDirSync(PUBLIC_DOWNLOADS_DIR);
fs.ensureDirSync(PUBLIC_RAW_DIR);
fs.ensureDirSync(CONTENT_SKILLS_DIR);

// Clean up previous content to avoid stale files
fs.emptyDirSync(CONTENT_SKILLS_DIR);
fs.emptyDirSync(PUBLIC_DOWNLOADS_DIR);
fs.emptyDirSync(PUBLIC_RAW_DIR);

function updateReadme(skills) {
    console.log(`📝 Updating README.md with ${skills.length} skills...`);
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
    const installCommands = skills
        .map(s => s.install_command)
        .filter(Boolean)
        .join('\n');
    
    // We want to keep the header and structure but replace the command list
    const newInstallSection = "```bash\n" + 
        "# Install this collection (includes all local copies)\n" +
        "npx skills add https://github.com/chiperman/agent-skills\n\n" +
        "# OR install specific skills from their official sources (Recommended for latest updates)\n" +
        installCommands + "\n" +
        "```";
    
    const startMarker = '### Remote (Recommended)';
    const startMarkerRegex = '### Remote \\(Recommended\\)';
    const endMarker = '## Usage';
    const sectionRegex = new RegExp(`${startMarkerRegex}[\\s\\S]+?${endMarker}`);
    
    const newSection = `${startMarker}\n\nInstall skills directly using [Skills CLI](https://skills.sh):\n\n${newInstallSection}\n\n`;
    
    if (sectionRegex.test(readme)) {
        readme = readme.replace(sectionRegex, newSection + endMarker);
    } else {
        console.warn('⚠️ Could not find Installation section in README.md, skipping replacement.');
    }

    fs.writeFileSync(README_PATH, readme);
    console.log('✅ README.md updated with latest skills data.');
}

async function main() {
    const skills = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, 'utf8'));
    const processedSkills = [];

    for (const skill of skills) {
        const { name, type, github_url } = skill;
        const skillDirPath = path.join(SKILLS_DIR, name);
        const hasLocalSource = fs.existsSync(skillDirPath);

        console.log(`📦 Processing skill: ${name} (${hasLocalSource ? 'Local' : 'External'})`);

        let content = '';
        let frontmatter = { ...skill };

        // 1. Handle Local Source (Personal Skills)
        if (hasLocalSource) {
            const skillMdPath = path.join(skillDirPath, 'SKILL.md');
            if (fs.existsSync(skillMdPath)) {
                const fileContent = fs.readFileSync(skillMdPath, 'utf8');
                const parsed = matter(fileContent);
                content = parsed.content;
                // Merge frontmatter: Local SKILL.md takes priority
                frontmatter = { ...frontmatter, ...parsed.data };

                // Create ZIP
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

                // Copy SKILL.md to public/raw
                const rawDestPath = path.join(PUBLIC_RAW_DIR, `${name}.md`);
                fs.copySync(skillMdPath, rawDestPath);
                console.log(`   ✅ Raw markdown synced: public/raw/${name}.md`);
            }
        }

        // 2. Auto-generate Install Command if missing
        if (!frontmatter.install_command) {
            const repoUrl = type === 'personal' ? MY_REPO_URL : github_url;
            console.log(`🛠️ Generating command for ${name}: type=${type}, url=${repoUrl}`);
            if (repoUrl) {
                frontmatter.install_command = `npx skills add ${repoUrl} --skill ${name}`;
            }
        }

        // 3. Fallback GitHub URL for personal skills
        if (type === 'personal' && !frontmatter.github_url) {
            frontmatter.github_url = MY_REPO_URL;
        }

        // 4. Sync to src/content/skills
        const destPath = path.join(CONTENT_SKILLS_DIR, `${name}.md`);
        fs.writeFileSync(destPath, matter.stringify(content, frontmatter));
        console.log(`   ✅ Content collection synced: src/content/skills/${name}.md`);

        processedSkills.push(frontmatter);
    }

    updateReadme(processedSkills);
    console.log('🎉 Asset preparation complete!');
}

main();