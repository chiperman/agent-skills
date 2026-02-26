# Maintenance & Contribution Guide

English | [简体中文](./how-to-add-skills.zh.md)

This repository uses a configuration-driven automated workflow. By modifying `src/data/skills.json` and the `skills/` directory, the system automatically generates website content, zip assets, AI-readable APIs, and updates the root `README.md`.

---

## 1. How to Create a Personal Skill

A Personal Skill is one where you write the complete `SKILL.md` instructions yourself.

### Step 1: Create Directory Structure
Create a new folder under `skills/` in the project root with the same name as your skill.
```bash
mkdir -p skills/my-new-skill
```

### Step 2: Write Skill Document
Create `SKILL.md` inside the new folder. It must include `name` and `description` metadata.
```markdown
---
name: my-new-skill
description: A short sentence describing the core functionality.
---

# Skill Name

### 1. Core Instructions
... Your AI instruction content ...

### 2. Workflow
...
```

### Step 3: Register the Skill
Edit `src/data/skills.json` and add the skill information to the array.
```json
{
  "name": "my-new-skill",
  "type": "personal"
}
```

---

## 2. How to Add a Reference Skill

A Reference Skill points to an existing high-quality open-source skill project, usually for curation and recommendation within this project.

### Step 1: Gather Information
You will need the skill's:
- **Name (name)**
- **Description (description)**
- **GitHub Repository URL (github_url)**

### Step 2: Register the Skill
Edit `src/data/skills.json` directly and add the following configuration.
```json
{
  "name": "external-awesome-skill",
  "type": "reference",
  "description": "This skill helps AI handle X tasks and improves Y efficiency.",
  "github_url": "https://github.com/someone/external-awesome-skill"
}
```
*Note: Reference skills do not require any files in the `skills/` directory.*

---

## 3. Sync & Apply Changes (Sync)

After completing the edits above, run the following command to apply all changes to the website and documentation:

```bash
npm run build
```

### What this command does:
1. **Generate Markdown Collections**: Syncs data to `src/content/skills/` (used by Astro).
2. **Package Assets**: Automatically generates `.zip` archives for Personal Skills in `public/downloads/`.
3. **Export Raw Files**: Copies `SKILL.md` to `public/raw/` for quick copying.
4. **Generate JSON API**: Creates structured interface files for AI in `public/api/skills/`.
5. **Update README**: Refreshes the skills table and installation command list in the root `README.md`.

---

## 4. Best Practices

- **Naming**: Use kebab-case (e.g., `ui-design-pro`).
- **Descriptions**: Keep them concise to keep the homepage cards tidy.
- **Testing**: After running `npm run build`, check if the `npx skills add` commands in `README.md` are correct.
