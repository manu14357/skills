# ZSkills

The open registry for agent skills - built by everyone, for every agent.

ZSkills is a no-login, GitHub-native platform for `SKILL.md` files. Every skill is stored in this repository under `skills/<skill-name>/SKILL.md`. The website and CLI read from GitHub, and submissions/edits are created as pull requests.

## Monorepo Layout

```
.
├── apps/
│   └── web/                 # Next.js 15 app (App Router)
├── packages/
│   └── cli/                 # zskills npm CLI
├── skills/                  # Skill registry (database)
├── .github/workflows/       # validate + auto-merge automation
├── .env.example
└── README.md
```

## Core Principles

- No database for skills
- No login required for contributors
- GitHub pull requests are the write path
- `skills/` directory is the single source of truth

## Website (apps/web)

Built with Next.js 15 + TypeScript + Tailwind.

### Main Pages

- `/` homepage with hero, stats, search, filters, sorting, and install snippets
- `/submit` submit a new skill (creates GitHub PR)
- `/s/[skill-name]` skill detail with overview/raw/history/discussion tabs
- `/edit/[skill-name]` edit an existing skill (creates GitHub PR)
- `/fork/[skill-name]` fork skill into a new one
- `/agent/[agent-name]` browse by agent
- `/category/[category]` browse by category
- `/leaderboard` contributors, installs, and recent edits
- `/docs` CLI and SKILL.md reference

### API Routes

- `GET /api/skills/[name]/skill.md` - raw SKILL.md endpoint for CLI
- `GET /api/skills/[name]/version/[sha]` - historical version for diff
- `POST /api/submit` - create PR adding a skill
- `POST /api/edit` - create PR editing a skill
- `POST /api/revert` - create PR reverting to historical version
- `POST /api/stats/copy` - install-copy telemetry counter

## CLI (packages/cli)

Package name: `zskills`

### Quick start

```bash
# Install globally
npm i -g zskills

# Add all skills from the registry (defaults to manu14357/zskills)
zskills add manu14357/zskills

# Add a single skill for a specific agent
zskills add manu14357/zskills --skill frontend-design
zskills add manu14357/zskills --skill frontend-design -a claude-code
zskills add manu14357/zskills --skill frontend-design -a claude-code -a cursor

# Install globally (not just the current project)
zskills add manu14357/zskills --global
```

### All commands

```bash
zskills add <repo>            # Install skills from a registry repo
zskills list                  # List all available skills in the default registry
zskills list --installed      # List locally installed skills
zskills find <query>          # Search skills by name or description
zskills check                 # Check installed skills for updates
zskills update                # Update all installed skills to latest
zskills remove <skill>        # Remove a specific installed skill
zskills remove --all          # Remove all installed skills
zskills init <name>           # Scaffold a new SKILL.md locally
```

The CLI installs skills into agent-specific directories in your project or globally. The default registry is `manu14357/zskills`.

## SKILL.md Standard

Each skill folder must contain exactly one `SKILL.md` with YAML frontmatter:

```yaml
---
name: skill-name
description: What this skill does and when to trigger it
category: frontend
agents:
  - claude-code
author: optional-handle
---
```

Required fields: `name`, `description`
Optional fields: `category`, `agents`, `author`

## GitHub Automation

### Validate Skill PR (`.github/workflows/validate.yml`)

Runs on pull requests touching `skills/**/SKILL.md` and checks:

- SKILL.md exists in `skills/<name>/SKILL.md`
- frontmatter has `name`
- frontmatter has `description`
- folder name matches `name`
- duplicate skill naming guard

Posts a pass/fail comment on the PR.

### Auto Merge (`.github/workflows/auto-merge.yml`)

After successful validation:

- auto-merges PR to `main`
- comments with live link message
- optionally triggers a Vercel deploy hook

## Environment Variables

Copy from `.env.example`:

```env
GITHUB_READ_TOKEN=
GITHUB_WRITE_TOKEN=
GITHUB_REPO_OWNER=manu14357
GITHUB_REPO_NAME=skills
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
VERCEL_DEPLOY_HOOK_URL=
```

If you are running your own ZSkills repo, replace `manu14357/zskills` with your own `owner/repo`.

## Local Development

```bash
npm install

# Web app (Turbopack enabled)
npm run dev -w @zskills/web

# CLI — run any command locally via tsx
npm run dev -w zskills -- list
npm run dev -w zskills -- add manu14357/zskills --skill frontend-design
npm run dev -w zskills -- --help
```

## Build

```bash
npm run build
```

## Deploy

- Deploy `apps/web` to Vercel
- Set environment variables in Vercel project settings
- Point `GITHUB_REPO_OWNER` + `GITHUB_REPO_NAME` at your ZSkills registry repo

## Status

This repository now includes:

- Next.js ZSkills MVP website
- zskills CLI package scaffold with full command set
- GitHub validation and auto-merge workflows
- Existing `skills/` content as registry data

