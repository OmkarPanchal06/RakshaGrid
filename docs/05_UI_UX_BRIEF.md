# UI/UX Brief
## RakshaGrid — AI Traffic Risk Heatmap & Police Deployment Decision Support

---

## 1. Design Principles
1. **Control-room clarity over decoration** — this is a tool a commander glances at under pressure; every pixel should answer "where, why, what next" fast.
2. **Explainability visible, not buried** — reasons and confidence are always one click away, never hidden in a report.
3. **Status at a glance** — color is the primary language (risk level, coverage status); text confirms, doesn't lead.
4. **Human authority is visible** — Accept/Modify/Reject controls are never smaller or less prominent than the AI recommendation itself.
5. **Trustworthy govt-tech aesthetic** — precise, calm, high-contrast — not a consumer app; avoid playful/startup visual language.

## 2. Visual Direction

| Element | Direction |
|---|---|
| Theme | **Dark mode, ops-center style** (like an air-traffic-control display) — reduces eye strain for long monitoring sessions, reads as "serious infrastructure" |
| Base palette | Near-black background (`#0B0F14`), slate panels (`#141A22`), cool gray text (`#C9D1D9`) |
| Risk color scale | Green `#2ECC71` (low) → Amber `#F5A623` (medium) → Red `#E74C3C` (high) → Deep Red pulse `#B71C1C` (critical/unmanned+high-risk) |
| Accent | Electric blue `#3D9DF6` for interactive/AI elements (recommendations, live indicators) — visually distinct from risk colors so AI action ≠ risk state |
| Typography | **Inter** or **IBM Plex Sans** — clean, official, highly legible at small sizes; monospace (**JetBrains Mono**) for scores/IDs/timestamps to reinforce "data system" feel |
| Iconography | Lucide icons — minimal, line-based, consistent stroke width |
| Motion | Subtle only: marker color transitions (300ms ease), list reordering (400ms), pulse animation only for critical/unmanned alerts — never decorative motion |

## 3. Layout System
- 12-column responsive grid, but **primary target is a large control-room monitor / laptop (1440px+)** — mobile is explicitly out of scope for this tool (field officer app is future roadmap).
- Persistent 3-zone layout: **Top status bar (fixed) / Left map (fluid, ~65%) / Right tabbed panel (fixed ~35%)**.
- Bottom drawer (audit/explainability feed) collapses to a thin strip by default, expandable — keeps map primary without hiding accountability data.

## 4. Key Screens — Wireframe Description

### 4.1 Main Dashboard
```
┌───────────────────────────────────────────────────────────────────┐
│ RakshaGrid   🕐 14:32  🔴 2 Active Incidents   👮 12/18 Deployed   │  ← top bar
├───────────────────────────────────────┬─────────────────────────┤
│                                        │ [Ranked] [Deploy] [Inc]  │
│           NAGPUR HEATMAP              │ ─────────────────────── │
│        (color-coded markers,          │ #1 Sitabuldi Sq  92 🔴   │
│         zone clusters, filters        │    unmanned — accident   │
│         top-left overlay)             │    +weather               │
│                                        │ #2 Wardha Rd Jn  81 🟠   │
│                                        │    manned (Officer 07)   │
│                                        │ ...                       │
├───────────────────────────────────────┴─────────────────────────┤
│ ▾ Audit / Explainability Feed  (collapsed strip, expandable)      │
└───────────────────────────────────────────────────────────────────┘
```

### 4.2 Junction Detail Drawer (slides in from right on marker click)
- Header: junction name, zone, current score gauge (radial).
- Feature contribution horizontal bar chart (7 factors, colored by weight).
- One-sentence plain-language reason (large, quoted style, blue accent).
- Coverage status chip + mini 24h incident history sparkline.

### 4.3 Recommendation Card (in Deploy tab)
```
┌─────────────────────────────────────────┐
│ 🔴 Sitabuldi Square         Score: 92    │
│ Recommend: Officer 14 (3 min away)       │
│ Why: accident density 3x avg + waterlogging active │
│ [ Accept ]   [ Modify ]   [ Reject ▾ ]   │
└─────────────────────────────────────────┘
```

### 4.4 Incident Injection Console
- Simple form: Type (icon-button chips: Accident / Waterlogging / VIP Movement / Festival / Obstruction), Location (map-click or search), Severity (slider 1–5), Submit.
- On submit: full-screen subtle flash + "Recalculating…" progress bar (<3s), then live update animation.

### 4.5 Baseline vs. Recommended Toggle
- Segmented control top-right of map: `[ Current Roster | RakshaGrid Recommended ]`.
- Summary stat strip beneath: "Uncovered high-risk junctions: **7 → 3** (-57%)" in large accent typography — designed to be the pitch's key screenshot.

## 5. Component Inventory (for shadcn/ui build)
- StatusBar, RiskGauge, FeatureContributionChart, JunctionMarker (map), RankedListItem, RecommendationCard, IncidentForm, ComparisonStatStrip, AuditFeedItem, OverrideDialog, Toast/NotificationBanner.

## 6. Accessibility & Usability
- WCAG AA contrast maintained even in dark theme (verify red/green distinguishable for color-blind users — add icon/shape redundancy: ●/▲/■ per risk tier, not color alone).
- All critical actions (Accept/Modify/Reject) keyboard-operable.
- Font sizes minimum 14px body / 12px monospace data, scalable.

## 7. Judge-Facing Polish Priorities (given 24h limit)
Rank effort here if time runs short:
1. Heatmap + ranked list looking sharp and live-updating (core wow).
2. Recommendation card + Accept/Modify/Reject flow (proves human-in-loop).
3. Incident injection → live recompute animation (the memorable demo beat).
4. Baseline vs Recommended comparison strip (the quantified-impact screenshot).
5. Explainability drawer polish (nice-to-have visual finesse last).