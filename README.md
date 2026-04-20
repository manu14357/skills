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

## Contributing

Contributions are welcome! Whether you're fixing a typo, improving an existing skill, or adding a brand new one — please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

---

## Contributors

Thanks to everyone who has contributed to this project! See [CONTRIBUTORS.md](./CONTRIBUTORS.md).

---

## License

This project is licensed under the [MIT License](./LICENSE).

© 2026 [manu14357](https://github.com/manu14357) and contributors.
