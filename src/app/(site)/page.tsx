import { HomeRevealStage } from "@/components/home/home-reveal-stage";
import { getRequestLocale } from "@/lib/i18n/server";
import { getSiteContent } from "@/lib/site/content";

export default async function Home() {
  const locale = await getRequestLocale();
  const { home } = getSiteContent(locale);

  return (
    <div className="snap-container relative flex flex-col overflow-y-auto overflow-x-hidden bg-[var(--page-background)] snap-y snap-mandatory h-screen">
      {/* Section 1: About */}
      <section id="about" className="relative flex min-h-screen flex-col snap-start snap-always">
        <HomeRevealStage hero={home.hero} />
      </section>

      {/* Section 2: Skills */}
      <section id="skills" className="relative flex min-h-screen flex-col items-center justify-center snap-start snap-always bg-[var(--page-background)]">
        <div className="max-w-4xl px-6 text-center">
          <h2 className="font-home-system text-5xl font-bold tracking-tight text-[var(--page-heading)] md:text-6xl">
            {locale === "zh" ? "技能" : "Skills"}
          </h2>
          <p className="mt-6 text-lg text-[var(--page-muted)]">
            {locale === "zh" ? "技能内容即将推出..." : "Skills content coming soon..."}
          </p>
        </div>
      </section>

      {/* Section 3: Projects */}
      <section id="projects" className="relative flex min-h-screen flex-col items-center justify-center snap-start snap-always bg-[var(--page-background)]">
        <div className="max-w-4xl px-6 text-center">
          <h2 className="font-home-system text-5xl font-bold tracking-tight text-[var(--page-heading)] md:text-6xl">
            {locale === "zh" ? "项目" : "Projects"}
          </h2>
          <p className="mt-6 text-lg text-[var(--page-muted)]">
            {locale === "zh" ? "项目内容即将推出..." : "Projects content coming soon..."}
          </p>
        </div>
      </section>

      {/* Section 4: Articles */}
      <section id="articles" className="relative flex min-h-screen flex-col items-center justify-center snap-start snap-always bg-[var(--page-background)]">
        <div className="max-w-4xl px-6 text-center">
          <h2 className="font-home-system text-5xl font-bold tracking-tight text-[var(--page-heading)] md:text-6xl">
            {locale === "zh" ? "文稿" : "Articles"}
          </h2>
          <p className="mt-6 text-lg text-[var(--page-muted)]">
            {locale === "zh" ? "文稿内容即将推出..." : "Articles content coming soon..."}
          </p>
        </div>
      </section>
    </div>
  );
}
