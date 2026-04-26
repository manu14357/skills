"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { AGENTS } from "@/lib/agents";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import { filterSkills, SkillRecord, sortSkills } from "@/lib/skill";
import { SkillListItem } from "./skill-list-item";

const PAGE_SIZE = 20;

type SkillGridClientProps = {
  skills: SkillRecord[];
};

const inputCls =
  "w-full bg-transparent border-b border-border py-2 text-sm text-text-primary outline-none placeholder:text-text-muted/50 transition-colors focus:border-primary";

export function SkillGridClient({ skills }: SkillGridClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"newest" | "edited" | "az">("edited");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const result = filterSkills(skills, { query, category, agents: selectedAgents });
    return sortSkills(result, sort);
  }, [skills, query, category, selectedAgents, sort]);

  // Reset to first page whenever filters change
  useEffect(() => {
    setPage(1);
  }, [query, category, selectedAgents, sort]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

  function toggleAgent(slug: string) {
    setSelectedAgents((prev) =>
      prev.includes(slug) ? prev.filter((a) => a !== slug) : [...prev, slug]
    );
  }

  return (
    <section className="space-y-6">
      {/* Filter row */}
      <div className="space-y-5">
        {/* Search + Category + Sort */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <p className="mb-1 text-xs uppercase tracking-widest text-text-muted">Search</p>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills…"
              className={inputCls}
            />
          </div>

          <div>
            <p className="mb-1 text-xs uppercase tracking-widest text-text-muted">Category</p>
            <select
              title="Filter by category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls}
            >
              <option value="">All categories</option>
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-1 text-xs uppercase tracking-widest text-text-muted">Sort</p>
            <select
              title="Sort skills"
              value={sort}
              onChange={(e) => setSort(e.target.value as "newest" | "edited" | "az")}
              className={inputCls}
            >
              <option value="edited">Recently edited</option>
              <option value="newest">Newest first</option>
              <option value="az">A – Z</option>
            </select>
          </div>
        </div>

        {/* Agent pill filter */}
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-text-muted">Agent</p>
          <div className="flex flex-wrap gap-1.5">
            {AGENTS.map((agent) => {
              const active = selectedAgents.includes(agent.slug);
              return (
                <button
                  key={agent.slug}
                  type="button"
                  onClick={() => toggleAgent(agent.slug)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-text-muted hover:border-text-muted hover:text-text-primary"
                  }`}
                >
                  {agent.label}
                </button>
              );
            })}
            {selectedAgents.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedAgents([])}
                className="rounded-full border border-error/40 px-3 py-1 text-xs text-error hover:bg-error/5"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-text-muted">
        Showing {visible.length} of {filtered.length} skill{filtered.length !== 1 ? "s" : ""}
        {hasMore ? " · scroll to load more" : ""}
      </p>

      {/* List */}
      <div className="border-t border-border">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-text-muted">No skills match your filters.</p>
            <a href="/submit" className="mt-2 inline-block text-sm text-primary hover:underline">
              Submit one →
            </a>
          </div>
        ) : (
          visible.map((skill) => <SkillListItem key={skill.slug} skill={skill} />)
        )}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />
      {hasMore ? (
        <p className="pb-4 text-center text-xs text-text-muted">Loading more…</p>
      ) : null}
    </section>
  );
}


