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

## 3. Sync & Deploy (Fully Automated)

This project features a **fully automated CI/CD pipeline**. You don't need to run manual sync scripts anymore.

### The Workflow
1. **Push Changes**: Simply commit and `git push` your changes to `src/data/skills.json` or the `skills/` directory.
2. **Auto-Processing**: GitHub Actions will automatically:
   - Update the tables and commands in `README.md` and `README.zh.md`.
   - **Commit the README changes** back to the repository for you.
   - Build the website and deploy the latest version to GitHub Pages.

### Local Preview (Optional)
If you want to preview your `SKILL.md` or website locally before pushing:
```bash
npm run dev
```
Navigate to `http://localhost:4321/` to see your changes in real-time.

---

## 4. Best Practices

- **Naming**: Use kebab-case (e.g., `ui-design-pro`).
- **Descriptions**: Keep them concise to keep the homepage cards tidy.
- **Testing**: After running `npm run build`, check if the `npx skills add` commands in `README.md` are correct.
