# Contributing to Skills

Thank you for your interest in contributing! This project thrives because of people like you.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Adding a New Skill](#adding-a-new-skill)
- [Improving an Existing Skill](#improving-an-existing-skill)
- [Reporting Issues](#reporting-issues)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)

---

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before contributing.

---

## How Can I Contribute?

- **Add a new skill** — Create a folder under `skills/` with a `SKILL.md`
- **Improve an existing skill** — Refine instructions, fix typos, add examples
- **Report a bug or issue** — Open a [GitHub Issue](https://github.com/manu14357/skills/issues)
- **Suggest a skill** — Open an issue with the `skill-request` label
- **Improve documentation** — Update READMEs, guides, or templates

---

## Adding a New Skill

1. **Fork** the repository and create a new branch:
   ```bash
   git checkout -b skill/your-skill-name
   ```

2. **Create** a folder under `skills/`:
   ```
   skills/your-skill-name/
   ├── SKILL.md
   └── examples/         # optional
       └── example-1.md
   ```

3. **Use the template** at [`docs/skill-template.md`](./docs/skill-template.md) to write your `SKILL.md`.

4. **Ensure your skill**:
   - Has a clear, focused purpose
   - Includes trigger conditions (when to use it)
   - Does not duplicate an existing skill
   - Is written in clear English

5. **Open a Pull Request** targeting the `main` branch.

---

## Improving an Existing Skill

- Edit the relevant `SKILL.md` directly
- Keep changes minimal and focused
- Describe what you changed and why in the PR description

---

## Reporting Issues

Open an issue at [github.com/manu14357/skills/issues](https://github.com/manu14357/skills/issues) with:

- A clear title
- What you expected vs. what happened
- Any relevant context or examples

---

## Pull Request Process

1. Ensure your branch is up to date with `main`
2. Fill in the PR description clearly
3. Link any related issues (`Closes #123`)
4. Wait for review — maintainers aim to respond within a few days
5. Address any requested changes

---

## Style Guide

### SKILL.md files

- Use clear, imperative language ("Use this skill when...", "Do NOT use for...")
- Keep descriptions concise — one sentence preferred
- List trigger phrases in bullet points
- Separate sections with `---`

### Folder naming

- Use lowercase and hyphens: `my-skill-name`
- Be descriptive but concise

---

## Adding Yourself as a Contributor

After your first merged PR, add your name to [CONTRIBUTORS.md](./CONTRIBUTORS.md) in alphabetical order.

---

Thank you for helping make this project better!
