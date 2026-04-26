---
name: notion-spec-to-implementation
description: Bridge the gap from product specifications to implemented features. Document requirements, acceptance criteria, tech design, and track implementation progress in Notion.
compatibility:
  use-case: Product development workflow, requirement tracking, feature delivery
  frameworks: Notion, product specs, implementation tracking
---

# Notion Spec-to-Implementation

## Use This Skill When

- Converting product specs into actionable engineering tasks
- Documenting feature requirements and acceptance criteria
- Tracking technical design and implementation progress
- Communicating between Product and Engineering
- Managing feature scope and preventing scope creep
- Documenting decisions about feature implementation

## When NOT to Use

- Bug tracking (use separate system)
- Ad-hoc task management (lightweight features OK)
- Highly complex systems (use dedicated design docs)

## Context: Spec-to-Implementation Maturity

**Undeveloped**: Vague specs; misalignment between Product and Eng; surprises at end.

**Target**: Clear specs, acceptance criteria, technical design, linked to implementation.

**Optimized**: Automated acceptance testing, automated scope tracking, continuous alignment.

## Core Principle

**Clear specs prevent rework.** Detailed specifications with acceptance criteria and technical design reduce surprises and rework between Product and Engineering.

## Instructions

### Step 1: Product Spec Template

**Create Notion database for specs:**

```markdown
## Feature Spec

**Feature Name**: [User-facing feature name]
**Epic**: [Which larger initiative this belongs to]
**Status**: [Proposed / Approved / In Design / Ready for Dev / In Progress / Launched]

**Business Case**:
- Problem: [What user problem does this solve?]
- Target User**: [User persona]
- Expected Outcome: [How do we measure success?]

**Feature Description**:
[Detailed description of what this feature does from user perspective]

### User Stories
1. As a [user type], I want to [action], so that [benefit]
2. As a [user type], I want to [action], so that [benefit]

### Acceptance Criteria
- [ ] Criterion 1: [Specific, testable requirement]
- [ ] Criterion 2: [Specific, testable requirement]
- [ ] Criterion 3: [Specific, testable requirement]

### Out of Scope
- [Explicitly exclude these to prevent scope creep]
```

### Step 2: Technical Design

```markdown
## Technical Design

**Assigned To**: [Engineering Lead]

**Design Approach**:
[1-2 paragraph explanation of how this will be built]

**Architecture**:
[ASCII diagram or description of system components affected]

**Database Changes**:
- [ ] New table: [Table name with schema]
- [ ] Modify table: [Changes]

**API Changes**:
- [ ] New endpoint: `POST /api/feature`
- [ ] Modified endpoint: `GET /api/resource`

**Frontend Changes**:
- [ ] New component: [Component name]
- [ ] Modified component: [Component name]

**Third-party Integrations**:
- [ ] Required: [Service name]
- [ ] Optional: [Service name]

**Performance Considerations**:
- Expected QPS: [Queries per second]
- Latency target: [ms]
- Data size: [GB]

**Security Considerations**:
- [ ] Authentication required
- [ ] Authorization required
- [ ] Data encryption needed

**Rollback Plan**:
- How to revert if needed: [Approach]
```

### Step 3: Implementation Tracking

```markdown
## Implementation Tasks

| Task | Owner | Status | Size | Dependency |
|------|-------|--------|------|-----------|
| Backend: Create API endpoint | John | In Progress | M | None |
| Database schema migration | Maria | Not started | M | Backend API |
| Frontend: Build component | Sarah | Not started | L | Backend API |
| Testing: Write tests | Tom | Not started | L | All above |
| Documentation | John | Not started | S | Testing |

**Size Legend**: S (< 4h), M (4-8h), L (8-16h), XL (> 16h)
```

### Step 4: Acceptance Testing

```markdown
## Acceptance Testing

**Test Plan**:

| Test Scenario | Steps | Expected Result | Status |
|---------------|-------|-----------------|--------|
| Happy path | 1. Do X, 2. Do Y, 3. Check Z | Z shows success | [ ] |
| Edge case 1 | 1. Do X with empty input | Error message shown | [ ] |
| Edge case 2 | 1. Do X with max data | No timeout | [ ] |

**Acceptance Criteria Verification**:
- [ ] Criterion 1: Tested and passes
- [ ] Criterion 2: Tested and passes
- [ ] Criterion 3: Tested and passes
```

### Step 5: Launch Checklist

```markdown
## Pre-Launch Checklist

**Technical**:
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Performance tested
- [ ] Security reviewed
- [ ] Monitoring/alerts configured
- [ ] Rollback procedure tested

**Product**:
- [ ] Product sign-off
- [ ] Documentation complete
- [ ] Help content updated
- [ ] Marketing/comms ready

**Operational**:
- [ ] Database migrations prepared
- [ ] Deployment runbook created
- [ ] On-call engineer briefed
- [ ] Metrics dashboard created
```

### Step 6: Post-Launch Monitoring

```markdown
## Post-Launch Tracking

**Metrics to Monitor**:
- Adoption rate: [% of users trying feature]
- Error rate: [% of requests failing]
- Performance: [Response time, p95 latency]
- User feedback: [Sentiment, NPS]

**Launch Day Actions**:
- 9am: Deployment + monitoring
- 10am: First user adoption wave
- 12pm: Check metrics and error rates
- EOD: Summary and findings

**30-Day Retrospective**:
- Did we hit adoption targets?
- Were there unexpected issues?
- What would we do differently?
```

## Output

**Deliver:**

1. **Product Spec** (feature description, acceptance criteria)
2. **Technical Design** (architecture, implementation approach)
3. **Implementation Tracking** (tasks, owners, status)
4. **Acceptance Testing** (test plan and results)
5. **Launch Checklist** (pre and post-launch verification)