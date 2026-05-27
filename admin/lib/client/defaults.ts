import type {
  RawExternalLinkSource,
  RawProjectSource,
  RawSkillSource,
  RawScreenshotSource,
} from "@shared/content/schema";

export function slugify(value: string) {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `project-${Date.now()}`;
}

export function createEmptySkill(): RawSkillSource {
  return {
    name: {
      zh: "",
      en: "",
    },
    level: {
      zh: "",
      en: "",
    },
    note: {
      zh: "",
      en: "",
    },
    topics: {
      zh: [],
      en: [],
    },
  };
}

export function createEmptyContactLink(): RawExternalLinkSource {
  return {
    label: {
      zh: "",
      en: "",
    },
    href: "",
  };
}

export function createEmptyScreenshot(): RawScreenshotSource {
  return {
    title: {
      zh: "",
      en: "",
    },
    caption: {
      zh: "",
      en: "",
    },
    src: "",
  };
}

export function createEmptyProject(nextSort: number): RawProjectSource {
  return {
    slug: `project-${nextSort}`,
    status: "published",
    sort: nextSort,
    name: {
      zh: "新项目",
      en: "New Project",
    },
    role: {
      zh: "",
      en: "",
    },
    techStack: [],
    problem: {
      zh: "",
      en: "",
    },
    summary: {
      zh: "",
      en: "",
    },
    highlights: {
      zh: [],
      en: [],
    },
    screenshots: [createEmptyScreenshot()],
    codePreview: {
      filename: "",
      language: "ts",
      snippetLines: [],
    },
    links: [createEmptyContactLink()],
  };
}
