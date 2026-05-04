# 2026-05-04-rich-skill-display-design

## 目标 (Goal)
升级技能详情页面，支持展示技能包内的完整文件结构（如脚本、资源文件等），并提供在线内容预览功能。

## 用户审核要求 (User Review Required)
> [!IMPORTANT]
> 所有的文件源码将被直接注入到 Astro 的 Content Collections 中。如果某个技能包含巨大的二进制文件或海量脚本，可能会导致构建产物体积增加。目前假设技能包内的脚本和资源均为轻量文本文件。

## 方案设计 (Proposed Changes)

### 1. 构建层：`src/integrations/prepare-assets.ts` [MODIFY]
- **逻辑升级**：在处理每个技能时，递归扫描其根目录（除 `SKILL.md` 外）。
- **分类收集**：将文件分为 `scripts`, `resources`, `examples` 三类。
- **内容读取**：读取所有文本文件的内容。
- **Frontmatter 注入**：将结构化数据注入到生成的 `.md` 文件中。

### 2. 内容层：`src/content/config.ts` [MODIFY]
- **Schema 扩展**：增加 `files` 字段定义：
  ```typescript
  files: z.record(z.array(z.object({
    path: z.string(),
    content: z.string().optional(),
    isBinary: z.boolean().default(false)
  }))).optional()
  ```

### 3. 组件层：`src/components/SkillDetail.astro` [MODIFY]
- **Tab 切换逻辑**：新增 `Instructions` / `Files` (或按类别拆分) 的 Tab 导航。
- **文件树展示**：新增 `FileExplorer.astro` 组件展示文件夹层级。
- **预览功能**：新增 `CodePreview.astro` 组件，使用 Shiki 进行语法高亮。

## 验证计划 (Verification Plan)

### 自动化测试
- 运行 `npm run build` 确保资产预处理逻辑正确生成带 `files` 数据的 Markdown。

### 手动验证
- 访问包含 `scripts/` 目录的技能页面（如 `git-commit`）。
- 验证 Tab 切换是否流畅。
- 验证点击脚本文件是否能正确显示源码高亮。

---
**Spec Written by Antigravity**
