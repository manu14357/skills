const ENV_OWNER = process.env.GITHUB_REPO_OWNER?.trim();
const ENV_REPO = process.env.GITHUB_REPO_NAME?.trim();

export const REPO_OWNER = ENV_OWNER && ENV_OWNER !== "your-org" ? ENV_OWNER : "manu14357";
export const REPO_NAME = ENV_REPO && ENV_REPO !== "askills" ? ENV_REPO : "askills";
export const REPO_SLUG = `${REPO_OWNER}/${REPO_NAME}`;

export const RAW_BASE_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`;
export const SKILLS_DIR = "skills";

export const CATEGORY_OPTIONS = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "devops", label: "DevOps" },
  { value: "testing", label: "Testing" },
  { value: "docs", label: "Docs" },
  { value: "data", label: "Data" },
  { value: "design", label: "Design" },
  { value: "security", label: "Security" },
  { value: "general", label: "General" }
] as const;

export const MAX_SUBMISSIONS_PER_HOUR = 3;
export const MAX_EDITS_PER_HOUR = 10;

export const DEFAULT_REVALIDATE_SECONDS = 60;

export const SKILL_TEMPLATE_BODY = `# Skill Name

## When to Use
Describe the exact scenarios where this skill should activate.

## Steps
1. First do this
2. Then do that
3. Finally do this

## Examples
Show concrete usage examples here.

## Notes
Any extra tips, warnings, or edge cases.`;
