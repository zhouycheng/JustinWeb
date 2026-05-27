# 本地 Admin 系统实施方案

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**目标：** 构建一套仅在本机 `127.0.0.1:3540` 运行的 Admin 系统，用来编辑 JustinView 的站点内容，并通过 `127.0.0.1:3535` 预览主站效果；整个方案不暴露公网写接口，不引入账号密码登录。

**架构：** 整体拆成三层：`content/` 负责存放可编辑内容源，`shared/` 负责共享主题 token 和内容 schema，主站与 Admin 分别作为两个独立应用运行。主站继续保持只读，通过统一 loader 读取内容；Admin 只负责本地内容编辑、资源上传、内容校验和预览。

**技术栈：** Next.js 16、React 19、TypeScript、Tailwind CSS v4、Route Handlers、本地文件读写、Zod 内容校验。

---

### 任务 1：抽离共享主题契约

**涉及文件：**
- 新建：`shared/theme/tokens.css`
- 新建：`shared/theme/admin.css`
- 修改：`src/app/globals.css`
- 验证：主站样式与 Admin 壳层样式

**步骤 1：抽离可复用设计 token**

把 [src/app/globals.css](/Users/leftzhou/项目/JustinView/src/app/globals.css) 中真正需要复用的部分抽到 `shared/theme/tokens.css`：
- 字体定义
- `--page-*` 颜色变量
- `--font-*` 字体变量
- 深色模式下的核心面板、边框、文字、阴影变量

不要抽离主站专属效果：
- 首页 Hero / Reveal 相关变量
- 主题切换动画
- 首页光标、舞台动效

**步骤 2：新增 Admin 专属工作台样式**

在 `shared/theme/admin.css` 中新增仅服务 Admin 的深色工作台样式：
- 左侧导航栏 surface
- 表单面板 surface
- 输入框、文本域、按钮、分组卡片
- 顶部工具栏
- 预览面板容器

**步骤 3：回收主站全局样式职责**

修改 `src/app/globals.css`：
- 引入共享 token
- 保留主站专属 light/dark 行为
- 保留首页视觉和切换动画
- 不把 Admin 的工作台布局样式写进主站样式文件

**步骤 4：验证**

运行：
```bash
npm run dev
```

预期：
- 主站在 `127.0.0.1:3535` 上视觉不变
- 共享 token 已经从主站全局样式中拆出

**步骤 5：提交**

```bash
git add shared/theme/tokens.css shared/theme/admin.css src/app/globals.css
git commit -m "refactor: 抽离共享主题 token"
```

### 任务 2：把主站内容迁移为文件化内容源

**涉及文件：**
- 新建：`content/site.json`
- 新建：`content/skills.json`
- 新建：`content/contact.json`
- 新建：`content/projects/*.json`
- 新建：`shared/content/schema.ts`
- 新建：`shared/content/types.ts`
- 新建：`shared/content/read-content.ts`
- 修改：`src/lib/site/content.ts`
- 验证：主站页面与项目详情页

**步骤 1：定义内容 schema**

在 `shared/content/schema.ts` 中用 Zod 定义：
- 站点基础信息
- 中英文本地化字符串
- 技能项
- 联系方式
- 项目项
- 截图、代码片段、外链等结构

**步骤 2：迁移静态内容**

把当前 [src/lib/site/content.ts](/Users/leftzhou/项目/JustinView/src/lib/site/content.ts) 里的硬编码内容拆到 `content/` 目录：
- `content/site.json`：站点标题、描述、导航、首页文案、页面文案
- `content/skills.json`：技能列表
- `content/contact.json`：联系方式
- `content/projects/*.json`：每个项目一个文件

**步骤 3：实现共享内容读取器**

在 `shared/content/read-content.ts` 中实现：
- 从磁盘读取 JSON
- 通过 Zod 校验
- 排序项目
- 返回强类型原始内容

**步骤 4：保持主站 API 不变**

修改 `src/lib/site/content.ts`，让它从“内容定义文件”变成“内容组装器”：
- 内部改为读取 `shared/content/read-content.ts`
- 对外继续保留 `getSiteContent(locale)`
- 对外继续保留 `getProjectBySlug(locale, slug)`

这样主站页面层不用大改。

**步骤 5：验证**

运行：
```bash
npm run dev
```

预期：
- `/`
- `/skills`
- `/projects`
- `/projects/[slug]`
- `/contact`

这些页面的展示内容与迁移前保持一致。

**步骤 6：提交**

```bash
git add content shared/content src/lib/site/content.ts
git commit -m "refactor: 将站点内容迁移为文件源"
```

### 任务 3：搭建独立本地 Admin 应用骨架

**涉及文件：**
- 新建：`admin/app/layout.tsx`
- 新建：`admin/app/page.tsx`
- 新建：`admin/app/globals.css`
- 新建：`admin/tsconfig.json`
- 新建：`admin/next-env.d.ts`
- 新建：`admin/next.config.ts`
- 修改：`package.json`
- 验证：Admin 本地启动

**步骤 1：把 Admin 作为独立应用**

在 `admin/` 下搭建一个独立的 Next 应用，不和主站页面共享路由或组件树。

布局采用工作台结构：
- 左侧：模块导航
- 中间：编辑区域
- 右侧：预览区域
- 顶部：保存、校验、刷新预览等操作

**步骤 2：Admin 只使用深色模式**

