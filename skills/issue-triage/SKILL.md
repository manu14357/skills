---
name: issue-triage
description: Triage Linear or Jira backlogs and run bug sweeps via the Composio CLI. Bulk-fetch issues, deduplicate, relabel, reassign, and post summaries all from the shell.
compatibility:
  use-case: Issue management, bug triage, backlog grooming
  frameworks: Linear, Jira, Composio CLI
---

# Issue Triage (Linear / Jira)

## Use This Skill When

- Running weekly triage sessions on backlogs
- Bug sweeps after releases to prioritize and assign
- Cleaning up unassigned or stale issues
- Cross-tool sync (Sentry errors to Linear issues)
- Deduplicating multiple reports of same bug
- Bulk-updating labels, priorities, or assignments
- Generating triage summaries for team sync

## When NOT to Use

- Individual issue creation (use Linear/Jira UI)
- Complex workflow automation (use native workflows)
- Issues requiring detailed investigation (do manually)
- Sensitive security issues (handle separately)

## Context: Triage Efficiency Maturity

**Undeveloped**: Manual clicking through UI, slow, inconsistent prioritization.

**Target**: CLI-based bulk fetch, dedupe, label, assign, and report in one command.

**Optimized**: Automated daily sweeps, smart dedup, predictive prioritization, team alerts.

## Core Principle

**Triage at scale requires automation.** Instead of clicking through the UI for every issue, fetch the backlog, apply logic programmatically, and hand back a clean list — saving hours and improving consistency.

## Instructions

### Step 1: Install and Link Composio CLI

**Install:**
```bash
curl -fsSL https://composio.dev/install | bash
composio login
```

**Link Linear or Jira:**
```bash
composio link linear  # For Linear
# or
composio link jira    # For Jira
```

### Step 2: Discover Available Actions

**Search for issue management tools:**

| Action | Purpose | Toolkit |
|--------|---------|---------|
| List Issues | Fetch backlog slice | linear / jira |
| Create Issue | Add new issue | linear / jira |
| Update Issue | Change status/labels/priority | linear / jira |
| Add Comment | Reply to issue thread | linear / jira |
| Assign Issue | Assign owner | linear / jira |
| Create Label | Add new label if needed | linear |

**Get schemas:**
```bash
composio tools get-schema LINEAR_LIST_ISSUES
composio tools get-schema LINEAR_UPDATE_ISSUE
```

### Step 3: Pull Backlog Slice

**Fetch unstarted/unassigned issues:**

**Linear:**
```bash
composio execute LINEAR_LIST_ISSUES -d '{
  "filter": {
    "state": { "type": { "eq": "unstarted" } },
    "assignee": { "null": true }
  },
  "first": 100,
  "orderBy": "createdAt"
}'
```

**Jira:**
```bash
composio execute JIRA_SEARCH_FOR_ISSUES_USING_JQL -d '{
  "jql": "status = \"To Do\" AND assignee is EMPTY ORDER BY created DESC",
  "maxResults": 100
}'
```

### Step 4: Analyze and Categorize

**Cluster issues for processing:**

```markdown
## Triage Results: 45 Unassigned Issues

### By Label/Type

**Critical (5 issues)** — Needs immediate attention
- [ISSUE-123]: App crashes on login (Error rate: 15%)
- [ISSUE-124]: Database backup failing
- [ISSUE-125]: Payment processing down

**High (12 issues)** — Assign this sprint
- [ISSUE-201]: Search results pagination broken (affects 20% queries)
- [ISSUE-202]: Mobile menu not responsive (design regression)

**Medium (18 issues)** — Backlog candidates
- [ISSUE-301]: Add dark mode toggle (feature request)
- [ISSUE-302]: Improve error messages (UX enhancement)

**Low (10 issues)** — Someday/Maybe
- [ISSUE-401]: Update documentation (no user impact)
- [ISSUE-402]: Refactor legacy code (tech debt)

### Duplicates Found (3)
- [ISSUE-150, ISSUE-151, ISSUE-152] — All about "login timeout" issue
  → Consolidate into ISSUE-150, close others
```

### Step 5: Apply Bulk Updates

**Update priority/labels for batch:**

```bash
# Mark all critical issues with "critical" label
composio execute LINEAR_UPDATE_ISSUE -d '{
  "issueIdOrKey": "ISSUE-123",
  "labels": ["critical", "blocking"],
  "priority": "URGENT"
}'

# Assign high-priority batch to team lead
composio execute LINEAR_UPDATE_ISSUE -d '{
  "issueIdOrKey": "ISSUE-201",
  "assignee": "team-lead-id",
  "priority": "HIGH"
}'
```

