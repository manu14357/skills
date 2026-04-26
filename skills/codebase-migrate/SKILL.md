---
name: codebase-migrate
description: Coordinate large-scale codebase migrations and multi-file refactors across hundreds of files. Manage framework upgrades, API renames, and config rewrites using batched PRs, issue tracking, and CI verification.
compatibility:
  use-case: Framework upgrades, API migrations, config rewrites, structural refactors
  frameworks: JavaScript, Python, TypeScript, multi-language support
---

# Codebase Migrate

## Use This Skill When

- Upgrading frameworks (React 17→19, Django 4→5, Node 18→22)
- Renaming APIs or functions across entire codebase
- Migrating configurations (webpack→vite, eslint→biome, jest→vitest)
- Refactoring file structures or naming conventions
- Running codemods on 100+ files simultaneously
- Coordinating changes across monorepos or large projects
- Need reviewable, batched PRs for large-scale changes

## When NOT to Use

- Small single-file changes (use direct edits instead)
- When you want all changes in one massive PR
- Projects without test coverage (risky to batch migrate)
- Custom migrations with complex manual logic
- When CI/CD pipeline is not stable

## Context: Migration Maturity

**Undeveloped**: Single massive PR, hard to review, hard to debug failures.

**Target**: Changes batched into 25–50 file chunks, each PR passes CI, easy to revert per-batch.

**Optimized**: Fully automated pipelines, parallel batch testing, quick rollback, minimal manual intervention.

## Core Principle

Large codebase migrations succeed when broken into **small, reviewable, verifiable chunks**. Batch changes to keep PRs under 10–15 files each, run full tests per batch, and use issue tracking to maintain checkpoint progress.

## Prerequisites

```bash
curl -fsSL https://composio.dev/install | bash
composio login
composio link github        # PR creation + CI status
composio link linear        # Issue tracking (or jira)
```

**Local Tools Required:**
- `git` (version control)
- `rg` / `grep` (file search)
- `jscodeshift` / `ts-morph` / `comby` / `ast-grep` (language-specific codemods)
- Test runner for your language

## Instructions

### Step 1: Define and Scope the Transform

**Good Definition Example:**
- ✓ "Replace `jest.mock` with `vi.mock`, swap `jest.fn()` for `vi.fn()`, rename `jest.config.js` → `vitest.config.ts`"

**Bad Definition Example:**
- ✗ "Migrate to vitest" (too vague)

**Scope the Blast Radius:**

```bash
# Find all files that need changes
rg -l 'jest\.(mock|fn|spyOn)' | wc -l
rg -l 'from "jest"' | sort | wc -l
```

**Document Findings:**
| Metric | Value |
|--------|-------|
| Total files to migrate | X |
| Estimated batch size | 25–50 files |
| Number of batches | X / 25 = N |
| Est. review time per PR | 15–30 min |

### Step 2: File a Tracking Issue

Create a central tracking issue to monitor progress:

```bash
composio execute LINEAR_CREATE_ISSUE -d '{
  "teamId":"TEAM_ID",
  "title":"Migrate: jest → vitest",
  "description":"Batches of ~25 files per PR. Track: batch-1, batch-2, ..."
}'
```

Document the issue ID (e.g., `LIN-482`).

### Step 3: Plan Batch Strategy

**Batch Structure:**

| Batch | Files | Scope | Depends On |
|-------|-------|-------|-----------|
| 1 | 1–25 | Core test config + base setup | None |
| 2 | 26–50 | Unit tests in src/ | Batch 1 ✓ |
| 3 | 51–75 | Integration tests | Batch 2 ✓ |
| N | ... | ... | Batch N-1 ✓ |

**Create Batch List:**

```bash
# Extract files matching pattern
BATCH=$(rg -l 'jest\.mock' | grep -v done.list | head -25)
echo "$BATCH" > batch-01.list
```

### Step 4: Execute Transform Per Batch

**Workflow:**

1. Checkout feature branch
2. Run codemod on batch files
3. Test locally
4. Commit and push
5. Create PR with issue reference
6. Wait for CI green
7. Merge and move to next batch

**Example:**

```bash
# Start batch branch
git checkout -b migrate/vitest-batch-01

# Run codemod (language-specific)
xargs < batch-01.list jscodeshift -t transforms/jest-to-vitest.ts

# Test changed files
npm test -- --changed

# Commit
git add -A
git commit -m "migrate(test): jest → vitest (batch 1 of 8)"
git push -u origin migrate/vitest-batch-01
```

### Step 5: Create PR and Track Progress

**Create PR with automation:**

```bash
composio execute GITHUB_CREATE_A_PULL_REQUEST -d '{
  "owner":"org","repo":"app",
  "head":"migrate/vitest-batch-01","base":"main",
  "title":"migrate(test): jest → vitest (batch 1 of 8)",
  "body":"Issue: LIN-482. Files: batch-01.list. Codemod: jest-to-vitest.ts"
}'
```

**Update tracking issue:**

```bash
composio execute LINEAR_CREATE_COMMENT -d '{
  "issueId":"LIN-482",
  "body":"Batch 1 PR opened. Waiting for CI. Tracking spreadsheet: [link]"
}'
```

### Step 6: Verify and Merge

**Check CI Status:**

```bash
composio execute GITHUB_LIST_WORKFLOW_RUNS_FOR_A_REPOSITORY \
  -d '{"owner":"org","repo":"app","branch":"migrate/vitest-batch-01"}' \
  | jq '.workflow_runs[0].conclusion'
```

**Verify Migration Progress:**

```bash
# Count remaining jest references
rg 'jest\.(mock|fn|spyOn)' | wc -l

# Should trend toward 0 as batches merge
```

**Merge when green:**
- Merge PR to main
- Mark batch as complete in tracking issue
- Start next batch

## Safety Rails

**Critical Rules:**

| Rule | Reason |
|------|--------|
| **One transform per PR** | Never mix rename + format change |
| **Maintain done.list** | Skip already-migrated files in next batch |
| **Full test suite on final batch** | Catch integration issues |
| **Codemod first, hand-edit second** | Patch exceptions manually, note in PR |
| **Per-batch rollback only** | Each PR reverts cleanly |
| **Keep batch size <50 files** | Reviewable in 20–30 minutes |
| **Never force-push merged branches** | Maintain clean history |

## Quality Checklist

After each batch merges:

- ✓ No conflicts with main or other open batches
- ✓ All tests pass (local + CI)
- ✓ Old API references trending to 0
- ✓ No regressions in unrelated code
- ✓ PR reviewed and approved
- ✓ Tracking issue updated with checkpoint

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Codemod regex too broad | Switch to AST-based tool (`ts-morph`, `ast-grep`) |
| Tests pass locally, fail in CI | Check Node/Python version parity (`.nvmrc`, `pyproject.toml`) |
| PR too large to review | Reduce batch size from 50→25 files |
| Batch conflicts | Rebase open batch before merging current one |
| Manual edits in multiple batches | Document in PR description for maintainers |

## Output

Provide:

1. **Migration Plan Document**
   - Scope (file count, complexity)
   - Batch breakdown (number, size)
   - Tracking issue ID
   - Estimated timeline

2. **Per-Batch Deliverables**
   - batch-01.list (files to transform)
   - Codemod script (e.g., jest-to-vitest.ts)
   - PR description template
   - Test instructions

3. **Progress Dashboard**
   - Batch completion status
   - CI pass/fail per batch
   - Issue link for coordination
   - Rollback plan if needed
