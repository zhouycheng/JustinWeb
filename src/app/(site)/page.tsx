import { HomeRevealStage } from "@/components/home/home-reveal-stage";
import { getRequestLocale } from "@/lib/i18n/server";
import { getSiteContent } from "@/lib/site/content";

export default async function Home() {
  const locale = await getRequestLocale();
  const { home } = getSiteContent(locale);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--page-background)]">
      <HomeRevealStage hero={home.hero} />
    </div>
  );
}
