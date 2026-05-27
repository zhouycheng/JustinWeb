import type { Metadata } from "next";

import { ArrowUpRightIcon, ServiceMark } from "@/components/site/site-icon";
import { SitePageShell } from "@/components/site/site-page-shell";
import { getRequestLocale } from "@/lib/i18n/server";
import { getSiteContent } from "@/lib/site/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { contactPage } = getSiteContent(locale);

  return {
    title: contactPage.metadataTitle,
    description: contactPage.metadataDescription,
  };
}

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const { contactLinks, contactPage } = getSiteContent(locale);

  return (
    <SitePageShell
      eyebrow={contactPage.eyebrow}
      title={contactPage.title}
      description={contactPage.description}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {contactLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="site-panel rounded-[28px] p-6 transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ServiceMark kind={item.kind} />
                <span className="text-[20px] font-semibold tracking-[-0.04em] text-[var(--page-heading)]">
                  {item.label}
                </span>
              </div>
              <ArrowUpRightIcon />
            </div>

            <p className="mt-5 text-[14px] leading-7 text-[var(--page-muted)]">{item.note}</p>
          </a>
        ))}
      </div>
    </SitePageShell>
  );
}
