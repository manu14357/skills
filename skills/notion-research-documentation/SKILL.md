---
name: notion-research-documentation
description: Systematically document research findings, competitive analysis, market trends, and user insights in Notion. Build searchable research repository for data-driven decisions.
compatibility:
  use-case: Research organization, market analysis, competitive intelligence
  frameworks: Notion database, research methodology, analysis documentation
---

# Notion Research Documentation

## Use This Skill When

- Documenting market research and competitive analysis
- Organizing user research findings and insights
- Capturing competitor features and pricing
- Building historical research repository
- Preparing data for product decisions
- Sharing research findings across team

## When NOT to Use

- Raw data collection (capture first, then organize)
- Real-time research (iterate, then document)
- Sensitive customer data (use secure systems)

## Context: Research Documentation Maturity

**Undeveloped**: Research scattered; same research done repeatedly.

**Target**: Organized research database with methodology, findings, sources.

**Optimized**: Automated data collection, analysis templates, AI-searchable insights.

## Core Principle

**Documented research scales.** Centralizing research methodology and findings prevents redoing research and enables pattern recognition across studies.

## Instructions

### Step 1: Design Research Database

**Create Notion structure:**

```
Research Repository:
├── Research Project
│   ├── Title
│   ├── Type: [Market, Competitive, User, Product]
│   ├── Objective: [What are we trying to learn]
│   ├── Methodology: [Survey, Interview, Analysis, etc]
│   ├── Date Started
│   ├── Date Completed
│   ├── Owner
│   ├── Status: [Planning, In Progress, Completed, Archived]
│   └── Key Finding: [1-line summary]
├── Competitive Entry
│   ├── Company
│   ├── Product
│   ├── Features: [List]
│   ├── Pricing
│   ├── Strengths
│   └── Weaknesses
└── User Insight
    ├── Segment
    ├── Insight
    ├── Evidence
    └── Confidence
```

### Step 2: Research Methodology Template

```markdown
## Research Project Template

**Title**: [Clear name of research]
**Type**: Market / Competitive / User / Product

**Objective**: [What question are we answering?]
- Example: "Understand market size for AI tools in logistics"

**Methodology**: [How did we research?]
- Survey: 150 logistics managers
- Sources: Crunchbase, G2, direct outreach
- Timeline: 2 weeks

**Key Findings**: [Top 3-5 insights]
1. Finding 1: [Context and evidence]
2. Finding 2: [Context and evidence]
3. Finding 3: [Context and evidence]

**Confidence Level**: [High / Medium / Low]
**Data Quality**: [Sample size, recency, bias assessment]

**Implications**: [What should we do with this?]
- Action 1: [Specific recommendation]
- Action 2: [Specific recommendation]

**Sources**:
- [Source 1] (date accessed)
- [Source 2] (date accessed)

**Related Research**:
- [Link to previous similar research]

**Decision Made**: [If this research drove a decision, link it]
```

### Step 3: Competitive Analysis Template

```markdown
## Competitor Entry

**Company**: [Competitor name]
**Product**: [Product name]

**Overview**:
- Founded: [Year]
- Funding: [Total raised]
- Team size: [Estimate]
- Market focus: [Target segment]

**Features**:
- Feature 1: [Description of capability]
- Feature 2: [Description]
- Feature 3: [Description]

**Pricing Model**:
- Tiers: [Free/Pro/Enterprise]
- Price: $[X]-$[Y] per month
- Target segment: [Who buys]

**Strengths**:
1. [Competitive advantage]
2. [Competitive advantage]
3. [Competitive advantage]

**Weaknesses**:
1. [Gap vs. similar products]
2. [Gap vs. similar products]

**Recent News**:
- [Funding round / Partnership / Launch]
- [Hiring / Leadership changes]

**Market Position**: [Leader / Challenger / Niche]
**Threat Level**: [High / Medium / Low]

**Last Updated**: [Date]
**Data Quality**: [High / Medium / Low]
```

### Step 4: User Insights Documentation

```markdown
## User Insight Entry

**Insight**: [One clear statement about users]
Example: "Enterprise users are willing to pay 3x premium for compliance features"

**User Segment**: [Who this applies to]
- Company size: 100-1000 employees
- Industry: Fintech, Healthcare
- Role: Compliance Officer, Security Lead

**Evidence**:
1. User interview (5 interviews, June 2026): 80% mentioned compliance as top 3 requirement
2. Pricing comparison: Competitors charging 3x for HIPAA compliance
3. Support tickets: 40% mention compliance concerns

**Confidence**: [High / Medium / Low]
**Data Sources**: [Interviews / Support / Surveys / Observation]

**Implications**:
- Product: Add compliance module
- Pricing: Can charge premium for compliance tier
- GTM: Highlight compliance in enterprise sales

**Related Insights**:
- [Link to related user insight]

**Action Taken**: [If this drove a decision/action, document it]
```

### Step 5: Build Research Timeline

**Visualize research progress:**

```markdown
## Research Timeline

**Q1 2026**:
- Feb: Market size research (completed)
- Mar: Competitive analysis (completed)

**Q2 2026**:
- May: User interviews (in progress, 8/12 done)
- June: Pricing analysis (planned)

**Q3 2026**:
- Aug: Product-market fit study (planned)
```

### Step 6: Create Query and Summary Views

**Notion database views:**

```markdown
## Research Dashboard

**By Type**:
- Market Research: 12 projects (avg confidence: 8.2/10)
- Competitive Analysis: 8 projects (avg confidence: 7.5/10)
- User Research: 15 projects (avg confidence: 8.8/10)

**By Status**:
- Active: 8 projects
- Completed: 28 projects
- Archived: 5 projects

**High-Confidence Insights** (Confidence > 8):
- [Insight 1]: [Action taken]
- [Insight 2]: [Action taken]
- [Insight 3]: [Action taken]

**Recent Research** (Last 30 days):
- [Project 1]
- [Project 2]
```

### Step 7: Maintenance and Archiving

```markdown
## Research Lifecycle

**During Research**:
- Status: In Progress
- Update weekly with findings

**Completion**:
- Status: Completed
- Document final findings
- Create summary for team
- Link to any decisions made

**After 6 Months**:
- Review: Is this still relevant?
- If outdated: Archive with note on why
- If still relevant: Flag for refresh if needed

**Query for Insights**:
- Completed research < 1 year old: Review quarterly
- Outdated research: Flag for refresh before using
```

## Output

**Deliver:**

1. **Research Database** (Notion structure)
2. **Research Project Entries** (documented findings)
3. **Competitive Analysis** (competitor tracking)
4. **User Insights** (segment insights)
5. **Research Timeline** (progress and planning)
6. **Query Views** (for discovery and insights)