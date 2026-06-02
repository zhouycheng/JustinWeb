import type { Locale } from "@/lib/i18n/config";

export type HeroFacingVariant = "primary" | "reveal";

export type HeroFacingContent = {
  leading: string;
  accent: string;
  subtitle: string;
};

export type SiteNavigationItem = {
  label: string;
  href: string;
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
};

const NAVIGATION_HREFS = [
  { key: "about", href: "#about" },
  { key: "skills", href: "#skills" },
  { key: "projects", href: "#projects" },
  { key: "articles", href: "#articles" },
] as const;

const SITE_COPY = {
  zh: {
    metadata: {
      title: "Justin",
      titleTemplate: "%s | Justin",
      description: "Justin 的个人主页。",
    },
    navigation: {
      brandLabel: "Justin",
      avatarLabel: "Justin 头像",
      labels: {
        about: "关于",
        skills: "技能",
        projects: "项目",
        articles: "文稿",
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
  },
  en: {
    metadata: {
      title: "Justin",
      titleTemplate: "%s | Justin",
      description: "Justin's personal site.",
    },
    navigation: {
      brandLabel: "Justin",
      avatarLabel: "Justin avatar",
      labels: {
        about: "About",
        skills: "Skills",
        projects: "Projects",
        articles: "Articles",
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
  }
>;

const siteContentCache = new Map<Locale, SiteContent>();

function buildNavigationItems(locale: Locale): SiteNavigationItem[] {
  return NAVIGATION_HREFS.map(({ key, href }) => ({
    href,
    label: SITE_COPY[locale].navigation.labels[key],
  }));
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
  };

  siteContentCache.set(locale, content);
  return content;
}
