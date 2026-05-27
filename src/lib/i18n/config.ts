export const supportedLocales = ["zh", "en"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "zh";
export const localeCookieName = "justinview-locale";
export const localeCookieMaxAge = 60 * 60 * 24 * 365;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "zh" || value === "en";
}

export function getHtmlLang(locale: Locale): string {
  return locale === "zh" ? "zh-CN" : "en";
}

export function getNextLocale(locale: Locale): Locale {
  return locale === "zh" ? "en" : "zh";
}
