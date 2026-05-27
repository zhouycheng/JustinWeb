import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectLinkButtons } from "@/components/site/project-link-buttons";
import { ArrowLeftIcon } from "@/components/site/site-icon";
import { getRequestLocale } from "@/lib/i18n/server";
import { getProjectBySlug, getSiteContent } from "@/lib/site/content";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getSiteContent("zh").projectItems.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getRequestLocale()]);
  const { projectDetail } = getSiteContent(locale);
  const project = getProjectBySlug(locale, slug);

  if (!project) {
    return {
      title: projectDetail.notFoundTitle,
    };
  }

  return {
    title: project.name,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const [{ slug }, locale] = await Promise.all([params, getRequestLocale()]);
  const { projectDetail } = getSiteContent(locale);
  const project = getProjectBySlug(locale, slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--page-background)] px-6 pb-20 pt-10 md:px-10 lg:px-12">
      <main className="site-readable mx-auto max-w-6xl">
        <Link
          href="/projects"
          className="site-detail-back-link inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] text-[var(--page-muted)]"
        >
          <ArrowLeftIcon />
          <span>{projectDetail.backToProjectsLabel}</span>
        </Link>

        <section className="mt-8 border-b border-[var(--page-line)] pb-10">
          <p className="font-home-mono text-[12px] uppercase tracking-[0.24em] text-[var(--page-muted)]">
            {projectDetail.eyebrow}
          </p>
          <h1 className="mt-4 font-home-mono text-[40px] font-semibold tracking-[-0.06em] text-[var(--page-heading)] md:text-[56px]">
            {project.name}
          </h1>
          <p className="mt-4 max-w-3xl text-[16px] leading-8 text-[var(--page-muted)]">
            {project.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map((item) => (
              <span key={item} className="site-chip">
                {item}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <ProjectLinkButtons links={project.links} />
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="site-panel rounded-[28px] p-6">
            <p className="site-label">{projectDetail.roleLabel}</p>
            <p className="text-[15px] leading-8 text-[var(--page-muted)]">{project.role}</p>

            <p className="site-label mt-7">{projectDetail.problemLabel}</p>
            <p className="text-[15px] leading-8 text-[var(--page-muted)]">{project.problem}</p>
          </article>

          <article className="site-panel rounded-[28px] p-6">
            <p className="site-label">{projectDetail.highlightsLabel}</p>
            <ul className="space-y-4 text-[15px] leading-8 text-[var(--page-muted)]">
              {project.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.75rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--page-accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="site-label">{projectDetail.screenshotLabel}</p>
              <h2 className="text-[28px] font-semibold tracking-[-0.05em] text-[var(--page-heading)]">
                {projectDetail.screenshotTitle}
              </h2>
            </div>
            <p className="text-[13px] text-[var(--page-muted)]">{projectDetail.screenshotHint}</p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {project.screenshots.map((shot, index) => (
              <article key={shot.title} className="space-y-3">
                <div className="site-shot-surface aspect-[4/3] p-5">
                  <div className="flex h-full flex-col justify-between">
                    <span className="font-home-mono text-[12px] uppercase tracking-[0.2em] text-[var(--page-muted)]">
                      {projectDetail.screenIndexLabel} {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[24px] font-semibold tracking-[-0.05em] text-[var(--page-heading)]">
                        {shot.title}
                      </h3>
                      <p className="mt-2 max-w-[18rem] text-[14px] leading-7 text-[var(--page-muted)]">
                        {shot.caption}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="site-label">{projectDetail.codeLabel}</p>
              <h2 className="text-[28px] font-semibold tracking-[-0.05em] text-[var(--page-heading)]">
                {projectDetail.codeTitle}
              </h2>
            </div>
            <p className="text-[13px] text-[var(--page-muted)]">{project.codePreview.language}</p>
          </div>

          <div className="site-code-window mt-5">
            <div className="flex items-center justify-between border-b border-[var(--page-code-divider)] px-5 py-4">
              <span className="font-home-mono text-[12px] uppercase tracking-[0.18em] text-[var(--page-code-muted)]">
                {project.codePreview.filename}
              </span>
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-[var(--page-code-dot-1)]" />
                <span className="h-3 w-3 rounded-full bg-[var(--page-code-dot-2)]" />
                <span className="h-3 w-3 rounded-full bg-[var(--page-code-dot-3)]" />
              </div>
            </div>

            <pre className="px-5 py-5 text-[13px] leading-7 text-[var(--page-code-foreground)]">
              <code>{project.codePreview.snippet}</code>
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
}
