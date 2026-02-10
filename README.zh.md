# Agent Skills (AI 智能体技能库)

[**English**](./README.md) | [中文版]

这是一个高质量 AI Agent 技能的精选合集，旨在通过标准化的专家知识体系提升开发工作流的质量与效率。

## 技能列表

> [!TIP]
> 本仓库是一个**精选集合**。除 `git-commit-expert` 外，大部分技能均源自社区，可能并非总是最新版本。如需获取绝对最新的更新，建议直接从 [Official Skills Registry](https://skills.sh) 安装。

| 技能名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| **[git-commit-expert](./skills/git-commit-expert/SKILL.md)** | 原创 (Personal) | 全面的 Git 专家技能，结合了战略性工作流、严格的规范化提交标准及安全执行协议。 |
| **[find-skills](https://github.com/vercel-labs/skills)** | 引用 (Reference) | 帮助用户发现并安装 Agent 技能，适用于“如何实现 X”或“查找 X 相关的技能”等咨询。 |
| **[frontend-design](https://github.com/anthropics/skills)** | 引用 (Reference) | 创建独特、生产级的现代前端界面，注重设计质量与创意代码，避免平庸的 AI 生成感。 |
| **[canvas-design](https://github.com/anthropics/skills)** | 引用 (Reference) | 使用专业设计理念创建精美的视觉艺术、海报及静态设计（PNG/PDF 格式）。 |
| **[baseline-ui](https://github.com/ibelick/ui-skills)** | 引用 (Reference) | 强制执行意见鲜明的 UI 基准，防止 AI 生成过度臃肿或混乱的界面。 |
| **[fixing-accessibility](https://github.com/ibelick/ui-skills)** | 引用 (Reference) | 修复可访问性问题，确保组件对所有用户（包括障碍人士）友好。 |
| **[fixing-motion-performance](https://github.com/ibelick/ui-skills)** | 引用 (Reference) | 修复动画性能问题，优化交互与动效的流畅度。 |
| **[web-design-guidelines](https://github.com/vercel-labs/agent-skills)** | 引用 (Reference) | 根据 Web 界面指南（WIG）审计 UI 代码的合规性。 |
| **[fixing-metadata](https://github.com/ibelick/ui-skills)** | 引用 (Reference) | 交付正确、完整的元数据，优化 SEO 与性能。 |
| **[12-principles-of-animation](https://github.com/raphaelsalaja/userinterface-wiki)** | 引用 (Reference) | 将迪士尼动画 12 原则应用于 Web 界面，创造自然、富有生命力的交互动效。 |
| **[design-lab](https://github.com/0xdesign/design-plugin)** | 引用 (Reference) | 进行交互式设计探索、访谈及变体生成，通过迭代反馈精炼 UI 设计。 |
| **[interaction-design](https://github.com/wshobson/agents)** | 引用 (Reference) | 设计并实现令人愉悦的微交互、动效衔接及用户反馈模式。 |
| **[interface-design](https://github.com/dammyjay93/interface-design)** | 引用 (Reference) | 构建高质量的仪表盘、管理面板及 SaaS 界面，专注于专业工艺与设计一致性。 |
| **[tailwind-css-patterns](https://github.com/giuseppe-trisciuoglio/developer-kit)** | 引用 (Reference) | 使用专家级的 Tailwind CSS 模式和现代 CSS 最佳实践构建响应式界面。 |
| **[ui-ux-pro-max](https://github.com/sickn33/antigravity-awesome-skills)** | 引用 (Reference) | 包含 50+ 风格、97 调色盘和 9 种技术栈的高级 UI/UX 设计智能插件。 |
| **[wcag-audit-patterns](https://github.com/wshobson/agents)** | 引用 (Reference) | 进行 WCAG 2.2 可访问性审计，提供自动化与人工测试及修复建议。 |

## 安装指南

### 远程安装 (推荐)

直接使用 [Skills CLI](https://skills.sh) 进行安装：

```bash
# 安装整个集合 (包含所有本地副本)
npx skills add https://github.com/chiperman/agent-skills

# 或者从官方源安装特定技能 (推荐以获取最新更新)
npx skills add https://github.com/chiperman/agent-skills --skill git-commit-expert
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
```

## 使用方法

安装完成后，当你在对话中请求执行相关任务时，你的 AI Agent 会根据技能描述自动调用这些规则。

## 推荐工作流 (黄金流程)

为了确保最高质量的代码交付，我们建议在调用技能时遵循以下逻辑顺序：

### 第一步：启动与编码

- **触发词**：“我要开始写一个新功能，确保基准稳固。”
- **激活技能**：`baseline-ui`
- **示例**：“帮我写一个登录卡片，请遵循 baseline-ui 规范。”
- **效果**：生成结构正确、样式克制且性能最优的初始代码。

### 第二步：打磨与优化

- **触发词**：“功能已跑通，现在开始精修。”
- **激活技能**：根据需求选择 `fixing-accessibility` 或 `fixing-motion-performance`。
- **示例**：“检查这个组件的动画性能” 或 “确保这个表单对屏幕阅读器友好”。
- **效果**：消除性能瓶颈，确保所有用户都能顺畅使用。

### 第三步：最终审计

- **触发词**：“准备收工，做最后的检查。”
- **激活技能**：`web-design-guidelines`（如果是页面开发，可增加 `fixing-metadata`）。
- **示例**：“用 web-design-guidelines 评审代码，看是否有 UX 问题。”
- **效果**：查漏补缺，提升专业度。

### 第四步：规范提交

- **触发词**：“代码完美，打包入库。”
- **激活技能**：`git-commit-expert`
- **示例**：“代码好了，帮我提交。”
    - **效果**：自动生成如 `feat(auth): implement user login card` 这样标准的提交信息，保持 Git 历史整洁。

## 维护指南

本项目采用配置驱动模式。所有元数据均在 `src/data/skills.json` 中维护，并通过脚本自动同步。

### 如何更新
1. **添加/修改技能**:
   - **原创技能 (Personal)**: 
     1. 在 `skills/<名称>/` 下创建目录。
     2. 在 `skills/<名称>/SKILL.md` 中编写内容（需在 frontmatter 中包含 `name` 和 `description`）。
     3. 在 `src/data/skills.json` 中添加 `{"name": "<名称>", "type": "personal"}`。
   - **引用技能 (Reference)**: 
     1. 直接在 `src/data/skills.json` 中添加条目，填写 `description` 和 `github_url`。
     2. 设置 `type: "reference"`。
2. **同步与生成**:
   运行以下命令以更新网站数据、生成压缩包资产并刷新 README：
   ```bash
   npm run prepare
   ```

> [!NOTE]
> `install_command` 是由脚本根据 `github_url` 和 `name` 自动生成的，无需手动填写。
