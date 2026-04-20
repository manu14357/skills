# How to Add a Skill

This guide walks you through creating and submitting a new skill to the repository.

---

## Step 1: Understand what a skill is

A skill is a self-contained set of instructions that tells an AI assistant how to behave for a specific domain or task. It lives in its own folder under `skills/` and contains at minimum a `SKILL.md` file.

---

## Step 2: Choose a skill name

- Use lowercase with hyphens: `my-skill-name`
- Be descriptive and concise
- Check existing skills to avoid duplicates

---

## Step 3: Create the skill folder

```
skills/
└── your-skill-name/
    ├── SKILL.md
    └── examples/          ← optional
        └── example-1.md
```

---

## Step 4: Write the SKILL.md

Use the [skill template](./skill-template.md) as your starting point. Your `SKILL.md` should include:

- **Description** — One sentence summary
- **When to Use** — Trigger conditions and phrases
- **When NOT to Use** — Exclusions and alternatives
- **Instructions** — Detailed AI behavior rules
- **Examples** — At least one concrete usage example

---

## Step 5: Submit a Pull Request

1. Fork the repository
2. Create a branch: `git checkout -b skill/your-skill-name`
3. Add your skill folder
4. Open a PR targeting `main`
5. Fill in the PR description

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the full contribution process.
