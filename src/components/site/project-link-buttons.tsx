import type { ExternalLink } from "@/lib/site/content";

import { ArrowUpRightIcon, ServiceMark } from "./site-icon";

type ProjectLinkButtonsProps = {
  links: ExternalLink[];
};

export function ProjectLinkButtons({ links }: ProjectLinkButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <a
          key={`${link.kind}-${link.label}`}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="site-link-button"
          title={link.note}
        >
          <ServiceMark kind={link.kind} />
          <span>{link.label}</span>
          <ArrowUpRightIcon />
        </a>
      ))}
    </div>
  );
}
