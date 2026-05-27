"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import type { RawProjectSource, RawSiteContentBundle } from "@shared/content/schema";
import type { SharedLocale } from "@shared/content/types";
import {
  createEmptyContactLink,
  createEmptyProject,
  createEmptyScreenshot,
  createEmptySkill,
  slugify,
} from "@admin/lib/client/defaults";

const locales = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
] as const satisfies Array<{ value: SharedLocale; label: string }>;

const sections = [
  { key: "skills", label: "技能项", description: "维护技能列表" },
  { key: "projects", label: "项目项", description: "维护项目内容" },
  { key: "contact", label: "联系方式", description: "维护联系入口" },
] as const;

const projectTabs = [
  { key: "basic", label: "基础信息" },
  { key: "screenshots", label: "截图" },
  { key: "code", label: "代码片段" },
  { key: "links", label: "外链" },
] as const;

type AdminSection = (typeof sections)[number]["key"];
type ProjectTab = (typeof projectTabs)[number]["key"];

type SaveState = {
  kind: "idle" | "saving" | "saved" | "error";
  message: string;
};

type SaveResult =
  | {
      ok: true;
      data: RawSiteContentBundle;
      savedAt: number;
    }
  | {
      ok?: false;
      message?: string;
      issues?: Array<{ message?: string; path?: Array<string | number> }>;
    };

type AdminWorkspaceProps = {
  initialData: RawSiteContentBundle;
};

function cloneBundle(bundle: RawSiteContentBundle) {
  return structuredClone(bundle);
}

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(items: string[]) {
  return items.join("\n");
}

function clampIndex(index: number, length: number) {
  if (length <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), length - 1);
}

function normalizeProjectSorts(projects: RawProjectSource[]) {
  projects.forEach((project, index) => {
    project.sort = (index + 1) * 10;
  });
}

function getProjectDisplayName(project: RawProjectSource, locale: SharedLocale) {
  return project.name[locale].trim() || project.name.zh.trim() || project.slug;
}

function getLocalizedLabel(value: Record<SharedLocale, string>, locale: SharedLocale) {
  return value[locale].trim() || value.zh.trim() || value.en.trim();
}

function CountBadge({ value }: { value: number | string }) {
  return (
    <span className="rounded-full border border-[var(--page-line)] px-2.5 py-1 text-[11px] text-[var(--page-muted)]">
      {value}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[13px] font-medium text-[var(--page-heading)]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="admin-input rounded-[12px] px-3 py-2.5 text-[14px]"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[13px] font-medium text-[var(--page-heading)]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="admin-textarea rounded-[12px] px-3 py-2.5 text-[14px] leading-7"
      />
    </label>
  );
}

function StatusBanner({ state }: { state: SaveState }) {
  const className =
    state.kind === "error"
      ? "border-[#7f1d1d] bg-[#2a1111] text-[#fecaca]"
      : state.kind === "saved"
        ? "border-[#1f4d32] bg-[#12271a] text-[#bbf7d0]"
        : "border-[var(--page-line)] bg-[var(--page-surface)] text-[var(--page-foreground)]";

  return (
    <div className={cx("rounded-[12px] border px-3 py-2.5 text-[13px] leading-6", className)}>
      {state.message}
    </div>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="admin-panel rounded-[18px] px-6 py-12 text-center">
      <p className="text-[16px] font-medium text-[var(--page-heading)]">{title}</p>
      <p className="mt-2 text-[13px] leading-6 text-[var(--page-muted)]">{description}</p>
      <button type="button" onClick={onAction} className="admin-button mt-5 px-4 py-2 text-[13px]">
        {actionLabel}
      </button>
    </div>
  );
}

