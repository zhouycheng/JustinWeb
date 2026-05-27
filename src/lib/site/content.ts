import type { Locale } from "@/lib/i18n/config";

export type HeroFacingVariant = "primary" | "reveal";

export type HeroFacingContent = {
  leading: string;
  accent: string;
  subtitle: string;
};

export type SkillItem = {
  name: string;
  level: string;
  note: string;
  topics: string[];
};

export type LinkKind = "github" | "gitee" | "juejin" | "mail";

export type ExternalLink = {
  label: string;
  href: string;
  kind: LinkKind;
  note: string;
};

export type ScreenshotPlaceholder = {
  title: string;
  caption: string;
};

export type CodePreview = {
  filename: string;
  language: string;
  snippet: string;
};

export type ProjectItem = {
  slug: string;
  name: string;
  role: string;
  techStack: string[];
  problem: string;
  summary: string;
  highlights: string[];
  screenshots: ScreenshotPlaceholder[];
  codePreview: CodePreview;
  links: ExternalLink[];
};

export type SiteNavigationItem = {
  label: string;
  href: string;
};

export type SitePageCopy = {
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  title: string;
  description: string;
};

export type ProjectCardCopy = {
  badge: string;
  detailAction: string;
  roleLabel: string;
  techStackLabel: string;
  problemLabel: string;
  summaryLabel: string;
};

export type ProjectDetailCopy = {
  notFoundTitle: string;
  backToProjectsLabel: string;
  eyebrow: string;
  roleLabel: string;
  problemLabel: string;
  highlightsLabel: string;
  screenshotLabel: string;
  screenshotTitle: string;
  screenshotHint: string;
  screenIndexLabel: string;
  codeLabel: string;
  codeTitle: string;
};

export type FloatingActionsCopy = {
  groupAriaLabel: string;
  themeToggleLabel: string;
  switchToEnglishLabel: string;
  switchToChineseLabel: string;
};

export type SiteContent = {
  metadata: {
    title: string;
    titleTemplate: string;
    description: string;
  };
  navigation: {
    brandLabel: string;
    avatarLabel: string;
    items: SiteNavigationItem[];
  };
  floatingActions: FloatingActionsCopy;
  home: {
    hero: Record<HeroFacingVariant, HeroFacingContent>;
  };
  skillsPage: SitePageCopy;
  projectsPage: SitePageCopy & {
    card: ProjectCardCopy;
  };
  contactPage: SitePageCopy;
  projectDetail: ProjectDetailCopy;
  skillItems: SkillItem[];
  projectItems: ProjectItem[];
  contactLinks: ExternalLink[];
};

type LocalizedValue<T> = Record<Locale, T>;

type LocalizedSkillSource = {
  name: LocalizedValue<string>;
  level: LocalizedValue<string>;
  note: LocalizedValue<string>;
  topics: LocalizedValue<string[]>;
};

type LocalizedExternalLinkSource = {
  label: LocalizedValue<string>;
  href: string;
  kind: LinkKind;
  note: LocalizedValue<string>;
};

type LocalizedProjectSource = {
  slug: string;
  name: LocalizedValue<string>;
  role: LocalizedValue<string>;
  techStack: string[];
  problem: LocalizedValue<string>;
  summary: LocalizedValue<string>;
  highlights: LocalizedValue<string[]>;
  screenshots: Array<{
    title: LocalizedValue<string>;
    caption: LocalizedValue<string>;
  }>;
  codePreview: CodePreview;
  links: LocalizedExternalLinkSource[];
};

const NAVIGATION_HREFS = [
  { key: "about", href: "/" },
  { key: "skills", href: "/skills" },
  { key: "projects", href: "/projects" },
  { key: "contact", href: "/contact" },
] as const;

