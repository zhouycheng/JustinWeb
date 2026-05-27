import Link from "next/link";

import type { ProjectCardCopy, ProjectItem } from "@/lib/site/content";

type ProjectCardProps = {
  copy: ProjectCardCopy;
  project: ProjectItem;
};

export function ProjectCard({ copy, project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <article className="site-panel h-full p-6 transition-transform duration-200 group-hover:-translate-y-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-home-mono text-[12px] uppercase tracking-[0.22em] text-[var(--page-muted)]">
              {copy.badge}
            </p>
            <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.04em] text-[var(--page-heading)]">
              {project.name}
            </h2>
          </div>

          <span className="site-card-action rounded-full px-3 py-1 text-[12px] text-[var(--page-muted)]">
            {copy.detailAction}
          </span>
        </div>

        <div className="mt-6 space-y-4 text-[14px] leading-7 text-[var(--page-muted)]">
          <div>
            <p className="site-label">{copy.roleLabel}</p>
            <p>{project.role}</p>
          </div>

          <div>
            <p className="site-label">{copy.techStackLabel}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.techStack.map((item) => (
                <span key={item} className="site-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="site-label">{copy.problemLabel}</p>
            <p>{project.problem}</p>
          </div>

          <div>
            <p className="site-label">{copy.summaryLabel}</p>
            <p>{project.summary}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
