import type { RawSiteContentBundle } from "@shared/content/schema";
import type { SharedLocale } from "@shared/content/types";

export const locales = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
] as const satisfies Array<{ value: SharedLocale; label: string }>;

export const sections = [
  { key: "skills", label: "技能项", description: "维护技能列表" },
  { key: "projects", label: "项目项", description: "维护项目内容" },
  { key: "contact", label: "联系方式", description: "维护联系入口" },
] as const;

export const projectTabs = [
  { key: "basic", label: "基础信息" },
  { key: "screenshots", label: "截图" },
  { key: "code", label: "代码片段" },
  { key: "links", label: "外链" },
] as const;

export type AdminSection = (typeof sections)[number]["key"];
export type ProjectTab = (typeof projectTabs)[number]["key"];

export type SaveState = {
  kind: "idle" | "saving" | "saved" | "error";
  message: string;
};

export type SaveResult =
  | {
      ok: true;
      data: RawSiteContentBundle;
      savedAt: number;
    }
  | {
      ok?: false;
      message?: string;
      issues?: Array<{ message?: string; path?: Array<string | number> }>;
    };