const SITE_COPY = {
  zh: {
    metadata: {
      title: "Justin",
      titleTemplate: "%s | Justin",
      description: "Justin 的个人主页，包含关于、技能、项目和联系入口。",
    },
    navigation: {
      brandLabel: "Justin",
      avatarLabel: "Justin 头像",
      labels: {
        about: "关于",
        skills: "技能",
        projects: "项目",
        contact: "联系",
      },
    },
    floatingActions: {
      groupAriaLabel: "站点快捷操作",
      themeToggleLabel: "切换颜色模式",
      switchToEnglishLabel: "切换到英文",
      switchToChineseLabel: "切换到中文",
    },
    home: {
      hero: {
        primary: {
          leading: "你好，我是",
          accent: "耀程",
          subtitle: "Flutter 工程师 / 22岁 / 新疆",
        },
        reveal: {
          leading: "HELLO, I'M ",
          accent: "Justin",
          subtitle: "Flutter Engineer / 22 / Xinjiang",
        },
      },
    },
    skillsPage: {
      metadataTitle: "技能",
      metadataDescription: "Justin 当前主要使用的技术栈与能力方向。",
      eyebrow: "技能视图",
      title: "技能",
      description:
        "先用静态内容固定当前主要技术栈，整体保持简约展示。后续只需要替换文案，就可以逐步补齐真实经验和案例。",
    },
    projectsPage: {
      metadataTitle: "项目",
      metadataDescription: "Justin 的项目卡片列表与详情入口。",
      eyebrow: "项目列表",
      title: "项目",
      description:
        "这里先放静态项目卡片，每张卡片都包含项目名、职责、技术栈、解决的问题和项目简介。点击后进入详情页查看截图、代码片段和外链入口。",
      card: {
        badge: "项目",
        detailAction: "查看详情",
        roleLabel: "职责",
        techStackLabel: "技术栈",
        problemLabel: "解决的问题",
        summaryLabel: "项目简介",
      },
    },
    contactPage: {
      metadataTitle: "联系",
      metadataDescription: "Justin 的社交链接与联系入口。",
      eyebrow: "联系",
      title: "联系",
      description:
        "合作模块改成联系页，先放掘金、GitHub 和 QQ 邮箱三个入口。当前都使用静态占位内容，后续替换成真实账号即可。",
    },
    projectDetail: {
      notFoundTitle: "项目不存在",
      backToProjectsLabel: "返回项目列表",
      eyebrow: "项目详情",
      roleLabel: "职责",
      problemLabel: "解决的问题",
      highlightsLabel: "项目简介补充",
      screenshotLabel: "截图预览",
      screenshotTitle: "截图占位",
      screenshotHint: "先放占位块，后续替换为真实截图",
      screenIndexLabel: "截图",
      codeLabel: "代码片段",
      codeTitle: "代码预览",
    },
  },
  en: {
    metadata: {
      title: "Justin",
      titleTemplate: "%s | Justin",
      description: "Justin's personal site with an about page, skills, projects, and contact links.",
    },
    navigation: {
      brandLabel: "Justin",
      avatarLabel: "Justin avatar",
      labels: {
        about: "About",
        skills: "Skills",
        projects: "Projects",
        contact: "Contact",
      },
    },
    floatingActions: {
      groupAriaLabel: "Site quick actions",
      themeToggleLabel: "Toggle color theme",
      switchToEnglishLabel: "Switch to English",
      switchToChineseLabel: "Switch to Chinese",
    },
    home: {
      hero: {
        primary: {
          leading: "HELLO, I'M ",
          accent: "Justin",
          subtitle: "Flutter Engineer / 22 / Xinjiang",
        },
        reveal: {
          leading: "你好，我是",
          accent: "耀程",
          subtitle: "Flutter 工程师 / 22岁 / 新疆",
        },
      },
    },
    skillsPage: {
      metadataTitle: "Skills",
      metadataDescription: "Justin's current core technologies and focus areas.",
      eyebrow: "Skills View",
      title: "Skills",
      description:
        "This page fixes the current stack in a clean static layout first. Later, new experience and case studies can be filled in by updating content only.",
    },
    projectsPage: {
      metadataTitle: "Projects",
      metadataDescription: "Justin's project list and project detail entry points.",
      eyebrow: "Projects",
      title: "Projects",
      description:
        "These project cards act as a temporary portfolio layer. Each card includes the project name, role, stack, problem statement, and summary, with a deeper detail page behind it.",
      card: {
        badge: "Project",
        detailAction: "View detail",
        roleLabel: "Role",
        techStackLabel: "Tech stack",
        problemLabel: "Problem",
        summaryLabel: "Summary",
      },
    },
    contactPage: {
      metadataTitle: "Contact",
      metadataDescription: "Justin's social profiles and contact entry points.",
      eyebrow: "Contact",
      title: "Contact",
      description:
        "The collaboration module is now a contact page with Juejin, GitHub, and QQ Mail as placeholders. You only need to replace the links later with real accounts.",
    },
    projectDetail: {
      notFoundTitle: "Project not found",
      backToProjectsLabel: "Back to projects",
      eyebrow: "Project Detail",
      roleLabel: "Role",
      problemLabel: "Problem",
      highlightsLabel: "Additional notes",
      screenshotLabel: "Screenshots",
      screenshotTitle: "Screenshot Placeholders",
      screenshotHint: "Placeholder surfaces for now. Replace them with real screenshots later.",
      screenIndexLabel: "Screen",
      codeLabel: "Code",
      codeTitle: "Code Preview",
    },
  },
} satisfies Record<
  Locale,
  {
    metadata: SiteContent["metadata"];
    navigation: {
      brandLabel: string;
      avatarLabel: string;
      labels: Record<(typeof NAVIGATION_HREFS)[number]["key"], string>;
    };
    floatingActions: FloatingActionsCopy;
    home: SiteContent["home"];
    skillsPage: SiteContent["skillsPage"];
    projectsPage: SiteContent["projectsPage"];
    contactPage: SiteContent["contactPage"];
    projectDetail: ProjectDetailCopy;
  }
