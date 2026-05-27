import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import {
  externalLinkSourceSchema,
  projectSourceSchema,
  siteCopyByLocaleSchema,
  siteContentBundleSchema,
  skillSourceSchema,
  type RawExternalLinkSource,
  type RawSiteContentBundle,
  type RawProjectSource,
  type RawSiteCopyByLocale,
  type RawSkillSource,
} from "./schema";

export type SiteContentBundle = RawSiteContentBundle;

function resolveRepoRoot() {
  const cwd = process.cwd();

  if (path.basename(cwd) !== "admin") {
    return cwd;
  }

  return path.resolve(cwd, "..");
}

const repoRoot = resolveRepoRoot();
const contentRoot = path.join(repoRoot, "content");
const projectsRoot = path.join(contentRoot, "projects");

function readJsonFile(filePath: string) {
  const raw = readFileSync(filePath, "utf8");
  return JSON.parse(raw) as unknown;
}

export function readSiteCopyByLocale(): RawSiteCopyByLocale {
  const filePath = path.join(contentRoot, "site.json");
  return siteCopyByLocaleSchema.parse(readJsonFile(filePath));
}

export function readSkillSources(): RawSkillSource[] {
  const filePath = path.join(contentRoot, "skills.json");
  const parsed = readJsonFile(filePath);
  return skillSourceSchema.array().parse(parsed);
}

export function readContactLinkSources(): RawExternalLinkSource[] {
  const filePath = path.join(contentRoot, "contact.json");
  const parsed = readJsonFile(filePath);
  return externalLinkSourceSchema.array().parse(parsed);
}

export function readProjectSources(): RawProjectSource[] {
  const filenames = readdirSync(projectsRoot)
    .filter((filename) => filename.endsWith(".json"))
    .sort((left, right) => left.localeCompare(right));

  const projects = filenames.map((filename) => {
    const parsed = readJsonFile(path.join(projectsRoot, filename));
    return projectSourceSchema.parse(parsed);
  });

  return projects.sort((left, right) => left.sort - right.sort || left.slug.localeCompare(right.slug));
}

export function readSiteContentBundle(): SiteContentBundle {
  return siteContentBundleSchema.parse({
    siteCopyByLocale: readSiteCopyByLocale(),
    skillItems: readSkillSources(),
    projectItems: readProjectSources(),
    contactLinks: readContactLinkSources(),
  });
}
