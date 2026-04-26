---
name: domain-name-brainstormer
description: Generate creative domain name ideas for your project and check availability across multiple TLDs (.com, .io, .dev, .ai, .app). Find the perfect domain name without manual checking.
compatibility:
  use-case: Domain research, startup naming, branding
  frameworks: Domain registrars, WHOIS, TLD databases
---

# Domain Name Brainstormer

## Use This Skill When

- Starting a new project, product, or company
- Launching a service or SaaS product
- Creating personal brand or portfolio site
- Rebranding an existing project
- Registering domain for side project
- Need alternatives when top choice is unavailable
- Want creative options with instant availability checking

## When NOT to Use

- Legal trademark research (consult lawyer)
- International domain extensions only (focus is popular TLDs)
- Bulk domain purchases without strategy
- Domain broker/investment advice

## Context: Domain Strategy Maturity

**Undeveloped**: Brainstorm locally, check manually, hit availability wall.

**Target**: Generate 10-15 creative options, check across 6+ TLDs, highlight best matches.

**Optimized**: Market research, competitor domain analysis, SEO recommendations, brand positioning guidance.

## Core Principle

**A great domain is memorable, brandable, and available.** Combine creative generation with instant availability checking to find options that work technically and strategically.

## Instructions

### Step 1: Understand Your Project

**Ask clarifying questions:**

| Element | Questions |
|---------|-----------|
| **What** | What problem does your project solve? What's the product/service? |
| **For Whom** | Who is the target audience? (developers, consumers, enterprises, creators?) |
| **Positioning** | How do you want to be perceived? (premium, indie, enterprise, fun, serious?) |
| **Style Preference** | Any naming preferences? (descriptive, abstract, acronym, word play?) |

**Document project profile:**
```markdown
# Domain Brief

**Product**: [Name/Description]
**Tag Line**: [One sentence positioning]
**Audience**: [Target user persona]
**Vibe**: [Premium/Indie/Fun/Enterprise]
**TLD Preference**: [.com/.io/.dev/any]
**Keywords**: [3-5 relevant terms]
```

### Step 2: Generate Creative Domain Options

**Brainstorming techniques:**

| Technique | Examples | Best For |
|-----------|----------|----------|
| **Descriptive** | what-it-does + domain extension | SaaS, tools (clear, SEO-friendly) |
| **Abstract** | unique word that evokes feeling | Brands, premium positioning |
| **Compound** | combine 2-3 short words | Memorable, brandable |
| **Metaphor** | related concept or analogy | Creative, memorable |
| **Acronym** | initials or abbreviation | Short, tech-focused |
| **Wordplay** | rhymes, alliteration, puns | Fun, memorable, risky |

**Generate diverse options (15-20 candidates):**

```markdown
## Domain Candidates

### Descriptive (Direct & Clear)
1. codepaste.com / codepaste.dev
2. scriptbox.com / scriptbox.io
3. devshare.com / devshare.app
4. clipcode.com / clipcode.dev

### Compound (Memorable)
5. snippet + box = snippetbox.com
6. code + trail = codetrail.dev
7. paste + hub = pastehub.io

### Abstract (Brandable)
8. Zephyr.com / zephyr.dev (evokes speed)
9. Nexus.io (connection point)
10. Vault.app (repository, security)

### Wordplay (Fun)
11. Pastel.dev (paste + dev pun)
12. Clipper.io (clip + name)
13. Gist.dev (GitHub gist reference)

### Unique/Creative
14. Archeo.dev (archive + archaeology)
15. Cryptic.io (code + cryptic)
```

### Step 3: Check Availability Across Multiple TLDs

**Primary TLDs to check:**
- `.com` (universal, highest authority)
- `.io` (tech startups, trendy)
- `.dev` (developer-focused)
- `.app` (application-focused)
- `.ai` (AI/ML projects)
- `.co` (alternative to .com)

**Check availability (use WHOIS or registrar APIs):**

**Option A: Manual check via registrars**
```
- namecheap.com
- godaddy.com
- hover.com
- domain.com
- etc.
```

**Option B: Programmatic check (pseudocode)**
```bash
# For each domain candidate
for domain in snippet.com snippet.io snippet.dev snippet.app; do
  whois $domain 2>/dev/null | grep -q "No Found"
  if [ $? -eq 0 ]; then
    echo "✓ AVAILABLE: $domain"
  else
    echo "✗ TAKEN: $domain"
  fi
done
```

