---
name: meeting-notes-and-actions
description: Capture meeting notes with clear structure: attendees, agenda, decisions, action items with owners and deadlines. Ensure accountability and alignment post-meeting.
compatibility:
  use-case: Meeting documentation, action tracking, team accountability
  frameworks: Meeting structure, note-taking, task management
---

# Meeting Notes and Actions

## Use This Skill When

- Documenting meeting outcomes with clear action items
- Capturing decisions and key points from discussions
- Tracking who owns what and when it's due
- Creating meeting records for absent team members
- Following up on previous meeting action items
- Preparing meeting summaries for stakeholders

## When NOT to Use

- Real-time transcription (use for post-meeting documentation)
- Highly detailed technical minutiae (focus on decisions)
- Personal notes unrelated to team coordination

## Context: Meeting Documentation Maturity

**Undeveloped**: No notes; vague action items; people forget what was decided.

**Target**: Clear structure with decisions, owners, deadlines; shared and accessible.

**Optimized**: Automated action item reminders, integration with task systems, outcome tracking.

## Core Principle

**Clear notes prevent rework.** Structured meeting documentation with explicit action items, owners, and deadlines eliminates confusion and keeps teams aligned post-meeting.

## Instructions

### Step 1: Meeting Setup

**Before meeting, prepare:**

```markdown
## Meeting: [Title]
**Date**: [Date/Time]
**Location**: [Zoom link / Room]
**Duration**: [Expected]
**Attendees**: [List or "see below"]
```

### Step 2: Document Attendees

```markdown
## Attendees
- [Name] — [Role] (organizer)
- [Name] — [Role]
- [Name] — [Role]
- [Name] — [Role] (absent; update post-meeting)
```

### Step 3: Capture Agenda and Outcomes

```markdown
## Agenda & Outcomes

### Topic 1: [Name]
**Discussion**: [1-2 sentence summary]
**Decision**: [What was decided; not what was discussed]
**Owner**: [If action needed]

### Topic 2: [Name]
**Discussion**: [summary]
**Decision**: [decision or "no decision yet"]

### Topic 3: [Name]
**Discussion**: [summary]
**Decision**: [decision]
```

### Step 4: List Decisions

```markdown
## Decisions Made

| Decision | Owner | Deadline |
|----------|-------|----------|
| Launch feature X | Sarah | June 15 |
| Schedule follow-up on budget | John | June 8 |
| Approve vendor proposal | Maria | June 12 |
```

### Step 5: Action Items

```markdown
## Action Items

| # | Action | Owner | Deadline | Status |
|---|--------|-------|----------|--------|
| 1 | Prepare Q3 roadmap | Sarah | June 12 | Not started |
| 2 | Get legal review on contract | John | June 10 | In progress |
| 3 | Schedule vendor call | Maria | June 8 | Done ✓ |
| 4 | Send budget analysis | Tom | June 15 | Not started |

**Tracking**: Update status weekly in shared doc
```

### Step 6: Risks and Next Steps

```markdown
## Risks & Blockers

- [Risk 1]: [mitigation plan]
- [Blocker 1]: [who will resolve]

## Next Meeting

- **Date**: [Date]
- **Focus**: [1-2 key topics]
- **Pre-work**: [What participants should prepare]
```

### Step 7: Share and Follow Up

**Send meeting summary:**
- Distribution: All attendees + stakeholders
- Format: Email or shared doc link
- Timing: Within 24 hours of meeting

**Weekly action item review:**
- Update status column
- Flag at-risk items
- Celebrate completions

## Output

**Deliver:**

1. **Meeting Notes** (attendees, agenda, decisions)
2. **Action Items Table** (owner, deadline, status)
3. **Decision Log** (for reference)
4. **Next Steps** (follow-up timing)