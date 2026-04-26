---
name: developer-growth-analysis
description: Analyzes recent Codex chat history to identify coding patterns, development gaps, and learning opportunities. Curates personalized learning resources and delivers growth reports to Slack.
compatibility:
  use-case: Developer self-assessment, learning path discovery, skill gap analysis
  frameworks: Codex, HackerNews, Slack integration
---

# Developer Growth Analysis

## Use This Skill When

- You want to understand your development patterns from recent work
- Identifying technical skill gaps based on actual chat history
- Seeking personalized learning recommendations
- Need data-driven insights on areas for improvement
- Want structured feedback on coding progress without waiting for reviews
- Looking to track and improve specific technical skills over time

## When NOT to Use

- General coding questions (ask for debugging help instead)
- You haven't used Codex recently (insufficient history to analyze)
- Real-time code reviews (different skill focus)
- Quick one-off technical support

## Context: Developer Growth Insight Maturity

**Undeveloped**: No feedback on work patterns; learning without direction.

**Target**: Analyze recent chat history, identify 3-5 improvement areas with evidence, curate HackerNews resources.

**Optimized**: Trend analysis across weeks/months, peer benchmarking, automated skill progression tracking, integrated learning platform connections.

## Core Principle

**Your chat history reflects your growth edges.** Analyzing recent conversations reveals what you're struggling with, what you're exploring, and where targeted learning yields the highest ROI.

## Instructions

### Step 1: Access and Filter Chat History

**Locate Codex history file:**
```bash
cat ~/.codex/history.jsonl
```

**Parse recent entries (past 24-48 hours):**
- File format: JSONL (one JSON object per line)
- Each entry contains: `display` (user message), `project`, `timestamp` (milliseconds), `pastedContents` (code snippets)
- Filter for entries where: `timestamp > (now - 48 hours)`

**Extract relevant data:**
```bash
jq --arg cutoff "$(date -d '48 hours ago' +%s)000" \
  'select(.timestamp > ($cutoff|tonumber))' \
  ~/.codex/history.jsonl
```

### Step 2: Identify Work Patterns

**Categorize conversations:**

| Pattern Category | What to Look For | Examples |
|-----------------|-----------------|----------|
| **Projects** | Types of work (backend, frontend, DevOps, data) | "working on auth system", "React component", "CI/CD pipeline" |
| **Technologies** | Languages, frameworks, tools mentioned | "TypeScript", "PostgreSQL", "Docker", "Vue" |
| **Problem Types** | Categories of challenges | Performance, debugging, refactoring, setup, architecture |
| **Repeated Topics** | Same questions/issues appearing multiple times | Suggests skill gap or knowledge hole |
| **Approach Patterns** | How problems are tackled | Methodical vs. experimental, quick fixes vs. deep dives |

**Extract examples:**
```bash
# Count most frequently mentioned topics
jq -r '.display' ~/.codex/history.jsonl | tr ' ' '\n' | \
  grep -i -E 'typescript|react|python|sql|docker|api|auth|database' | \
  sort | uniq -c | sort -rn
```

### Step 3: Detect Improvement Areas

**Identify patterns indicating growth opportunities:**

**Evidence Markers for Skills Gaps:**
- Repeated similar questions (e.g., asking about async/await multiple times)
- Multi-step debugging efforts on same issue
- Questions about basic concepts in your primary language
- Complex architectural decisions where you struggled

**Examples of strong improvement areas (evidence-based):**

| Weak (Too Vague) | Strong (Specific & Evidence-Based) |
|-----------------|-----------------------------------|
| "Better TypeScript" | "Advanced TypeScript patterns (generics, utility types) - 3 different queries about type safety in your [Project] work" |
| "Learn databases" | "Query optimization - you rewrote the same PostgreSQL query 4 times with incrementally better performance" |
| "Improve error handling" | "Error handling and validation - repeated null check bugs in your checkout feature; missing try-catch patterns" |

**Generate 3-5 improvement areas:**
- Pick evidence from chat history
- Rank by impact (what would help most?)
- Make each specific and actionable

### Step 4: Curate Learning Resources from HackerNews

**Search HackerNews for relevant content:**

**Technique 1: HackerNews Search**
```bash
# Manual check: https://hn.algolia.com/
# Search for improvement area keywords + "tutorial" or "guide"
# Example: "TypeScript generics tutorial"
```

**Technique 2: Curate from popular categories:**

