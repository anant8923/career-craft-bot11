## Goal

Extend the premium aesthetic from the landing hero to the rest of the app so the product feels cohesive: animated gradients, glassmorphism, glow accents, gradient text, subtle motion, and richer empty states. No business logic changes.

## Scope (UI only)

1. **Login page (`src/pages/Login.tsx`)**
   - Replace static `gradient-hero-bg` with the new `gradient-hero-animated-bg` and overlay `hero-grid-pattern`.
   - Add 2–3 `glow-orb` accents (indigo / purple / pink) behind the branding column.
   - Upgrade headline to use `gradient-text-hero` for the highlighted line; restyle features list with check icons inside small glass chips instead of plain dots.
   - Right side: wrap form in a refined glass card with a soft gradient border, gradient text title, and a `btn-glow` primary submit button.
   - Style inputs with focused gradient ring; demo button gets a subtle gradient outline.

2. **Sidebar (`src/components/layout/Sidebar.tsx`)**
   - Active nav item: switch from flat primary fill to `bg-gradient-primary` with `shadow-glow` and a left accent bar.
   - Hover state: subtle gradient wash + icon scale.
   - Logo block: keep gradient tile, add soft glow ring.
   - User card: replace flat muted bg with `glass-card` style + gradient plan badge.

3. **Dashboard (`src/pages/Dashboard.tsx`)**
   - Header: gradient-text accent on the user's name, add a faint glow orb behind the greeting.
   - Metric cards (`MetricCard`): upgrade icon container to gradient tile with glow; animated count-up on mount; hover lift.
   - "Top Skills", "Recent Activity", "Career Goals" sections: bump to `glass-card-hover`, gradient section titles, refined empty states (gradient icon halo).
   - Goal cards: gradient border on hover, "Click to complete" becomes a small gradient pill.

4. **Shared primitives**
   - `src/components/ui/card.tsx`: keep API, but add an optional `variant="glass"` class path for opt-in glass styling (does not affect existing usages).
   - `src/components/ui/input.tsx`: refine focus ring to use a soft gradient shadow instead of the default 2px ring.
   - `src/components/dashboard/MetricCard.tsx` and `SkillProgress.tsx`: align with new gradient/glow tokens.

5. **Tokens / CSS (`src/index.css`)**
   - No new color palette — reuse existing `--gradient-primary`, `--gradient-hero-animated`, `--shadow-glow`, `glow-orb`, `btn-glow`, `hero-grid-pattern` introduced for the landing page.
   - Add small helpers if needed: `.gradient-border` (mask-based 1px gradient border) and `.icon-tile-gradient` for reusable gradient icon containers.

## Out of scope

- No changes to auth flow, Supabase queries, routing, or data shapes.
- Other feature pages (CareerAdvice, SkillAssessment, ResumeBuilder, InterviewPrep, CareerRoadmap, SalaryInsights, SavedCareers, Subscription) are **not** touched in this pass — we can do a follow-up round once these four anchor screens are approved, to avoid one giant change.

## Technical notes

- All colors via existing HSL semantic tokens / gradient vars in `index.css`. No hardcoded hex in components.
- Animations reuse `animate-fade-in`, `animate-slide-up`, `animate-float`, `animate-bounce-slow` already defined.
- Dark mode: verified tokens already exist; glass + gradient styles use translucent layers that work in both themes.
- Accessibility: keep focus-visible rings, preserve semantic labels, maintain color contrast on gradient backgrounds (text stays white/foreground over gradients).

## Deliverables

Edits to: `Login.tsx`, `Sidebar.tsx`, `Dashboard.tsx`, `MetricCard.tsx`, `SkillProgress.tsx`, `card.tsx`, `input.tsx`, `index.css`. No new dependencies.

After approval, would you like me to also extend this to the feature pages (Career Advice, Skill Assessment, Resume Builder, etc.) in a follow-up?
