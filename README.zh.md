# 智能体技能库 | Agent Skills

[English](./README.md) | 简体中文

精心挑选的高质量 AI 智能体技能集合，旨在通过标准化的专家知识增强开发工作流。

## 技能列表

> [!TIP]
> 本仓库是一个 **精选技能集合**。除 `git-commit` 外，大部分技能源自社区，可能不总是最新版本。如需获取绝对最新的更新，建议直接从 [官方技能注册表](https://skills.sh) 安装。

<!-- SKILLS_TABLE_START -->
| 技能 | 类别 | 描述 |
| :--- | :--- | :--- |
<<<<<<< HEAD
| **[skill-manager](./skills/skill-manager/SKILL.md)** | 个人 | 专门用于自动化管理和注册本项目技能的元工具。支持个人技能登记与外部引用关联。 |
| **[git-commit](./skills/git-commit/SKILL.md)** | 个人 | 综合性 Git 智能体技能，强制要求中文提交信息。结合战略工作流、严格的 Conventional Commits 标准和安全执行协议。以资深工程师的视角引导原子化、可验证且标准化的 Git 操作。 |
=======
| **[skill-manager](./.agents/skills/skill-manager/SKILL.md)** | 个人 | 专门用于自动化管理和注册本项目技能的元工具。支持个人技能登记与外部引用关联。 |
| **[git-commit](./.agents/skills/git-commit/SKILL.md)** | 个人 | A comprehensive Git agent skill combining strategic workflows, strict conventional commit standards, and safe execution protocols. Acts as a senior engineer to guide users through atomic, verifiable, and standardized git operations. |
>>>>>>> 4615c72 (feat(skill): 迁移 skills 目录至 .agents/skills 标准路径)
| **[find-skills](https://github.com/vercel-labs/skills)** | 参考 | Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", or express interest in extending capabilities. |
| **[frontend-design](https://github.com/anthropics/skills)** | 参考 | Create distinctive, production-grade frontend interfaces with high design quality, creative code, and polished UI that avoids generic AI aesthetics. |
| **[canvas-design](https://github.com/anthropics/skills)** | 参考 | Create beautiful visual art, posters, and static designs in PNG and PDF formats using professional design philosophy and original visual elements. |
| **[baseline-ui](https://github.com/ibelick/ui-skills)** | 参考 | Enforces an opinionated UI baseline to prevent AI-generated interface slop. |
| **[fixing-accessibility](https://github.com/ibelick/ui-skills)** | 参考 | Fix accessibility issues. Ensure the component is accessible to all users. |
| **[fixing-motion-performance](https://github.com/ibelick/ui-skills)** | 参考 | Fix animation performance issues. Optimize animations and interactions. |
| **[web-design-guidelines](https://github.com/vercel-labs/agent-skills)** | 参考 | Review UI code for Web Interface Guidelines compliance. |
| **[fixing-metadata](https://github.com/ibelick/ui-skills)** | 参考 | Ship correct, complete metadata for SEO and performance optimization. |
| **[12-principles-of-animation](https://github.com/raphaelsalaja/userinterface-wiki)** | 参考 | Apply Disney's 12 principles to web interfaces to create natural, organic, and lifelike motion that enhances user engagement. |
| **[design-lab](https://github.com/0xdesign/design-plugin)** | 参考 | Conduct interactive design exploration, interviews, and variant generation to refine UI designs through iterative feedback. |
| **[interaction-design](https://github.com/wshobson/agents)** | 参考 | Design and implement delightful microinteractions, motion transitions, and user feedback patterns for seamless user experiences. |
| **[interface-design](https://github.com/dammyjay93/interface-design)** | 参考 | Build high-quality dashboards, admin panels, and SaaS interfaces with a focus on professional craft and design consistency. |
| **[tailwind-css-patterns](https://github.com/giuseppe-trisciuoglio/developer-kit)** | 参考 | Build modern, responsive user interfaces using expert Tailwind CSS utility-first patterns and modern CSS best practices. |
| **[ui-ux-pro-max](https://github.com/sickn33/antigravity-awesome-skills)** | 参考 | Advanced UI/UX design intelligence featuring 50+ styles, 97 palettes, and 9 technology stacks for building professional interfaces. |
| **[wcag-audit-patterns](https://github.com/wshobson/agents)** | 参考 | Conduct WCAG 2.2 accessibility audits with automated and manual testing, providing remediation guidance for fixing violations and accessible design. |
| **[web-haptics](https://github.com/lochie/web-haptics)** | 参考 | Provides cross-platform haptic feedback for mobile web and PWAs, enabling native-feeling vibrations on both iOS and Android browsers. |
<!-- SKILLS_TABLE_END -->

## 安装

### 远程安装（推荐）

使用 [Skills CLI](https://skills.sh) 直接安装技能：

<!-- INSTALL_SECTION_START -->
```bash
# 安装此集合
npx skills add https://github.com/chiperman/agent-skills

# 安装特定技能
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

## 使用方法

安装后，当你要求 AI 智能体执行基于技能描述的相关任务时，它将自动使用这些规则。

## 推荐工作流

为了实现最高质量的代码交付，我们建议在调用技能时遵循以下逻辑顺序：

### 第一步：开始与编码

- **触发**: “我正开始编写一个新功能，请确保基础稳固。”
- **激活**: baseline-ui
- **示例**: “帮我写一个用户登录卡片，请遵循 baseline-ui 指南。”
- **效果**: 生成结构正确、样式克制且具备最佳性能模式的代码。

### 第二步：优化

- **触发**: “功能已经运行，现在让我们优化它。”
- **激活**: 根据需求选择 fixing-accessibility 或 fixing-motion-performance。
- **示例**: “检查此组件的动画性能”或“确保此表单对屏幕阅读器友好。”
- **效果**: 消除性能瓶颈并确保所有用户都能访问该功能。

### 第三步：审查

- **触发**: “准备完成，进行最后检查。”
- **激活**: web-design-guidelines（可选地为页面级开发添加 fixing-metadata）。
- **示例**: “使用 web-design-guidelines 审查代码，看看是否有任何 UX 问题。”
- **效果**: 填补空白并提升专业度。

### 第四步：提交

- **触发**: “代码很完美，打包存储。”
- **激活**: git-commit
- **示例**: “代码已就绪，帮我提交。”
- **效果**: 生成标准的提交信息，如 `feat(auth): implement user login card`，保持 Git 历史整洁。

## 维护

本项目由配置驱动。所有元数据均在 `src/data/skills.json` 中管理，并通过自动化同步。

有关如何创建个人技能或添加社区引用的详细指南，请参阅：
👉 **[维护与贡献指南](./docs/how-to-add-skills.zh.md)**

### 同步与生成
修改 JSON 或技能文件后，运行以下命令以刷新网站、资产和本 README：
```bash
npm run build
```

> [!NOTE]
> `install_command` 由脚本根据 `github_url` 和 `name` 自动生成。
