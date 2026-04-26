---
name: lead-research-assistant
description: Identify high-quality sales leads by analyzing your business, defining ideal customer profile, and discovering target companies with personalized contact strategies.
compatibility:
  use-case: Sales research, lead generation, business development
  frameworks: Company research, market analysis, outreach strategy
---

# Lead Research Assistant

## Use This Skill When

- Finding potential customers for your product or service
- Building B2B prospect lists for sales outreach
- Identifying companies for partnership opportunities
- Preparing target account list for sales campaigns
- Researching companies matching your ideal customer profile
- Discovering expansion opportunities in new markets

## When NOT to Use

- Recruitment/hiring (different purpose)
- Consumer audience research (not B2B focused)
- Competitive analysis only (not lead-focused)
- Market research reports (broader scope)

## Context: Lead Research Maturity

**Undeveloped**: Manual Google searches, unqualified leads, no strategy.

**Target**: Defined ICP (Ideal Customer Profile), prioritized company list, contact approaches.

**Optimized**: Automated prospecting, multi-channel contact data, engagement scoring, CRM integration.

## Core Principle

**Better leads = higher conversion.** Defining your Ideal Customer Profile clearly and researching company fit systematically leads to higher-quality sales conversations and shorter sales cycles.

## Instructions

### Step 1: Define Your Product & Value Prop

**Document your offering:**

```markdown
## Product Definition

**What**: [Brief product description]
**Problem Solved**: [Primary pain point]
**Ideal Customer**: [Type of company/buyer]
**Key Differentiator**: [Why you vs. competitors]

### Example (SaaS)
**What**: Cloud-based incident response platform
**Problem**: Teams waste hours on incident coordination during outages
**Ideal Customer**: DevOps/SRE teams at growth-stage tech companies
**Differentiator**: AI-suggested responses + Slack-first workflow
```

### Step 2: Define Ideal Customer Profile (ICP)

**Create comprehensive ICP criteria:**

| Criterion | Details | Weighting |
|-----------|---------|-----------|
| **Industry** | SaaS, FinTech, Healthcare | Must-have |
| **Company Size** | 50-500 employees (Series A-C) | Strong |
| **Revenue** | $5M-$50M ARR | Important |
| **Growth Stage** | Scaling (20%+ YoY growth) | Important |
| **Tech Stack** | Uses cloud infrastructure (AWS/Azure) | Nice-to-have |
| **Pain Points** | Frequent incidents, alert fatigue | Must-have |

**Calculate Lead Score:**
- Meets all must-haves: 100 points
- Matches 80% of important criteria: 80 points
- Matches few criteria: 40 points

### Step 3: Research Target Companies

**Search approaches:**

**Method 1: Direct company databases**
- G2 reviews (companies in adjacent solutions)
- Crunchbase (growth-stage companies)
- PitchBook (funded startups)
- LinkedIn Sales Navigator

**Method 2: Market analysis**
- Industry reports
- Funded startups in verticals
- Recent IPOs and public companies

**Method 3: Referrals and warm intros**
- Ask customers for similar companies
- Industry events and conferences
- Online communities (Reddit, Slack)

**Build prospecting list:**

```markdown
## Target Companies List (Top 20)

| Company | Industry | Size | Score | Fit Rationale | Contact Info |
|---------|----------|------|-------|---------------|--------------|
| Company A | FinTech | 150 emp | 95 | Uses AWS, 40% growth, hiring engineers | [contacts] |
| Company B | SaaS | 300 emp | 88 | Series B, growing incident team | [contacts] |
| Company C | Healthcare | 75 emp | 82 | Cloud-first, struggling with alerts | [contacts] |

**Score 95-100**: Tier 1 (Hot prospects)
**Score 80-94**: Tier 2 (Good fits)
**Score 60-79**: Tier 3 (Long shots)
```

### Step 4: Gather Contact Intelligence

**For top 20 companies, collect:**

- Decision-makers: VP Eng, Head of SRE, CTO
- Email formats (if detectable)
- LinkedIn profiles
- Recent news (funding, hiring, product launches)
- Company pain signals (Twitter/LinkedIn complaints)

**Tools to use:**

| Tool | Purpose |
|------|---------|
| RocketReach, Hunter.io, Clearbit | Email finding |
| LinkedIn Sales Navigator | Decision-maker research |
| Crunchbase, PitchBook | Company intelligence |
| G2, Capterra | Product/culture signals |

### Step 5: Develop Contact Strategies

**Create personalized approach for each Tier 1 prospect:**

```markdown
## Company A — Contact Strategy

**Target Decision-Maker**: John Smith, VP Engineering

**Research Signals**:
- Recently hired 3 SRE engineers (LinkedIn update)
- Tweeted about "alert fatigue" last month
- Using PagerDuty (main competitor space)

**Contact Angle**: "I noticed you're hiring SRE talent — incident response tooling is often the bottleneck for growing teams like yours"

**Outreach Sequence**:
1. LinkedIn connection request (personalized)
2. Wait 3-5 days, then warm email
3. If no response in 1 week, try different contact
4. Follow up every 2 weeks (max 3 attempts)

**Email Template**:
```
Subject: Quick idea for [Company]'s incident response

Hi John,

I noticed you recently expanded your SRE team. Great to see! 

We work with teams like [Competitor Company] on incident response automation — cut incident resolution time in half typically.

Worth a 15-minute call to explore if it's relevant? 

[Link to calendar]

[Your name]
```

**Alternative Approach**:
- If LinkedIn connection fails, try Twitter/email
- If email bounces, research for direct team contact
- If cold outreach fails, look for warm intro via mutual connection
```

### Step 6: Prioritize and Sequence

**Create outreach plan:**

```markdown
## Outreach Campaign — Q2 2026

### Phase 1: Tier 1 (Week 1-2)
- [ ] Send to Top 5 prospects
- [ ] Track responses
- [ ] Book any interested calls

### Phase 2: Tier 2 (Week 3-4)
- [ ] Send to next 10 prospects
- [ ] Iterate messaging based on Phase 1 responses

### Phase 3: Tier 3 (Week 5+)
- [ ] Broader outreach or focus based on learnings

### Tracking
- Outreach rate: [Goal] emails/week
- Response rate target: [Goal] %
- Meeting booking rate: [Goal] %
- Win rate goal: [Goal] %

**Weekly check-in**:
- [ ] How many prospects reached?
- [ ] Response rate? (Iterate messaging if <10%)
- [ ] Meetings booked? (Target: 1-3/week)
```

### Step 7: Refine Based on Feedback

**After initial outreach:**

```markdown
## Learnings & Refinement

**What worked**:
- Response rate highest from [Approach]
- Best meetings from [Contact type]
- Strongest fit from [Industry/Size segment]

**What didn't**:
- Cold emails to [Title] got 0% response
- [Competitor name] messaging fell flat

**Refined ICP**:
- Upgrade from "50-500" to "100-300" employees (better fit)
- Add "Recent funding" as strong signal
- Remove "Nice-to-have" tech stack filters

**Next iteration**:
- Focus on [Top-performing segment]
- Adjust messaging to emphasize [Key benefit]
- Test new channel: [LinkedIn vs. Email vs. Community]
```

## Output

**Deliver:**

1. **ICP Definition** (criteria, scoring model)
2. **Target Company List** (20-50 companies ranked by fit)
3. **Contact Intelligence** (decision-makers, emails, signals)
4. **Personalized Outreach Strategy** (approach for each Tier)
5. **Campaign Plan** (sequencing, tracking, goals)
6. **Refinement Notes** (based on results)