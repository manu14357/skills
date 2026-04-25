---
name: minimalist-review
description: >
  Review any business decision, plan, or strategy through the minimalist entrepreneur lens.
  Use to gut-check decisions, simplify approaches, or evaluate options using core principles.
compatibility:
  models: [any-llm]
  use-case: decision-framework
  frameworks: [minimalist-entrepreneur]
---

# Minimalist Review

Evaluate business decisions through the minimalist entrepreneur framework. Test decisions against core principles before committing.

## Use This Skill When

- User wants feedback on a business decision
- User is deciding between multiple options
- User is considering spending money or hiring
- User needs a "gut-check" on their strategy
- User says phrases like "should I", "does this make sense", "am I overthinking", "what do you think about", "is this a good idea"

## When NOT to Use

- User is asking for specialized skill (use specific skill: sales, marketing, product, etc.)
- User is deep in execution and needs tactical help
- User is asking for market research or customer data

## Core Principles

The minimalist entrepreneur framework is built on 8 principles. Use them to evaluate any decision.

### Principle 1: Community First
- **Question**: Does this serve your community, or is it driven by ego/vanity metrics?
- **Test**: Would your customers specifically ask for this? Are you staying close to them?
- **Risk**: Building for imaginary future customers instead of real present ones

### Principle 2: Manual Before Automated
- **Question**: Could this be done manually first, by you, before building a system?
- **Test**: Have you done this work by hand enough to understand it deeply?
- **Risk**: Over-engineering a process before validating it works

### Principle 3: Build Minimally
- **Question**: What's the simplest version that makes someone's life better?
- **Test**: Can you ship this in a weekend? What's 10% of your initial vision?
- **Risk**: Feature creep and scope expansion

### Principle 4: Sell Before You Scale
- **Question**: Have real people paid real money for this already?
- **Test**: Did you sell it manually first? At least to 10–20 customers?
- **Risk**: Building something nobody will actually buy

### Principle 5: Spend Time Before Money
- **Question**: Can you accomplish this with time (your effort) instead of money?
- **Test**: Blog posts, social media, outreach, content are free. Use these first.
- **Risk**: Throwing money at a problem that time and focus could solve

### Principle 6: Profitability is the Goal
- **Question**: Does this move you closer to or further from profitability?
- **Test**: "Default alive" (positive cash flow even with zero new customers) or "default dead" (requires constant growth)?
- **Risk**: Unsustainable spending that burns runway

### Principle 7: Grow at Customer Speed
- **Question**: Are your customers asking for this, or are you guessing?
- **Test**: How many customers requested this? Do they care enough to pay?
- **Risk**: Optimizing for growth metrics instead of customer demand

### Principle 8: Build the House You Want to Live In
- **Question**: Does this align with your values? Would you want to work here in 5 years?
- **Test**: If you made this decision every week, would you still like the company?
- **Risk**: Building a business that owns you instead of one you own

## Decision Evaluation Framework

For any decision, score each factor:

| Principle | Your Decision | Aligned? | Notes |
|-----------|---------------|----------|-------|
| **Community first** | Does this serve real customers? | ☐ Yes ☐ No ☐ Maybe | |
| **Manual first** | Could you do this by hand first? | ☐ Yes ☐ No ☐ Maybe | |
| **Minimally** | Can you do 50% of this? | ☐ Yes ☐ No ☐ Maybe | |
| **Sell first** | Have customers asked or paid for this? | ☐ Yes ☐ No ☐ Maybe | |
| **Time > money** | Does this use time instead of money? | ☐ Yes ☐ No ☐ Maybe | |
| **Profitable** | Does this improve profitability? | ☐ Yes ☐ No ☐ Maybe | |
| **Customer-paced** | Did customers drive this, not guesses? | ☐ Yes ☐ No ☐ Maybe | |
| **Values-aligned** | Do you want to live with this decision? | ☐ Yes ☐ No ☐ Maybe | |

**Scoring**: 6–8 green = Strong decision. 4–5 green = Rethink or simplify. <4 green = Likely a mistake.

## Common Decision Types

### Hiring (Big Decision)

**Minimalist approach**: Hire when it hurts

- Have you really exhausted automation and freelancers?
- Can one person do this job 80% of the time (not 100%)?
- Is this reversible? (Severance costs, recruitment pain)
- Are you profitable enough to absorb this fixed cost?

**Recommendation**: Only hire when you can't get the work done any other way, and it's clearly impacting revenue/customers.

### Spending Money (Features, Tools, Marketing)

**Minimalist approach**: Prove it works with time first

- Can you test this manually or with a free tool first?
- Do you know it will work before scaling the investment?
- What's the absolute minimum spend to validate?

**Recommendation**: Manual → Freelancer → Tool → Hire. Each step is more expensive and less flexible.

### Strategic Pivots (Product, Market, Model)

**Minimalist approach**: Micro-test before fully pivoting

- Have you sold to even 5 customers in the new direction?
- Is this driven by 10+ customers asking, or just one?
- Can you test this with existing customers before rebuilding?

**Recommendation**: Validate with real customers, not assumptions, before major resource reallocation.

### Scaling/Growth Decisions

**Minimalist approach**: Prove unit economics first

- Does each customer generate more revenue than you spend to acquire them?
- Can you profitably acquire customers at your current prices?
- What's the LTV:CAC ratio? (Should be 3:1 or higher)

**Recommendation**: Don't scale a broken unit economy. Fix profitability first, then scale.

## Review Template

When evaluating any decision, provide the user:

1. **Recommendation**: Do it / Simplify it / Don't do it (with confidence level: high/medium/low)

2. **Minimalist version**: What does 30% of this plan look like? What's the core idea stripped down?

3. **Principle alignment**: Which 2–3 principles this decision violates (if any)

4. **Key risks**:
   - What's most likely to go wrong?
   - What's the cost of failure?
   - Is it reversible?

5. **Validation test**: One thing to try this week to confirm/refute the decision without major commitment

6. **Reversibility score**: Easy to undo / Medium difficulty / Hard to reverse

## Output

Provide feedback in this format:

---
**Decision**: [User's decision]

**Recommendation**: [Do it / Simplify / Don't do it] (Confidence: High/Med/Low)

**Minimalist Version**: [Stripped-down version]

**Principle Alignment**:
- ✓ Principles this aligns with
- ✗ Principles this violates

**Key Risks**:
1. [Risk 1]
2. [Risk 2]

**Validation Test**: [Small experiment to confirm before committing]

**Reversibility**: [Easy / Medium / Hard]

---
