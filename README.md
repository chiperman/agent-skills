# Agent Skills

A collection of high-quality AI agent skills, designed to enhance development workflows with standardized expert knowledge.

## Skills

> [!TIP]
> This repository is a **curated collection** of high-quality skills. Except for `git-commit-expert`, most skills are sourced from the community and might not always be the latest version. For the absolute latest updates, we recommend installing them directly from the [Official Skills Registry](https://skills.sh).

| Skill                                                                 | Description                                                                                                                        |
| :-------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| **[git-commit-expert](./skills/git-commit-expert/SKILL.md)**          | A comprehensive Git agent skill combining strategic workflows, strict conventional commit standards, and safe execution protocols. |
| **[baseline-ui](./skills/baseline-ui/SKILL.md)**                      | Enforces an opinionated UI baseline to prevent AI-generated interface slop.                                                        |
| **[fixing-accessibility](./skills/fixing-accessibility/SKILL.md)**    | Fix accessibility issues. Ensure the component is accessible to all users.                                                         |
| **[fixing-motion-performance](./skills/fixing-motion-performance/SKILL.md)** | Fix animation performance issues. Optimize animations and interactions.                                                     |
| **[web-design-guidelines](./skills/web-design-guidelines/SKILL.md)**  | Review UI code for Web Interface Guidelines compliance.                                                                            |
| **[fixing-metadata](./skills/fixing-metadata/SKILL.md)**              | Ship correct, complete metadata for SEO and performance optimization.                                                              |

## Installation

### Remote (Recommended)

Install skills directly using [Skills CLI](https://skills.sh):

```bash
# Install this collection (includes all local copies)
npx skills add https://github.com/chiperman/agent-skills

# OR install specific skills from their official sources (Recommended for latest updates)
npx skills add https://github.com/chiperman/agent-skills --skill git-commit-expert
npx skills add https://github.com/ibelick/ui-skills --skill baseline-ui
npx skills add https://github.com/ibelick/ui-skills --skill fixing-accessibility
npx skills add https://github.com/ibelick/ui-skills --skill fixing-motion-performance
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines
npx skills add https://github.com/ibelick/ui-skills --skill fixing-metadata
```

## Usage

Once installed, your AI agent will automatically use these rules when you ask it to perform relevant tasks based on the skill descriptions.

## Recommended Workflow (The Golden Workflow)

To achieve the highest quality code delivery, we recommend following this logical sequence when calling the skills:

### Step 1: Start & Code

- **Trigger**: "I'm starting to write a new feature, make sure the baseline is solid."
- **Activates**: baseline-ui
- **Example**: "Help me write a user login card, please follow baseline-ui guidelines."
- **Effect**: Generate code with correct structure, restrained styling, and optimal performance patterns.

### Step 2: Refine

- **Trigger**: "The feature is working, now let's refine it."
- **Activates**: Choose fixing-accessibility or fixing-motion-performance based on needs.
- **Example**: "Check the animation performance of this component" or "Make sure this form is screen reader friendly."
- **Effect**: Eliminate performance bottlenecks and ensure all users can access the functionality.

### Step 3: Audit

- **Trigger**: "Ready to finish, do a final checkup."
- **Activates**: web-design-guidelines (optionally add fixing-metadata for page-level development).
- **Example**: "Review the code with web-design-guidelines, see if there are any UX issues."
- **Effect**: Fill gaps and improve professionalism.

### Step 4: Commit

- **Trigger**: "Code is perfect, package it for storage."
- **Activates**: git-commit-expert
- **Example**: "Code is ready, help me commit it."
- **Effect**: Generate standard commit message like feat(auth): implement user login card, keeping Git history clean.