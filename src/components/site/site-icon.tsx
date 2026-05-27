import type { LinkKind } from "@/lib/site/content";

type ServiceMarkProps = {
  kind: LinkKind;
};

const serviceMarks: Record<LinkKind, string> = {
  github: "GH",
  gitee: "GI",
  juejin: "掘",
  mail: "@",
};

export function ServiceMark({ kind }: ServiceMarkProps) {
  return <span className="site-service-mark">{serviceMarks[kind]}</span>;
}

export function ArrowLeftIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <path
        d="M11.5 4.5L6 10l5.5 5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M6.5 10H15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <path
        d="M6.5 13.5L13.5 6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M8 6.5h5.5V12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
