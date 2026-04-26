# ASkills Web

Next.js 15 application for ASkills.

## Run locally

1. Copy root `.env.example` values into environment variables.
2. Install dependencies at repo root:

   npm install

3. Start the web app:

   npm run dev -w @askills/web

## Routes

- `/` homepage with search/filter/sort
- `/submit` submit new skill
- `/s/[skill-name]` skill detail, raw, history, discussion
- `/edit/[skill-name]` edit existing skill
- `/fork/[skill-name]` fork existing skill as new
- `/agent/[agent-name]` skills for one agent
- `/category/[category]` skills by category
- `/leaderboard` community stats
- `/docs` product + CLI documentation

## API routes

- `GET /api/skills/[name]/skill.md`
- `GET /api/skills/[name]/version/[sha]`
- `POST /api/submit`
- `POST /api/edit`
- `POST /api/revert`
- `POST /api/stats/copy`
