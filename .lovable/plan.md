## Goal
Upgrade the landing page hero from "clean template" to a premium, AI-SaaS-grade experience by adding a dashboard mockup, stronger headline + CTA, glass card, dynamic background, trust row, and micro-interactions.

## Files to change

1. **`src/index.css`** — add new tokens, animations, and utilities
2. **`src/pages/Index.tsx`** — restructure hero into a 2-column premium layout

No new dependencies. No new files.

---

## 1. `src/index.css` additions

**Richer 3-color hero gradient** (replace current `--gradient-hero`):
```
linear-gradient(135deg, #4F46E5 0%, #9333EA 50%, #EC4899 100%)
```
Plus an animated variant `--gradient-hero-animated` (200% size, shifting position) for a moving-gradient feel.

**New utilities & keyframes:**
- `.hero-grid-pattern` — subtle white SVG grid overlay (replaces the dot pattern in hero)
- `.glow-orb` — large blurred radial gradient orbs (purple/pink) for depth behind the card
- `.animate-gradient-shift` — slowly animates background-position (15s)
- `.animate-bounce-slow` — softer bounce for the scroll indicator
- `.animate-float-slow` — 8s float for the dashboard mockup
- `@keyframes gradientShift`, `bounceSoft`
- `.btn-glow` — hover state: `scale(1.03)` + `box-shadow: 0 0 40px rgba(236,72,153,0.5)`
- `.gradient-text-hero` — white→pink gradient clip for the second headline line

## 2. `src/pages/Index.tsx` — new hero structure

Replace the centered hero block with a **two-column responsive layout** (`lg:grid-cols-2`, stacks on mobile):

**Left column (text + CTA):**
- Pill badge (keep) — "AI-Powered Career Platform"
- Headline (two lines, left-aligned on lg, centered on mobile):
  - Line 1: `"AI-Powered Career Guidance"` — solid white, bold
  - Line 2: `"Tailored Just for You"` — `gradient-text-hero` (white→pink)
- Subhead: existing copy, slightly tightened
- **Primary CTA:** `"Start Free Career Analysis"` with `btn-glow` (gradient bg, hover scale + glow)
- **Trust row** under the CTA — three inline items with icons:
  - `Zap` "AI Powered"
  - `Target` "Personalized Results"
  - `TrendingUp` "Career Growth"
- Wrap everything in a **glassmorphism card**: `bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 lg:p-10 shadow-2xl`

**Right column (visual storytelling — dashboard mockup):**
A faux floating "Career Suggestions" UI built with divs (no images), wrapped in `animate-float-slow`:
- Outer card: `glass-card` style with white/15 bg, white/30 border, rounded-3xl, shadow
- Mock header row: avatar circle + "Your Career Match" title + small status dot
- 3 mock suggestion rows, each with:
  - Icon tile (gradient bg)
  - Job title (e.g., "AI/ML Engineer", "Product Designer", "Data Scientist")
  - Match % badge (e.g., "94% match") with mini progress bar
- Bottom mini-chart: 4-5 vertical gradient bars of varying heights ("Skill Growth")
- Two small floating accent cards behind it (sparkle badge "+12 new paths", trending badge "↑ 2.5x growth") with `animate-float` at staggered delays

**Background layer (behind both columns):**
- Replace dot pattern with `.hero-grid-pattern`
- Add 2-3 `.glow-orb` divs (top-left purple, bottom-right pink, center-right indigo) with `animate-float`
- Apply `gradient-hero-animated` + `animate-gradient-shift` to the section background

**Scroll indicator:** keep, swap to `animate-bounce-slow` and add subtle "Scroll" text above it.

## 3. CTA section (bottom of page)
Update CTA button text to `"Get Your Career Plan"` and apply `btn-glow`. Headline stays.

## 4. Features section
No structural change. Add `btn-glow`-style hover via existing `glass-card-hover` (already good).

---

## Visual reference

```text
┌────────────────────────────────────────────────────────────────┐
│  animated 3-color gradient + grid + glowing orbs               │
│                                                                │
│  ┌──────────────────────────┐    ┌─────────────────────────┐   │
│  │ ✦ AI-Powered Platform    │    │  ● Your Career Match    │   │
│  │                          │    │  ┌───────────────────┐  │   │
│  │ AI-Powered Career        │    │  │ ▣ AI/ML Engineer  │  │   │
│  │   Guidance               │    │  │   ████████░ 94%   │  │   │
│  │ Tailored Just for You    │    │  ├───────────────────┤  │   │
│  │ (gradient line 2)        │    │  │ ▣ Product Designer│  │   │
│  │                          │    │  │   ███████░░ 87%   │  │   │
│  │ Subhead text...          │    │  ├───────────────────┤  │   │
│  │                          │    │  │ ▣ Data Scientist  │  │   │
│  │ [ Start Free Analysis → ]│    │  │   ██████░░░ 82%   │  │   │
│  │                          │    │  └───────────────────┘  │   │
│  │ ⚡ AI · 🎯 Personal · 📈  │    │  ▮▮▯▮▮ Skill Growth     │   │
│  └──────────────────────────┘    └─────────────────────────┘   │
│                                                                │
│                       ⌄ Scroll                                 │
└────────────────────────────────────────────────────────────────┘
```

## Out of scope
- New images/illustrations (mockup is pure CSS/divs)
- Changes to features section content, login flow, or any other page
- New libraries (no framer-motion, no particle libs)