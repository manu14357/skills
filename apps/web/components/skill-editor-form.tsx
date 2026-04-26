"use client";

import { useMemo, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { AGENTS } from "@/lib/agents";
import { CATEGORY_OPTIONS, SKILL_TEMPLATE_BODY } from "@/lib/constants";
import { createSkillMarkdown, normalizeSkillName } from "@/lib/skill";

type SkillEditorFormProps = {
  mode: "submit" | "edit";
  initialName?: string;
  initialDescription?: string;
  initialCategory?: string;
  initialAgents?: string[];
  initialBody?: string;
  initialAuthor?: string;
  initialSummary?: string;
  forkedFrom?: string;
};

export function SkillEditorForm({
  mode,
  initialName = "",
  initialDescription = "",
  initialCategory = "general",
  initialAgents = [],
  initialBody = SKILL_TEMPLATE_BODY,
  initialAuthor = "",
  initialSummary = "",
  forkedFrom
}: SkillEditorFormProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState(initialCategory);
  const [agents, setAgents] = useState<string[]>(initialAgents);
  const [body, setBody] = useState(initialBody);
  const [author, setAuthor] = useState(initialAuthor);
  const [summary, setSummary] = useState(initialSummary);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string>("");

  const normalized = normalizeSkillName(name);

  const generatedMarkdown = useMemo(
    () =>
      createSkillMarkdown(
        {
          name: normalized || "skill-name",
          description: description || "What this skill does and when to trigger it",
          category,
          agents,
          author: author || undefined
        },
        body
      ),
    [normalized, description, category, agents, author, body]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResultMessage("");

    try {
      const endpoint = mode === "submit" ? "/api/submit" : "/api/edit";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          skillName: normalized,
          description,
          category,
          agents,
          body,
          author,
          summary,
          forkedFrom
        })
      });

      const payload = (await response.json()) as { message?: string; pullRequestUrl?: string; error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Failed to submit skill");
      }

      setResultMessage(`Success: ${payload.message || "Submitted"} ${payload.pullRequestUrl || ""}`.trim());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setResultMessage(`Error: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Identity */}
        <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Identity</p>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">
              Skill slug <span className="text-primary">*</span>
            </label>
            <input
              value={name}
              onChange={(event) => setName(normalizeSkillName(event.target.value))}
              disabled={mode === "edit"}
              placeholder="my-skill"
              className="w-full rounded-lg border border-border bg-black/40 px-3 py-2.5 font-mono text-sm text-text-primary outline-none ring-primary/40 transition focus:border-primary/60 focus:ring-2 disabled:opacity-60"
              required
            />
            {normalized ? (
              <p className="mt-1 font-mono text-[11px] text-text-muted">
                → <span className="text-primary">{normalized}</span>
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">
              Short description <span className="text-primary">*</span>
            </label>
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What this skill does and when it triggers"
              className="w-full rounded-lg border border-border bg-black/40 px-3 py-2.5 text-sm text-text-primary outline-none ring-primary/40 transition focus:border-primary/60 focus:ring-2"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">Category</label>
              <select
                title="Skill category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-border bg-black/40 px-3 py-2.5 text-sm text-text-primary outline-none ring-primary/40 transition focus:border-primary/60 focus:ring-2"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">
                Your handle <span className="text-text-muted/50">(optional)</span>
              </label>
              <input
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="github-username"
                className="w-full rounded-lg border border-border bg-black/40 px-3 py-2.5 text-sm text-text-primary outline-none ring-primary/40 transition focus:border-primary/60 focus:ring-2"
              />
            </div>
          </div>
        </div>

        {/* Section: Target Agents */}
        <div className="space-y-3 rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Target agents</p>
            {agents.length > 0 ? (
              <button
                type="button"
                onClick={() => setAgents([])}
                className="text-[11px] text-text-muted hover:text-primary"
              >
                Clear all
              </button>
            ) : (
              <span className="text-[11px] text-text-muted">Leave empty for agent-agnostic</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {AGENTS.map((agent) => {
              const active = agents.includes(agent.slug);
              return (
                <button
                  key={agent.slug}
                  type="button"
                  onClick={() => {
                    if (active) {
                      setAgents((prev) => prev.filter((a) => a !== agent.slug));
                    } else {
                      setAgents((prev) => [...new Set([...prev, agent.slug])]);
                    }
                  }}
                  className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    active
                      ? "border-primary/60 bg-primary/15 text-primary"
                      : "border-border text-text-muted hover:border-text-muted hover:text-text-primary"
                  }`}
                >
                  {agent.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Skill body */}
        <div className="space-y-3 rounded-xl border border-border bg-surface p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Skill content</p>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">
              {mode === "submit" ? "What does this skill do?" : "Summary of changes"}{" "}
              <span className="text-primary">*</span>
            </label>
            <input
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder={mode === "submit" ? "Brief description of what this skill does" : "What changed in this edit?"}
              className="w-full rounded-lg border border-border bg-black/40 px-3 py-2.5 text-sm text-text-primary outline-none ring-primary/40 transition focus:border-primary/60 focus:ring-2"
              required
            />
          </div>

          <div data-color-mode="dark">
            <label className="mb-1.5 block text-xs font-medium text-text-muted">
              SKILL.md body <span className="text-primary">*</span>
            </label>
            <MDEditor value={body} onChange={(value) => setBody(value || "")} height={420} />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Submitting…"
              : mode === "submit"
              ? "Submit Skill →"
              : "Submit Edit →"}
          </button>
          {resultMessage ? (
            <p
              className={`text-sm ${
                resultMessage.startsWith("Error") ? "text-error" : "text-success"
              }`}
            >
              {resultMessage}
            </p>
          ) : null}
        </div>
      </form>

      {/* Live preview */}
      <section className="space-y-4">
        <div className="sticky top-20 space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-text-muted">Live preview</p>
            <pre className="max-h-[480px] overflow-auto rounded-lg border border-border bg-black/60 p-3 text-[11px] leading-relaxed text-zinc-300">
              {generatedMarkdown}
            </pre>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-text-muted">Install command</p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-black/60 px-3 py-2.5">
              <code className="flex-1 truncate font-mono text-[11px] text-zinc-300">
                {`npx askills add your-org/askills --skill ${normalized || "skill-name"}`}
              </code>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
