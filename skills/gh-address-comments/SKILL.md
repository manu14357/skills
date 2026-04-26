---
name: gh-address-comments
description: Address GitHub PR review comments and issue feedback using the gh CLI. Fetch all comments, summarize review threads, and apply fixes with explicit user approval.
compatibility:
  use-case: Code review workflow, PR collaboration, feedback handling
  frameworks: GitHub CLI, PR workflow
---

# GitHub PR Address Comments

## Use This Skill When

- Need to address review comments on your open GitHub PR
- Want to systematically handle all feedback threads
- Making code changes in response to reviewer suggestions
- Need visibility into all pending comments before responding
- Want to batch-address multiple review items

## When NOT to Use

- Responding directly on GitHub (can do manually)
- Complex discussions requiring back-and-forth debate
- Comments needing legal/compliance review
- Working on closed/merged PRs

## Context: PR Feedback Workflow Maturity

**Undeveloped**: Manual review, ad-hoc responses, forget some comments.

**Target**: Fetch all comments, list with summaries, apply fixes after user selects which to address.

**Optimized**: Auto-categorize by type (bug, style, enhancement), suggest fixes for each, batch commit with reply threads.

## Core Principle

**Address feedback systematically.** Fetch all comments, understand context, let user choose priorities, then apply fixes — reducing friction in PR review cycles.

## Instructions

### Step 1: Verify gh CLI Authentication

**Check authentication status:**
```bash
gh auth status
```

**If not authenticated:**
```bash
gh auth login
# Select GitHub.com
# Select SSH or HTTPS
# Authorize with browser
```

**Verify workflow/repo scopes:**
```bash
gh auth status --show-token  # Verify scopes include "repo" and "workflow"
```

### Step 2: Locate Current PR

**Find PR for current branch:**
```bash
gh pr view --json number,title,url,state
```

**Or specify PR explicitly:**
```bash
gh pr view 123 --json number,title,url,state
# or
gh pr view https://github.com/owner/repo/pull/123
```

### Step 3: Fetch All Review Comments

**Pull all comments and review threads:**
```bash
# Run helper script (if available)
python scripts/fetch_comments.py

# Or manual approach:
gh pr view [PR] --json reviews --jq '.reviews[]'
```

**Output includes:**
- Reviewer name
- Comment text
- Status (approved, commented, changes requested)
- Threading structure

### Step 4: Summarize and Prioritize Comments

**Organize comments for user review:**

```markdown
# PR Comments to Address

## Review Thread 1: "Add error handling" (Changes Requested by @reviewer-name)
**Line**: src/utils.ts:42
**Comment**: "This function should handle null values gracefully"
**Context**: [Code snippet]
**Priority**: High — blocking approval
**Fix needed**: Add try-catch or validation

---

## Review Thread 2: "Typo in variable name" (Commented by @reviewer-name)
**Line**: src/types.ts:15
**Comment**: "Should this be `userAuthToken` instead of `userAuthTOKEN`?"
**Priority**: Medium — style
**Fix needed**: Rename variable

---

## Review Thread 3: "Nice refactoring!" (Approved by @reviewer-name)
**Status**: ✓ Approved
**Action**: No response needed
```

### Step 5: Ask User Which Comments to Address

**Present prioritized list:**
```
Select which comments to address (enter numbers separated by comma):

[ 1] High: Add error handling (Line 42)
[ 2] Medium: Fix typo in variable name (Line 15)  
[ 3] Low: Consider adding JSDoc comment (Line 8)

Enter selection (e.g., "1,2"):
```

### Step 6: Apply Fixes

**For each selected comment:**

1. **Navigate to line/file**
   ```bash
   code src/utils.ts:42  # Open editor at line
   ```

2. **Make required changes**
   - Apply fix (add error handling, rename variable, etc.)
   - Test locally if needed

3. **Commit changes**
   ```bash
   git add [files]
   git commit -m "Address review feedback: [comment theme]"
   git push
   ```

4. **Reply to comment (optional)**
   ```bash
   gh pr review [PR] --comment -b "Fixed: Added error handling for null values"
   ```

### Step 7: Verify Updated Status

**Check if review is now satisfied:**
```bash
gh pr view [PR] --json reviewDecisions,statusCheckRollup
```

**If approved:**
```bash
gh pr merge [PR] --squash --delete-branch
```

## Common Workflows

**Address all blocking comments:**
```bash
gh pr view [PR] --json reviews --jq '.reviews[] | select(.state=="CHANGES_REQUESTED")'
# Then select those for addressing
```

**Reply to specific comment:**
```bash
gh pr comment [PR] -b "Fixed in latest commit. Thanks for the feedback!"
```

**Re-request review after fixing:**
```bash
gh pr review [PR] --request-review @reviewer-name
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **gh not authenticated** | Run `gh auth login` and select scopes including repo/workflow |
| **Rate limit errors** | Wait a few minutes or check `gh auth status` for token validity |
| **Can't see PR** | Verify you're on correct branch or provide explicit PR number/URL |
| **Comments not showing** | Ensure gh is fully authenticated with `gh auth refresh` |

## Output

**Deliver:**

1. **Organized comment list** with context and priorities
2. **User selections** (which comments to address)
3. **Applied changes** with commit links
4. **Updated PR status** (approved/changes requested/etc.)