在 Admin layout 中：
- 固定 `data-theme="dark"`
- 不提供亮色模式切换
- 不复用主站首页的视觉特效
- 只复用共享 token 与基础深色审美

**步骤 3：补充根脚本**

在 [package.json](/Users/leftzhou/项目/JustinView/package.json) 增加：

```json
{
  "admin:dev": "next dev ./admin --port 3540 --hostname 127.0.0.1",
  "admin:build": "next build ./admin --webpack",
  "admin:start": "next start ./admin --port 3540 --hostname 127.0.0.1"
}
```

**步骤 4：验证**

运行：
```bash
npm run admin:dev
```

预期：
- Admin 可在 `http://127.0.0.1:3540` 访问
- 主站依旧在 `http://127.0.0.1:3535`
- 两者互不干扰

**步骤 5：提交**

```bash
git add admin package.json
git commit -m "feat: 初始化本地 Admin 应用"
```

### 任务 4：实现仅本地可用的内容读写接口

**涉及文件：**
- 新建：`admin/app/api/content/route.ts`
- 新建：`admin/app/api/projects/[slug]/route.ts`
- 新建：`admin/app/api/assets/route.ts`
- 新建：`admin/lib/server/content-service.ts`
- 新建：`admin/lib/server/request-guards.ts`
- 验证：本地读写 `content/` 和资源文件

**步骤 1：实现内容服务层**

在 `admin/lib/server/content-service.ts` 中封装：
- 读取站点、技能、联系、项目内容
- 写回 `content/*.json`
- 新建/删除项目文件
- 上传资源到 `public/uploads/projects/`

**步骤 2：做本地边界控制**

虽然不做登录，但仍然要控制 Admin 写接口的使用边界：
- Admin 服务只绑定 `127.0.0.1`
- 对写请求校验 `Origin: http://127.0.0.1:3540`
- 拒绝来自其他来源的写操作

这不是用户认证，而是本地工具边界控制。

**步骤 3：实现 Route Handlers**

Admin 侧提供这些接口：
- `GET /api/content`
- `PUT /api/content`
- `POST /api/projects`
- `PUT /api/projects/[slug]`
- `DELETE /api/projects/[slug]`
- `POST /api/assets`

所有接口仅存在于 Admin 应用，不进入主站。

**步骤 4：验证**

预期：
- 主站没有任何内容写接口
- Admin 可以本地读写内容文件
- 非法 payload 返回 400，并附带字段级报错

**步骤 5：提交**

```bash
git add admin/app/api admin/lib/server
git commit -m "feat: 添加本地 Admin 内容接口"
```

### 任务 5：实现 Admin 编辑界面

**涉及文件：**
- 新建：`admin/components/shell/*`
- 新建：`admin/components/forms/*`
- 新建：`admin/components/projects/*`
- 新建：`admin/components/preview/*`
- 新建：`admin/lib/client/*`
- 修改：`admin/app/page.tsx`
- 验证：手动 CRUD 流程

**步骤 1：定义信息架构**

Admin 首版建议包含以下模块：
- `站点设置`
- `技能`
- `项目`
- `联系`
- `资源`

**步骤 2：界面策略以易用为核心**

Admin 不追求展示型视觉，而是工作台体验：
- 固定左侧导航
- 中间主编辑区
- 右侧预览区
- 顶部固定操作栏
- 字段分组明确
- 中英文字段并排编辑
- 保存状态清晰
- 表单报错就地展示

**步骤 3：优先实现核心 CRUD**

第一版只做这些必要能力：
- 编辑站点基础文案
- 编辑技能列表
- 列出项目
- 编辑单个项目
- 新增 / 删除项目
- 编辑联系方式

**步骤 4：验证**

预期操作路径：
1. 打开 `127.0.0.1:3540`
2. 编辑内容
3. 点击保存
4. 右侧预览刷新
5. 在主站预览看到内容变化

**步骤 5：提交**

```bash
git add admin/components admin/lib/client admin/app/page.tsx
git commit -m "feat: 构建 Admin 编辑工作台"
```

### 任务 6：接入预览与发布流程

**涉及文件：**
- 新建：`admin/app/api/publish/route.ts`
- 新建：`admin/lib/server/publish-service.ts`
- 修改：`README.md`
- 验证：本地预览与发布校验

**步骤 1：加入主站预览面板**

右侧预览面板用 iframe 直接指向主站：
- `http://127.0.0.1:3535/`
- 并可切换预览 `/projects`、`/contact` 等常用页面

**步骤 2：实现发布前校验**

在 `admin/lib/server/publish-service.ts` 中封装本地发布前动作：
- 内容校验
- `npm run lint`
- `npm run build`

第一版建议不要自动执行 `git commit` / `git push`，仍保留为显式动作，避免误操作。

**步骤 3：更新文档**

修改 [README.md](/Users/leftzhou/项目/JustinView/README.md)：
- 主站端口 `3535`
- Admin 端口 `3540`
- 本地 Admin 的使用方式
- 内容编辑、预览、发布的完整流程

**步骤 4：验证**

运行：
```bash
npm run dev
npm run admin:dev
```

预期：
- Admin 可编辑内容
- 主站可预览更新
- 发布校验链路可运行

**步骤 5：提交**

```bash
git add admin/app/api/publish admin/lib/server README.md
git commit -m "feat: 添加预览与发布流程"
```
