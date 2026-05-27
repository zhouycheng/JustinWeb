import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import {
  siteContentBundleSchema,
  type RawProjectSource,
  type RawSiteContentBundle,
} from "@shared/content/schema";

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

function formatJson(value: unknown) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function normalizeProjects(projectItems: RawProjectSource[]) {
  return [...projectItems].sort(
    (left, right) => left.sort - right.sort || left.slug.localeCompare(right.slug)
  );
}

function assertUniqueProjectSlugs(projectItems: RawProjectSource[]) {
  const seen = new Set<string>();

  for (const project of projectItems) {
    if (seen.has(project.slug)) {
      throw new Error(`存在重复的项目 slug：${project.slug}`);
    }

    seen.add(project.slug);
  }
}

async function writeJsonFile(filePath: string, value: unknown) {
  await fs.writeFile(filePath, formatJson(value), "utf8");
}

export async function saveSiteContentBundle(input: unknown): Promise<RawSiteContentBundle> {
  const parsed = siteContentBundleSchema.parse(input);
  const normalizedProjects = normalizeProjects(parsed.projectItems);

  assertUniqueProjectSlugs(normalizedProjects);

  await fs.mkdir(projectsRoot, { recursive: true });

  await Promise.all([
    writeJsonFile(path.join(contentRoot, "site.json"), parsed.siteCopyByLocale),
    writeJsonFile(path.join(contentRoot, "skills.json"), parsed.skillItems),
    writeJsonFile(path.join(contentRoot, "contact.json"), parsed.contactLinks),
  ]);

  const desiredProjectFilenames = new Set(
    normalizedProjects.map((project) => `${project.slug}.json`)
  );

  const existingProjectFilenames = (await fs.readdir(projectsRoot)).filter((filename) =>
    filename.endsWith(".json")
  );

  await Promise.all(
    normalizedProjects.map((project) =>
      writeJsonFile(path.join(projectsRoot, `${project.slug}.json`), project)
    )
  );

  await Promise.all(
    existingProjectFilenames
      .filter((filename) => !desiredProjectFilenames.has(filename))
      .map((filename) => fs.unlink(path.join(projectsRoot, filename)))
  );

  return {
    ...parsed,
    projectItems: normalizedProjects,
  };
}