function Panel({
  title,
  children,
  extra,
}: {
  title: string;
  children: ReactNode;
  extra?: ReactNode;
}) {
  return (
    <section className="admin-panel rounded-[18px] p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[16px] font-semibold text-[var(--page-heading)]">{title}</h3>
        {extra}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function ActionRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

function ListButton({
  active,
  title,
  subtitle,
  meta,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full rounded-[14px] border px-3 py-3 text-left transition",
        active
          ? "border-[var(--page-heading)] bg-[var(--page-surface)]"
          : "border-[var(--page-line)] bg-transparent hover:bg-[var(--page-surface)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium text-[var(--page-heading)]">{title}</p>
          {subtitle ? (
            <p className="mt-1 truncate text-[12px] text-[var(--page-muted)]">{subtitle}</p>
          ) : null}
        </div>
        {meta}
      </div>
    </button>
  );
}

function SectionButton({
  active,
  label,
  description,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full rounded-[14px] border px-3 py-3 text-left transition",
        active
          ? "border-[var(--page-heading)] bg-[var(--page-surface)]"
          : "border-[var(--page-line)] bg-transparent hover:bg-[var(--page-surface)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[14px] font-medium text-[var(--page-heading)]">{label}</p>
          <p className="mt-1 text-[12px] text-[var(--page-muted)]">{description}</p>
        </div>
        <CountBadge value={count} />
      </div>
    </button>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-full px-3 py-2 text-[13px] transition",
        active
          ? "bg-[var(--page-heading)] text-[var(--page-background)]"
          : "border border-[var(--page-line)] text-[var(--page-muted)] hover:bg-[var(--page-surface)]"
      )}
    >
      {label}
    </button>
  );
}

function SegmentButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-[10px] px-3 py-2 text-[13px] transition",
        active
          ? "bg-[var(--page-heading)] text-[var(--page-background)]"
          : "text-[var(--page-muted)] hover:bg-[var(--page-surface)]"
      )}
    >
      {label}
    </button>
  );
}

function MetaCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[14px] border border-[var(--page-line)] px-3 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--page-muted)]">{label}</p>
      <p className="mt-2 truncate text-[14px] font-medium text-[var(--page-heading)]">{value}</p>
    </div>
  );
}