| Improvement Area | HackerNews Queries |
|-----------------|-------------------|
| Advanced TypeScript | "TypeScript patterns", "TypeScript advanced", "TypeScript types" |
| Query optimization | "SQL optimization", "database indexing", "query performance" |
| Error handling | "exception handling patterns", "error recovery", "resilience" |
| System design | "system design", "architecture patterns", "microservices" |

**Selection criteria for resources:**
- Published in last 6 months (current best practices)
- Minimum 50 upvotes (community validation)
- Comments show substantive discussion
- Practical examples or case studies

**Format findings:**
```markdown
## Learning Resources: [Improvement Area]

1. **[Article Title](URL)**
   - Source: HackerNews [score: XXX]
   - Key takeaway: [1 sentence summary]
   - Relevant to your work: [Why this matters for your recent projects]

2. **[Article Title](URL)**
   - [Same format]
```

### Step 5: Generate Personalized Growth Report

**Structure:**

```markdown
# Your Developer Growth Report
Generated: [Date]
Period Analyzed: Past 48 hours

## 📊 Work Summary
- **Primary Projects**: [List with % of time]
- **Languages/Frameworks**: [Top 5]
- **Problem Categories**: [Breakdown: debugging 40%, feature work 35%, setup 25%]

## 🎯 Improvement Areas

### 1. Advanced TypeScript Patterns (High Impact)
**Evidence**: 3 questions about type safety in your checkout service; struggled with generic types

**Specific Focus**:
- Utility types (Pick, Omit, Record)
- Generic type constraints
- Type guards and discriminated unions

**Quick Wins**:
- [ ] Read: [HN Article] (15 min)
- [ ] Apply to: [Your specific project]
- [ ] Practice: Refactor one TypeScript utility

---

### 2. [Second Area]
[Same structure]

## 📚 Curated Resources

### For TypeScript Patterns
- [Article 1]
- [Article 2]

### For [Second Area]
- [Article A]
- [Article B]

## 🚀 Action Items This Week

1. Spend 30 mins on TypeScript generics (HN article #1)
2. Apply learnings to [specific file in your project]
3. Ask Codex to review refactored code
4. Note improvements in next week's analysis

---

**Next Report**: [Date]
```

### Step 6: Send Report to Slack

**Format for Slack message:**
```markdown
Hi [Name]! 👋 Here's your developer growth analysis from the past 48 hours:

📊 *You worked on*: [Project list]
🛠️ *Technologies*: TypeScript, React, PostgreSQL

🎯 *Top Growth Opportunities*:
• Advanced TypeScript patterns (detected from 3 related questions)
• Query optimization (rewrote query 4x this week)

📚 *Recommended reading* (15-30 min each):
1. [HN Article] - [Why this matters]
2. [HN Article] - [Why this matters]

🚀 *This week focus*: Pick 1 area and apply it to current project

Full report: [Link to detailed report]
```

**Delivery method:**
- Post to your Slack DMs (requires Slack API integration)
- Or: Output markdown file user can share

## Example Output

```markdown
# Developer Growth Report — April 26, 2026

## Your Focus Areas (48 hours)
- TypeScript/React frontend: 60%
- PostgreSQL queries: 30%
- DevOps/Docker: 10%

## Top Improvement Opportunities

### 1. Advanced TypeScript (High Leverage)
Your recent work shows struggles with generic types and utility types.
Three questions in one day about type safety = clear signal.

**Curated Resource**: 
- "Understanding TypeScript Generics" (HackerNews, 180 upvotes)
  https://...

### 2. SQL Query Optimization
You rewrote the same checkout query 4 times with incrementally better performance.
Suggests knowledge gap in indexing and query planning.

**Curated Resources**:
- "Query Optimization Patterns" (HN, 245 upvotes)
- "PostgreSQL Indexing for Performance" (HN, 198 upvotes)

## Action Items
- [ ] 15 mins: Read TypeScript generics article
- [ ] 20 mins: Review PostgreSQL indexing concepts
- [ ] Apply to: [Your current project] in next session
```

## Output

**Deliver:**

1. **Growth Report** (markdown)
   - Work summary with percentages
   - 3-5 evidence-based improvement areas
   - Specific action items

2. **Curated Resources** (with URLs and summaries)
   - HackerNews articles ranked by relevance
   - 15-30 minute reading estimates

3. **Slack Message** (optional)
   - High-level summary
   - Top 2 recommended resources
   - Link to full report