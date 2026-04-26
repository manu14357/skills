import Link from "next/link";
import { CopyButton } from "@/components/copy-button";
import { SkillGridClient } from "@/components/skill-grid-client";
import { AGENTS } from "@/lib/agents";
import { listAllSkills } from "@/lib/github";
import { SkillRecord } from "@/lib/skill";

export const revalidate = 60;

async function loadSkillsSafe(): Promise<SkillRecord[]> {
  try {
    return await listAllSkills();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const skills = await loadSkillsSafe();
  const uniqueAuthors = new Set(skills.map((s) => s.author).filter(Boolean));

  return (
    <div>
      {/* ── Hero ── */}
      <section className="pb-12 pt-10 md:pt-20">
        <div className="space-y-5 md:space-y-8">
          {/* Tag line */}
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Open Skill Registry
          </p>

          {/* Main headline */}
          <h1 className="max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-4xl md:text-6xl lg:text-7xl">
            The open registry{" "}
            <span className="text-text-muted">for agent skills.</span>
          </h1>

          {/* Sub */}
          <p className="max-w-xl text-base text-text-muted md:text-lg">
            Browse, submit, and evolve{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm text-text-primary">
              SKILL.md
            </code>{" "}
            files for every coding agent. Open contributions, fast validation, zero friction.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#skills"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Browse Skills
            </Link>
            <a
              href="https://github.com/manu14357/askills/fork"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border px-5 py-2.5 text-sm text-text-muted transition-colors hover:border-text-muted hover:text-text-primary"
            >
              Contribute on GitHub ↗
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 border-t border-border pt-6 text-sm sm:gap-10">
            <div>
              <span className="text-2xl font-semibold text-text-primary">{skills.length}</span>
              <span className="ml-2 text-text-muted">skills</span>
            </div>
            <div>
              <span className="text-2xl font-semibold text-text-primary">{uniqueAuthors.size}</span>
              <span className="ml-2 text-text-muted">contributors</span>
            </div>
            <div>
              <span className="text-2xl font-semibold text-text-primary">{AGENTS.length}+</span>
              <span className="ml-2 text-text-muted">agents supported</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLI snippet ── */}
      <section className="border-t border-border py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-text-muted">Quick install</p>
            <code className="mt-1.5 block font-mono text-sm text-text-primary">
              npx askills add manu14357/askills
            </code>
          </div>
          <CopyButton value="npx askills add manu14357/askills" />
        </div>
      </section>

      {/* ── Skills list ── */}
      <section id="skills" className="border-t border-border pt-10">
        <SkillGridClient skills={skills} />
      </section>
    </div>
  );
}

