#!/usr/bin/env node
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Command } from "commander";
import matter from "gray-matter";
import { AGENT_MAP, AGENT_TARGETS } from "./agents";
import { SKILL_TEMPLATE } from "./template";

type ManifestEntry = {
  repo: string;
  skill: string;
  agent: string;
  installPath: string;
  hash: string;
  installedAt: string;
};

type Manifest = {
  version: number;
  entries: ManifestEntry[];
};

const VERSION = "0.1.0";
const DEFAULT_REPO = "manu14357/zskills";
const GITHUB_API_BASE = "https://api.github.com";
const MANIFEST_DIR = path.join(os.homedir(), ".zskills");
const MANIFEST_FILE = path.join(MANIFEST_DIR, "installed.json");

function normalizeSkillName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseRepo(repo: string): { owner: string; name: string } {
  const [owner, name] = repo.split("/");
  if (!owner || !name) {
    throw new Error(`Invalid repo format: ${repo}. Expected owner/name`);
  }
  return { owner, name };
}

async function loadManifest(): Promise<Manifest> {
  try {
    const content = await fs.readFile(MANIFEST_FILE, "utf8");
    const parsed = JSON.parse(content) as Manifest;
    if (!parsed.entries) {
      return { version: 1, entries: [] };
    }
    return parsed;
  } catch {
    return { version: 1, entries: [] };
  }
}

async function saveManifest(manifest: Manifest): Promise<void> {
  await fs.mkdir(MANIFEST_DIR, { recursive: true });
  await fs.writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2), "utf8");
}

function buildRawSkillUrl(repo: string, skillName: string): string {
  return `https://raw.githubusercontent.com/${repo}/main/skills/${skillName}/SKILL.md`;
}

function buildSkillsDirApiUrl(repo: string): string {
  const { owner, name } = parseRepo(repo);
  return `${GITHUB_API_BASE}/repos/${owner}/${name}/contents/skills`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "zskills-cli"
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }

  return (await response.json()) as T;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "zskills-cli"
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }

  return response.text();
}

