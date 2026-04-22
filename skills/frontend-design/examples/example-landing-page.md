---
name: frontend-design-example
description: >
  Reference example for the frontend-design skill. Shows the complete expected
  behavior when a user requests a production landing page — from concept definition
  through token system, implementation, and validation. Use this as the benchmark
  for output quality and structure.
---

# Example: Product Landing Page

Demonstrates the full frontend-design skill workflow on a real-world request.
Use this as the quality benchmark for any landing page, marketing site, or
product screen output.

---

## User Request

> "Design and implement a product landing page for a developer analytics platform.
> Make it memorable, responsive, and production-ready."

---

## Step 0 — Context Inference

No explicit brand or framework was given, so infer and state assumptions upfront:

| Input | Inferred value |
|---|---|
| Audience | Engineering teams, CTOs, senior developers |
| Tone | Technical confidence + premium clarity |
| Framework | HTML + CSS + JS (no framework specified → use vanilla for portability) |
| Device priority | Desktop-first, mobile must work cleanly |
| Existing brand | None provided — establish from scratch |
| Required sections | Hero, features, social proof, pricing preview, footer |

---

## Step 1 — Concept Direction

**Editorial-Tech Minimal**

For engineering leaders who distrust marketing fluff.
Bold typographic hierarchy signals confidence; restrained color and generous
whitespace signal precision. Motion is purposeful — one entrance sequence,
subtle hover states, nothing decorative.

Memorable because: it looks like a tool built by engineers, not a Webflow template.

---

## Step 2 — Design System

### Typography

```css
/* Display: strong editorial presence — Syne or DM Serif Display */
/* Body: clean readable — Inter or DM Sans */
/* Mono: code snippets, metrics labels — JetBrains Mono */

--font-display: 'Syne', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

--text-xs:   0.75rem;   /* 12px — legal, captions */
--text-sm:   0.875rem;  /* 14px — secondary labels */
--text-base: 1rem;      /* 16px — body copy */
--text-lg:   1.125rem;  /* 18px — lead text */
--text-xl:   1.375rem;  /* 22px — card headings */
--text-2xl:  1.75rem;   /* 28px — section headings */
--text-3xl:  2.5rem;    /* 40px — hero subheading */
--text-4xl:  3.5rem;    /* 56px — hero display */
--text-5xl:  5rem;      /* 80px — oversized accent */

--weight-regular: 400;
--weight-medium:  500;
--weight-bold:    700;
--weight-black:   900;

--leading-tight:  1.1;
--leading-snug:   1.3;
--leading-normal: 1.6;
--leading-loose:  1.8;
```

### Color

```css
/* Neutral dark base + single electric accent */
--color-bg:             #0A0A0F;  /* near-black with blue undertone */
--color-surface:        #111118;  /* card backgrounds */
--color-surface-raised: #18181F;  /* hover states, popovers */
--color-border:         #2A2A35;  /* subtle structural lines */
--color-border-strong:  #44445A;  /* visible dividers */

--color-text-primary:   #F0F0F8;  /* headings */
--color-text-secondary: #8888A8;  /* body, descriptors */
--color-text-muted:     #55556A;  /* placeholders, legal */

--color-accent:         #6B63FF;  /* electric indigo — primary CTA */
--color-accent-hover:   #8278FF;  /* lighter on hover */
--color-accent-glow:    rgba(107, 99, 255, 0.18); /* ambient glow */

--color-success: #34D399;
--color-warning: #FBBF24;
--color-error:   #F87171;
```

### Spacing

```css
--space-1:  0.25rem;   --space-2:  0.5rem;
--space-3:  0.75rem;   --space-4:  1rem;
--space-5:  1.25rem;   --space-6:  1.5rem;
--space-8:  2rem;      --space-10: 2.5rem;
--space-12: 3rem;      --space-16: 4rem;
--space-20: 5rem;      --space-24: 6rem;
--space-32: 8rem;

--container-sm:  640px;
--container-md:  768px;
--container-lg:  1024px;
--container-xl:  1280px;
--container-max: 1440px;
```

### Radius & Shadow

```css
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-xl:   20px;
--radius-full: 9999px;

--shadow-sm:  0 1px 3px rgba(0,0,0,0.3);
--shadow-md:  0 4px 16px rgba(0,0,0,0.4);
--shadow-lg:  0 12px 40px rgba(0,0,0,0.5);
--shadow-accent: 0 0 40px var(--color-accent-glow);
```

### Motion

```css
--duration-instant: 80ms;
--duration-fast:    150ms;
--duration-base:    220ms;
--duration-slow:    380ms;
--duration-xslow:   600ms;

--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out:     cubic-bezier(0.0, 0, 0.2, 1);
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration:  0.01ms !important;
  }
}
```

---

## Step 3 — Layout Plan

