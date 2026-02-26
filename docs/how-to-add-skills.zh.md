# 维护与贡献指南 | Maintenance & Contribution Guide

[English](./how-to-add-skills.md) | 简体中文

本仓库采用配置驱动的自动化工作流。通过修改 `src/data/skills.json` 并配合 `skills/` 目录，系统会自动生成网页内容、压缩包资产、AI 可读 API 以及更新根目录的 `README.md`。

---

## 1. 如何创建自建技能 (Personal Skill)

自建技能是指由你亲自编写、包含完整 `SKILL.md` 指令的技能。

### 第一步：创建目录结构
在项目根目录的 `skills/` 下新建一个与技能名一致的文件夹。
```bash
mkdir -p skills/my-new-skill
```

### 第二步：编写技能文档
在新建的文件夹内创建 `SKILL.md`。必须包含 `name` 和 `description` 元数据。
```markdown
---
name: my-new-skill
description: 这是一个描述技能核心功能的简短句子。
---

# 技能名称

### 1. 核心指令
... 你的 AI 指令内容 ...

### 2. 执行流程
...
```

### 第三步：注册技能
编辑 `src/data/skills.json`，在数组中添加该技能的信息。
```json
{
  "name": "my-new-skill",
  "type": "personal"
}
```

---

## 2. 如何添加引用技能 (Reference Skill)

引用技能是指指向外部优秀开源项目的技能，通常仅在本项目中做收录推荐。

### 第一步：获取信息
你需要准备好该技能的：
- **名称 (name)**
- **功能描述 (description)**
- **GitHub 仓库地址 (github_url)**

### 第二步：注册技能
直接编辑 `src/data/skills.json`，添加如下配置。
```json
{
  "name": "external-awesome-skill",
  "type": "reference",
  "description": "该技能可以帮助 AI 处理 X 任务，提升 Y 效率。",
  "github_url": "https://github.com/someone/external-awesome-skill"
}
```
*注意：引用技能不需要在 `skills/` 目录下创建任何文件。*

---

## 3. 同步与部署 (全自动化)

本项目配备了**全自动 CI/CD 流水线**。你不再需要手动运行同步脚本。

### 工作流
1. **推送变更**：只需将对 `src/data/skills.json` 或 `skills/` 目录的修改提交并 `git push` 到 GitHub。
2. **云端自动处理**：GitHub Actions 会自动执行以下操作：
   - 刷新 `README.md` 和 `README.zh.md` 中的技能表格与命令。
   - **自动将 README 的变更提交并推回仓库**（以 Bot 名义）。
   - 构建网站并部署最新版本到 GitHub Pages。

### 本地预览 (可选)
如果你想在推送前预览 `SKILL.md` 或网站效果：
```bash
npm run dev
```
访问 `http://localhost:4321/` 即可实时查看变更。

---

## 4. 最佳实践提示

- **技能命名**：建议使用小写字母和中划线（kebab-case），例如 `ui-design-pro`。
- **描述信息**：尽量简洁，以保证首页卡片整齐。
- **安装测试**：运行 `npm run build` 后，检查 `README.md` 中的 `npx skills add` 命令是否符合预期。
