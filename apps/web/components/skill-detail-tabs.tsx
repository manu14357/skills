"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { CopyButton } from "./copy-button";
import { MarkdownPreview } from "./markdown-preview";
import type { SkillRecord } from "@/lib/skill";

type HistoryItem = {
  sha: string;
  message: string;
  author: string;
  authoredAt: string;
  htmlUrl: string;
};

type DiscussionItem = {
  title: string;
  url: string;
  number: number;
};

const DiffViewer = dynamic(() => import("react-diff-viewer-continued"), { ssr: false });

type SkillDetailTabsProps = {
  skill: SkillRecord;
  history: HistoryItem[];
  discussion: DiscussionItem[];
  rawUrl: string;
};

export function SkillDetailTabs({ skill, history, discussion, rawUrl }: SkillDetailTabsProps) {
  const [tab, setTab] = useState<"overview" | "raw" | "history" | "discussion">("overview");
  const [selectedSha, setSelectedSha] = useState<string>(history[1]?.sha || "");
  const [historicalRaw, setHistoricalRaw] = useState<string>("");
  const [revertMessage, setRevertMessage] = useState<string>("");

  const tabs = useMemo(
    () => [
      { key: "overview", label: "Overview" },
      { key: "raw", label: "Raw SKILL.md" },
      { key: "history", label: "History" },
      { key: "discussion", label: "Discussion" }
    ] as const,
    []
  );

  async function loadHistorical() {
    if (!selectedSha) return;
    const response = await fetch(`/api/skills/${skill.slug}/version/${selectedSha}`);
    if (!response.ok) return;
    const payload = (await response.json()) as { content: string };
    setHistoricalRaw(payload.content);
  }

  async function revertToSelected() {
    if (!selectedSha) return;

    const response = await fetch("/api/revert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        skillName: skill.slug,
        targetCommitSha: selectedSha,
        summary: `Revert ${skill.slug} to ${selectedSha.slice(0, 7)}`
      })
    });

    const payload = (await response.json()) as { error?: string; pullRequestUrl?: string };
    if (!response.ok) {
      setRevertMessage(payload.error || "Failed to create revert PR");
      return;
    }

    setRevertMessage(payload.pullRequestUrl ? `Revert PR created: ${payload.pullRequestUrl}` : "Revert PR created.");
  }

  return (
    <section className="space-y-5">
      {/* Tabs — scrollable on mobile */}
      <div className="flex overflow-x-auto border-b border-border">
        {tabs.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setTab(entry.key)}
            className={`relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === entry.key
                ? "text-text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:content-[\'\']"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? <MarkdownPreview markdown={skill.body} /> : null}

      {tab === "raw" ? (
        <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-mono text-sm font-medium text-text-primary">Raw SKILL.md</h3>
            <div className="flex items-center gap-2">
              <CopyButton value={skill.raw} />
              <a href={rawUrl} target="_blank" rel="noreferrer" className="rounded-md border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-text-muted hover:text-text-primary">
                Open on GitHub ↗
              </a>
            </div>
          </div>
          <pre className="max-h-[60vh] overflow-auto rounded-lg border border-border bg-black/60 p-4 text-xs leading-relaxed text-zinc-300">{skill.raw}</pre>
        </div>
      ) : null}

      {tab === "history" ? (
        <div className="space-y-4 rounded-xl border border-border bg-surface p-4">
          <ul className="space-y-2">
            {history.map((entry, index) => (
              <li key={entry.sha} className="flex items-start gap-3 rounded-lg border border-border bg-black/30 p-3">
                <span className="mt-0.5 shrink-0 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
                  v{history.length - index}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-primary">{entry.message}</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {entry.author} · {entry.authoredAt ? new Date(entry.authoredAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "unknown"}
                  </p>
                  <a href={entry.htmlUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block font-mono text-[11px] text-primary hover:underline">
                    {entry.sha.slice(0, 7)} on GitHub ↗
                  </a>
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-md border border-border bg-black/30 p-3">
            <p className="mb-2 text-xs text-text-muted">Diff against selected version</p>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <select
                aria-label="Select historical version"
                value={selectedSha}
                onChange={(event) => setSelectedSha(event.target.value)}
                className="rounded-md border border-border bg-black/40 px-3 py-2 text-xs text-text-primary"
              >
                <option value="">Select version</option>
                {history.map((entry) => (
                  <option key={entry.sha} value={entry.sha}>
                    {entry.sha.slice(0, 7)} - {entry.message}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={loadHistorical}
                className="rounded-md border border-primary/50 bg-primary/20 px-3 py-2 text-xs text-primary"
              >
                Load Diff
              </button>
              <button
                type="button"
                onClick={revertToSelected}
                className="rounded-md border border-border bg-surface px-3 py-2 text-xs text-text-muted hover:text-text-primary"
              >
                Revert to this version
              </button>
            </div>

            {historicalRaw ? (
              <DiffViewer oldValue={historicalRaw} newValue={skill.raw} splitView={false} useDarkTheme />
            ) : (
              <p className="text-xs text-text-muted">Select a version to view a diff.</p>
            )}

            {revertMessage ? <p className="mt-3 text-xs text-text-muted">{revertMessage}</p> : null}
          </div>
        </div>
      ) : null}

      {tab === "discussion" ? (
        <div className="space-y-4 rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">
              {discussion.length > 0
                ? `${discussion.length} related thread${discussion.length !== 1 ? "s" : ""} found`
                : "No related discussions yet"}
            </p>
            <a
              href={`https://github.com/manu14357/askills/pulls?q=${encodeURIComponent(skill.slug)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-text-muted hover:text-text-primary"
            >
              Open on GitHub ↗
            </a>
          </div>
          {discussion.length > 0 ? (
            <ul className="space-y-2">
              {discussion.map((entry) => (
                <li key={entry.number} className="rounded-lg border border-border bg-black/30 p-3">
                  <p className="text-sm text-text-primary">{entry.title}</p>
                  <a href={entry.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-primary hover:underline">
                    #{entry.number} — Open thread ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-sm text-text-muted">No discussions yet for this skill.</p>
              <a
                href={`https://github.com/manu14357/askills/issues/new?title=${encodeURIComponent(`[${skill.slug}] `)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs text-primary hover:underline"
              >
                Start a discussion ↗
              </a>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
