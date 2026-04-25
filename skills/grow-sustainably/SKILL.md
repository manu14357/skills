---
name: grow-sustainably
description: >
  Help founders evaluate business decisions through the lens of sustainable, profitable growth.
  Use when discussing spending, hiring, fundraising, pricing, or scaling decisions.
compatibility:
  models: [any-llm]
  use-case: business-strategy
  frameworks: [minimalist-entrepreneur, profitability-first, sustainable-growth]
---

# Grow Sustainably

Make business decisions that prioritize profitability, runway, and energy sustainability over rapid scaling.

## Use This Skill When

- User is making decisions about spending or hiring
- User is considering fundraising or VC
- User is evaluating scaling strategies
- User is concerned about profitability or cash flow
- User says phrases like "should I hire", "is it worth", "can I afford", "should I raise", "growth strategy", "sustainability"

## When NOT to Use

- User is asking for product roadmap or feature prioritization (use product skill)
- User is optimizing marketing campaigns or CAC (use marketing skill)
- User is building pitch decks for investors (use fundraising skill)

## Context: Growth Stage Maturity

**Bootstrapped**: <$10k revenue; profitable or profitable in months  
**Sustainable**: $10k–100k revenue; monthly profitability; reinvesting in growth  
**Scalable**: $100k+ revenue; profitability or clear path to it; hiring → **Target**  
**Optimized**: $500k+ revenue; variable margins understood; sustainable hiring rate

## Core Principle

**Profitability is a superpower.** When you're profitable (revenue > costs), your runway becomes infinite. You gain control, can move at your own pace, and can outlast competitors who are burning VC money. Spend less than you make.

## Instructions

### Understanding Your Unit Economics

#### The Profitability Equation

**Profit = Revenue - Costs**

Ensure this is positive. If negative, you are on a countdown timer.

#### Cost Categories

| Cost Type | Behavior | Examples |
|-----------|----------|----------|
| **Variable (COGS)** | Scales with each sale | Payment processing (2–3%), hosting per customer, fraud prevention, shipping |
| **Fixed** | Constant regardless of revenue | Salary, domain, base hosting, insurance, office lease |

**Example**: At $1 revenue, if variable costs = 40¢, you have 60¢ gross margin. Subtract fixed costs to find net profit.

### Cost Discipline Rules

#### 1. Minimize Personal Salary Early
- Start at a level that's survivable, not comfortable
- Example: $36k/year in SF, or $0 if needed during crises
- Increase salary only as company revenue supports it
- Lower personal spending = longer runway

#### 2. Buy Software, Not Humans
- Automate with tools before hiring people
- Affordable solutions: Zapier, Stripe, Gusto (payroll), Pilot (accounting), Airtable, etc.
- A software subscription ($50–500/mo) costs less than 1 FTE ($60k+/yr)

#### 3. Stay Remote (Default)
- No office = no rent, utilities, commute costs, lease risks
- Adds hiring flexibility (hire talent anywhere)
- Avoid office until it's a reward, not a necessity

#### 4. Resist Expensive Geography
- Live/operate where costs are low
- No need to move to SF/NYC unless specific reason
- Reduces fixed costs, extends runway

#### 5. Outsource Before Hiring FT
- Order: You + automation → Freelancers → Part-time → Full-time employees
- Test need before committing to salary

### Growth Mindset

**Sustainable growth ≠ "move fast and break things"**

- Most small businesses never face Big Fish competition. Big fish eat other big fish.
- Long-lived businesses (restaurants, family firms, small services) often stay small by choice
- Growth speed is determined by customer demand, not your willingness to "hustle"
- Working more hours ≠ faster growth. Strategic hours matter more.

**Realistic growth**:
- Early months: 10–20% monthly growth possible
- After 1 year: 5–15% monthly growth typical
- After 3 years: 3–10% monthly growth expected
- This is healthy, sustainable growth

### Fundraising Decision Tree

```
Should you raise money?

├─ Can you reach profitability without it?
│  └─ YES → Bootstrap (better for control)
│  └─ NO  → Consider fundraising
│
├─ What do you need money for?
│  ├─ Bridge cash flow gap → Consider invoice financing/loans instead
│  ├─ Hire team → First validate work can be done with freelancers
│  ├─ Product rewrite → Validate customer demand first
│  └─ Marketing → Prove unit economics before scaling spend
│
├─ Ready for VC?
│  └─ Only if: (a) Seeking exponential growth, (b) Large market, (c) Repeatable sales
│  └─ Avoid if: Profitable, happy with growth, want autonomy
│
└─ Alternative structures
   ├─ Regulation Crowdfunding (customers become investors)
   ├─ Revenue-based financing (no equity, paid from revenue %)
   ├─ Indie funds (Indie.vc, Earnest Capital, Tinyseed) for sustainable growth
   └─ Bank loans (requires collateral/history)
```

### Avoiding Burnout

**Two fatal mistakes:**
1. Running out of money (solved by profitability)
2. Running out of energy (solved by sustainability mindset)

#### Co-founder Health
- Discuss expectations early (like a marriage contract):
  - What does success look like?
  - How fast do we want to grow?
  - What's an acceptable exit timeline?
  - How much salary/equity are we each comfortable with?
- Use vesting (4-year cliff) to protect both parties
- Have hard conversations early; they only get harder
- Plan for separation scenarios

#### Personal Sustainability
- Business shouldn't make you perpetually stressed or euphoric
- Define what "good" looks like: income, hours, control, impact
- Hire people when tasks hurt (not before)
- Take real breaks; burnout is a sprint killer

### The "Default Alive" Test

When evaluating any decision (hire, spend, expand):

- **Default alive**: Even with zero new customers, can you survive 12 months? If yes, you have leverage.
- **Default dead**: Requires constant growth or capital infusions to avoid collapse. Risky.

Aim for default alive.

## Evaluation Framework for Any Decision

When user asks "Should I do X?" (hire, spend, launch feature, etc.):

1. **Revenue impact**: Will this increase customer revenue? By how much? When?
2. **Cost impact**: Upfront costs? Ongoing costs? How long to recoup?
3. **Reversibility**: Can you undo this? Long-term lease = risky. Freelancer = easy to stop.
4. **Motivation check**: Customer need or ego/vanity? (Honest answer matters)
5. **Alternatives**: Cheaper/simpler way to solve this?
6. **Default alive test**: Do you remain profitable or runway-positive?

## Output

For any business decision, provide:

1. **Profitability impact** (revenue increase, cost increase, net effect)
2. **Reversibility score** (Easy to undo / Medium / Hard to undo)
3. **Timing** (When can you afford this? What's the breakeven?)
4. **Alternatives** (2–3 cheaper/simpler options)
5. **Recommendation** (Yes/No/Wait, with reasoning)

Example:
- **Decision**: Hire a full-time designer
- **Revenue impact**: Might increase customer satisfaction → 5–10% retention improvement ($X/year upside)
- **Cost impact**: $80k/year salary + benefits = $100k/year fixed cost
- **Reversibility**: Hard (severance, recruitment cost)
- **Alternative**: Hire freelancer at $2k/month to test if investment pays off
- **Recommendation**: Test with freelancer first; hire FT only if revenue impact is proven