>;

const SKILL_SOURCES: LocalizedSkillSource[] = [
  {
    name: {
      zh: "Flutter",
      en: "Flutter",
    },
    level: {
      zh: "核心栈",
      en: "Core stack",
    },
    note: {
      zh: "当前最主要的跨平台交付方案，适合业务应用、后台工具和轻产品快速落地。",
      en: "The main cross-platform delivery stack right now, well suited for business apps, internal tools, and lightweight product launches.",
    },
    topics: {
      zh: ["组件封装", "状态管理", "性能调优"],
      en: ["Component abstraction", "State management", "Performance tuning"],
    },
  },
  {
    name: {
      zh: "Dart",
      en: "Dart",
    },
    level: {
      zh: "日常主语言",
      en: "Primary daily language",
    },
    note: {
      zh: "围绕 Flutter 长期使用，主要负责业务建模、异步流程和工程结构整理。",
      en: "Used long term around Flutter, mainly for domain modeling, async flows, and keeping the project structure clean.",
    },
    topics: {
      zh: ["异步编排", "泛型封装", "代码规范"],
      en: ["Async orchestration", "Generic abstractions", "Code standards"],
    },
  },
  {
    name: {
      zh: "Android",
      en: "Android",
    },
    level: {
      zh: "原生能力",
      en: "Native capability",
    },
    note: {
      zh: "用于处理原生桥接、机型问题排查，以及复杂业务场景下的能力补位。",
      en: "Used for native bridges, device-specific debugging, and filling gaps when product scenarios need lower-level platform support.",
    },
    topics: {
      zh: ["Jetpack", "原生调试", "桥接接入"],
      en: ["Jetpack", "Native debugging", "Bridge integration"],
    },
  },
  {
    name: {
      zh: "SwiftUI",
      en: "SwiftUI",
    },
    level: {
      zh: "界面实现",
      en: "Interface delivery",
    },
    note: {
      zh: "用于 iOS 端轻量页面和原型实现，强调状态驱动和简洁的交互表达。",
      en: "Used for lightweight iOS screens and prototypes, with a focus on state-driven UI and concise interaction design.",
    },
    topics: {
      zh: ["状态驱动", "动画过渡", "列表布局"],
      en: ["State-driven UI", "Motion transitions", "List layouts"],
    },
  },
  {
    name: {
      zh: "Uniapp",
      en: "Uniapp",
    },
    level: {
      zh: "业务快交付",
      en: "Fast business delivery",
    },
    note: {
      zh: "适合表单密集型小程序和轻应用项目，重点在流程稳定和提交流畅。",
      en: "A pragmatic fit for form-heavy mini-programs and lightweight apps where stable flows and smooth submissions matter most.",
    },
    topics: {
      zh: ["表单流", "上传流程", "业务页面"],
      en: ["Form flows", "Upload flows", "Business pages"],
    },
  },
  {
    name: {
      zh: "Spring Boot",
      en: "Spring Boot",
    },
    level: {
      zh: "接口联调",
      en: "API integration",
    },
    note: {
      zh: "主要用于后台占位和接口支撑，服务于客户端联调与基础业务能力实现。",
      en: "Mainly used for backend scaffolding and API support to unblock client integration and basic business capabilities.",
    },
    topics: {
      zh: ["REST API", "权限基础", "CRUD 能力"],
      en: ["REST APIs", "Basic auth", "CRUD support"],
    },
  },
];

