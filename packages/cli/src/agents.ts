import os from "node:os";
import path from "node:path";

export type AgentInstallTarget = {
  slug: string;
  projectPath: string;
  globalPath: string;
};

export const AGENT_TARGETS: AgentInstallTarget[] = [
  { slug: "claude-code", projectPath: ".claude/skills", globalPath: path.join(os.homedir(), ".claude/skills") },
  { slug: "cursor", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".cursor/skills") },
  { slug: "codex", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".codex/skills") },
  { slug: "opencode", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".config/opencode/skills") },
  { slug: "windsurf", projectPath: ".windsurf/skills", globalPath: path.join(os.homedir(), ".codeium/windsurf/skills") },
  { slug: "cline", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".agents/skills") },
  { slug: "github-copilot", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".copilot/skills") },
  { slug: "gemini-cli", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".gemini/skills") },
  { slug: "roo", projectPath: ".roo/skills", globalPath: path.join(os.homedir(), ".roo/skills") },
  { slug: "continue", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".continue/skills") },
  { slug: "augment", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".augment/skills") },
  { slug: "goose", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".goose/skills") },
  { slug: "openhands", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".openhands/skills") },
  { slug: "trae", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".trae/skills") },
  { slug: "zencoder", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".zencoder/skills") },
  { slug: "kilo", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".kilo/skills") },
  { slug: "qwen-code", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".qwen-code/skills") },
  { slug: "amp", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".amp/skills") },
  { slug: "sourcegraph-cody", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".sourcegraph/cody/skills") },
  { slug: "replit-agent", projectPath: ".agents/skills", globalPath: path.join(os.homedir(), ".replit/skills") }
];

export const AGENT_MAP = new Map(AGENT_TARGETS.map((entry) => [entry.slug, entry]));
