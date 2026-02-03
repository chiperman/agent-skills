# Agent Skills

A collection of high-quality AI agent skills, designed to enhance development workflows with standardized expert knowledge.

## Skills

| Skill | Description |
| :--- | :--- |
| **[git-commit-expert](./git-commit-expert/SKILL.md)** | A senior-level git assistant enforcing atomic commits, conventional standards, and safety protocols. |

## Installation

### Remote (Recommended)

Install skills directly from this repository using [Vercel Skills](https://skills.sh):

```bash
# Install the entire collection
npx skills add chiperman/agent-skills

# OR install a specific skill
npx skills add chiperman/agent-skills/git-commit-expert
```

### Local (For Development)

If you have cloned this repository, you can register skills via symlink (shortcuts) to your agent's skills directory:

```bash
# Register a specific skill (e.g., git-commit-expert)
# Replace <path-to-agent-skills> with your agent's skills folder (e.g., ~/.gemini/skills or ~/.cursor/skills)
ln -s $(pwd)/git-commit-expert <path-to-agent-skills>/git-commit-expert
```

## Usage
Once installed, your AI agent will automatically use these rules when you ask it to commit code or explain git changes.
