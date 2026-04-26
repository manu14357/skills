---
name: brand-guidelines
description: Apply OpenAI's brand colors, typography, and visual identity standards to artifacts. Ensure design consistency with OpenAI branding for presentations, documents, and UI components.
compatibility:
  use-case: Design consistency, brand compliance, visual styling
  frameworks: PowerPoint, design systems, brand guidelines
---

# OpenAI Brand Styling

## Use This Skill When

- Applying OpenAI's brand identity to presentations or artifacts
- Ensuring visual consistency with Codex/OpenAI design standards
- Selecting colors or typography that match OpenAI branding
- Styling UI components or documents with corporate identity
- Creating branded materials that need professional visual identity

## When NOT to Use

- Non-OpenAI projects or different brand guidelines
- When brand compliance is not required
- For generic design without specific brand standards
- When custom color schemes are explicitly requested

## Context: Brand Implementation

**Undeveloped**: No brand standards applied; generic styling only.

**Target**: OpenAI colors, typography, and design standards consistently applied to all visual elements.

**Optimized**: Brand guidelines automatically enforced across all artifacts with smart fallbacks and accessibility considerations.

## Core Principle

Strong visual branding creates trust and recognition. OpenAI's palette and typography should be applied consistently to maintain a professional, cohesive identity across all materials.

## Instructions

### Step 1: Understand OpenAI Brand Palette

**Main Colors:**
- **Charcoal** `#0E0F12` - Primary text, dark backgrounds
- **Slate** `#202123` - Surface backgrounds
- **Mist** `#F5F7FA` - Light backgrounds, text on dark
- **Steel** `#9EA1AA` - Secondary elements, dividers

**Accent Colors:**
- **OpenAI Green** `#10A37F` - Primary accent
- **Azure** `#2B8FFF` - Secondary accent
- **Graphite** `#40434A` - Neutral accent for icons/strokes

### Step 2: Apply Typography Standards

**Font Stack (with fallbacks):**
- **Headings** (24pt+): Inter Semibold/Bold → Arial
- **Body Text**: Inter Regular → Arial
- **Code/Monospace**: IBM Plex Mono → Menlo/monospace

**Rules:**
- Headings: 24pt or larger
- Body text: Regular weight
- Code snippets: Always monospace
- Automatic fallback if fonts unavailable

### Step 3: Select Colors by Context

| Element | Color | Use Case |
|---------|-------|----------|
| Primary Text | Charcoal | Dark backgrounds, main content |
| Background | Slate or Mist | Based on contrast needs |
| Accent (Primary) | OpenAI Green | Call-to-action, highlights |
| Accent (Secondary) | Azure | Secondary actions, links |
| Dividers/Icons | Steel or Graphite | Subtle separation, neutral icons |

### Step 4: Apply Smart Color Selection

**For Text:**
- On dark backgrounds → Use Mist
- On light backgrounds → Use Charcoal
- High contrast: Charcoal/Mist pairing

**For Non-Text Elements:**
- Cycle accents: Green → Azure → Graphite
- Maintains visual interest without clashing
- Use Graphite for icons needing neutral treatment

## Implementation Checklist

When applying OpenAI branding:

- ✓ All text elements use Inter or Arial fallback
- ✓ Headings are 24pt+, Semibold/Bold weight
- ✓ Body text uses Regular weight
- ✓ Color selection matches context (text vs. shapes)
- ✓ Dark backgrounds pair with Mist text
- ✓ Light backgrounds pair with Charcoal text
- ✓ Accent colors cycle without repetition
- ✓ Fallback fonts applied if custom fonts unavailable

## Output

Provide the user with:

**Branded Design Specification:**
- Color palette codes (Charcoal, Slate, Mist, Steel, Green, Azure, Graphite)
- Typography rules applied (font names, sizes, weights)
- Layout notes (spacing, contrast, hierarchy)
- Fallback options for fonts

**Sample Implementation:**
- Example showing Charcoal text on Mist background
- Example showing OpenAI Green accent on Slate background
- Color-coded element list for reference

**Brand Compliance Checklist:**
- [ ] All headings use Inter Semibold/Bold (24pt+)
- [ ] All body text uses Inter Regular
- [ ] Text-on-background contrast approved
- [ ] Accent colors applied (Green → Azure → Graphite cycle)
- [ ] Fallback fonts configured
- [ ] Design matches OpenAI visual standards
