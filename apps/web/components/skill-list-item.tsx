"use client";

import Link from "next/link";
import { AgentBadges } from "./agent-badges";
import { CopyButton } from "./copy-button";
import type { SkillRecord } from "@/lib/skill";

type SkillListItemProps = {
  skill: SkillRecord;
};

function relativeTime(iso: string): string {
  const diffDays = Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000);
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(diffDays, "day");
}


export function SkillListItem({ skill }: SkillListItemProps) {
  const installCommand = `npx zskills add manu14357/zskills --skill ${skill.slug}`;
  const editedLabel = skill.lastEditedAt ? relativeTime(skill.lastEditedAt) : "recently";

  return (
    <article className="flex items-start gap-3 border-b border-border px-3 py-3.5 last:border-b-0 transition-colors hover:bg-primary/5 sm:px-4 sm:gap-4">
      {/* Main info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            href={`/s/${skill.slug}`}
            className="font-mono text-sm font-semibold text-text-primary transition hover:text-primary"
          >
            {skill.name}
          </Link>
          {skill.category ? (
            <span className="hidden rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-text-muted sm:inline">
              {skill.category}
            </span>
          ) : null}
          <span className="text-xs text-text-muted">{editedLabel}</span>
        </div>

        {skill.description ? (
          <p className="mt-0.5 line-clamp-1 text-sm text-text-muted">{skill.description}</p>
        ) : null}

        <div className="mt-1.5">
          <AgentBadges agents={skill.agents} compact />
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <CopyButton
          minimal
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
          className="rounded-md border border-border px-2.5 py-1.5 text-xs text-text-muted transition hover:border-primary/50 hover:text-text-primary"
        >
          View
        </Link>
      </div>
    </article>
  );
}
