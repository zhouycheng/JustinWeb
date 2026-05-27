import type { Metadata } from "next";

import { SitePageShell } from "@/components/site/site-page-shell";
import { getRequestLocale } from "@/lib/i18n/server";
import { getSiteContent } from "@/lib/site/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { skillsPage } = getSiteContent(locale);

  return {
    title: skillsPage.metadataTitle,
    description: skillsPage.metadataDescription,
  };
}

export default async function SkillsPage() {
  const locale = await getRequestLocale();
  const { skillItems, skillsPage } = getSiteContent(locale);

  return (
    <SitePageShell
      eyebrow={skillsPage.eyebrow}
      title={skillsPage.title}
      description={skillsPage.description}
    >
      <div className="grid gap-4">
        {skillItems.map((skill, index) => (
          <article
            key={skill.name}
            className="site-panel rounded-[28px] px-6 py-6 md:grid md:grid-cols-[96px_1fr] md:gap-6"
          >
            <div className="font-home-mono text-[13px] uppercase tracking-[0.22em] text-[var(--page-muted)]">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="mt-4 md:mt-0">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-[28px] font-semibold tracking-[-0.05em] text-[var(--page-heading)]">
                    {skill.name}
                  </h2>
                  <p className="mt-2 text-[14px] text-[var(--page-muted)]">{skill.level}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skill.topics.map((topic) => (
                    <span key={topic} className="site-chip">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-5 max-w-3xl text-[15px] leading-7 text-[var(--page-muted)]">
                {skill.note}
              </p>
            </div>
          </article>
        ))}
      </div>
    </SitePageShell>
  );
}