const PROJECT_SOURCES: LocalizedProjectSource[] = [
  {
    slug: "justin-view",
    name: {
      zh: "JustinView",
      en: "JustinView",
    },
    role: {
      zh: "负责整体视觉实现、导航拆分、项目详情结构和状态展示能力落地。",
      en: "Owned the visual execution, navigation split, project detail structure, and live status surface.",
    },
    techStack: ["Next.js", "React", "TypeScript"],
    problem: {
      zh: "让个人主页不再只是静态介绍，而是能承载技能、项目和当前工作状态入口。",
      en: "Turn the personal site from a static intro page into a place that can carry skills, projects, and a live activity entry point.",
    },
    summary: {
      zh: "一个偏简约的个人站，占位版本先承载关于、技能、项目和联系四个基础页面，并预留后续持续填充空间。",
      en: "A minimal personal website that currently ships four base pages: about, skills, projects, and contact, while keeping enough room for future additions.",
    },
    highlights: {
      zh: [
        "将单屏首页扩展为多页面结构，方便后续继续补内容。",
        "保留顶部固定导航，让主要页面之间的切换成本更低。",
        "项目详情页预留截图与代码片段，便于以后沉淀作品案例。",
      ],
      en: [
        "Expanded a single-screen homepage into a multi-page structure so new content can be added incrementally.",
        "Kept the top navigation fixed to reduce navigation friction across core pages.",
        "Reserved screenshot and code sections in the detail page to accumulate future portfolio case studies.",
      ],
    },
    screenshots: [
      {
        title: {
          zh: "About Hero",
          en: "About Hero",
        },
        caption: {
          zh: "用于展示名字、身份和当前状态的首页首屏。",
          en: "The hero section that introduces the name, role, and current working state.",
        },
      },
      {
        title: {
          zh: "Projects Grid",
          en: "Projects Grid",
        },
        caption: {
          zh: "统一的项目卡片列表，负责承接项目浏览入口。",
          en: "A unified project card grid that acts as the browsing entry point.",
        },
      },
      {
        title: {
          zh: "Project Detail",
          en: "Project Detail",
        },
        caption: {
          zh: "详情页保留截图区、代码区和外链入口。",
          en: "The detail page keeps dedicated areas for screenshots, code, and external links.",
        },
      },
    ],
    codePreview: {
      filename: "src/components/site/site-header.tsx",
      language: "tsx",
      snippet: `const navItems = [
  { label: "About", href: "/" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(\`\${href}/\`);
}`,
    },
    links: [
      {
        label: {
          zh: "GitHub",
          en: "GitHub",
        },
        href: "https://github.com/",
        kind: "github",
        note: {
          zh: "占位入口，后续替换为真实仓库链接。",
          en: "Placeholder entry. Replace it later with the real repository URL.",
        },
      },
      {
        label: {
          zh: "Gitee",
          en: "Gitee",
        },
        href: "https://gitee.com/",
        kind: "gitee",
        note: {
          zh: "占位入口，后续替换为镜像仓库或国内代码托管地址。",
          en: "Placeholder entry. Replace it later with a mirror repo or domestic code hosting URL.",
        },
      },
    ],
  },
  {
    slug: "flow-kit",
    name: {
      zh: "FlowKit",
      en: "FlowKit",
    },
    role: {
      zh: "负责 Flutter 客户端架构拆分、页面实现和接口联调闭环。",
      en: "Owned the Flutter client architecture split, page implementation, and API integration loop.",
    },
    techStack: ["Flutter", "Dart", "SpringBoot"],
    problem: {
      zh: "解决任务流转中状态同步不稳定、弱网提交慢，以及页面切换后上下文丢失的问题。",
      en: "Solve unstable status sync in task flows, slow submissions on weak networks, and lost context after page switches.",
    },
    summary: {
      zh: "一套偏任务管理与流程执行的移动端应用，占位内容用于展示客户端项目的结构和信息密度。",
      en: "A mobile app centered on task management and flow execution, used here as a placeholder case for client-side structure and information density.",
    },
    highlights: {
      zh: [
        "将任务列表、详情和状态流转拆成独立模块。",
        "通过本地缓存与接口状态兜底，减少弱网下的重复提交。",
        "预留组件化结构，便于后期扩展日历、筛选和提醒能力。",
      ],
      en: [
        "Split task list, detail, and state transitions into independent modules.",
        "Used local cache and API state fallbacks to reduce duplicate submissions in weak-network conditions.",
        "Reserved a componentized structure for later calendar, filtering, and reminder features.",
      ],
    },
    screenshots: [
      {
        title: {
          zh: "Task Overview",
          en: "Task Overview",
        },
        caption: {
          zh: "展示今日任务、状态分布和最近更新时间。",
          en: "Shows today's tasks, status distribution, and the latest update time.",
        },
      },
      {
        title: {
          zh: "Task Detail",
          en: "Task Detail",
        },
        caption: {
          zh: "集中展示任务信息、操作节点和流转记录。",
          en: "Focuses task information, action nodes, and transition records in one place.",
        },
      },
      {
        title: {
          zh: "Status Report",
          en: "Status Report",
        },
        caption: {
          zh: "用于查看已完成、处理中和延期项的比例变化。",
          en: "Used to review how completed, in-progress, and delayed items are changing over time.",
        },
      },
    ],
    codePreview: {
      filename: "lib/modules/tasks/task_list_view.dart",
      language: "dart",
      snippet: `class TaskListView extends StatelessWidget {
  const TaskListView({super.key, required this.items});

  final List<TaskItem> items;

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      itemCount: items.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final item = items[index];
        return TaskCard(item: item);
      },
    );
  }
}`,
    },
    links: [
      {
        label: {
          zh: "GitHub",
          en: "GitHub",
        },
        href: "https://github.com/",
        kind: "github",
        note: {
          zh: "占位入口，后续替换为 Flutter 项目仓库。",
          en: "Placeholder entry. Replace it later with the real Flutter repository.",
        },
      },
      {
        label: {
          zh: "Gitee",
          en: "Gitee",
        },
        href: "https://gitee.com/",
        kind: "gitee",
        note: {
          zh: "占位入口，后续替换为项目镜像或私有仓镜像地址。",
          en: "Placeholder entry. Replace it later with a project mirror or private mirror URL.",
        },
      },
    ],
  },
  {
    slug: "patrol-lite",
    name: {
      zh: "巡检助手",
      en: "Patrol Assistant",
    },
    role: {
      zh: "负责 Uniapp 端业务页面、表单提交链路和后台接口联调。",
      en: "Owned the Uniapp business pages, form submission flow, and backend API integration.",
    },
    techStack: ["Uniapp", "Android", "SpringBoot"],
    problem: {
      zh: "解决巡检表单复杂、照片上传慢、现场提交不稳定和流程反馈不清晰的问题。",
      en: "Solve overly complex inspection forms, slow photo uploads, unstable on-site submissions, and unclear process feedback.",
    },
    summary: {
      zh: "一个偏现场作业场景的小程序项目，占位版重点展示业务流项目在信息组织上的清晰度。",
      en: "A mini-program for field operations, used here to show how business-heavy projects can still keep information structure clear.",
    },
    highlights: {
      zh: [
        "通过分步骤表单降低一次性输入的认知负担。",
        "针对上传链路增加状态反馈，减少用户等待焦虑。",
        "保留 Android 侧能力接入空间，便于处理扫码和相机能力扩展。",
      ],
      en: [
        "Reduced cognitive load with step-based forms instead of one large submission surface.",
        "Added clearer upload feedback to reduce waiting anxiety during field use.",
        "Left room for Android-side capability extensions such as scanning and camera enhancements.",
      ],
    },
    screenshots: [
      {
        title: {
          zh: "Checklist Start",
          en: "Checklist Start",
        },
        caption: {
          zh: "展示巡检入口、任务摘要和开始按钮。",
          en: "Shows the inspection entry, task summary, and primary start action.",
        },
      },
      {
        title: {
          zh: "Upload Flow",
          en: "Upload Flow",
        },
        caption: {
          zh: "用于放置拍照上传、压缩和提交中的状态反馈。",
          en: "Reserved for feedback across photo capture, compression, upload, and submission.",
        },
      },
      {
        title: {
          zh: "Result Sheet",
          en: "Result Sheet",
        },
        caption: {
          zh: "集中查看本次巡检结果和异常项说明。",
          en: "Used to review inspection results and exception notes in one place.",
        },
      },
    ],
    codePreview: {
      filename: "src/pages/patrol/submit.ts",
      language: "ts",
      snippet: `export async function submitPatrol(payload: PatrolPayload) {
  const files = await Promise.all(
    payload.images.map((item) => compressAndUpload(item))
  );

  return request.post("/patrol/submit", {
    ...payload,
    images: files,
  });
}`,
    },
    links: [
      {
        label: {
          zh: "GitHub",
          en: "GitHub",
        },
        href: "https://github.com/",
        kind: "github",
        note: {
          zh: "占位入口，后续替换为项目源码或组件仓库。",
          en: "Placeholder entry. Replace it later with the project source or component repository.",
        },
      },
      {
        label: {
          zh: "Gitee",
          en: "Gitee",
        },
        href: "https://gitee.com/",
        kind: "gitee",
        note: {
          zh: "占位入口，后续替换为业务项目镜像地址。",
          en: "Placeholder entry. Replace it later with a business project mirror URL.",
        },
      },
    ],
  },
  {
    slug: "focus-frames",
    name: {
      zh: "Focus Frames",
      en: "Focus Frames",
    },
    role: {
      zh: "负责 SwiftUI 页面结构、信息层级设计和核心记录流程占位实现。",
      en: "Owned the SwiftUI page structure, information hierarchy, and placeholder implementation of the core capture flow.",
    },
    techStack: ["SwiftUI", "iOS", "Dart"],
    problem: {
      zh: "解决轻记录类产品信息密度低、浏览效率弱和界面结构不够稳定的问题。",
      en: "Solve low information density, weak browsing efficiency, and unstable screen structure in lightweight journaling products.",
    },
    summary: {
      zh: "一个偏记录展示的原生 iOS 项目，占位版用于呈现原生项目的页面层级、截图区和代码片段布局。",
      en: "A native iOS project focused on structured record display, used here to present page hierarchy, screenshot regions, and code layout.",
    },
    highlights: {
      zh: [
        "通过清晰的列表与详情层级提升查看效率。",
        "将记录内容、标签和时间信息集中到同一阅读视图。",
        "保留后续接入跨端数据同步和服务端接口的空间。",
      ],
      en: [
        "Improved browsing efficiency through a clear list-and-detail hierarchy.",
        "Gathered content, tags, and timestamps into a single reading surface.",
        "Kept room for future cross-platform sync and backend integration.",
      ],
    },
    screenshots: [
      {
        title: {
          zh: "Daily Feed",
          en: "Daily Feed",
        },
        caption: {
          zh: "轻量信息流，用来查看最近记录和关键标签。",
          en: "A lightweight feed for recent entries and key tags.",
        },
      },
      {
        title: {
          zh: "Entry Detail",
          en: "Entry Detail",
        },
        caption: {
          zh: "进入详情后聚焦单条内容、附件和时间线。",
          en: "The detail screen focuses on one entry, its attachments, and its timeline.",
        },
      },
      {
        title: {
          zh: "Collection View",
          en: "Collection View",
        },
        caption: {
          zh: "集合页面承接筛选、归档和标签整理能力。",
          en: "The collection screen holds filtering, archiving, and tag organization.",
        },
      },
    ],
    codePreview: {
      filename: "FocusFrames/Scenes/EntryListView.swift",
      language: "swift",
      snippet: `struct EntryListView: View {
  let entries: [EntryItem]

  var body: some View {
    ScrollView {
      LazyVStack(spacing: 14) {
        ForEach(entries) { entry in
          EntryRow(entry: entry)
        }
      }
      .padding(.horizontal, 20)
      .padding(.vertical, 24)
    }
  }
}`,
    },
    links: [
      {
        label: {
          zh: "GitHub",
          en: "GitHub",
        },
        href: "https://github.com/",
        kind: "github",
        note: {
          zh: "占位入口，后续替换为 iOS 项目仓库。",
          en: "Placeholder entry. Replace it later with the iOS project repository.",
        },
      },
      {
        label: {
          zh: "Gitee",
          en: "Gitee",
        },
        href: "https://gitee.com/",
        kind: "gitee",
        note: {
          zh: "占位入口，后续替换为代码镜像地址。",
          en: "Placeholder entry. Replace it later with a code mirror URL.",
        },
      },
    ],
  },
];

