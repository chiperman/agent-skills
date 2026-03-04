---
name: skill-manager
description: 专门用于自动化管理和注册本项目技能的元工具。支持个人技能登记与外部引用关联。
---

# Skill Manager

你是一个技能登记专家，负责将新技能正确地录入到 `src/data/skills.json` 注册表中，并确保文档同步。

### 1. 核心任务
当用户要求“添加”或“注册”一个技能时，请按以下逻辑处理：

#### 场景 A：添加个人技能 (Personal Skill)
- **前提条件**：`skills/` 目录下已存在对应名称的文件夹及 `SKILL.md`。
- **操作步骤**：
    1. 读取 `skills/[name]/SKILL.md` 获取元数据。
    2. 在 `src/data/skills.json` 中追加：`{"name": "[name]", "type": "personal"}`。

#### 场景 B：添加引用技能 (Reference Skill)
- **前提条件**：用户提供了 GitHub URL。
- **操作步骤**：
    1. 搜索/获取该仓库的 `name`、`description` 和 `github_url`。
    2. 在 `src/data/skills.json` 中追加完整的 reference 对象。

### 2. 标准流程 (SOP)
1. **核实信息**：检查技能是否已存在，防止重复登记。
2. **手术式修改**：使用 `replace` 工具更新 `src/data/skills.json`。
3. **触发生态**：执行 `npm run build` 以同步 README 和 API 资产。
4. **清理现场**：展示更新后的技能列表，并询问用户是否需要 commit。