```
┌─────────────────────────────────────┐
│  NAV  logo + links + CTA button     │
├─────────────────────────────────────┤
│  HERO                               │
│  Oversized headline (2 lines)       │
│  Lead subtext + primary CTA         │
│  Dashboard preview image/mockup     │
├─────────────────────────────────────┤
│  SOCIAL PROOF  logo strip           │
├─────────────────────────────────────┤
│  FEATURES  2-col asymmetric grid    │
│  Large feature card left            │
│  2 small cards stacked right        │
│  (repeat inversed for next row)     │
├─────────────────────────────────────┤
│  METRICS  3-col stat callouts       │
├─────────────────────────────────────┤
│  TESTIMONIAL  editorial blockquote  │
├─────────────────────────────────────┤
│  PRICING  3-tier card row           │
│  (Starter / Pro / Enterprise)       │
├─────────────────────────────────────┤
│  CTA BAND  full-width accent strip  │
├─────────────────────────────────────┤
│  FOOTER  4-col links + legal row    │
└─────────────────────────────────────┘
```

**Hierarchy notes:**
- Hero headline uses `--text-5xl` at `--weight-black`
- Feature card titles use `--text-xl` at `--weight-bold`
- Body copy stays at `--text-base` / `--leading-normal`
- Accent color appears only on CTAs, active states, and one decorative element per section

---

## Step 4 — Motion Plan

| Element | Trigger | Animation |
|---|---|---|
| Nav | Page load | Fade in, 0ms delay |
| Hero headline | Page load | Fade + slide up 24px, 100ms delay |
| Hero subtext | Page load | Fade + slide up 16px, 200ms delay |
| Hero CTA | Page load | Fade + scale from 0.96, 300ms delay |
| Hero image | Page load | Fade + slide up 32px, 150ms delay |
| Feature cards | Scroll into view | Stagger fade + slide up, 80ms apart |
| Stat counters | Scroll into view | Count up from 0 over 1.2s |
| Testimonial | Scroll into view | Fade in, no movement |
| Pricing cards | Scroll into view | Stagger scale from 0.97, 60ms apart |
| All buttons | Hover | Background shift + shadow-accent, `--duration-fast` |
| Nav links | Hover | Underline expand from left, `--duration-base` |

---

## Step 5 — Implementation

> Full code output goes here. It must be complete and runnable —
> no placeholder comments like `// add your content here`.

The implementation should include:

- Single `index.html` file with embedded `<style>` and `<script>` blocks
  (or separate files if the user's workflow prefers it)
- All CSS custom properties defined on `:root`
- Google Fonts `<link>` preload for chosen typefaces
- Semantic HTML structure with `<nav>`, `<main>`, `<section>`, `<footer>`
- JS limited to: scroll-triggered entrance animations, stat counter, mobile nav toggle
- No external JS dependencies unless the user asked for a framework

**Model instruction:** When generating the implementation, produce the full file.
Do not truncate. Do not say "the rest follows the same pattern."
Every section listed in the layout plan must appear in the output.

---

## Step 6 — Validation Checklist

Run through every item before delivering:

### Responsive
- [ ] 375px — hero headline wraps cleanly, no overflow, CTA full-width
- [ ] 768px — feature grid collapses to single column, pricing cards stack
- [ ] 1280px — max-width container respected, no content stretching to edge
- [ ] 1440px+ — layout holds, no runaway line lengths

### Accessibility
- [ ] Tab order follows visual reading order
- [ ] All buttons and links have visible `:focus-visible` ring
- [ ] Color contrast: body text ≥ 4.5:1, large text ≥ 3:1 (check on dark bg)
- [ ] Decorative images use `alt=""`, meaningful images have descriptive alt text
- [ ] `<nav>` has `aria-label="Main navigation"`
- [ ] Mobile nav toggle has `aria-expanded` toggled correctly
- [ ] Pricing cards announce plan name and price to screen readers

### Performance
- [ ] No render-blocking scripts (all `<script>` tags use `defer` or placed before `</body>`)
- [ ] Fonts loaded with `display=swap`
- [ ] No animation running on scroll — only triggered once on enter
- [ ] No `box-shadow` or `filter` animations (GPU-safe only: `transform`, `opacity`)

### Visual
- [ ] Accent color used ≤ 3 times per section (not overused)
- [ ] Every section has a distinct visual rhythm from the one above it
- [ ] No two adjacent sections use the same background color
- [ ] Concept feels cohesive end-to-end — no section looks like it belongs to a different site

---

## Output Shape (summary)

When the model delivers the final response, it must contain these five parts in order:

1. **Concept statement** — 3–5 lines: audience, aesthetic, differentiator
2. **Token reference** — complete CSS custom property block, ready to paste
3. **Layout summary** — which sections were built and any notable structure decisions
4. **Complete code** — full runnable file(s), no omissions
5. **Validation results** — brief pass/fail notes on responsive, a11y, performance, visual

---

## Failure Modes to Watch For

| Failure | Signal | Fix |
|---|---|---|
| Generic output | Looks like every SaaS landing page | Revisit Step 1 — commit harder to the concept |
| Inconsistent tokens | Random hardcoded values mixed in | Audit CSS for any value not from `:root` |
| Truncated code | "...continues similarly" or placeholders | Always output the full file |
| Missing states | Buttons have no hover or focus styles | Check every interactive element |
| Broken mobile | Layout overflow or tiny text on 375px | Test with browser dev tools before delivery |
| Decoration without purpose | Gradients and glows that don't reinforce hierarchy | Remove or tie each effect to a design intent |