const CONTACT_LINK_SOURCES: LocalizedExternalLinkSource[] = [
  {
    label: {
      zh: "掘金",
      en: "Juejin",
    },
    href: "https://juejin.cn/",
    kind: "juejin",
    note: {
      zh: "暂时展示平台入口，后续替换为个人主页链接。",
      en: "Platform placeholder for now. Replace it later with the actual profile URL.",
    },
  },
  {
    label: {
      zh: "GitHub",
      en: "GitHub",
    },
    href: "https://github.com/",
    kind: "github",
    note: {
      zh: "暂时展示平台入口，后续替换为个人账号地址。",
      en: "Platform placeholder for now. Replace it later with the actual account URL.",
    },
  },
  {
    label: {
      zh: "QQ邮箱",
      en: "QQ Mail",
    },
    href: "mailto:your-qq-mail@qq.com",
    kind: "mail",
    note: {
      zh: "占位邮箱地址，后续替换为真实联系邮箱。",
      en: "Placeholder mailbox for now. Replace it later with the real contact address.",
    },
  },
];

const siteContentCache = new Map<Locale, SiteContent>();

function pickLocale<T>(value: LocalizedValue<T>, locale: Locale): T {
  return value[locale];
}

function buildNavigationItems(locale: Locale): SiteNavigationItem[] {
  return NAVIGATION_HREFS.map(({ key, href }) => ({
    href,
    label: SITE_COPY[locale].navigation.labels[key],
  }));
}

