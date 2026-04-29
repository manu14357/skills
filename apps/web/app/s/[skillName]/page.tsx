import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentBadges } from "@/components/agent-badges";
import { CopyButton } from "@/components/copy-button";
import { SkillDetailTabs } from "@/components/skill-detail-tabs";
import { RAW_BASE_URL, SITE_URL } from "@/lib/constants";
import { getSkillByName, getSkillHistory, getSkillRelatedDiscussion, listAllSkills } from "@/lib/github";

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{ skillName: string }>;
}): Promise<Metadata> {
  const { skillName } = await params;

  try {
    const skill = await getSkillByName(skillName);
    const title = `${skill.name} — Skill`;
    const description = skill.description || "Explore this ZSkills entry.";
    const url = `${SITE_URL}/s/${skill.slug}`;

    return {
      title,
      description,
      alternates: {
        canonical: url
      },
      openGraph: {
        type: "article",
        url,
        title,
        description,
        siteName: "ZSkills"
      },
      twitter: {
        card: "summary",
        title,
        description
      }
    };
  } catch {
    return {
      title: "Skill not found · ZSkills",
      description: "This skill could not be found."
    };
  }
}

export default async function SkillDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ skillName: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { skillName } = await params;
  const { ref } = await searchParams;

  let skill;
  try {
    skill = await getSkillByName(skillName, ref);
  } catch {
    notFound();
  }

  const [history, discussion, allSkills] = await Promise.all([
    getSkillHistory(skill.slug).catch(() => []),
    getSkillRelatedDiscussion(skill.slug).catch(() => []),
    listAllSkills().catch(() => [])
  ]);

  const related = allSkills
    .filter((entry) => entry.slug !== skill.slug)
    .filter((entry) => (skill.category ? entry.category === skill.category : true))
    .slice(0, 6);

  const installCommand = `npx zskills add manu14357/zskills --skill ${skill.slug}`;
  const rawUrl = `${RAW_BASE_URL}/skills/${skill.slug}/SKILL.md`;

  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative border-b border-border pb-6 pt-2">
        {/* subtle glow */}
        <div className="pointer-events-none absolute -top-10 left-0 h-48 w-64 rounded-full bg-primary/10 blur-3xl" />

        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
          skill
        </p>

        <h1 className="break-words font-mono text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
          {skill.name}
        </h1>

        {skill.description ? (
          <p className="mt-3 max-w-2xl text-base text-text-muted">{skill.description}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <AgentBadges agents={skill.agents} />
          {skill.category ? (
            <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] uppercase tracking-widest text-text-muted">
              {skill.category}
            </span>
          ) : null}
        </div>

        <p className="mt-4 text-xs text-text-muted">
          Contributed by{" "}
          <span className="text-text-primary">{skill.author || "Anonymous"}</span>
          {" · "}
          Last edited{" "}
          {skill.lastEditedAt ? new Date(skill.lastEditedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "unknown"}
          {history.length > 0 ? ` · ${history.length} edit${history.length !== 1 ? "s" : ""}` : ""}
        </p>
      </div>

      {/* ── Sticky action bar ── */}
      <div className="sticky top-14 z-30 border-b border-border bg-bg/90 py-2.5 backdrop-blur md:-mx-10 md:px-10 lg:-mx-16 lg:px-16">
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton value={installCommand} />
          <a
            href={`https://github.com/manu14357/zskills/fork`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-text-muted hover:text-text-primary"
          >
            Fork on GitHub ↗
          </a>
          <a
            href={rawUrl}
            className="rounded-md border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-text-muted hover:text-text-primary"
            download
          >
            <span className="sm:hidden">Download ↓</span>
            <span className="hidden sm:inline">Download SKILL.md</span>
          </a>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 gap-8 pt-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Left: tabs */}
        <div className="min-w-0">
          <SkillDetailTabs skill={skill} history={history} discussion={discussion} rawUrl={rawUrl} />
        </div>

        {/* Right: sidebar — appears below tabs on mobile */}
        <aside className="space-y-5">
          {/* Install */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-2 text-[11px] uppercase tracking-widest text-text-muted">Install</p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2.5">
              <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-text-muted">
                {installCommand}
              </code>
              <CopyButton value={installCommand} minimal />
            </div>
            <div className="mt-3">
              <p className="mb-1 text-[11px] uppercase tracking-widest text-text-muted">Raw URL</p>
              <a
                href={rawUrl}
                target="_blank"
                rel="noreferrer"
                className="break-all font-mono text-[11px] text-primary hover:underline"
              >
                {rawUrl}
              </a>
            </div>
          </div>

          {/* Related skills */}
          {related.length > 0 ? (
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-widest text-text-muted">Related skills</p>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {related.map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={`/s/${entry.slug}`}
                      className="group block rounded-lg border border-border bg-surface p-3 transition-colors hover:border-primary/40 hover:bg-surface"
                    >
                      <span className="font-mono text-xs font-semibold text-text-primary group-hover:text-primary">
                        {entry.slug}
                      </span>
                      {entry.description ? (
                        <p className="mt-1 line-clamp-2 text-[11px] text-text-muted">
                          {entry.description}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
