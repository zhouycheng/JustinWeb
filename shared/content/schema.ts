import { z } from "zod";

export const localizedStringSchema = z.object({
  zh: z.string(),
  en: z.string(),
});

export const localizedStringArraySchema = z.object({
  zh: z.array(z.string()),
  en: z.array(z.string()),
});

export const metadataSchema = z.object({
  title: z.string(),
  titleTemplate: z.string(),
  description: z.string(),
});

export const navigationLabelsSchema = z.object({
  about: z.string(),
  skills: z.string(),
  projects: z.string(),
  contact: z.string(),
});

export const floatingActionsSchema = z.object({
  groupAriaLabel: z.string(),
  themeToggleLabel: z.string(),
  switchToEnglishLabel: z.string(),
  switchToChineseLabel: z.string(),
});

export const heroFacingContentSchema = z.object({
  leading: z.string(),
  accent: z.string(),
  subtitle: z.string(),
});

export const sitePageCopySchema = z.object({
  metadataTitle: z.string(),
  metadataDescription: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
});

export const projectCardCopySchema = z.object({
  badge: z.string(),
  detailAction: z.string(),
  roleLabel: z.string(),
  techStackLabel: z.string(),
  problemLabel: z.string(),
  summaryLabel: z.string(),
});

export const projectDetailCopySchema = z.object({
  notFoundTitle: z.string(),
  backToProjectsLabel: z.string(),
  eyebrow: z.string(),
  roleLabel: z.string(),
  problemLabel: z.string(),
  highlightsLabel: z.string(),
  screenshotLabel: z.string(),
  screenshotTitle: z.string(),
  screenshotHint: z.string(),
  screenIndexLabel: z.string(),
  codeLabel: z.string(),
  codeTitle: z.string(),
});

export const siteCopyByLocaleSchema = z.object({
  zh: z.object({
    metadata: metadataSchema,
    navigation: z.object({
      brandLabel: z.string(),
      avatarLabel: z.string(),
      labels: navigationLabelsSchema,
    }),
    floatingActions: floatingActionsSchema,
    home: z.object({
      hero: z.object({
        primary: heroFacingContentSchema,
        reveal: heroFacingContentSchema,
      }),
    }),
    skillsPage: sitePageCopySchema,
    projectsPage: sitePageCopySchema.extend({
      card: projectCardCopySchema,
    }),
    contactPage: sitePageCopySchema,
    projectDetail: projectDetailCopySchema,
  }),
  en: z.object({
    metadata: metadataSchema,
    navigation: z.object({
      brandLabel: z.string(),
      avatarLabel: z.string(),
      labels: navigationLabelsSchema,
    }),
    floatingActions: floatingActionsSchema,
    home: z.object({
      hero: z.object({
        primary: heroFacingContentSchema,
        reveal: heroFacingContentSchema,
      }),
    }),
    skillsPage: sitePageCopySchema,
    projectsPage: sitePageCopySchema.extend({
      card: projectCardCopySchema,
    }),
    contactPage: sitePageCopySchema,
    projectDetail: projectDetailCopySchema,
  }),
});

export const skillSourceSchema = z.object({
  name: localizedStringSchema,
  level: localizedStringSchema,
  note: localizedStringSchema,
  topics: localizedStringArraySchema,
});

export const externalLinkSourceSchema = z.object({
  label: localizedStringSchema,
  href: z.string(),
});

export const screenshotSourceSchema = z.object({
  title: localizedStringSchema,
  caption: localizedStringSchema,
  src: z.string().optional(),
});

export const codePreviewSourceSchema = z.object({
  filename: z.string(),
  language: z.string(),
  snippetLines: z.array(z.string()),
});

export const projectStatusSchema = z.enum(["published", "draft"]);

export const projectSourceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug 只能包含小写字母、数字和中划线"),
  status: projectStatusSchema,
  sort: z.number().int(),
  name: localizedStringSchema,
  role: localizedStringSchema,
  techStack: z.array(z.string()),
  problem: localizedStringSchema,
  summary: localizedStringSchema,
  highlights: localizedStringArraySchema,
  screenshots: z.array(screenshotSourceSchema),
  codePreview: codePreviewSourceSchema,
  links: z.array(externalLinkSourceSchema),
});

export const siteContentBundleSchema = z.object({
  siteCopyByLocale: siteCopyByLocaleSchema,
  skillItems: z.array(skillSourceSchema),
  projectItems: z.array(projectSourceSchema),
  contactLinks: z.array(externalLinkSourceSchema),
});

export type RawSiteCopyByLocale = z.infer<typeof siteCopyByLocaleSchema>;
export type RawSkillSource = z.infer<typeof skillSourceSchema>;
export type RawExternalLinkSource = z.infer<typeof externalLinkSourceSchema>;
export type RawProjectSource = z.infer<typeof projectSourceSchema>;
export type RawScreenshotSource = z.infer<typeof screenshotSourceSchema>;
export type RawCodePreviewSource = z.infer<typeof codePreviewSourceSchema>;
export type RawSiteContentBundle = z.infer<typeof siteContentBundleSchema>;
