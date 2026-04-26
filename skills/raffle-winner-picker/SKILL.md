---
name: raffle-winner-picker
description: Run fair, transparent raffles and sweepstakes. Randomly select winners from participant lists with verification and documentation for credibility.
compatibility:
  use-case: Raffles, giveaways, sweepstakes, fair selection
  frameworks: Random selection, verification, documentation
---

# Raffle Winner Picker

## Use This Skill When

- Running company giveaways or contests
- Selecting random participants for testing or interviews
- Choosing winners for sweepstakes
- Fair team or process selection
- Random sampling for research
- Internal celebration/reward raffles

## When NOT to Use

- Biased selection (intentionally favor certain people)
- Non-random needed (intentional targeting)
- Prize obligations (legal concerns)

## Context: Fair Selection Maturity

**Undeveloped**: Manual picking; unclear fairness; people question results.

**Target**: Clear participant list, documented random selection, verified results.

**Optimized**: Blockchain verification, auditable random source, real-time transparency.

## Core Principle

**Transparency builds trust.** Clear documentation of how winners were selected and verification of fairness ensures buy-in even if someone doesn't win.

## Instructions

### Step 1: Define Raffle Parameters

**Establish clear rules:**

```markdown
## Raffle: Q2 Company All-Hands Prize

**Prize**: 2x $100 gift cards

**Eligibility**:
- Current employees only
- Attendees at Q2 all-hands
- No managers to avoid bias
- No repeat winners (from last 2 raffles)

**Participant Pool**:
- Total participants: 87
- Eligible after filters: 73

**Selection Method**: Random.org (third-party)
**Verification**: Streamed live on Zoom (optional)

**Date**: June 15, 2026 at 2:00 PM
**Announced**: June 15 at 2:15 PM
```

### Step 2: Build Participant List

**Create clean list:**

```markdown
## Participant List (ELIGIBLE)

ID | Name | Email | Verification |
---|------|-------|--------------|
1 | Alice Johnson | alice@company.com | ✓ |
2 | Bob Smith | bob@company.com | ✓ |
3 | Carol Davis | carol@company.com | ✓ |
4 | David Brown | david@company.com | ✓ |
... (69 more) ...

**Total**: 73 participants
**Filtered out** (2):
- John Manager (manager role)
- Sarah Winner (won last raffle, excluded per rules)
```

### Step 3: Select Random Numbers

**Use third-party randomizer:**

**Option 1: Random.org (recommended)**
```
Visit: https://www.random.org/integers/
Settings:
- Generate: 2 integers (for 2 winners)
- From: 1 to 73
- Format: One number per line
- Randomization: True randomness (NIST certified)

Results (with timestamp):
- Time: June 15, 2026 2:00 PM UTC
- Numbers: 14, 52
```

**Option 2: Python random**
```python
import random
import datetime

# Set random seed with timestamp for reproducibility
seed_timestamp = "2026-06-15 2:00 PM UTC"
random.seed(hash(seed_timestamp))

participants = [...list of 73...]
winners = random.sample(participants, 2)

print(f"Winners: {winners}")
print(f"Timestamp: {seed_timestamp}")
print(f"Participants: {len(participants)}")
```

**Option 3: Google Sheets RAND()**
```
Column A: Participant names (1-73)
Column B: =RAND() for each
Sort by Column B
Top 2 in Column A = winners
Screenshot before sort for audit trail
```

### Step 4: Map Numbers to Winners

**Link random numbers to actual names:**

```markdown
## Winner Selection Results

**Random Numbers Generated**: 14, 52

**Mapping to Participant List**:
- Random #14 → Participant 14 → **Carol Davis**
- Random #52 → Participant 52 → **Michael Chen**

**Verification**:
- List remained unchanged from selection
- No filtering after random selection (fairness)
- Participant count: 73 (verified)
```

### Step 5: Document and Verify

**Create verification record:**

```markdown
## Raffle Results — Verification Document

**Raffle Name**: Q2 All-Hands Prize Drawing
**Date**: June 15, 2026 | 2:00 PM UTC

**Parameters**:
- Prize: 2x $100 gift cards
- Participants (eligible): 73
- Method: Random.org (NIST certified random)

**Selection Process**:
1. Verified eligible participant list
2. Generated 2 random numbers between 1-73
3. Mapped numbers to participant names
4. No modifications after random selection

**Winners**:
1. Carol Davis (ID: 14) — Prize: $100
2. Michael Chen (ID: 52) — Prize: $100

**Random Source Proof**:
- Screenshot: [random.org results]
- Timestamp: June 15, 2026 2:00:35 PM UTC
- Certification: NIST-certified true randomness

**Announced**: June 15, 2026 2:15 PM (at all-hands)
**By**: HR Manager
**Witnessed**: All-hands attendees (video recording available)

**Previous Winners** (excluded from this raffle):
- Last raffle: Sarah Winner
- Raffle before: Tom Lopez

**Approval**:
- [ ] HR Lead: Signed off
- [ ] Organizer: Confirmed
- [ ] Winner 1: Notified & accepted
- [ ] Winner 2: Notified & accepted
```

### Step 6: Announce Results

**Share transparently:**

```markdown
## Announcement to Winners

Subject: Congratulations! You Won the Q2 Raffle 🎉

Hi Carol,

You've been randomly selected as a winner of the Q2 All-Hands raffle!

Prize: $100 gift card (your choice of [Visa/Amazon/Company Store])

How we selected you:
- We had 73 eligible participants
- Used Random.org (certified true randomness) to pick 2 winners
- Your participant ID was randomly selected

[Link to raffle verification document]

Claim your prize by: June 22, 2026
Reply to confirm which gift card type you'd prefer.

Congratulations!
```

### Step 7: Maintain Records

**Archive for auditing:**

```bash
# Save verification document
# Save random.org screenshot
# Save participant list (with hash for proof of no changes)
# Archive announcement

# Create folder:
/raffles/2026-Q2-all-hands/
├── rules.md
├── participant_list.csv
├── random_selection_screenshot.png
├── verification_document.md
└── winner_notifications/
    ├── carol_notification.txt
    └── michael_notification.txt
```

## Output

**Deliver:**

1. **Clear Raffle Rules** (eligibility, prize, dates)
2. **Participant List** (verified and cleaned)
3. **Random Selection** (documented, with proof)
4. **Winner Mapping** (numbers → actual names)
5. **Verification Document** (audit trail)
6. **Announcement** (transparent explanation)