async function listRemoteSkillNames(repo: string): Promise<string[]> {
  const data = await fetchJson<Array<{ name: string; type: string }>>(buildSkillsDirApiUrl(repo));
  return data
    .filter((entry) => entry.type === "dir")
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

async function listRemoteSkills(repo: string): Promise<Array<{ name: string; description: string; category?: string; agents: string[] }>> {
  const names = await listRemoteSkillNames(repo);
  const results = await Promise.all(
    names.map(async (name) => {
      try {
        const markdown = await fetchText(buildRawSkillUrl(repo, name));
        const parsed = matter(markdown);
        const data = parsed.data as {
          name?: string;
          description?: string;
          category?: string;
          agents?: string[];
        };

        return {
          name,
          description: data.description || "No description",
          category: data.category,
          agents: data.agents || []
        };
      } catch {
        return {
          name,
          description: "Unable to parse",
          category: undefined,
          agents: []
        };
      }
    })
  );

  return results;
}

function selectAgentsFromFlags(agentFlags: string[] | undefined): string[] {
  if (!agentFlags || agentFlags.length === 0) {
    return ["claude-code"];
  }

  const unique = [...new Set(agentFlags)];
  const invalid = unique.filter((agent) => !AGENT_MAP.has(agent));
  if (invalid.length > 0) {
    throw new Error(`Unsupported agent(s): ${invalid.join(", ")}`);
  }

  return unique;
}

function targetBasePath(agent: string, useGlobal: boolean): string {
  const target = AGENT_MAP.get(agent);
  if (!target) {
    throw new Error(`Unknown agent: ${agent}`);
  }

  return useGlobal ? target.globalPath : path.resolve(process.cwd(), target.projectPath);
}

function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

async function installSkill(options: {
  repo: string;
  skill: string;
  agent?: string;
  useGlobal?: boolean;
  customPath?: string;
}): Promise<ManifestEntry> {
  const normalizedSkill = normalizeSkillName(options.skill);
  const content = await fetchText(buildRawSkillUrl(options.repo, normalizedSkill));

  let base: string;
  if (options.customPath) {
    base = options.customPath;
  } else if (options.agent) {
    base = targetBasePath(options.agent, Boolean(options.useGlobal));
  } else {
    base = path.resolve(process.cwd(), "skills");
  }

  const skillDir = path.join(base, normalizedSkill);
  const skillFile = path.join(skillDir, "SKILL.md");

  await fs.mkdir(skillDir, { recursive: true });
  await fs.writeFile(skillFile, content, "utf8");

  return {
    repo: options.repo,
    skill: normalizedSkill,
    agent: options.agent || "custom",
    installPath: skillFile,
    hash: hashContent(content),
    installedAt: new Date().toISOString()
  };
}

function upsertManifestEntry(manifest: Manifest, entry: ManifestEntry): Manifest {
  const filtered = manifest.entries.filter(
    (existing) => !(existing.repo === entry.repo && existing.skill === entry.skill && existing.agent === entry.agent)
  );
  return {
    ...manifest,
    entries: [...filtered, entry]
  };
}

async function commandAdd(repo: string, options: { skill?: string; agent?: string[]; all?: boolean; global?: boolean; path?: string }) {
  const useGlobal = Boolean(options.global);
  const customPath = options.path ? path.resolve(options.path) : undefined;
  const hasAgents = options.agent && options.agent.length > 0;

  // If neither --path nor --agent given, default to ./skills in cwd
  const selectedAgents = (!customPath && hasAgents)
    ? selectAgentsFromFlags(options.agent)
    : customPath ? [] : null;

  const skillNames = options.skill
    ? [normalizeSkillName(options.skill)]
    : await listRemoteSkillNames(repo);

  if (!skillNames.length) {
    console.log("No skills found to install.");
    return;
  }

  let manifest = await loadManifest();
  let installCount = 0;

  if (customPath || (!hasAgents)) {
    // Path mode or default ./skills mode
    const baseDir = customPath ?? path.resolve(process.cwd(), "skills");
    for (const skill of skillNames) {
      const entry = await installSkill({ repo, skill, customPath: baseDir });
      manifest = upsertManifestEntry(manifest, entry);
      installCount += 1;
      console.log(`Installed ${skill} -> ${entry.installPath}`);
    }
  } else {
    // Agent mode
    for (const skill of skillNames) {
      for (const agent of selectedAgents!) {
        const entry = await installSkill({ repo, skill, agent, useGlobal });
        manifest = upsertManifestEntry(manifest, entry);
        installCount += 1;
        console.log(`Installed ${skill} for ${agent} -> ${entry.installPath}`);
      }
    }
  }

  await saveManifest(manifest);
  console.log(`Done. Installed ${installCount} item(s).`);
}

async function commandListInstalled() {
  const manifest = await loadManifest();
  if (manifest.entries.length === 0) {
    console.log("No installed skills found.");
    return;
  }

  const sorted = [...manifest.entries].sort((a, b) => a.skill.localeCompare(b.skill));
  for (const entry of sorted) {
    console.log(`${entry.skill} [${entry.agent}] from ${entry.repo}`);
    console.log(`  ${entry.installPath}`);
  }
}

async function commandListAvailable(repo: string) {
  const remote = await listRemoteSkills(repo);
  if (remote.length === 0) {
    console.log("No skills found in remote registry.");
    return;
  }

  for (const entry of remote) {
    console.log(`${entry.name} - ${entry.description}`);
  }
}

async function commandFind(query: string, options: { repo?: string }) {
  const repo = options.repo || DEFAULT_REPO;
  const allSkills = await listRemoteSkills(repo);
  const q = query.toLowerCase().trim();
  const filtered = allSkills.filter(
    (skill) => skill.name.toLowerCase().includes(q) || skill.description.toLowerCase().includes(q)
  );

  if (!filtered.length) {
    console.log("No matching skills found.");
    return;
  }

  for (const skill of filtered) {
    console.log(`${skill.name} - ${skill.description}`);
    console.log(`  npx zskills add ${repo} --skill ${skill.name}`);
  }
}

async function commandRemove(skill?: string, options?: { all?: boolean; agent?: string[] }) {
  let manifest = await loadManifest();
  if (manifest.entries.length === 0) {
    console.log("Nothing to remove.");
    return;
  }

  const selectedAgents = options?.agent && options.agent.length > 0 ? new Set(selectAgentsFromFlags(options.agent)) : null;
  const removeAll = Boolean(options?.all);
  const normalizedSkill = skill ? normalizeSkillName(skill) : undefined;

  const toRemove = manifest.entries.filter((entry) => {
    if (selectedAgents && !selectedAgents.has(entry.agent)) {
      return false;
    }
    if (removeAll) {
      return true;
    }
    if (normalizedSkill) {
      return entry.skill === normalizedSkill;
    }
    return false;
  });

  if (toRemove.length === 0) {
    console.log("No matching installed skills found.");
    return;
  }

  for (const entry of toRemove) {
    const skillDir = path.dirname(entry.installPath);
    await fs.rm(skillDir, { recursive: true, force: true });
    console.log(`Removed ${entry.skill} for ${entry.agent}`);
  }

  manifest.entries = manifest.entries.filter((entry) => !toRemove.includes(entry));
  await saveManifest(manifest);
  console.log(`Done. Removed ${toRemove.length} item(s).`);
}

async function commandCheck() {
  const manifest = await loadManifest();
  if (manifest.entries.length === 0) {
    console.log("No installed skills to check.");
    return;
  }

  let updates = 0;

  for (const entry of manifest.entries) {
    try {
      const latest = await fetchText(buildRawSkillUrl(entry.repo, entry.skill));
      const latestHash = hashContent(latest);
      if (latestHash !== entry.hash) {
        updates += 1;
        console.log(`Update available: ${entry.skill} [${entry.agent}]`);
      }
    } catch {
      console.log(`Unable to check: ${entry.skill} [${entry.agent}]`);
    }
  }

  if (updates === 0) {
    console.log("All installed skills are up to date.");
  } else {
    console.log(`${updates} installed item(s) have updates.`);
  }
}

async function commandUpdate() {
  const manifest = await loadManifest();
  if (manifest.entries.length === 0) {
    console.log("No installed skills to update.");
    return;
  }

  let updated = 0;
  let nextManifest = manifest;

  for (const entry of manifest.entries) {
    try {
      const latest = await fetchText(buildRawSkillUrl(entry.repo, entry.skill));
      const latestHash = hashContent(latest);
      if (latestHash === entry.hash) {
        continue;
      }

      await fs.mkdir(path.dirname(entry.installPath), { recursive: true });
      await fs.writeFile(entry.installPath, latest, "utf8");

      nextManifest = upsertManifestEntry(nextManifest, {
        ...entry,
        hash: latestHash,
        installedAt: new Date().toISOString()
      });

      updated += 1;
      console.log(`Updated ${entry.skill} [${entry.agent}]`);
    } catch {
      console.log(`Failed to update ${entry.skill} [${entry.agent}]`);
    }
  }

  await saveManifest(nextManifest);
  console.log(updated === 0 ? "No updates found." : `Updated ${updated} item(s).`);
}

async function commandInit(name: string) {
  const slug = normalizeSkillName(name);
  if (!slug) {
    throw new Error("Skill name cannot be empty.");
  }

  const skillDir = path.resolve(process.cwd(), slug);
  const skillPath = path.join(skillDir, "SKILL.md");

  await fs.mkdir(skillDir, { recursive: true });
  const content = SKILL_TEMPLATE.replaceAll("skill-name", slug).replace("your-handle", "optional-handle");
  await fs.writeFile(skillPath, content, "utf8");

  console.log(`Created ${skillPath}`);
}

const program = new Command();
program.name("zskills").description("ZSkills CLI").version(VERSION);

program
  .command("add")
  .argument("<repo>", "GitHub repo (owner/name)")
  .option("--skill <name>", "Install one specific skill")
  .option("-a, --agent <agent>", "Target agent slug (e.g. claude-code, copilot)", (value, previous: string[]) => {
    previous.push(value);
    return previous;
  }, [])
  .option("--all", "Install all skills from repo")
  .option("--global", "Install into global agent path")
  .option("--path <dir>", "Custom output directory (overrides agent paths, default: ./skills)")
  .action(async (repo, options) => {
    await commandAdd(repo, options);
  });

program
  .command("list")
  .description("List available skills (or installed with --installed)")
  .option("--installed", "List installed skills only")
  .option("--repo <repo>", "Repo to list from", DEFAULT_REPO)
  .action(async (options) => {
    if (options.installed) {
      await commandListInstalled();
      return;
    }

    await commandListAvailable(options.repo || DEFAULT_REPO);
  });

program
  .command("find")
  .argument("<query>", "Search term")
  .option("--repo <repo>", "Repo to search", DEFAULT_REPO)
  .action(async (query, options) => {
    await commandFind(query, options);
  });

program.command("check").description("Check for skill updates").action(commandCheck);
program.command("update").description("Update installed skills").action(commandUpdate);

program
  .command("remove")
  .argument("[skill]", "Skill slug to remove")
  .option("--all", "Remove all installed skills")
  .option("-a, --agent <agent>", "Agent filter", (value, previous: string[]) => {
    previous.push(value);
    return previous;
  }, [])
  .action(async (skill, options) => {
    await commandRemove(skill, options);
  });

program.command("init").argument("<name>", "New skill name").action(commandInit);

program.parseAsync().catch((error) => {
  const message = error instanceof Error ? error.message : "Unexpected error";
  console.error(`zskills error: ${message}`);
  process.exit(1);
});
