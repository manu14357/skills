---
name: changelog-generator
description: Transform technical git commits into polished, user-friendly changelogs and release notes. Automatically categorizes changes, translates developer language into customer-friendly copy, and generates professional changelog entries.
compatibility:
  use-case: Release documentation, product updates, version notes
  frameworks: Git, changelog management, release workflows
---

# Changelog Generator

## Use This Skill When

- Preparing release notes for a new product version
- Creating weekly or monthly product update summaries
- Documenting changes for customers or stakeholders
- Writing app store changelog submissions
- Generating update notifications for users
- Maintaining public changelog or product update pages
- Creating internal release documentation
- Need to transform commits into customer-facing language

## When NOT to Use

- Internal developer documentation (keep technical commit language)
- When commits already have clear user-facing descriptions
- For non-git version control systems
- When detailed technical accuracy is required for developers
- For automated CI/CD commit logs (use raw commits instead)

## Context: Changelog Maturity

**Undeveloped**: Raw git commits listed, technical jargon, unclear for customers.

**Target**: Commits categorized by type, translated to user language, grouped logically, professional formatting.

**Optimized**: Polished changelog with strategic storytelling, emphasis on customer impact, brand voice, multimedia integration.

## Core Principle

Users deserve clear, accessible changelogs that celebrate product improvements. Transform technical commits into customer language that highlights impact, not implementation.

## Instructions

### Step 1: Gather Commit History

**Identify the scope:**

| Scope Type | Example | Use Case |
|-----------|---------|----------|
| **Date Range** | "March 1–15" | Weekly/monthly updates |
| **Version Range** | "v2.4.0 to v2.5.0" | Release-specific |
| **Time Period** | "Last 7 days" | Recent changes |
| **Branch** | "main since last release" | Staged features |

**Command pattern** (provide to user):
```
Get all commits from [DATE] to [DATE]
or
Get all commits between version [V1] and [V2]
or
Get all commits from the past [N] days
```

### Step 2: Categorize Changes

**Standard Categories:**

| Category | Indicators | Icon |
|----------|-----------|------|
| **Features** | "feat:", new functionality, user-facing | ✨ |
| **Improvements** | "perf:", "improve", speed, UX enhancements | 🔧 |
| **Bug Fixes** | "fix:", "resolved", issues, errors | 🐛 |
| **Breaking Changes** | "BREAKING", incompatible changes | ⚠️ |
| **Security** | "security", "CVE", vulnerability fixes | 🔒 |
| **Documentation** | "docs:", guides, README, help | 📖 |

**Rule**: If a commit fits multiple categories, prioritize user impact (features > improvements > fixes).

### Step 3: Translate to Customer Language

**Translation Framework:**

| Technical | Customer-Friendly |
|-----------|-----------------|
| "Optimized database queries" | "Faster loading times" |
| "Refactored auth module" | "Improved security and reliability" |
| "Added memoization caching" | "Reduced bandwidth usage by 30%" |
| "Fixed race condition in sync" | "Resolved sync timing issues" |
| "Updated dependencies" | "Security and stability improvements" |
| "Added pagination to results" | "Browse large lists more smoothly" |

**Guidelines:**
- Focus on user benefit, not technical how
- Use active voice and action verbs
- Mention specific impact (speed, new capability, fixed behavior)
- Avoid jargon (refactor, pipeline, dependency, etc.)
- Start with action: "Create", "Add", "Fix", "Improve", "Support"

### Step 4: Structure the Changelog

**Format:**

```markdown
# Version [X.Y.Z] - [Release Date]

## ✨ New Features

- **Feature Name**: Brief description of what users can now do. 
  Context or benefit.

## 🔧 Improvements  

- **Feature/Area**: Specific improvement made. Impact or reason.

## 🐛 Bug Fixes

- Fixed issue where [behavior] now [correct behavior]
- Resolved [problem area] that affected [users/use case]

## ⚠️ Breaking Changes (if applicable)

- **Change Name**: What changed and how users need to update.

## 📖 Documentation

- Added/updated guides for [area]
```

**Requirements:**
- Group related commits together
- Use headers and icons for scannability
- Include 1-2 sentence descriptions (not bullet points for multi-part features)
- Highlight user impact or benefit
- Keep tone positive, celebratory for new features

### Step 5: Apply Brand Voice

**Tone Examples:**

- Professional/Enterprise: "Advanced authentication options are now available"
- Friendly/Consumer: "You can now invite team members to your workspace!"
- Technical-but-Clear: "Improved JSON parsing performance by 2x"

**Check:**
- Does it sound like your product talking?
- Would customers understand without developer context?
- Does it emphasize customer benefit?

## Quality Checklist

Before finalizing:

- ✓ All commits categorized appropriately
- ✓ Customer-friendly language (no jargon)
- ✓ Action verbs and active voice
- ✓ User benefit mentioned or implied
- ✓ Consistent formatting and tone
- ✓ Grouped logically by feature area
- ✓ Breaking changes clearly marked
- ✓ No internal/refactoring commits visible
- ✓ Professional presentation ready to share

## Output

Provide:

1. **Structured Changelog**
   - Clear version/date header
   - Categorized sections (Features, Improvements, Fixes, Breaking)
   - Customer-friendly descriptions
   - Emoji/icons for quick scanning

2. **Release Notes Summary** (optional)
   - Headline highlighting major feature
   - 2-3 key improvements
   - Link to full changelog

3. **Editable Markdown**
   - Ready to paste into CHANGELOG.md
   - Save and share immediately
   - No manual reformatting needed
- Writing app store update descriptions
- Generating email updates for users
- Creating social media announcement posts

