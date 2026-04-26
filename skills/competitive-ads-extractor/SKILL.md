---
name: competitive-ads-extractor
description: Extract and analyze competitor ads from ad libraries (Facebook, LinkedIn, etc.) to understand messaging strategies, pain points highlighted, and creative approaches that resonate with audiences.
compatibility:
  use-case: Competitive research, ad strategy, marketing insights
  frameworks: Facebook Ad Library, LinkedIn, ad analysis platforms
---

# Competitive Ads Extractor

## Use This Skill When

- Researching competitor ad campaigns and messaging
- Finding inspiration for your own ad creative
- Understanding market positioning and pain points
- Analyzing successful ad patterns and copy approaches
- Discovering new use cases or customer problems
- Planning campaigns with proven messaging concepts
- Benchmarking ad performance across competitors
- Understanding audience targeting strategies

## When NOT to Use

- Copying competitor ads (research, don't replicate)
- When competitors have private or non-library ads only
- For platforms without public ad libraries
- When you need to analyze offline/traditional media
- For real-time ad performance data (not available in libraries)

## Context: Competitive Intelligence

**Undeveloped**: Manual ad browsing, no systematic analysis, missed patterns.

**Target**: Extracted ads with analyzed messaging, identified pain points, recognized successful patterns.

**Optimized**: Comprehensive competitive map, sentiment analysis, trend forecasting, prediction of what works next.

## Core Principle

Winning ads solve real problems and use proven messaging patterns. Extract competitor ads systematically to identify which pain points resonate and which creative approaches drive action.

## Instructions

### Step 1: Identify Competitors and Platforms

**Define Competitive Set:**

| Competitor | Primary Platform | Ad Frequency | Target Audience |
|------------|------------------|--------------|-----------------|
| Company A | Facebook | 15+ ads | Startups |
| Company B | LinkedIn | 8+ ads | Enterprise |
| Company C | Facebook + LinkedIn | 20+ ads | Mid-market |

**Platform Access:**
- **Facebook Ad Library**: facebook.com/ads/library (public, most comprehensive)
- **LinkedIn Ads**: linkedin.com/ads/library (limited, enterprise focus)
- **Google Ads Transparency**: ads.google.com/transparency (political/election ads)
- **Platform-specific**: TikTok, Instagram, YouTube also have ad libraries

### Step 2: Extract Ads Systematically

**Extraction Process:**

1. Search competitor name in ad library
2. Screenshot all active ads (note: usually 10–50 per competitor)
3. Save with consistent naming: `{competitor}-{theme}-{date}.png`
4. Record metadata:
   - Ad copy (full text)
   - Visuals (format: static image, video, carousel)
   - CTA button text ("Try Free", "Learn More", etc.)
   - Audience targeting (if visible)
   - Approximate spend level (if indicated)

**Example Folder Structure:**
```
competitor-ads/
├── notion/
│   ├── ads-001-productivity.png
│   ├── ads-002-collaboration.png
│   └── metadata.json
├── slack/
│   ├── ads-001-teams.png
│   └── metadata.json
```

### Step 3: Analyze Messaging and Pain Points

**Framework for Analysis:**

| Element | Questions to Answer |
|---------|-------------------|
| **Problems Highlighted** | What pain point(s) does each ad address? How is it phrased? |
| **Value Propositions** | What outcome is promised? Benefit-focused or feature-focused? |
| **Audience Segments** | Which customer type is each ad targeting? (Startup, Enterprise, etc.) |
| **Emotional Angle** | Fear, aspiration, relief, achievement? What emotion drives the CTA? |
| **Copy Patterns** | Short/long? Question or statement? Specific numbers or general? |

**Example Analysis:**

**Ad: "Stop Switching Between 10 Tools"**
- **Pain Point**: Tool fragmentation, context switching
- **Target**: Teams dealing with collaboration chaos
- **Emotion**: Relief from frustration
- **CTA**: "Try Free" (low friction)
- **Likely Effectiveness**: High (universal pain point)

### Step 4: Identify Recurring Patterns

**Pattern Categories:**

| Pattern Type | Example | Frequency | Why Effective |
|-------------|---------|-----------|--------------|
| **Before/After** | Chaos → Organization | 6/23 ads | Visual clarity of transformation |
| **Feature Showcase** | 5-sec GIF of product | 8/23 ads | Product familiarity + proof |
| **Social Proof** | "Join 20M users" | 4/23 ads | Credibility + scale |
| **Problem-Agitation** | "Never ask where is that?" | 7/23 ads | Specific pain point | 
| **Vision Statement** | "The all-in-one workspace" | 5/23 ads | Positioning clarity |

**What Patterns Mean:**
- If 30%+ of ads use the same pattern → Proven to work
- If pattern appears with multiple pain points → Flexible framework
- If pattern uses specific numbers → Performance metric visible

### Step 5: Extract Copy That Performs

**Headline Analysis:**

| Headline | Strength | Weakness |
|----------|----------|----------|
| "Your team's knowledge, finally in one place" | Benefit + relief | Generic |
| "The all-in-one workspace" | Positioning + clarity | Not specific to pain |
| "AI that actually helps you work" | Skepticism antidote | Feature-focused |

**Body Copy Patterns That Work:**

- **Short sentences** (max 10 words): Scannability
- **Specific numbers**: "Cut meetings by 50%" vs. "Save time"
- **Outcome-first**: "Spend 3 fewer hours in meetings" not "Features: [list]"
- **Problem restatement**: Echo the pain back to audience
- **Clear CTA**: "Try Free", "Get Started", "Learn More"

### Step 6: Map Audience Strategies

**Example Audience Segmentation:**

**Competitor: Notion**
- **Founders**: Solo productivity, founder story angle
- **Team Leads**: Collaboration, alignment, transparency
- **Enterprise**: Security, compliance, integration, scale
- **Students**: Free access, templates, organization

**Why This Matters:**
- Different pain points for different segments
- Different CTAs per segment (free vs. demo vs. contact sales)
- Different creative angles (individual vs. team vs. org)

## Quality Checklist

- ✓ All competitor ads extracted (not just a sample)
- ✓ Screenshots organized with clear naming
- ✓ Metadata captured (copy, CTA, format, targeting)
- ✓ Pain points identified and quoted
- ✓ Creative patterns documented with frequency
- ✓ Copy patterns extracted and analyzed
- ✓ Audience segments mapped
- ✓ Insights synthesized (what's clearly working)

## Output

Deliver:

1. **Competitive Ad Library**
   - Screenshots of all ads found
   - Organized by competitor and theme
   - Metadata spreadsheet (copy, CTA, format)

2. **Pattern Analysis Document**
   - Identified pain points (with quotes)
   - Recurring creative patterns + frequency
   - Successful copy structures
   - Audience targeting insights

3. **Strategic Recommendations**
   - Top 3 pain points to address
   - Recommended creative pattern(s)
   - Copy approaches to test
   - Audience segments to target first

4. **Swipe File**
   - Best headlines and copy
   - Before/after patterns
   - CTAs that work
   - Positioning statements worth emulating

## Recommendations for Your Ads

1. **Test the "tool sprawl" pain point**
   → Strong resonance based on their ad frequency

2. **Use product screenshots over abstract visuals**
   → All their top ads show actual UI

3. **Lead with the problem, not the solution**
   → "Tired of X?" performs better than "Introducing Y"

4. **Keep copy under 100 characters**
   → Their shortest ads seem most frequent

5. **Test before/after visual formats**
   → Proven pattern in their creative

## Files Saved
- All ads: ~/competitor-ads/notion/
- Analysis: ~/competitor-ads/notion/analysis.md
- Best performers: ~/competitor-ads/notion/top-10/
```

**Inspired by:** Sumant Subrahmanya's use case from Lenny's Newsletter

## What You Can Learn

### Messaging Analysis
- What problems they emphasize
- How they position against competition
- Value propositions that resonate
- Target audience segments

### Creative Patterns
- Visual styles that work
- Video vs. static image performance
- Color schemes and branding
- Layout patterns

### Copy Formulas
- Headline structures
- Call-to-action patterns
- Length and tone
- Emotional triggers

### Campaign Strategy
- Seasonal campaigns
- Product launch approaches
- Feature announcement tactics
- Retargeting patterns

## Best Practices

### Legal & Ethical
✓ Only use for research and inspiration
✓ Don't copy ads directly
✓ Respect intellectual property
✓ Use insights to inform original creative
✗ Don't plagiarize copy or steal designs

### Analysis Tips
1. **Look for patterns**: What themes repeat?
2. **Track over time**: Save ads monthly to see evolution
3. **Test hypotheses**: Adapt successful patterns for your brand
4. **Segment by audience**: Different messages for different targets
5. **Compare platforms**: LinkedIn vs Facebook messaging differs

## Advanced Features

### Trend Tracking
```
Compare [Competitor]'s ads from Q1 vs Q2. 
What messaging has changed?
```

### Multi-Competitor Analysis
```
Extract ads from [Company A], [Company B], [Company C]. 
What are the common patterns? Where do they differ?
```

### Industry Benchmarks
```
Show me ad patterns across the top 10 project management 
tools. What problems do they all focus on?
```

### Format Analysis
```
Analyze video ads vs static image ads from [Competitor]. 
Which gets more engagement? (if data available)
```

## Common Workflows

### Ad Campaign Planning
1. Extract competitor ads
2. Identify successful patterns
3. Note gaps in their messaging
4. Brainstorm unique angles
5. Draft test ad variations

### Positioning Research
1. Get ads from 5 competitors
2. Map their positioning
3. Find underserved angles
4. Develop differentiated messaging
5. Test against their approaches

### Creative Inspiration
1. Extract ads by theme
2. Analyze visual patterns
3. Note color and layout trends
4. Adapt successful patterns
5. Create original variations

## Tips for Success

1. **Regular Monitoring**: Check monthly for changes
2. **Broad Research**: Look at adjacent competitors too
3. **Save Everything**: Build a reference library
4. **Test Insights**: Run your own experiments
5. **Track Performance**: A/B test inspired concepts
6. **Stay Original**: Use for inspiration, not copying
7. **Multiple Platforms**: Compare Facebook, LinkedIn, TikTok, etc.

## Output Formats

- **Screenshots**: All ads saved as images
- **Analysis Report**: Markdown summary of insights
- **Spreadsheet**: CSV with ad copy, CTAs, themes
- **Presentation**: Visual deck of top performers
- **Pattern Library**: Categorized by approach

## Related Use Cases

- Writing better ad copy for your campaigns
- Understanding market positioning
- Finding content gaps in your messaging
- Discovering new use cases for your product
- Planning product marketing strategy
- Inspiring social media content