export function AdminWorkspace({ initialData }: AdminWorkspaceProps) {
  const [bundle, setBundle] = useState<RawSiteContentBundle>(() => cloneBundle(initialData));
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initialData));
  const [saveState, setSaveState] = useState<SaveState>({
    kind: "idle",
    message: "这里只维护技能项、项目项和联系方式。保存后会直接写回 content/。",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("projects");
  const [locale, setLocale] = useState<SharedLocale>("zh");
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);
  const [selectedContactIndex, setSelectedContactIndex] = useState(0);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(
    initialData.projectItems[0]?.slug ?? null
  );
  const [projectTab, setProjectTab] = useState<ProjectTab>("basic");
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0);
  const [selectedProjectLinkIndex, setSelectedProjectLinkIndex] = useState(0);

  const isDirty = JSON.stringify(bundle) !== savedSnapshot;
  const selectedSkill = bundle.skillItems[selectedSkillIndex] ?? null;
  const selectedContact = bundle.contactLinks[selectedContactIndex] ?? null;
  const selectedProject =
    bundle.projectItems.find((project) => project.slug === selectedProjectSlug) ??
    bundle.projectItems[0] ??
    null;

  const screenshots = selectedProject?.screenshots ?? [];
  const safeScreenshotIndex = clampIndex(selectedScreenshotIndex, screenshots.length);
  const selectedScreenshot = screenshots[safeScreenshotIndex] ?? null;

  const projectLinks = selectedProject?.links ?? [];
  const safeProjectLinkIndex = clampIndex(selectedProjectLinkIndex, projectLinks.length);
  const selectedProjectLink = projectLinks[safeProjectLinkIndex] ?? null;

  function markDirty() {
    setSaveState((current) =>
      current.kind === "saving"
        ? current
        : {
            kind: "idle",
            message: "有未保存修改。",
          }
    );
  }

  function patchBundle(mutator: (draft: RawSiteContentBundle) => void) {
    setBundle((current) => {
      const next = cloneBundle(current);
      mutator(next);
      return next;
    });
    markDirty();
  }

  function patchSelectedProject(mutator: (project: RawProjectSource) => void) {
    const slug = selectedProject?.slug;
    if (!slug) {
      return;
    }

    patchBundle((draft) => {
      const project = draft.projectItems.find((item) => item.slug === slug);
      if (!project) {
        return;
      }

      mutator(project);
    });
  }

  function selectProject(slug: string | null) {
    setSelectedProjectSlug(slug);
    setProjectTab("basic");
    setSelectedScreenshotIndex(0);
    setSelectedProjectLinkIndex(0);
  }

  async function reloadFromDisk() {
    try {
      const response = await fetch("/api/content", {
        cache: "no-store",
      });
      const data = (await response.json()) as RawSiteContentBundle;
      const nextProjectSlug = data.projectItems.find((project) => project.slug === selectedProjectSlug)?.slug
        ?? data.projectItems[0]?.slug
        ?? null;

      setBundle(data);
      setSavedSnapshot(JSON.stringify(data));
      setSelectedSkillIndex((current) => clampIndex(current, data.skillItems.length));
      setSelectedContactIndex((current) => clampIndex(current, data.contactLinks.length));
      selectProject(nextProjectSlug);
      setSaveState({
        kind: "saved",
        message: "已重新加载本地内容。",
      });
    } catch (error) {
      setSaveState({
        kind: "error",
        message: error instanceof Error ? error.message : "重新加载失败。",
      });
    }
  }

  async function saveBundle() {
    setIsSaving(true);
    setSaveState({
      kind: "saving",
      message: "正在保存...",
    });

    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bundle),
      });

      const payload = (await response.json()) as SaveResult;

      if (!response.ok || !("ok" in payload && payload.ok)) {
        const failedPayload =
          "ok" in payload && payload.ok
            ? { message: "保存失败。" }
            : payload;
        const issueMessage = failedPayload.issues?.[0]
          ? `${failedPayload.issues[0].path?.join(".") ?? "字段"}：${failedPayload.issues[0].message ?? "校验失败"}`
          : failedPayload.message ?? "保存失败。";

        setSaveState({
          kind: "error",
          message: issueMessage,
        });
        return;
      }

      const nextProjectSlug =
        payload.data.projectItems.find((project) => project.slug === selectedProjectSlug)?.slug ??
        payload.data.projectItems[0]?.slug ??
        null;

      setBundle(payload.data);
      setSavedSnapshot(JSON.stringify(payload.data));
      setSelectedSkillIndex((current) => clampIndex(current, payload.data.skillItems.length));
      setSelectedContactIndex((current) => clampIndex(current, payload.data.contactLinks.length));
      selectProject(nextProjectSlug);
      setSaveState({
        kind: "saved",
        message: `已保存 ${new Date(payload.savedAt).toLocaleTimeString("zh-CN")}`,
      });
    } catch (error) {
      setSaveState({
        kind: "error",
        message: error instanceof Error ? error.message : "保存失败。",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function addSkill() {
    const nextIndex = bundle.skillItems.length;
    patchBundle((draft) => {
      draft.skillItems.push(createEmptySkill());
    });
    setSelectedSkillIndex(nextIndex);
  }

  function removeSkill(index: number) {
    if (!window.confirm("确认删除这个技能项吗？")) {
      return;
    }

    patchBundle((draft) => {
      draft.skillItems.splice(index, 1);
    });
    setSelectedSkillIndex((current) => clampIndex(Math.min(current, index), bundle.skillItems.length - 1));
  }

  function moveSkill(direction: -1 | 1) {
    const targetIndex = selectedSkillIndex + direction;
    if (targetIndex < 0 || targetIndex >= bundle.skillItems.length) {
      return;
    }

    patchBundle((draft) => {
      const current = draft.skillItems[selectedSkillIndex];
      draft.skillItems[selectedSkillIndex] = draft.skillItems[targetIndex];
      draft.skillItems[targetIndex] = current;
    });
    setSelectedSkillIndex(targetIndex);
  }

  function addContact() {
    const nextIndex = bundle.contactLinks.length;
    patchBundle((draft) => {
      draft.contactLinks.push(createEmptyContactLink());
    });
    setSelectedContactIndex(nextIndex);
  }

  function removeContact(index: number) {
    if (!window.confirm("确认删除这个联系方式吗？")) {
      return;
    }

    patchBundle((draft) => {
      draft.contactLinks.splice(index, 1);
    });
    setSelectedContactIndex((current) =>
      clampIndex(Math.min(current, index), bundle.contactLinks.length - 1)
    );
  }

  function moveContact(direction: -1 | 1) {
    const targetIndex = selectedContactIndex + direction;
    if (targetIndex < 0 || targetIndex >= bundle.contactLinks.length) {
      return;
    }

    patchBundle((draft) => {
      const current = draft.contactLinks[selectedContactIndex];
      draft.contactLinks[selectedContactIndex] = draft.contactLinks[targetIndex];
      draft.contactLinks[targetIndex] = current;
    });
    setSelectedContactIndex(targetIndex);
  }

  function addProject() {
    const nextSort =
      bundle.projectItems.reduce((max, project) => Math.max(max, project.sort), 0) + 10;
    const nextProject = createEmptyProject(nextSort);

    patchBundle((draft) => {
      draft.projectItems.push(nextProject);
      normalizeProjectSorts(draft.projectItems);
    });
    selectProject(nextProject.slug);
  }

  function removeProject(slug: string) {
    if (
      !window.confirm("确认删除这个项目吗？保存后对应的 content/projects/*.json 文件也会被移除。")
    ) {
      return;
    }

    patchBundle((draft) => {
      draft.projectItems = draft.projectItems.filter((project) => project.slug !== slug);
      normalizeProjectSorts(draft.projectItems);
    });

    const nextProject = bundle.projectItems.find((project) => project.slug !== slug);
    selectProject(nextProject?.slug ?? null);
  }

  function moveProject(direction: -1 | 1) {
    const currentIndex = bundle.projectItems.findIndex((project) => project.slug === selectedProject?.slug);
    const targetIndex = currentIndex + direction;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= bundle.projectItems.length) {
      return;
    }

    patchBundle((draft) => {
      const current = draft.projectItems[currentIndex];
      draft.projectItems[currentIndex] = draft.projectItems[targetIndex];
      draft.projectItems[targetIndex] = current;
      normalizeProjectSorts(draft.projectItems);
    });
  }

  function addScreenshot() {
    patchSelectedProject((target) => {
      target.screenshots.push(createEmptyScreenshot());
    });
    setSelectedScreenshotIndex(screenshots.length);
  }

  function removeScreenshot(index: number) {
    patchSelectedProject((target) => {
      target.screenshots.splice(index, 1);
    });
    setSelectedScreenshotIndex((current) =>
      clampIndex(Math.min(current, index), screenshots.length - 1)
    );
  }

  function moveScreenshot(direction: -1 | 1) {
    const targetIndex = safeScreenshotIndex + direction;
    if (targetIndex < 0 || targetIndex >= screenshots.length) {
      return;
    }

    patchSelectedProject((target) => {
      const current = target.screenshots[safeScreenshotIndex];
      target.screenshots[safeScreenshotIndex] = target.screenshots[targetIndex];
      target.screenshots[targetIndex] = current;
    });
    setSelectedScreenshotIndex(targetIndex);
  }

  function addProjectLink() {
    patchSelectedProject((target) => {
      target.links.push(createEmptyContactLink());
    });
    setSelectedProjectLinkIndex(projectLinks.length);
  }

  function removeProjectLink(index: number) {
    patchSelectedProject((target) => {
      target.links.splice(index, 1);
    });
    setSelectedProjectLinkIndex((current) =>
      clampIndex(Math.min(current, index), projectLinks.length - 1)
    );
  }

  function moveProjectLink(direction: -1 | 1) {
    const targetIndex = safeProjectLinkIndex + direction;
    if (targetIndex < 0 || targetIndex >= projectLinks.length) {
      return;
    }

    patchSelectedProject((target) => {
      const current = target.links[safeProjectLinkIndex];
      target.links[safeProjectLinkIndex] = target.links[targetIndex];
      target.links[targetIndex] = current;
    });
    setSelectedProjectLinkIndex(targetIndex);
  }

  function renderSkills() {
    return (
      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <Panel
          title="技能列表"
          extra={
            <button type="button" onClick={addSkill} className="admin-button px-3 py-2 text-[13px]">
              新增技能
            </button>
          }
        >
          <div className="space-y-2">
            {bundle.skillItems.map((skill, index) => (
              <ListButton
                key={`${skill.name.zh}-${skill.name.en}-${index}`}
                active={index === selectedSkillIndex}
                title={getLocalizedLabel(skill.name, locale) || `Skill ${index + 1}`}
                subtitle={getLocalizedLabel(skill.level, locale) || "未填写"}
                meta={<CountBadge value={index + 1} />}
                onClick={() => setSelectedSkillIndex(index)}
              />
            ))}
          </div>
        </Panel>

        {selectedSkill ? (
          <div className="space-y-4">
            <Panel
              title={getLocalizedLabel(selectedSkill.name, locale) || "技能内容"}
              extra={
                <ActionRow>
                  <button
                    type="button"
                    onClick={() => moveSkill(-1)}
                    disabled={selectedSkillIndex === 0}
                    className="admin-button admin-button-secondary px-3 py-2 text-[13px] disabled:opacity-40"
                  >
                    上移
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSkill(1)}
                    disabled={selectedSkillIndex >= bundle.skillItems.length - 1}
                    className="admin-button admin-button-secondary px-3 py-2 text-[13px] disabled:opacity-40"
                  >
                    下移
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSkill(selectedSkillIndex)}
                    className="admin-button admin-button-secondary px-3 py-2 text-[13px]"
                  >
                    删除
                  </button>
                </ActionRow>
              }
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <Field
                  label="名称"
                  value={selectedSkill.name[locale]}
                  onChange={(value) =>
                    patchBundle((draft) => {
                      draft.skillItems[selectedSkillIndex].name[locale] = value;
                    })
                  }
                />
                <Field
                  label="级别 / 定位"
                  value={selectedSkill.level[locale]}
                  onChange={(value) =>
                    patchBundle((draft) => {
                      draft.skillItems[selectedSkillIndex].level[locale] = value;
                    })
                  }
                />
              </div>

              <TextAreaField
                label="说明"
                value={selectedSkill.note[locale]}
                rows={5}
                onChange={(value) =>
                  patchBundle((draft) => {
                    draft.skillItems[selectedSkillIndex].note[locale] = value;
                  })
                }
              />

              <TextAreaField
                label="关键词"
                value={joinLines(selectedSkill.topics[locale])}
                rows={8}
                placeholder="每行一个关键词"
                onChange={(value) =>
                  patchBundle((draft) => {
                    draft.skillItems[selectedSkillIndex].topics[locale] = splitLines(value);
                  })
                }
              />
            </Panel>
          </div>
        ) : (
          <EmptyState
            title="还没有技能项"
            description="先新增一个技能项，再开始填写具体内容。"
            actionLabel="新增技能项"
            onAction={addSkill}
          />
        )}
      </div>
    );
  }

  function renderProjectBasicTab(project: RawProjectSource) {
    return (
      <Panel title="基础信息">
        <div className="grid gap-3 lg:grid-cols-3">
          <MetaCard label="Slug" value={project.slug} />
          <MetaCard label="截图数" value={String(project.screenshots.length)} />
          <MetaCard label="外链数" value={String(project.links.length)} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_150px]">
          <Field
            label="Slug"
            value={project.slug}
            onChange={(value) => {
              const previousSlug = project.slug;
              patchBundle((draft) => {
                const target = draft.projectItems.find((item) => item.slug === previousSlug);
                if (!target) {
                  return;
                }

                target.slug = value;
              });
              selectProject(value);
            }}
          />
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                const nextSlug = slugify(project.name.en || project.name.zh);
                const previousSlug = project.slug;
                patchBundle((draft) => {
                  const target = draft.projectItems.find((item) => item.slug === previousSlug);
                  if (!target) {
                    return;
                  }

                  target.slug = nextSlug;
                });
                selectProject(nextSlug);
              }}
              className="admin-button admin-button-secondary w-full px-3 py-2.5 text-[13px]"
            >
              自动生成
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="项目名"
            value={project.name[locale]}
            onChange={(value) =>
              patchSelectedProject((target) => {
                target.name[locale] = value;
              })
            }
          />
          <TextAreaField
            label="角色"
            value={project.role[locale]}
            rows={4}
            onChange={(value) =>
              patchSelectedProject((target) => {
                target.role[locale] = value;
              })
            }
          />
        </div>

        <TextAreaField
          label="技术栈"
          value={joinLines(project.techStack)}
          rows={4}
          placeholder="每行一个技术项"
          onChange={(value) =>
            patchSelectedProject((target) => {
              target.techStack = splitLines(value);
            })
          }
        />

        <TextAreaField
          label="问题背景"
          value={project.problem[locale]}
          rows={4}
          onChange={(value) =>
            patchSelectedProject((target) => {
              target.problem[locale] = value;
            })
          }
        />

        <TextAreaField
          label="项目简介"
          value={project.summary[locale]}
          rows={5}
          onChange={(value) =>
            patchSelectedProject((target) => {
              target.summary[locale] = value;
            })
          }
        />

        <TextAreaField
          label="亮点"
          value={joinLines(project.highlights[locale])}
          rows={7}
          placeholder="每行一条"
          onChange={(value) =>
            patchSelectedProject((target) => {
              target.highlights[locale] = splitLines(value);
            })
          }
        />
      </Panel>
    );
  }

  function renderProjectScreenshotsTab(project: RawProjectSource) {
    return (
      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <Panel
          title="截图列表"
          extra={
            <button type="button" onClick={addScreenshot} className="admin-button px-3 py-2 text-[13px]">
              新增截图
            </button>
          }
        >
          <div className="space-y-2">
            {project.screenshots.map((shot, index) => (
              <ListButton
                key={`${project.slug}-shot-${index}`}
                active={index === safeScreenshotIndex}
                title={getLocalizedLabel(shot.title, locale) || `Screenshot ${index + 1}`}
                subtitle={shot.src || getLocalizedLabel(shot.caption, locale) || "未填写"}
                meta={<CountBadge value={index + 1} />}
                onClick={() => setSelectedScreenshotIndex(index)}
              />
            ))}
          </div>
        </Panel>

        {selectedScreenshot ? (
          <Panel
            title={getLocalizedLabel(selectedScreenshot.title, locale) || "截图内容"}
            extra={
              <ActionRow>
                <button
                  type="button"
                  onClick={() => moveScreenshot(-1)}
                  disabled={safeScreenshotIndex === 0}
                  className="admin-button admin-button-secondary px-3 py-2 text-[13px] disabled:opacity-40"
                >
                  上移
                </button>
                <button
                  type="button"
                  onClick={() => moveScreenshot(1)}
                  disabled={safeScreenshotIndex >= screenshots.length - 1}
                  className="admin-button admin-button-secondary px-3 py-2 text-[13px] disabled:opacity-40"
                >
                  下移
                </button>
                <button
                  type="button"
                  onClick={() => removeScreenshot(safeScreenshotIndex)}
                  className="admin-button admin-button-secondary px-3 py-2 text-[13px]"
                >
                  删除
                </button>
              </ActionRow>
            }
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Field
                label="标题"
                value={selectedScreenshot.title[locale]}
                onChange={(value) =>
                  patchSelectedProject((target) => {
                    target.screenshots[safeScreenshotIndex].title[locale] = value;
                  })
                }
              />
              <Field
                label="图片地址"
                value={selectedScreenshot.src ?? ""}
                onChange={(value) =>
                  patchSelectedProject((target) => {
                    const normalized = value.trim();
                    target.screenshots[safeScreenshotIndex].src = normalized || undefined;
                  })
                }
              />
            </div>

            <TextAreaField
              label="说明"
              value={selectedScreenshot.caption[locale]}
              rows={6}
              onChange={(value) =>
                patchSelectedProject((target) => {
                  target.screenshots[safeScreenshotIndex].caption[locale] = value;
                })
              }
            />
          </Panel>
        ) : (
          <EmptyState
            title="还没有截图"
            description="先新增一个截图项，再补充标题、地址和说明。"
            actionLabel="新增截图"
            onAction={addScreenshot}
          />
        )}
      </div>
    );
  }

  function renderProjectCodeTab(project: RawProjectSource) {
    return (
      <Panel title="代码片段">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="文件名"
            value={project.codePreview.filename}
            onChange={(value) =>
              patchSelectedProject((target) => {
                target.codePreview.filename = value;
              })
            }
          />
          <Field
            label="语言"
            value={project.codePreview.language}
            onChange={(value) =>
              patchSelectedProject((target) => {
                target.codePreview.language = value;
              })
            }
          />
        </div>

        <TextAreaField
          label="代码"
          value={project.codePreview.snippetLines.join("\n")}
          rows={16}
          onChange={(value) =>
            patchSelectedProject((target) => {
              target.codePreview.snippetLines = value.split("\n");
            })
          }
        />
      </Panel>
    );
  }

  function renderProjectLinksTab(project: RawProjectSource) {
    return (
      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <Panel
          title="外链列表"
          extra={
            <button type="button" onClick={addProjectLink} className="admin-button px-3 py-2 text-[13px]">
              新增外链
            </button>
          }
        >
          <div className="space-y-2">
            {project.links.map((link, index) => (
              <ListButton
                key={`${project.slug}-link-${index}`}
                active={index === safeProjectLinkIndex}
                title={getLocalizedLabel(link.label, locale) || `Link ${index + 1}`}
                subtitle={link.href || "未填写"}
                meta={<CountBadge value={index + 1} />}
                onClick={() => setSelectedProjectLinkIndex(index)}
              />
            ))}
          </div>
        </Panel>

        {selectedProjectLink ? (
          <Panel
            title={getLocalizedLabel(selectedProjectLink.label, locale) || "外链内容"}
            extra={
              <ActionRow>
                <button
                  type="button"
                  onClick={() => moveProjectLink(-1)}
                  disabled={safeProjectLinkIndex === 0}
                  className="admin-button admin-button-secondary px-3 py-2 text-[13px] disabled:opacity-40"
                >
                  上移
                </button>
                <button
                  type="button"
                  onClick={() => moveProjectLink(1)}
                  disabled={safeProjectLinkIndex >= projectLinks.length - 1}
                  className="admin-button admin-button-secondary px-3 py-2 text-[13px] disabled:opacity-40"
                >
                  下移
                </button>
                <button
                  type="button"
                  onClick={() => removeProjectLink(safeProjectLinkIndex)}
                  className="admin-button admin-button-secondary px-3 py-2 text-[13px]"
                >
                  删除
                </button>
              </ActionRow>
            }
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Field
                label="名称"
                value={selectedProjectLink.label[locale]}
                onChange={(value) =>
                  patchSelectedProject((target) => {
                    target.links[safeProjectLinkIndex].label[locale] = value;
                  })
                }
              />
              <Field
                label="链接"
                value={selectedProjectLink.href}
                onChange={(value) =>
                  patchSelectedProject((target) => {
                    target.links[safeProjectLinkIndex].href = value;
                  })
                }
              />
            </div>
          </Panel>
        ) : (
          <EmptyState
            title="还没有外链"
            description="先新增一个外链项，再填写名称和链接。"
            actionLabel="新增外链"
            onAction={addProjectLink}
          />
        )}
      </div>
    );
  }

  function renderProjects() {
    return (
      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <Panel
          title="项目列表"
          extra={
            <button type="button" onClick={addProject} className="admin-button px-3 py-2 text-[13px]">
              新增项目
            </button>
          }
        >
          <div className="space-y-2">
            {bundle.projectItems.map((project, index) => (
              <ListButton
                key={project.slug}
                active={project.slug === selectedProject?.slug}
                title={getProjectDisplayName(project, locale)}
                subtitle={project.slug}
                meta={<CountBadge value={index + 1} />}
                onClick={() => selectProject(project.slug)}
              />
            ))}
          </div>
        </Panel>

        {selectedProject ? (
          <div className="space-y-4">
            <Panel
              title={getProjectDisplayName(selectedProject, locale)}
              extra={
                <ActionRow>
                  <button
                    type="button"
                    onClick={() => moveProject(-1)}
                    disabled={bundle.projectItems[0]?.slug === selectedProject.slug}
                    className="admin-button admin-button-secondary px-3 py-2 text-[13px] disabled:opacity-40"
                  >
                    上移
                  </button>
                  <button
                    type="button"
                    onClick={() => moveProject(1)}
                    disabled={bundle.projectItems[bundle.projectItems.length - 1]?.slug === selectedProject.slug}
                    className="admin-button admin-button-secondary px-3 py-2 text-[13px] disabled:opacity-40"
                  >
                    下移
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProject(selectedProject.slug)}
                    className="admin-button admin-button-secondary px-3 py-2 text-[13px]"
                  >
                    删除
                  </button>
                </ActionRow>
              }
            >
              <div className="flex flex-wrap gap-2">
                {projectTabs.map((tab) => (
                  <TabButton
                    key={tab.key}
                    active={projectTab === tab.key}
                    label={tab.label}
                    onClick={() => setProjectTab(tab.key)}
                  />
                ))}
              </div>
            </Panel>

            {projectTab === "basic" ? renderProjectBasicTab(selectedProject) : null}
            {projectTab === "screenshots" ? renderProjectScreenshotsTab(selectedProject) : null}
            {projectTab === "code" ? renderProjectCodeTab(selectedProject) : null}
            {projectTab === "links" ? renderProjectLinksTab(selectedProject) : null}
          </div>
        ) : (
          <EmptyState
            title="还没有项目项"
            description="先新增一个项目，再继续填写详情。"
            actionLabel="新增项目项"
            onAction={addProject}
          />
        )}
      </div>
    );
  }

  function renderContact() {
    return (
      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <Panel
          title="联系方式"
          extra={
            <button type="button" onClick={addContact} className="admin-button px-3 py-2 text-[13px]">
              新增联系方式
            </button>
          }
        >
          <div className="space-y-2">
            {bundle.contactLinks.map((item, index) => (
              <ListButton
                key={`${item.label.zh}-${item.label.en}-${index}`}
                active={index === selectedContactIndex}
                title={getLocalizedLabel(item.label, locale) || `Contact ${index + 1}`}
                subtitle={item.href || "未填写"}
                meta={<CountBadge value={index + 1} />}
                onClick={() => setSelectedContactIndex(index)}
              />
            ))}
          </div>
        </Panel>

        {selectedContact ? (
          <Panel
            title={getLocalizedLabel(selectedContact.label, locale) || "联系方式内容"}
            extra={
              <ActionRow>
                <button
                  type="button"
                  onClick={() => moveContact(-1)}
                  disabled={selectedContactIndex === 0}
                  className="admin-button admin-button-secondary px-3 py-2 text-[13px] disabled:opacity-40"
                >
                  上移
                </button>
                <button
                  type="button"
                  onClick={() => moveContact(1)}
                  disabled={selectedContactIndex >= bundle.contactLinks.length - 1}
                  className="admin-button admin-button-secondary px-3 py-2 text-[13px] disabled:opacity-40"
                >
                  下移
                </button>
                <button
                  type="button"
                  onClick={() => removeContact(selectedContactIndex)}
                  className="admin-button admin-button-secondary px-3 py-2 text-[13px]"
                >
                  删除
                </button>
              </ActionRow>
            }
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Field
                label="名称"
                value={selectedContact.label[locale]}
                onChange={(value) =>
                  patchBundle((draft) => {
                    draft.contactLinks[selectedContactIndex].label[locale] = value;
                  })
                }
              />
              <Field
                label="链接"
                value={selectedContact.href}
                onChange={(value) =>
                  patchBundle((draft) => {
                    draft.contactLinks[selectedContactIndex].href = value;
                  })
                }
              />
            </div>
          </Panel>
        ) : (
          <EmptyState
            title="还没有联系方式"
            description="先新增一个联系入口，再填写名称和链接。"
            actionLabel="新增联系方式"
            onAction={addContact}
          />
        )}
      </div>
    );
  }

  function renderContent() {
    if (activeSection === "skills") {
      return renderSkills();
    }

    if (activeSection === "contact") {
      return renderContact();
    }

    return renderProjects();
  }

  const sectionCounts = {
    skills: bundle.skillItems.length,
    projects: bundle.projectItems.length,
    contact: bundle.contactLinks.length,
  } as const;

  const currentSectionLabel = sections.find((section) => section.key === activeSection)?.label ?? "项目项";

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar space-y-5 px-4 py-5">
        <div>
          <h1 className="text-[18px] font-semibold text-[var(--page-heading)]">Admin</h1>
          <p className="mt-1 text-[13px] text-[var(--page-muted)]">更短路径的内容编辑</p>
        </div>

        <div className="space-y-2">
          {sections.map((section) => (
            <SectionButton
              key={section.key}
              active={activeSection === section.key}
              label={section.label}
              description={section.description}
              count={sectionCounts[section.key]}
              onClick={() => setActiveSection(section.key)}
            />
          ))}
        </div>

        {saveState.kind === "idle" ? null : <StatusBanner state={saveState} />}
      </aside>

      <main className="admin-main min-h-screen">
        <div className="sticky top-0 z-10 border-b border-[var(--page-line)] bg-[var(--page-background)]/95 px-5 py-4 backdrop-blur lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--page-muted)]">
                {currentSectionLabel}
              </p>
              <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.04em] text-[var(--page-heading)]">
                {isDirty ? "有未保存修改" : "内容已同步"}
              </h2>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <div className="flex flex-wrap items-center gap-2 rounded-[12px] border border-[var(--page-line)] bg-[var(--page-surface)] p-1">
                {locales.map((item) => (
                  <SegmentButton
                    key={item.value}
                    active={locale === item.value}
                    label={item.label}
                    onClick={() => setLocale(item.value)}
                  />
                ))}
              </div>

              <ActionRow>
                <button
                  type="button"
                  onClick={reloadFromDisk}
                  className="admin-button admin-button-secondary px-4 py-2 text-[13px]"
                >
                  重新加载
                </button>
                <button
                  type="button"
                  onClick={saveBundle}
                  disabled={isSaving}
                  className="admin-button px-4 py-2 text-[13px]"
                >
                  {isSaving ? "保存中..." : "保存修改"}
                </button>
              </ActionRow>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 lg:px-6">{renderContent()}</div>
      </main>
    </div>
  );
}
