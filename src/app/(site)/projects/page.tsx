import type { Metadata } from "next";

import { ProjectCard } from "@/components/site/project-card";
import { SitePageShell } from "@/components/site/site-page-shell";
import { getRequestLocale } from "@/lib/i18n/server";
import { getSiteContent } from "@/lib/site/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { projectsPage } = getSiteContent(locale);

  return {
    title: projectsPage.metadataTitle,
    description: projectsPage.metadataDescription,
  };
}

export default async function ProjectsPage() {
  const locale = await getRequestLocale();
  const { projectItems, projectsPage } = getSiteContent(locale);

  return (
    <SitePageShell
      eyebrow={projectsPage.eyebrow}
      title={projectsPage.title}
      description={projectsPage.description}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {projectItems.map((project) => (
          <ProjectCard key={project.slug} copy={projectsPage.card} project={project} />
        ))}
      </div>
    </SitePageShell>
  );
}
