# JustinView

一个偏简约风格的个人主页项目，用来承载个人介绍、技能、项目展示和联系方式，同时在首页顶部补了一条实时活动状态，让站点不只是静态名片。

当前项目基于 `Next.js 16`、`React 19`、`TypeScript` 和 `Tailwind CSS v4` 开发，内容以静态数据驱动，适合继续往里补真实项目、技能经历和外部链接。

## 项目特点

- 多页面个人站结构，包含首页、技能、项目、联系页和项目详情页
- 中英双语切换，语言状态通过 Cookie 保存
- 亮色 / 暗色主题切换，前端直接完成主题同步
- 首页头像旁边支持实时活动状态展示
- 项目内容、技能内容、联系链接集中维护，后续改内容不需要频繁改页面组件

## 页面说明

### `/`

首页目前是一个偏视觉表达的 Hero 区，承担品牌展示和第一印象，配合顶部导航进入其他页面。

### `/skills`

技能页用于展示当前主要技术栈、熟悉方向和简短说明。

### `/projects`

项目页以卡片形式展示作品，每张卡片包含职责、技术栈、问题描述和简介。

### `/projects/[slug]`

项目详情页会进一步展示项目补充说明、截图占位、代码片段和外链入口。

### `/contact`

联系页用于放置掘金、GitHub、邮箱等外部入口，当前部分内容仍是占位链接，后续可以直接替换。

## 技术栈

- `Next.js 16`
- `React 19`
- `TypeScript 5`
- `Tailwind CSS v4`
- `ESLint 9`

## 目录结构

```text
.
├── public/                     # 静态资源，如头像、字体等
├── scripts/
│   └── activity-monitor.mjs    # 本地活动状态采集脚本（macOS）
├── src/
│   ├── app/
│   │   ├── (site)/             # 站点主页面：首页、技能、项目、联系
│   │   ├── (detail)/           # 项目详情页
│   │   └── api/
│   │       └── activity/       # 活动状态更新与 SSE 推送接口
│   ├── components/
│   │   ├── home/               # 首页视觉与活动状态相关组件
│   │   ├── site/               # 导航、项目卡片、页面壳等通用组件
│   │   └── theme/              # 主题与语言切换相关组件
│   └── lib/
│       ├── activity/           # 活动状态映射、存储与类型定义
│       ├── i18n/               # 多语言配置
│       ├── site/               # 站点内容数据源
│       └── theme/              # 主题逻辑
├── package.json
└── README.md
```

## 快速开始

### 1. 安装依赖

项目当前带的是 `package-lock.json`，默认按 `npm` 使用即可：

```bash
npm install
```

### 2. 启动开发环境

```bash
npm run dev
```

打开 `http://localhost:3000` 查看页面。

### 3. 构建生产版本

```bash
npm run build
npm run start
```

## 可用脚本

```bash
npm run dev              # 本地开发（webpack）
npm run dev:turbo        # 使用 Next 默认开发模式启动
npm run build            # 生产构建（webpack）
npm run start            # 启动生产环境
npm run lint             # 运行 ESLint
npm run monitor:activity # 启动本地活动状态监控脚本
```

## 活动状态功能

项目顶部支持展示类似“正在用 Cursor 写代码”这样的实时状态。

这套链路是单向的：

- `本地 Mac 脚本 -> 网站 API`：通过 `POST /api/activity/update` 推送最新状态
- `网站服务端 -> 浏览器`：通过 `GET /api/activity/stream` 使用 `SSE` 推送当前快照
- 浏览器不会反向控制本机
- 不保留历史记录，只保留当前有效状态

如果本地脚本停止、心跳超时，或者当前应用不在已配置列表中，页面上的状态会自动清除。

### 环境变量

在项目根目录创建 `.env.local`：

```bash
ACTIVITY_MONITOR_TOKEN=replace-with-a-long-random-token
ACTIVITY_MONITOR_URL=http://localhost:3000
```

如需调整轮询和心跳节奏，也可以继续补这些可选项：

```bash
ACTIVITY_MONITOR_POLL_INTERVAL_MS=2000
ACTIVITY_MONITOR_HEARTBEAT_INTERVAL_MS=12000
ACTIVITY_MONITOR_REQUEST_TIMEOUT_MS=4000
```

### 启动活动监控

先启动站点：

```bash
npm run dev
```

再启动本地监控脚本：

```bash
npm run monitor:activity
```

### 注意事项

- 监控脚本仅支持 `macOS`
- 脚本通过 `osascript` 读取当前前台应用
- 只有在 `src/lib/activity/catalog.ts` 里登记过的应用，才会显示对应文案
- 状态只保留最新一次有效快照，不做消息历史存储

## 内容维护位置

如果你后面主要是补站点内容，优先看这几个文件：

- `src/lib/site/content.ts`：站点文案、技能、项目、联系链接的核心数据源
- `src/lib/activity/catalog.ts`：活动状态文案映射
- `public/avatar/my.jpg`：站点头像
- `src/components/site/`：导航、卡片、详情页等通用展示组件

也就是说，大多数“换文案、加项目、改技能、补链接”的工作，主要都在 `src/lib/site/content.ts` 里完成。

## 当前状态

项目已经具备完整的个人站基础骨架，适合继续做这几类补充：

- 把占位项目替换成真实项目经历
- 给项目详情页补真实截图
- 替换联系页中的占位链接和邮箱
- 根据个人风格继续微调首页视觉和动效

## License

如无额外说明，默认仅作为个人项目展示与维护使用。
