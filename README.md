# Agent Skills

English | [简体中文](./README.zh.md)

A collection of high-quality AI agent skills, designed to enhance development workflows with standardized expert knowledge.

## Skills

> [!TIP]
> This repository is a **curated collection** of high-quality skills. Except for `git-commit`, most skills are sourced from the community and might not always be the latest version. For the absolute latest updates, we recommend installing them directly from the [Official Skills Registry](https://skills.sh).

<!-- SKILLS_TABLE_START -->
| Skill | Category | Description |
| :--- | :--- | :--- |
| **[skill-manager](./.agents/skills/skill-manager/SKILL.md)** | Personal | 专门用于自动化管理和注册本项目技能的元工具。支持个人技能登记与外部引用关联。 |
| **[git-commit](./.agents/skills/git-commit/SKILL.md)** | Personal | 综合性 Git 智能体技能，强制要求中文提交信息。结合战略工作流、严格的 Conventional Commits 标准和安全执行协议。以资深工程师的视角引导原子化、可验证且标准化的 Git 操作。 |
| **[find-skills](https://github.com/vercel-labs/skills)** | Reference | Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", or express interest in extending capabilities. |
| **[frontend-design](https://github.com/anthropics/skills)** | Reference | Create distinctive, production-grade frontend interfaces with high design quality, creative code, and polished UI that avoids generic AI aesthetics. |
| **[canvas-design](https://github.com/anthropics/skills)** | Reference | Create beautiful visual art, posters, and static designs in PNG and PDF formats using professional design philosophy and original visual elements. |
| **[baseline-ui](https://github.com/ibelick/ui-skills)** | Reference | Enforces an opinionated UI baseline to prevent AI-generated interface slop. |
| **[fixing-accessibility](https://github.com/ibelick/ui-skills)** | Reference | Fix accessibility issues. Ensure the component is accessible to all users. |
| **[fixing-motion-performance](https://github.com/ibelick/ui-skills)** | Reference | Fix animation performance issues. Optimize animations and interactions. |
| **[web-design-guidelines](https://github.com/vercel-labs/agent-skills)** | Reference | Review UI code for Web Interface Guidelines compliance. |
| **[fixing-metadata](https://github.com/ibelick/ui-skills)** | Reference | Ship correct, complete metadata for SEO and performance optimization. |
| **[12-principles-of-animation](https://github.com/raphaelsalaja/userinterface-wiki)** | Reference | Apply Disney's 12 principles to web interfaces to create natural, organic, and lifelike motion that enhances user engagement. |
| **[design-lab](https://github.com/0xdesign/design-plugin)** | Reference | Conduct interactive design exploration, interviews, and variant generation to refine UI designs through iterative feedback. |
| **[interaction-design](https://github.com/wshobson/agents)** | Reference | Design and implement delightful microinteractions, motion transitions, and user feedback patterns for seamless user experiences. |
| **[interface-design](https://github.com/dammyjay93/interface-design)** | Reference | Build high-quality dashboards, admin panels, and SaaS interfaces with a focus on professional craft and design consistency. |
| **[tailwind-css-patterns](https://github.com/giuseppe-trisciuoglio/developer-kit)** | Reference | Build modern, responsive user interfaces using expert Tailwind CSS utility-first patterns and modern CSS best practices. |
| **[ui-ux-pro-max](https://github.com/sickn33/antigravity-awesome-skills)** | Reference | Advanced UI/UX design intelligence featuring 50+ styles, 97 palettes, and 9 technology stacks for building professional interfaces. |
| **[wcag-audit-patterns](https://github.com/wshobson/agents)** | Reference | Conduct WCAG 2.2 accessibility audits with automated and manual testing, providing remediation guidance for fixing violations and accessible design. |
| **[web-haptics](https://github.com/lochie/web-haptics)** | Reference | Provides cross-platform haptic feedback for mobile web and PWAs, enabling native-feeling vibrations on both iOS and Android browsers. |
<!-- SKILLS_TABLE_END -->

## Installation

### Remote (Recommended)

Install skills directly using [Skills CLI](https://skills.sh):

<!-- INSTALL_SECTION_START -->
```bash
# Install this collection
npx skills add https://github.com/chiperman/agent-skills

# Install specific skills
npx skills add https://github.com/chiperman/agent-skills --skill skill-manager
npx skills add https://github.com/chiperman/agent-skills --skill git-commit
npx skills add https://github.com/vercel-labs/skills --skill find-skills
npx skills add https://github.com/anthropics/skills --skill frontend-design
npx skills add https://github.com/anthropics/skills --skill canvas-design
npx skills add https://github.com/ibelick/ui-skills --skill baseline-ui
npx skills add https://github.com/ibelick/ui-skills --skill fixing-accessibility
npx skills add https://github.com/ibelick/ui-skills --skill fixing-motion-performance
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines
npx skills add https://github.com/ibelick/ui-skills --skill fixing-metadata
npx skills add https://github.com/raphaelsalaja/userinterface-wiki --skill 12-principles-of-animation
npx skills add https://github.com/0xdesign/design-plugin --skill design-lab
npx skills add https://github.com/wshobson/agents --skill interaction-design
npx skills add https://github.com/dammyjay93/interface-design --skill interface-design
npx skills add https://github.com/giuseppe-trisciuoglio/developer-kit --skill tailwind-css-patterns
npx skills add https://github.com/sickn33/antigravity-awesome-skills --skill ui-ux-pro-max
npx skills add https://github.com/wshobson/agents --skill wcag-audit-patterns
npx skills add https://github.com/lochie/web-haptics --skill web-haptics
```
<!-- INSTALL_SECTION_END -->

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
- **Activates**: git-commit
- **Example**: "Code is ready, help me commit it."
- **Effect**: Generate standard commit message like `feat(auth): implement user login card`, keeping Git history clean.

## Maintenance

This project is configuration-driven. All metadata is managed in `src/data/skills.json` and synchronized via automation.

For a detailed walkthrough on how to create personal skills or add community references, please see our:
👉 **[Maintenance & Contribution Guide](./docs/how-to-add-skills.md)**

### Sync & Generate
After making changes to the JSON or skill files, run the following to refresh the website, assets, and this README:
```bash
npm run build
```

> [!NOTE]
> The `install_command` is automatically generated by the script based on the `github_url` and `name`.