function buildExternalLink(link: LocalizedExternalLinkSource, locale: Locale): ExternalLink {
  return {
    label: pickLocale(link.label, locale),
    href: link.href,
    kind: link.kind,
    note: pickLocale(link.note, locale),
  };
}

function buildSkillItem(skill: LocalizedSkillSource, locale: Locale): SkillItem {
  return {
    name: pickLocale(skill.name, locale),
    level: pickLocale(skill.level, locale),
    note: pickLocale(skill.note, locale),
    topics: pickLocale(skill.topics, locale),
  };
}

function buildProjectItem(project: LocalizedProjectSource, locale: Locale): ProjectItem {
  return {
    slug: project.slug,
    name: pickLocale(project.name, locale),
    role: pickLocale(project.role, locale),
    techStack: project.techStack,
    problem: pickLocale(project.problem, locale),
    summary: pickLocale(project.summary, locale),
    highlights: pickLocale(project.highlights, locale),
    screenshots: project.screenshots.map((shot) => ({
      title: pickLocale(shot.title, locale),
      caption: pickLocale(shot.caption, locale),
    })),
    codePreview: project.codePreview,
    links: project.links.map((link) => buildExternalLink(link, locale)),
  };
}

export function getSiteContent(locale: Locale): SiteContent {
  const cached = siteContentCache.get(locale);
  if (cached) {
    return cached;
  }

  const content: SiteContent = {
    metadata: SITE_COPY[locale].metadata,
    navigation: {
      brandLabel: SITE_COPY[locale].navigation.brandLabel,
      avatarLabel: SITE_COPY[locale].navigation.avatarLabel,
      items: buildNavigationItems(locale),
    },
    floatingActions: SITE_COPY[locale].floatingActions,
    home: SITE_COPY[locale].home,
    skillsPage: SITE_COPY[locale].skillsPage,
    projectsPage: SITE_COPY[locale].projectsPage,
    contactPage: SITE_COPY[locale].contactPage,
    projectDetail: SITE_COPY[locale].projectDetail,
    skillItems: SKILL_SOURCES.map((skill) => buildSkillItem(skill, locale)),
    projectItems: PROJECT_SOURCES.map((project) => buildProjectItem(project, locale)),
    contactLinks: CONTACT_LINK_SOURCES.map((link) => buildExternalLink(link, locale)),
  };

  siteContentCache.set(locale, content);
  return content;
}

export function getProjectBySlug(locale: Locale, slug: string): ProjectItem | undefined {
  return getSiteContent(locale).projectItems.find((project) => project.slug === slug);
}
