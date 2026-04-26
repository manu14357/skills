---
name: notion-meeting-intelligence
description: Use Notion to track meeting patterns, identify communication insights, and improve team coordination. Record decisions, attendees, and outcomes for trend analysis.
compatibility:
  use-case: Meeting tracking, communication analysis, team insights
  frameworks: Notion database, meeting patterns, analytics
---

# Notion Meeting Intelligence

## Use This Skill When

- Tracking recurring meeting patterns and effectiveness
- Identifying who should be in which meetings
- Analyzing decision velocity and outcomes
- Building historical record of decisions and changes
- Understanding communication bottlenecks
- Optimizing meeting time across organization

## When NOT to Use

- Real-time meeting facilitation (use during meeting capture)
- Personal meeting notes (capture, then analyze)
- Highly sensitive personnel discussions

## Context: Meeting Intelligence Maturity

**Undeveloped**: No record of meetings; forget what was decided.

**Target**: Meeting history with decisions, attendees, outcomes; can query for patterns.

**Optimized**: Automated meeting capture, decision trend analysis, impact assessment.

## Core Principle

**Meetings leave a data trail.** Recording meeting metadata (who, what, when, decisions) reveals patterns about how organization communicates and decides—enabling optimization.

## Instructions

### Step 1: Design Meeting Database

**Create Notion database for meetings:**

```
Meetings Database:
├── Title: [Meeting name]
├── Date: [When]
├── Duration: [Minutes]
├── Organizer: [Owner]
├── Attendees: [Relation to People DB]
├── Decisions Made: [Number]
├── Action Items: [Number]
├── Decision: [Multi-select: Strategy, Operations, Engineering, etc]
├── Status: [Open/Closed/Blocked]
└── Notes: [Link to detailed notes]
```

### Step 2: Capture Meeting Metadata

```markdown
## Meeting Entry

**Title**: Q2 Planning & Priorities

**Date**: June 5, 2026 | 2:00 PM - 3:30 PM
**Duration**: 90 minutes
**Organizer**: Product Manager
**Attendees**: 8 people
  - Product Manager (organizer)
  - Engineering Lead
  - Designer
  - [...]

**Meeting Type**: Strategic Planning
**Category**: [Company, Product, Engineering]
**Recurring**: Yes (Quarterly)

**Decisions Made**: 4
- Decision 1: [Linked to decision log]
- Decision 2: [...]

**Action Items**: 6 (5 assigned, 1 open)
- John: Complete roadmap by June 12
- [...]

**Key Outcomes**:
- [Summary of what matters]

**Blockers Identified**: 2
- Resource constraint for Q2
- [...]

**Follow-up Required**: Yes
**Next Meeting**: June 19 (sync on blockers)
```

### Step 3: Analyze Meeting Patterns

**Query your meeting data:**

```markdown
## Meeting Metrics Analysis

### By Organizer
- Product Manager: 12 meetings (3h/week)
- Engineering Lead: 8 meetings (2h/week)
- [...]

### By Attendee Count
- 1-3 people: 40% (focused decisions)
- 4-6 people: 35% (productive)
- 7+ people: 25% (info sharing)

### Decision Velocity
- Decisions per meeting: Average 3.2
- Time to implement: Average 5.3 days
- Decision reversal rate: 8%

### Meeting Effectiveness
- Follow-up rate (actions from meetings): 75%
- Decision implementation rate: 82%
- Satisfaction (1-5): 3.4/5
```

### Step 4: Identify Optimization Opportunities

```markdown
## Meeting Optimization Insights

### Finding 1: Too Many Large Meetings
- 25% of meetings have 7+ attendees
- Recommendation: Separate into working groups + async updates
- Potential time savings: 2h/week

### Finding 2: Recurring Meetings May Be Stale
- 5 recurring meetings with no decisions in 3 months
- Recommendation: Consolidate or archive meetings
- Potential time savings: 1.5h/week

### Finding 3: Decision Implementation is Slow
- Average time from decision to action: 5.3 days
- Outliers: Strategy meetings take 10+ days to implement
- Recommendation: Assign action owners during meeting

### Finding 4: Communication Gaps
- Engineering rarely attends Product meetings (5%)
- Product rarely attends Engineering standups (2%)
- Recommendation: Async meeting notes + better cross-team attendance
```

### Step 5: Build Decision Log

**Track all decisions in Notion:**

```markdown
## Decision Log (Linked to Meetings)

| Decision | Meeting | Date | Owner | Status | Impact |
|----------|---------|------|-------|--------|--------|
| Adopt new framework | Eng Planning | June 5 | John | In Progress | High |
| Increase Q2 budget | Finance | June 3 | Maria | Approved | High |
| Pivot product feature | Product | June 1 | Sarah | Blocked | Critical |

**Status Legend**:
- Approved: Agreed, ready to implement
- In Progress: Being executed
- Blocked: Can't proceed; waiting on [X]
- Completed: Done
- Reversed: Changed mind / superseded by new decision
```

### Step 6: Track Communication Flow

**Understand who talks to whom:**

```markdown
## Communication Network

**Meeting Density** (attendee overlap):
- Product + Engineering: 60% overlap
- Engineering + Operations: 40% overlap
- Product + Operations: 15% overlap
- **Gap**: Product-Operations rarely overlap; need bridge meetings

**Decision Authority**:
- Strategy decisions: Led by [Role]
- Tactical decisions: Led by [Role]
- Operational decisions: Led by [Role]
- **Question**: Are decisions appropriately routed?

**Information Flow**:
- 1 hour after meeting: 60% of organization informed
- 1 day after: 85% informed
- 1 week after: 100% informed (but memory fades)
- **Recommendation**: Faster communication or more smaller meetings
```

### Step 7: Reporting and Iteration

**Monthly meeting intelligence report:**

```markdown
## Monthly Meeting Report — June 2026

### Summary
- Total meetings: 48
- Total attendees: 185 (duplicates)
- Meeting hours/week: 11.5h (target: 8h)
- Decisions made: 28
- Actions tracked: 64
- Action completion: 75%

### Top Opportunities
1. Consolidate 3 overlapping recurring meetings (-1.5h/week)
2. Make 2 meetings async (status updates) (-1h/week)
3. Improve cross-team attendance (better alignment)

### Success Metrics
- [ ] Reduce meeting time: 11.5h → 9h/week
- [ ] Increase decision velocity: 5.3 days → 3 days
- [ ] Improve follow-up rate: 75% → 85%

### Next Month Focus
- Consolidate meetings
- Pilot async format
- Measure impact
```

## Output

**Deliver:**

1. **Meeting Database** (Notion structure)
2. **Metadata Capture** (format for recording)
3. **Analytics Queries** (patterns and insights)
4. **Decision Log** (linked to meetings)
5. **Communication Flow Analysis** (who talks to whom)
6. **Optimization Recommendations** (with time savings)