import Link from "next/link";
import { notFound } from "next/navigation";
import { SkillCard } from "@/components/skill-card";
import { AGENT_MAP } from "@/lib/agents";
import { listAllSkills } from "@/lib/github";

export const revalidate = 60;

export default async function AgentPage({ params }: { params: Promise<{ agentName: string }> }) {
  const { agentName } = await params;
  const agent = AGENT_MAP.get(agentName);

  if (!agent) {
    notFound();
  }

  const skills = await listAllSkills().catch(() => []);
  const filtered = skills.filter((skill) => (skill.agents || []).includes(agentName));

  return (
    <div className="space-y-6">
      <header className="space-y-3 rounded-md border border-border bg-surface p-5">
        <h1 className="font-mono text-2xl font-semibold text-text-primary">{agent.label}</h1>
        <p className="text-sm text-text-muted">Browse ZSkills compatible with {agent.label}.</p>
        <a href={agent.docsUrl} target="_blank" rel="noreferrer" className="inline-flex text-sm text-primary">
          Official docs
        </a>
        <div className="grid gap-2 text-xs text-text-muted md:grid-cols-2">
          <p>Project path: {agent.projectPath}</p>
          <p>Global path: {agent.globalPath}</p>
        </div>
        <pre className="rounded-md border border-border bg-black/40 p-3 text-xs text-zinc-300">
          {`npx zskills add your-org/zskills -a ${agent.slug}`}
        </pre>
      </header>

      <p className="text-sm text-text-muted">{filtered.length} skill(s) for this agent</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((skill) => (
          <SkillCard key={skill.slug} skill={skill} />
        ))}
      </div>

      <Link href="/submit" className="inline-flex rounded-md border border-primary/60 bg-primary/20 px-4 py-2 text-sm text-primary">
        Submit a skill for {agent.label}
      </Link>
    </div>
  );
}
