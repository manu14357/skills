---
name: pr-review-ci-fix
description: Review failing CI checks on pull requests, diagnose root causes, and fix issues. Covers common failures: tests, linting, type checks, security scans, and builds.
compatibility:
  use-case: CI/CD debugging, pull request validation, build troubleshooting
  frameworks: GitHub Actions, GitLab CI, Jenkins, common testing frameworks
---

# PR Review and CI Fixes

## Use This Skill When

- Reviewing CI failures on pull requests
- Diagnosing test failures
- Fixing linting or type check errors
- Resolving build failures
- Understanding security scan results
- Unblocking stalled PRs due to CI issues

## When NOT to Use

- Pre-PR testing (run locally first)
- Infrastructure issues (not PR-level)
- Flaky test investigation (broader scope)

## Context: CI Fix Capability Maturity

**Undeveloped**: CI failures unclear; don't know how to fix.

**Target**: Read CI logs, identify root cause, apply fix.

**Optimized**: Automated CI fixes, pattern detection, preventive changes.

## Core Principle

**CI failures are clues, not blockers.** Understanding CI output and common error patterns enables quick diagnosis and fixes.

## Instructions

### Step 1: Understand CI System

**Identify the CI system:**

| System | Log Location | Re-run |
|--------|--------------|--------|
| GitHub Actions | Actions tab on PR | "Re-run jobs" |
| GitLab CI | CI/CD → Pipelines | Re-run button |
| Jenkins | Build console | "Build Again" |
| CircleCI | Checks tab | Rerun workflow |

### Step 2: Read CI Logs

**Locate and analyze logs:**

```
❌ FAILED: Run tests
  → Look for: error message, stack trace, failed test name
  → Key info: Where exactly did it fail?

Example output:
  FAIL  tests/calculator.test.js
  ● Calculator › should add numbers correctly
    Expected: 5
    Received: NaN
    at test (tests/calculator.test.js:12:5)
```

### Step 3: Categorize Failure Type

**Common CI failures:**

| Type | Example | Fix |
|------|---------|-----|
| **Test Failure** | "Expected: 5, Received: NaN" | Fix code to match expectation |
| **Linting Error** | "Unexpected token ';'" | Run linter locally, fix issues |
| **Type Error** | "Cannot find property 'x' on type 'any'" | Add type annotations |
| **Build Error** | "Module not found: 'react'" | Install missing dependencies |
| **Security Scan** | "High severity: SQL injection" | Fix vulnerability |

### Step 4: Test Failure Diagnosis

**Common test issues:**

```markdown
## Test Failure: "Expected 5, Received NaN"

### Root Cause Analysis

**Step 1**: Identify test file location
- File: tests/calculator.test.js, Line 12

**Step 2**: Review test code
```javascript
test('should add numbers correctly', () => {
  const result = add(2, 3);
  expect(result).toBe(5);  // Line 12 failing here
});
```

**Step 3**: Review implementation
```javascript
function add(a, b) {
  return a + b;  // Currently returns NaN
}
```

**Step 4**: Identify issue
- Function returns NaN when called with (2, 3)
- Check: Are parameters being parsed as numbers? Strings?
- Possible fix: `return Number(a) + Number(b);`

**Step 5**: Fix and verify locally
```bash
npm test tests/calculator.test.js
# ✓ Test passes
# Push fix
```
```

### Step 5: Linting Error Fixes

**Common linting issues:**

```markdown
## Linting Error: "Unexpected token ';'"

### Common Causes
- Extra semicolon: Remove
- Missing semicolon: Add
- Quote mismatch: Use consistent quotes
- Unused variable: Remove or use variable

### Auto-fix
```bash
npm run lint -- --fix
# Automatically fixes 80% of errors
```
```

### Step 6: Type Check Errors

**TypeScript/Flow issues:**

```markdown
## Type Error: "Cannot find property 'x' on type 'any'"

### Root Cause
- Variable typed as 'any' but property not guaranteed
- Solution: Add proper type annotation

### Fix
```typescript
// Before
const user: any = getUser();
console.log(user.email);  // TS error

// After
interface User {
  id: number;
  email: string;
}

const user: User = getUser();
console.log(user.email);  // TS OK
```
```

### Step 7: Build/Dependency Errors

**Module not found errors:**

```markdown
## Build Error: "Module not found: 'react'"

### Causes
- Package not installed
- Wrong import path
- Version conflict

### Fix
```bash
# Check if package is installed
npm list react

# If not, install it
npm install react

# If installed but not found, try clean install
rm package-lock.json node_modules/
npm install

# If import path wrong:
# Change: import React from 'react-dom'  ❌
# To:     import React from 'react'      ✓
```
```

### Step 8: Security Scan Failures

**Fix security vulnerabilities:**

```markdown
## Security: "SQL injection vulnerability"

### Scan Output
```
CRITICAL: SQL injection in queries.js:12
  const query = `SELECT * FROM users WHERE id = ${userId}`
                                                     ^^^^^^
  Risk: User input directly in SQL
```

### Fix
```javascript
// Before (vulnerable)
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.run(query);

// After (safe)
const query = 'SELECT * FROM users WHERE id = ?';
db.run(query, [userId]);  // Parameterized query
```
```

### Step 9: Check If PR Needs Changes

**Once logs are analyzed, determine next step:**

```markdown
## CI Fix Decision Tree

1. **Is the error in my code?**
   - Yes → Fix it
   - No → Check dependencies

2. **Did I add a new dependency?**
   - Yes → Verify package-lock.json is committed
   - No → Proceed

3. **Is the test failing?**
   - Yes → Review test logic
   - No → Check environment setup

4. **Can I reproduce locally?**
   - Yes → Fix locally, push
   - No → Might be environment issue; check CI config
```

## Common Fix Checklist

- [ ] Read full CI log (not just error summary)
- [ ] Identify failure type (test/lint/type/build/security)
- [ ] Reproduce issue locally
- [ ] Apply fix
- [ ] Run test/check locally to verify
- [ ] Push changes
- [ ] Monitor CI rerun

## Output

**Deliver:**

1. **Failure Diagnosis** (root cause identified)
2. **Fix Applied** (code changes committed)
3. **Verification** (CI passing, test passing locally)
4. **Documentation** (if issue was non-obvious)