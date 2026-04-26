import matter from "gray-matter";
import { z } from "zod";
import { CATEGORY_OPTIONS } from "./constants";

export const SkillFrontmatterSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().optional(),
  agents: z.array(z.string()).optional(),
  author: z.string().optional()
});

export type SkillFrontmatter = z.infer<typeof SkillFrontmatterSchema>;

export type SkillRecord = SkillFrontmatter & {
  slug: string;
  body: string;
  raw: string;
  path: string;
  sha?: string;
  lastEditedAt?: string;
};

export function normalizeSkillName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function parseSkillMarkdown(markdown: string, fallbackSlug = ""): SkillRecord {
  const parsed = matter(markdown);
  const fm = SkillFrontmatterSchema.parse(parsed.data);
  const slug = normalizeSkillName(fm.name || fallbackSlug);

  return {
    ...fm,
    slug,
    body: parsed.content.trim(),
    raw: markdown,
    path: `skills/${slug}/SKILL.md`
  };
}

export function createSkillMarkdown(frontmatter: SkillFrontmatter, body: string): string {
  const lines: string[] = ["---"];

  lines.push(`name: ${normalizeSkillName(frontmatter.name)}`);
  lines.push(`description: ${frontmatter.description}`);

  if (frontmatter.category) {
    lines.push(`category: ${frontmatter.category}`);
  }

  if (frontmatter.agents && frontmatter.agents.length > 0) {
    lines.push("agents:");
    for (const agent of frontmatter.agents) {
      lines.push(`  - ${agent}`);
    }
  }

  if (frontmatter.author) {
    lines.push(`author: ${frontmatter.author}`);
  }

  lines.push("---", "", body.trim(), "");
  return lines.join("\n");
}

export function filterSkills(
  skills: SkillRecord[],
  options: {
    query?: string;
    agents?: string[];
    category?: string;
  }
): SkillRecord[] {
  const query = (options.query || "").toLowerCase().trim();
  const selectedAgents = options.agents ?? [];

  return skills.filter((skill) => {
    const byQuery =
      !query ||
      skill.name.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query) ||
      skill.body.toLowerCase().includes(query);

    const byCategory = !options.category || skill.category === options.category;

    const byAgents =
      selectedAgents.length === 0 ||
      selectedAgents.every((agent) => (skill.agents || []).includes(agent));

    return byQuery && byCategory && byAgents;
  });
}

export function sortSkills(skills: SkillRecord[], sort: "newest" | "edited" | "az"): SkillRecord[] {
  const copied = [...skills];

  if (sort === "az") {
    copied.sort((a, b) => a.name.localeCompare(b.name));
    return copied;
  }

  copied.sort((a, b) => {
    const aTime = a.lastEditedAt ? new Date(a.lastEditedAt).getTime() : 0;
    const bTime = b.lastEditedAt ? new Date(b.lastEditedAt).getTime() : 0;
    return bTime - aTime;
  });

  return copied;
}

export const VALID_CATEGORIES = new Set(CATEGORY_OPTIONS.map((c) => c.value));
