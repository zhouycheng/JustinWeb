import "server-only";

import { cookies } from "next/headers";

import { defaultLocale, isLocale, type Locale, localeCookieName } from "./config";

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get(localeCookieName)?.value;

  return isLocale(storedLocale) ? storedLocale : defaultLocale;
}
