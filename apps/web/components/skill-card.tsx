"use client";

import Link from "next/link";
import { AgentBadges } from "./agent-badges";
import { CopyButton } from "./copy-button";
import type { SkillRecord } from "@/lib/skill";

type SkillCardProps = {
  skill: SkillRecord;
};

export function SkillCard({ skill }: SkillCardProps) {
  const installCommand = `npx askills add your-org/askills --skill ${skill.slug}`;

  const editedLabel = skill.lastEditedAt
    ? `edited ${new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
        Math.round((new Date(skill.lastEditedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        "day"
      )}`
    : "edited recently";

  return (
    <article className="group flex h-full flex-col rounded-md border border-border bg-surface p-4 transition hover:border-primary/60 hover:shadow-glow">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-mono text-sm font-semibold text-text-primary">{skill.name}</h3>
        {skill.category ? (
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-text-muted">{skill.category}</span>
        ) : null}
      </div>

      <p className="mb-3 line-clamp-2 text-sm text-text-muted">{skill.description}</p>
      <div className="mb-3">
        <AgentBadges agents={skill.agents} compact />
      </div>

      <p className="mb-4 text-xs text-text-muted">{editedLabel}</p>

      <div className="mt-auto flex flex-wrap gap-2">
        <CopyButton
          value={installCommand}
          onCopied={async () => {
            await fetch("/api/stats/copy", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ skill: skill.slug })
            });
          }}
        />
        <Link
          href={`/s/${skill.slug}`}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-text-muted transition hover:border-primary/50 hover:text-text-primary"
        >
          View
        </Link>
        <Link
          href={`/edit/${skill.slug}`}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-text-muted transition hover:border-primary/50 hover:text-text-primary"
        >
          Edit
        </Link>
      </div>
    </article>
  );
}
