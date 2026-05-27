export const sharedLocales = ["zh", "en"] as const;

export type SharedLocale = (typeof sharedLocales)[number];

export type LocalizedValue<T> = Record<SharedLocale, T>;

export type HeroFacingVariant = "primary" | "reveal";

export type ProjectStatus = "published" | "draft";
