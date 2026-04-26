import { AGENTS } from "@/lib/agents";

export default function DocsPage() {
  return (
    <div className="max-w-3xl space-y-14">
      <div className="border-b border-border pb-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Documentation</p>
        <h1 className="text-3xl font-bold text-text-primary md:text-4xl">ZSkills</h1>
        <p className="mt-3 text-base text-text-muted">
          ZSkills is a fully open registry where every skill lives as{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 text-sm text-text-primary">skills/skill-name/SKILL.md</code>{" "}
          in GitHub.
        </p>
      </div>

      {/* Format */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-text-muted">SKILL.md format</h2>
        <pre className="overflow-x-auto rounded-md border border-border bg-surface p-5 text-xs leading-relaxed text-text-primary">
{`---
name: skill-name
description: What this skill does and when to trigger it
category: frontend
agents:
  - claude-code
author: optional-handle
---

# Skill Name

## When to Use
...`}
        </pre>
      </section>

      {/* CLI */}
      <section className="space-y-5">
        <h2 className="text-xs uppercase tracking-widest text-text-muted">CLI quickstart</h2>

        <div className="space-y-2">
          <p className="text-sm font-medium text-text-primary">Install</p>
          <pre className="overflow-x-auto rounded-md border border-border bg-surface p-5 text-xs leading-relaxed text-text-primary">
{`npm i -g zskills`}
          </pre>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-text-primary">Add skills</p>
          <pre className="overflow-x-auto rounded-md border border-border bg-surface p-5 text-xs leading-relaxed text-text-primary">
{`# Install all skills from the registry
zskills add manu14357/zskills

# Install a single skill
zskills add manu14357/zskills --skill frontend-design

# Install for a specific agent (defaults to claude-code)
zskills add manu14357/zskills --skill frontend-design -a cursor

# Install multiple agents at once
zskills add manu14357/zskills --skill frontend-design -a claude-code -a cursor

# Install globally (not just this project)
zskills add manu14357/zskills --global`}
          </pre>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-text-primary">Manage installed skills</p>
          <pre className="overflow-x-auto rounded-md border border-border bg-surface p-5 text-xs leading-relaxed text-text-primary">
{`zskills list                  # all skills in the registry
zskills list --installed       # skills installed on this machine
zskills find <query>           # search by name or description
zskills check                  # check for updates
zskills update                 # update all installed skills
zskills remove <skill>         # remove one skill
zskills remove --all           # remove all installed skills
zskills init <name>            # scaffold a new SKILL.md`}
          </pre>
        </div>
      </section>

      {/* Agent paths */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-text-muted">Agent installation paths</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-8 font-medium text-text-primary">Agent</th>
                <th className="pb-2 pr-8 font-medium text-text-primary">Project path</th>
                <th className="pb-2 font-medium text-text-primary">Global path</th>
              </tr>
            </thead>
            <tbody>
              {AGENTS.map((agent) => (
                <tr key={agent.slug} className="border-b border-border last:border-0">
                  <td className="py-3 pr-8 text-text-primary">{agent.slug}</td>
                  <td className="py-3 pr-8 font-mono text-xs text-text-muted">{agent.projectPath}</td>
                  <td className="py-3 font-mono text-xs text-text-muted">{agent.globalPath}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* GitHub Actions */}
      <section className="space-y-2 border-t border-border pt-8">
        <h2 className="text-xs uppercase tracking-widest text-text-muted">GitHub Actions</h2>
        <p className="text-sm text-text-muted">
          Use <code className="text-text-primary">validate.yml</code> and{" "}
          <code className="text-text-primary">auto-merge.yml</code> to enforce format and automatically merge valid PRs.
        </p>
        <p className="text-sm text-text-muted">
          Ready to contribute?{" "}
          <a href="https://github.com/manu14357/zskills/fork" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-2 hover:underline">
            Fork the repo on GitHub ↗
          </a>
          {" "}and open a PR adding your skill under{" "}
          <code className="text-text-primary">skills/your-skill-name/SKILL.md</code>.
        </p>
      </section>
    </div>
  );
}