**Organize results:**

```markdown
## Availability Check Results

### ✅ Available (.com)
| Domain | Price Estimate | Why Good |
|--------|----------------|----------|
| snippetbox.com | $10-15 | Direct, memorable, clear product name |
| codetrail.dev | $10-15 | Short, .dev signals developer tool |
| devpaste.app | $10-15 | Clear CTA (paste), developer-focused |

### ⚠️ Premium (Taken, $1000+)
| Domain | Notes |
|--------|-------|
| codeshare.com | Taken (premium ask: ~$2500) |
| snippet.com | Taken (premium domain) |

### 🚀 Best Alternatives
| Domain | Status | Why |
|--------|--------|-----|
| snippetbox.io | Available | .io adds tech credibility |
| devshare.app | Available | .app extension, clear purpose |
```

### Step 4: Rank and Recommend

**Scoring criteria:**

| Criterion | Weight | Scoring |
|-----------|--------|---------|
| **Memorability** | 25% | How easy to remember/spell? |
| **Brandability** | 25% | How unique/defensible? |
| **Availability** | 25% | Available now? Premium cost? |
| **Audience Fit** | 15% | Does it resonate with target users? |
| **SEO Potential** | 10% | Does it contain relevant keywords? |

**Top 3 recommendations:**

```markdown
## 🏆 My Top 3 Recommendations

### 1️⃣ snippet.dev — Perfect Choice
**Score**: 9.2/10
**Why**: 
- ✓ Developer audience loves .dev
- ✓ Clear product description
- ✓ Available NOW ($12/year)
- ✓ 11 characters, easy to remember
- ✓ Good for SEO ("snippet sharing")

**Marketing Angle**: "The dev-first code snippet platform"

---

### 2️⃣ snippetbox.com — Runner-Up
**Score**: 8.8/10
**Why**:
- ✓ .com is universally trusted
- ✓ "Box" metaphor (container)
- ✓ Available ($14/year)
- ✓ 11 characters
- ✗ More generic than .dev option

**When to choose**: If .com feels essential to your brand

---

### 3️⃣ codetrail.io — Creative Alternative
**Score**: 8.1/10
**Why**:
- ✓ Unique, memorable name
- ✓ .io appeals to tech community
- ✓ Available ($25/year)
- ✓ Interesting metaphor ("trail of code")
- ✗ Slightly less clear product definition

**When to choose**: If you want distinctive branding
```

### Step 5: Consider Strategic Factors

**Additional analysis:**

| Factor | Analysis |
|--------|----------|
| **Growth Alignment** | Will domain work if you pivot? (e.g., "snippet.dev" limits to code) |
| **International** | Does it work across languages/cultures? |
| **Trademark Risk** | Avoid existing brand names, registered TMs |
| **Social Media** | Check Twitter, GitHub, LinkedIn username availability |
| **Pronunciation** | Can people say it out loud without confusion? |

**Secondary domain strategy:**
```markdown
## Supporting Domains (Buy to Protect Brand)

If you buy `snippet.dev`, also consider:
- snippet.com (catch searches)
- snippetbox.io (brand variation)
- thesnippet.dev (branded variation)

Why? Prevents competitors from buying similar names; makes you easier to find.
```

### Step 6: Decision Framework

**Choose based on priority:**

```markdown
## Decision Framework

**Priority: Maximum Authority?**
→ Choose `.com` if available at reasonable price

**Priority: Target Audience (Developers)?**
→ Choose `.dev` or `.io`

**Priority: Unique, Memorable Brand?**
→ Choose creative/compound name regardless of TLD

**Priority: SEO & Discoverability?**
→ Choose descriptive name with relevant keywords

**Priority: Budget-Conscious?**
→ Choose cheaper TLD (.io cheaper than .com typically)
```

## Output

**Deliver:**

1. **Brainstorm List** (15-20 domain candidates)
   - Organized by technique (descriptive, abstract, wordplay, etc.)
   - Brief rationale for each

2. **Availability Matrix** (checked across 6+ TLDs)
   - Green for available
   - Yellow for premium/negotiable
   - Red for taken with notes

3. **Top 3 Recommendations**
   - Ranked by overall fit
   - Score and reasoning
   - Best use cases for each

4. **Strategic Guidance**
   - Domain growth strategy
   - Trademark/social media check
   - Supporting domain suggestions