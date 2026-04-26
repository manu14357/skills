# Skills

A curated, open-source collection of reusable AI skills — structured prompts and instructions designed to give AI assistants specialized capabilities across different domains.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Contributors](https://img.shields.io/github/contributors/manu14357/skills)](https://github.com/manu14357/skills/graphs/contributors)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)](https://github.com/manu14357/skills)

---

## What is this?

Each **skill** is a self-contained folder with a `SKILL.md` file that describes:

- **What** the skill does
- **When** to use it
- **How** the AI should behave when the skill is active

Skills can be composed together — multiple skills can apply to a single request.

---

## Project Structure

```
skills/
├── skills/                    # Individual skill folders
│   └── <skill-name>/
│       ├── SKILL.md           # Skill instructions & metadata
│       └── examples/          # (optional) usage examples
├── docs/
│   ├── how-to-add-a-skill.md  # Guide for contributors
│   └── skill-template.md      # Template for new skills
├── CONTRIBUTING.md
├── CONTRIBUTORS.md
├── CODE_OF_CONDUCT.md
├── LICENSE
└── README.md
```

---

## Getting Started

### Using a Skill

1. Browse the [`skills/`](./skills/) directory
2. Open the skill folder relevant to your use case
3. Read the `SKILL.md` to understand the skill's purpose and trigger conditions
4. Reference the skill in your AI assistant or tool as instructed

### Adding a Skill

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to contribute a new skill.

A ready-to-use template is at [docs/skill-template.md](./docs/skill-template.md).

---

## Available Skills

### Azure & Cloud Skills (18)

- [appinsights-instrumentation](./skills/appinsights-instrumentation/SKILL.md)
- [azure-aigateway](./skills/azure-aigateway/SKILL.md)
- [azure-cloud-migrate](./skills/azure-cloud-migrate/SKILL.md)
- [azure-compliance](./skills/azure-compliance/SKILL.md)
- [azure-compute](./skills/azure-compute/SKILL.md)
- [azure-deploy](./skills/azure-deploy/SKILL.md)
- [azure-diagnostics](./skills/azure-diagnostics/SKILL.md)
- [azure-hosted-copilot-sdk](./skills/azure-hosted-copilot-sdk/SKILL.md)
- [azure-kusto](./skills/azure-kusto/SKILL.md)
- [azure-messaging](./skills/azure-messaging/SKILL.md)
- [azure-prepare](./skills/azure-prepare/SKILL.md)
- [azure-quotas](./skills/azure-quotas/SKILL.md)
- [azure-rbac](./skills/azure-rbac/SKILL.md)
- [azure-resource-lookup](./skills/azure-resource-lookup/SKILL.md)
- [azure-resource-visualizer](./skills/azure-resource-visualizer/SKILL.md)
- [azure-storage](./skills/azure-storage/SKILL.md)
- [azure-validate](./skills/azure-validate/SKILL.md)
- [entra-app-registration](./skills/entra-app-registration/SKILL.md)

### Minimalist Entrepreneur Skills (10)

- [company-values](./skills/company-values/SKILL.md)
- [find-community](./skills/find-community/SKILL.md)
- [first-customers](./skills/first-customers/SKILL.md)
- [grow-sustainably](./skills/grow-sustainably/SKILL.md)
- [marketing-plan](./skills/marketing-plan/SKILL.md)
- [minimalist-review](./skills/minimalist-review/SKILL.md)
- [mvp](./skills/mvp/SKILL.md)
- [pricing](./skills/pricing/SKILL.md)
- [processize](./skills/processize/SKILL.md)
- [validate-idea](./skills/validate-idea/SKILL.md)

### Development & Engineering (15)

- [codebase-migrate](./skills/codebase-migrate/SKILL.md)
- [deploy-pipeline](./skills/deploy-pipeline/SKILL.md)
- [gh-address-comments](./skills/gh-address-comments/SKILL.md)
- [gh-fix-ci](./skills/gh-fix-ci/SKILL.md)
- [helium-mcp](./skills/helium-mcp/SKILL.md)
- [linear](./skills/linear/SKILL.md)
- [mcp-builder](./skills/mcp-builder/SKILL.md)
- [pr-review-ci-fix](./skills/pr-review-ci-fix/SKILL.md)
- [skill-creator](./skills/skill-creator/SKILL.md)
- [skill-installer](./skills/skill-installer/SKILL.md)
- [template-skill](./skills/template-skill/SKILL.md)
- [webapp-testing](./skills/webapp-testing/SKILL.md)

### Communication & Documentation (9)

- [changelog-generator](./skills/changelog-generator/SKILL.md)
- [content-research-writer](./skills/content-research-writer/SKILL.md)
- [email-draft-polish](./skills/email-draft-polish/SKILL.md)
- [internal-comms](./skills/internal-comms/SKILL.md)
- [meeting-insights-analyzer](./skills/meeting-insights-analyzer/SKILL.md)
- [meeting-notes-and-actions](./skills/meeting-notes-and-actions/SKILL.md)
- [tailored-resume-generator](./skills/tailored-resume-generator/SKILL.md)
- [image-enhancer](./skills/image-enhancer/SKILL.md)
- [video-downloader](./skills/video-downloader/SKILL.md)

### Project & Knowledge Management (6)

- [issue-triage](./skills/issue-triage/SKILL.md)
- [notion-knowledge-capture](./skills/notion-knowledge-capture/SKILL.md)
- [notion-meeting-intelligence](./skills/notion-meeting-intelligence/SKILL.md)
- [notion-research-documentation](./skills/notion-research-documentation/SKILL.md)
- [notion-spec-to-implementation](./skills/notion-spec-to-implementation/SKILL.md)
- [support-ticket-triage](./skills/support-ticket-triage/SKILL.md)

### Sales & Research (6)

- [competitive-ads-extractor](./skills/competitive-ads-extractor/SKILL.md)
- [domain-name-brainstormer](./skills/domain-name-brainstormer/SKILL.md)
- [lead-research-assistant](./skills/lead-research-assistant/SKILL.md)
- [langsmith-fetch](./skills/langsmith-fetch/SKILL.md)
- [raffle-winner-picker](./skills/raffle-winner-picker/SKILL.md)
- [sentry-triage](./skills/sentry-triage/SKILL.md)

### Design & UI (5)

- [canvas-design](./skills/canvas-design/SKILL.md)
- [frontend-design](./skills/frontend-design/SKILL.md)
- [paperjsx](./skills/paperjsx/SKILL.md)
- [shadcn](./skills/shadcn/SKILL.md)
- [theme-factory](./skills/theme-factory/SKILL.md)

### Marketing & Content (6)

- [brand-guidelines](./skills/brand-guidelines/SKILL.md)
- [connect](./skills/connect/SKILL.md)
- [connect-apps](./skills/connect-apps/SKILL.md)
- [create-plan](./skills/create-plan/SKILL.md)
- [file-organizer](./skills/file-organizer/SKILL.md)
- [invoice-organizer](./skills/invoice-organizer/SKILL.md)

### Automation & Integration (5)

- [composio-skills](./skills/composio-skills/SKILL.md)
- [datadog-logs](./skills/datadog-logs/SKILL.md)
- [skill-share](./skills/skill-share/SKILL.md)
- [slack-gif-creator](./skills/slack-gif-creator/SKILL.md)
- [spreadsheet-formula-helper](./skills/spreadsheet-formula-helper/SKILL.md)

**Total: 77 skills**

---

## Contributing

Contributions are welcome! Whether you're fixing a typo, improving an existing skill, or adding a brand new one — please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

---

## Contributors

Thanks to everyone who has contributed to this project! See [CONTRIBUTORS.md](./CONTRIBUTORS.md).

---

## License

This project is licensed under the [MIT License](./LICENSE).

© 2026 [manu14357](https://github.com/manu14357) and contributors.
