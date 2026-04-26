import Link from "next/link";
import { SkillCard } from "@/components/skill-card";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import { listAllSkills } from "@/lib/github";

export const revalidate = 60;

const categoryDescriptions: Record<string, string> = {
  frontend: "Skills for UI systems, interaction patterns, and frontend architecture.",
  backend: "Skills for APIs, databases, services, and server-side systems.",
  devops: "Skills for pipelines, deployment, infra, reliability, and ops.",
  testing: "Skills for QA, test automation, and verification workflows.",
  docs: "Skills for technical writing, changelogs, and team documentation.",
  data: "Skills for analytics, ETL, data workflows, and insights.",
  design: "Skills for visual design, UX, and prototyping.",
  security: "Skills for secure coding, audits, and risk mitigation.",
  general: "General-purpose skills across multiple domains."
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const allSkills = await listAllSkills().catch(() => []);
  const filtered = allSkills.filter((skill) => skill.category === category);

  const categoryMeta = CATEGORY_OPTIONS.find((entry) => entry.value === category);

  return (
    <div className="space-y-6">
      <header className="space-y-2 rounded-md border border-border bg-surface p-5">
        <h1 className="font-mono text-2xl font-semibold text-text-primary">{categoryMeta?.label || category}</h1>
        <p className="text-sm text-text-muted">{categoryDescriptions[category] || "Skills in this category."}</p>
      </header>

      <p className="text-sm text-text-muted">{filtered.length} skill(s) in this category</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((skill) => (
          <SkillCard key={skill.slug} skill={skill} />
        ))}
      </div>

      <Link href="/submit" className="inline-flex rounded-md border border-primary/60 bg-primary/20 px-4 py-2 text-sm text-primary">
        Submit a skill in this category
      </Link>
    </div>
  );
}