**Or use script for bulk:**

```typescript
// triage.ts
const triageScript = async (payload) => {
  const { issues, action } = payload;
  
  for (const issue of issues) {
    if (action === "mark-critical") {
      await execute("LINEAR_UPDATE_ISSUE", {
        issueIdOrKey: issue.id,
        labels: ["critical"],
        priority: "URGENT"
      });
    } else if (action === "assign-to-sprint") {
      await execute("LINEAR_UPDATE_ISSUE", {
        issueIdOrKey: issue.id,
        cycle: "current-sprint",
        priority: "HIGH"
      });
    } else if (action === "close-duplicate") {
      await execute("LINEAR_UPDATE_ISSUE", {
        issueIdOrKey: issue.id,
        state: "DUPLICATE",
        related: issue.relatedIssueId
      });
    }
  }
};
```

### Step 6: Deduplicate and Link

**Handle duplicate issues:**

```bash
# Close duplicate, link to primary
composio execute LINEAR_UPDATE_ISSUE -d '{
  "issueIdOrKey": "ISSUE-151",
  "state": "DUPLICATE",
  "relatedIssues": [
    { "issueId": "ISSUE-150", "relationType": "is duplicated by" }
  ]
}'

# Add comment explaining consolidation
composio execute LINEAR_CREATE_COMMENT -d '{
  "issueIdOrKey": "ISSUE-151",
  "body": "Closed as duplicate of ISSUE-150. See that issue for tracking."
}'
```

### Step 7: Generate Triage Summary

**Create report for team:**

```markdown
# Weekly Triage Summary — April 28, 2026

## Overview
- Total issues processed: 45
- New issues created: 3
- Issues closed: 8
- Issues assigned this sprint: 12
- Duplicates consolidated: 3

## Action Items This Week

### Critical (Assign immediately)
1. **[ISSUE-123]** App crashes on login
   - Status: Unstarted
   - Assigned to: @engineer-1
   - ETA: Friday EOD

2. **[ISSUE-124]** Database backup failing
   - Status: Unstarted
   - Assigned to: @devops-lead
   - ETA: By Monday

### High Priority (Add to sprint)
- [ISSUE-201]: Search pagination — @engineer-2
- [ISSUE-202]: Mobile menu — @engineer-3
- [ISSUE-203]: Error messages — @engineer-1 (when Issue-123 done)

### Consolidated
- ✓ Closed ISSUE-150, 151, 152 → Merged into primary tracking

### Recommended
- [ ] Create "on-deck" label for issues ready to work
- [ ] Set up automated daily email for critical issues
- [ ] Review "Low" category (10 items) for archival

---

**Next Triage**: May 5, 2026 (weekly Monday 10am)
**Owner**: @triage-lead
```

### Step 8: Schedule Recurring Triages

**Automate workflow:**

```bash
# Create weekly triage script
cat > scripts/weekly-triage.sh << 'EOF'
#!/bin/bash

# Fetch unstarted, unassigned issues
composio execute LINEAR_LIST_ISSUES -d '{
  "filter": { "state": { "type": { "eq": "unstarted" } }, "assignee": { "null": true } },
  "first": 100
}' > /tmp/triage-$(date +%Y%m%d).json

# Post summary to Slack
composio execute SLACK_SEND_MESSAGE -d "{
  \"channel\": \"#engineering\",
  \"text\": \"Weekly Triage Ready — $(jq '.[] | length' /tmp/triage-*.json) issues to review\"
}"
EOF

chmod +x scripts/weekly-triage.sh

# Run via cron (every Monday 9am)
# Add to crontab: 0 9 * * 1 /path/to/scripts/weekly-triage.sh
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Not authenticated** | Run `composio login` and link Linear/Jira again |
| **Rate limiting** | Wait a few mins; Composio has rate limits |
| **Wrong filter results** | Test filter syntax; verify field names with --get-schema |
| **Updates not applying** | Check permissions; ensure issue ID/key format correct |

## Output

**Deliver:**

1. **Backlog Summary** (count by priority/label)
2. **Categorized Issues** (critical, high, medium, low)
3. **Bulk Updates Applied** (labels, assignments, consolidations)
4. **Triage Report** (for team sync)
5. **Next Steps** (recommendations for follow-up)