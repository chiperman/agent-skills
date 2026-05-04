# Rich Skill Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 升级技能详情页面，支持展示技能包内的完整文件结构并提供在线代码预览。

**Architecture:** 
1.  在构建时递归扫描技能目录，将文件结构和内容注入 Markdown frontmatter。
2.  在 Astro 组件中使用 `files` 元数据渲染 Tab 切换界面。
3.  使用 Shiki 提供语法高亮。

**Tech Stack:** Astro, TypeScript, Gray-matter, Shiki, TailwindCSS (for existing styling).

---

### Task 1: 扩展内容集合 Schema

**Files:**
- Modify: `src/content/config.ts`

- [ ] **Step 1: 编写失败的类型检查（假设已在使用该字段）**
修改 `src/content/config.ts` 中的 `skillsCollection`，尝试访问 `files` 字段。

- [ ] **Step 2: 运行构建/类型检查验证失败**
Run: `npx astro check`
Expected: FAIL (property 'files' does not exist)

- [ ] **Step 3: 更新 Schema 定义**
```typescript
const skillsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        // ... existing
        files: z.record(z.array(z.object({
            path: z.string(),
            content: z.string().optional(),
            isBinary: z.boolean().default(false)
        }))).optional()
    })
});
```

- [ ] **Step 4: 验证通过**
Run: `npx astro check`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/content/config.ts
git commit -m "feat: add files field to skills collection schema"
```

---

### Task 2: 升级资产处理脚本

**Files:**
- Modify: `src/integrations/prepare-assets.ts`

- [ ] **Step 1: 实现递归扫描逻辑**
在 `processSkill` 函数中，增加对目录结构的扫描。

```typescript
function getFilesRecursive(dir: string, baseDir: string): any[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results: any[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dist'].includes(entry.name)) continue;
      results = results.concat(getFilesRecursive(fullPath, baseDir));
    } else if (entry.isFile() && entry.name !== 'SKILL.md') {
      const isBinary = isBinaryFileSync(fullPath); // 需要引入或实现
      results.push({
        path: relativePath,
        content: isBinary ? null : fs.readFileSync(fullPath, 'utf8'),
        isBinary
      });
    }
  }
  return results;
}
```

- [ ] **Step 2: 将文件按类别分组并注入 frontmatter**
修改 `processSkill`：
```typescript
const allFiles = getFilesRecursive(skillDirPath, skillDirPath);
const filesByCategory: Record<string, any[]> = {
  scripts: allFiles.filter(f => f.path.startsWith('scripts/')),
  resources: allFiles.filter(f => f.path.startsWith('resources/')),
  examples: allFiles.filter(f => f.path.startsWith('examples/')),
  others: allFiles.filter(f => !f.path.startsWith('scripts/') && !f.path.startsWith('resources/') && !f.path.startsWith('examples/'))
};
frontmatter.files = filesByCategory;
```

- [ ] **Step 3: 运行构建验证数据生成**
Run: `npm run build`
检查 `src/content/skills/git-commit.md` 是否包含 `files` 数据。

- [ ] **Step 4: Commit**
```bash
git add src/integrations/prepare-assets.ts
git commit -m "feat: scan and inject skill files into frontmatter"
```

---

### Task 3: 创建 Tab 和文件浏览器组件

**Files:**
- Create: `src/components/SkillTabs.astro`
- Create: `src/components/FileExplorer.astro`

- [ ] **Step 1: 实现 `SkillTabs.astro`**
使用简单的 State（或基于 URL hash）管理 Tab 切换。

- [ ] **Step 2: 实现 `FileExplorer.astro`**
展示文件列表，并提供展开预览的按钮。

- [ ] **Step 3: 集成到 `SkillDetail.astro`**
```astro
---
import SkillTabs from './SkillTabs.astro';
---
<SkillTabs skill={skill}>
  <div slot="instructions">
    <Content />
  </div>
  <div slot="files">
    <FileExplorer files={skill.data.files} />
  </div>
</SkillTabs>
```

- [ ] **Step 4: Commit**
```bash
git add src/components/SkillTabs.astro src/components/FileExplorer.astro src/components/SkillDetail.astro
git commit -m "feat: implement tabs and file explorer components"
```

---

### Task 4: 语法高亮与最后打磨

**Files:**
- Create: `src/components/CodePreview.astro`

- [ ] **Step 1: 实现 `CodePreview.astro`**
使用 Astro 的 `<Code />` 组件（基于 Shiki）渲染源码。

- [ ] **Step 2: 响应式优化**
确保在移动端 Tab 和代码块显示正常。

- [ ] **Step 3: 最终验证**
访问 `/skills/git-commit`，切换到 Files Tab，查看源码。

- [ ] **Step 4: Commit**
```bash
git add src/components/CodePreview.astro
git commit -m "feat: add code preview with syntax highlighting"
```
