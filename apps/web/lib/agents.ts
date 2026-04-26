export type AgentInfo = {
  slug: string;
  label: string;
  docsUrl: string;
  projectPath: string;
  globalPath: string;
  colorClass: string;
};

const DEFAULT_PROJECT_PATH = ".agents/skills/";
const DEFAULT_GLOBAL_PATH = "~/.agents/skills/";

export const AGENTS: AgentInfo[] = [
  { slug: "claude-code", label: "Claude Code", docsUrl: "https://docs.anthropic.com/", projectPath: ".claude/skills/", globalPath: "~/.claude/skills/", colorClass: "bg-violet-600/20 text-violet-300 border-violet-500/40" },
  { slug: "cursor", label: "Cursor", docsUrl: "https://docs.cursor.com/", projectPath: ".agents/skills/", globalPath: "~/.cursor/skills/", colorClass: "bg-blue-600/20 text-blue-300 border-blue-500/40" },
  { slug: "codex", label: "Codex", docsUrl: "https://platform.openai.com/", projectPath: ".agents/skills/", globalPath: "~/.codex/skills/", colorClass: "bg-emerald-600/20 text-emerald-300 border-emerald-500/40" },
  { slug: "opencode", label: "OpenCode", docsUrl: "https://github.com/", projectPath: ".agents/skills/", globalPath: "~/.config/opencode/skills/", colorClass: "bg-cyan-600/20 text-cyan-300 border-cyan-500/40" },
  { slug: "windsurf", label: "Windsurf", docsUrl: "https://codeium.com/windsurf", projectPath: ".windsurf/skills/", globalPath: "~/.codeium/windsurf/skills/", colorClass: "bg-sky-600/20 text-sky-300 border-sky-500/40" },
  { slug: "cline", label: "Cline", docsUrl: "https://github.com/cline/cline", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-amber-600/20 text-amber-300 border-amber-500/40" },
  { slug: "github-copilot", label: "GitHub Copilot", docsUrl: "https://docs.github.com/copilot", projectPath: ".agents/skills/", globalPath: "~/.copilot/skills/", colorClass: "bg-indigo-600/20 text-indigo-300 border-indigo-500/40" },
  { slug: "gemini-cli", label: "Gemini CLI", docsUrl: "https://ai.google.dev/", projectPath: ".agents/skills/", globalPath: "~/.gemini/skills/", colorClass: "bg-lime-600/20 text-lime-300 border-lime-500/40" },
  { slug: "roo", label: "Roo", docsUrl: "https://github.com/", projectPath: ".roo/skills/", globalPath: "~/.roo/skills/", colorClass: "bg-fuchsia-600/20 text-fuchsia-300 border-fuchsia-500/40" },
  { slug: "continue", label: "Continue", docsUrl: "https://continue.dev/", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-orange-600/20 text-orange-300 border-orange-500/40" },
  { slug: "augment", label: "Augment", docsUrl: "https://www.augmentcode.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-rose-600/20 text-rose-300 border-rose-500/40" },
  { slug: "goose", label: "Goose", docsUrl: "https://github.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-teal-600/20 text-teal-300 border-teal-500/40" },
  { slug: "openhands", label: "OpenHands", docsUrl: "https://www.all-hands.dev/", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-red-600/20 text-red-300 border-red-500/40" },
  { slug: "trae", label: "Trae", docsUrl: "https://github.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-pink-600/20 text-pink-300 border-pink-500/40" },
  { slug: "zencoder", label: "Zencoder", docsUrl: "https://zencoder.ai/", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-yellow-600/20 text-yellow-300 border-yellow-500/40" },
  { slug: "kilo", label: "Kilo", docsUrl: "https://github.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-stone-600/20 text-stone-300 border-stone-500/40" },
  { slug: "qwen-code", label: "Qwen Code", docsUrl: "https://qwenlm.github.io/", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-slate-600/20 text-slate-300 border-slate-500/40" },
  { slug: "amp", label: "Amp", docsUrl: "https://ampcode.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-violet-600/20 text-violet-300 border-violet-500/40" },
  { slug: "sourcegraph-cody", label: "Sourcegraph Cody", docsUrl: "https://docs.sourcegraph.com/cody", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.sourcegraph/cody/skills/", colorClass: "bg-blue-600/20 text-blue-300 border-blue-500/40" },
  { slug: "replit-agent", label: "Replit Agent", docsUrl: "https://docs.replit.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.replit/skills/", colorClass: "bg-orange-600/20 text-orange-300 border-orange-500/40" },
  { slug: "vscode-chat", label: "VS Code Chat", docsUrl: "https://code.visualstudio.com/docs/copilot/chat", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.vscode/skills/", colorClass: "bg-cyan-600/20 text-cyan-300 border-cyan-500/40" },
  { slug: "codeium", label: "Codeium", docsUrl: "https://codeium.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.codeium/skills/", colorClass: "bg-sky-600/20 text-sky-300 border-sky-500/40" },
  { slug: "tabby", label: "Tabby", docsUrl: "https://tabby.tabbyml.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.tabby/skills/", colorClass: "bg-emerald-600/20 text-emerald-300 border-emerald-500/40" },
  { slug: "llama-coder", label: "Llama Coder", docsUrl: "https://github.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-lime-600/20 text-lime-300 border-lime-500/40" },
  { slug: "bito", label: "Bito", docsUrl: "https://docs.bito.ai/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.bito/skills/", colorClass: "bg-indigo-600/20 text-indigo-300 border-indigo-500/40" },
  { slug: "aider", label: "Aider", docsUrl: "https://aider.chat/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.aider/skills/", colorClass: "bg-rose-600/20 text-rose-300 border-rose-500/40" },
  { slug: "sweep", label: "Sweep", docsUrl: "https://docs.sweep.dev/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.sweep/skills/", colorClass: "bg-red-600/20 text-red-300 border-red-500/40" },
  { slug: "marscode", label: "MarsCode", docsUrl: "https://www.marscode.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.marscode/skills/", colorClass: "bg-amber-600/20 text-amber-300 border-amber-500/40" },
  { slug: "codebuddy", label: "CodeBuddy", docsUrl: "https://github.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-fuchsia-600/20 text-fuchsia-300 border-fuchsia-500/40" },
  { slug: "devika", label: "Devika", docsUrl: "https://github.com/stitionai/devika", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-teal-600/20 text-teal-300 border-teal-500/40" },
  { slug: "tabnine", label: "Tabnine", docsUrl: "https://www.tabnine.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.tabnine/skills/", colorClass: "bg-stone-600/20 text-stone-300 border-stone-500/40" },
  { slug: "bolt", label: "Bolt", docsUrl: "https://bolt.new/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.bolt/skills/", colorClass: "bg-yellow-600/20 text-yellow-300 border-yellow-500/40" },
  { slug: "newrelic-codestream", label: "CodeStream", docsUrl: "https://docs.newrelic.com/docs/codestream/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.codestream/skills/", colorClass: "bg-pink-600/20 text-pink-300 border-pink-500/40" },
  { slug: "autogen-studio", label: "AutoGen Studio", docsUrl: "https://microsoft.github.io/autogen/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.autogen/skills/", colorClass: "bg-green-600/20 text-green-300 border-green-500/40" },
  { slug: "phind", label: "Phind", docsUrl: "https://www.phind.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.phind/skills/", colorClass: "bg-purple-600/20 text-purple-300 border-purple-500/40" },
  { slug: "perplexity-coder", label: "Perplexity Coder", docsUrl: "https://www.perplexity.ai/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.perplexity/skills/", colorClass: "bg-cyan-600/20 text-cyan-300 border-cyan-500/40" },
  { slug: "notdiamond", label: "NotDiamond", docsUrl: "https://notdiamond.ai/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.notdiamond/skills/", colorClass: "bg-orange-600/20 text-orange-300 border-orange-500/40" },
  { slug: "openinterpreter", label: "Open Interpreter", docsUrl: "https://docs.openinterpreter.com/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.openinterpreter/skills/", colorClass: "bg-sky-600/20 text-sky-300 border-sky-500/40" },
  { slug: "smol-developer", label: "Smol Developer", docsUrl: "https://github.com/smol-ai/developer", projectPath: DEFAULT_PROJECT_PATH, globalPath: DEFAULT_GLOBAL_PATH, colorClass: "bg-lime-600/20 text-lime-300 border-lime-500/40" },
  { slug: "factory-ai", label: "Factory AI", docsUrl: "https://factory.ai/", projectPath: DEFAULT_PROJECT_PATH, globalPath: "~/.factory/skills/", colorClass: "bg-indigo-600/20 text-indigo-300 border-indigo-500/40" }
];

export const AGENT_MAP = new Map(AGENTS.map((agent) => [agent.slug, agent]));
