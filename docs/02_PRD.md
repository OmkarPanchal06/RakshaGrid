# Product Requirements Document (PRD)
## Project: RakshaGrid — AI Traffic Risk Heatmap & Police Deployment Decision Support (Nagpur)

**Version:** 1.0 · **Hackathon:** Government ITMS Hackathon · **Team size:** 5 · **Build window:** 24 hours

---

## 1. Problem Statement

Nagpur Traffic Police manage a large number of junctions and road stretches with limited personnel. Risk conditions (congestion, accidents, violations, illegal parking, obstructions, weather, events) shift throughout the day, but there is no system that automatically tells commanders **where** risk is highest, **why**, and **where officers should be right now**. High-risk locations can go unmanned while low-risk ones stay staffed out of habit.

## 2. Product Vision

> "A living, explainable map of risk across Nagpur that tells a traffic commander — every few minutes — where danger is building, why, and exactly how to move the officers they already have to cover it."

RakshaGrid is not another CCTV/challan tool. It is a **decision-support layer** that sits on top of whatever data a city already has (or, for the demo, realistic simulated data) and turns it into ranked, explainable, actionable deployment recommendations — updated dynamically as incidents happen.

## 3. Target Users

| User | Need |
|---|---|
| **Traffic Control Room Operator** | Real-time view of risk + who's deployed where |
| **Traffic Commander / DCP** | Ranked priority list, override authority, accountability trail |
| **Field Officer (future scope)** | Push notification of reassignment |
| **Hackathon Judges (govt stakeholders)** | Proof the system reduces uncovered high-risk time and is explainable/auditable |

## 4. Goals & Success Metrics

| Goal | Metric (demo-measurable) |
|---|---|
| Correctly surface high-risk locations | Top-N ranked list matches seeded "ground truth" risk scenario |
| Reduce uncovered high-risk junctions | % of high-risk junctions unmanned, baseline vs. RakshaGrid (target: ≥40% reduction in simulation) |
| Fast reaction to new incidents | Recommendation recomputed & shown in <3s of incident injection |
| Explainability | Every score/recommendation shows a plain-language reason, no black box |
| Operator trust / control | 100% of recommendations are accept/modify/reject-able, with reason logged |

## 5. Scope

### 5.1 In Scope (24-hour build)
- Simulated/open dataset for Nagpur junctions (coordinates, historical incident patterns, time-of-day traffic profiles).
- Risk scoring engine (rule-based + lightweight ML) producing 0–100 score per junction, refreshed continuously.
- Interactive color-coded heatmap (Leaflet/Mapbox) of Nagpur.
- Ranked priority list of junctions needing attention.
- Personnel allocation algorithm assigning N available officers to top-risk/under-covered junctions.
- Incident injection panel to simulate a live event (accident, VIP movement, waterlogging, festival crowd) and show dynamic re-ranking + redeployment.
- Detection of high-risk-but-unmanned junctions (visually flagged).
- Explainability panel: natural-language "why this score / why this recommendation."
- Operator controls: Accept / Modify / Reject each recommendation, with a logged reason.
- Baseline-vs-recommended deployment comparison view.
- Control-room style dashboard (single-page, dark-mode ops-center aesthetic).

### 5.2 Out of Scope (explicitly, for the pitch)
- Live CCTV video ingestion / real ANPR-RLVD feeds (only stubs/mock adapters — architecture supports it, demo doesn't require it).
- Mobile app for field officers (shown as a roadmap slide only).
- Integration with real Nagpur Police backend systems (would require MoUs/data access).
- User authentication hardening beyond a simple demo login.

## 6. Key Features (Detailed)

### F1 — Risk Scoring Engine
Combines weighted signals: historical accident density, current/forecasted congestion, active violations rate, weather severity, event calendar (e.g., festival, VIP movement), road-work obstructions, time-of-day/day-of-week pattern. Produces an explainable composite score with per-feature contribution breakdown (SHAP-style bar).

### F2 — Risk Heatmap
Nagpur map, junctions plotted as color-coded markers/heat layer (green/amber/red), clustered by zone, filterable by time window and risk category.

### F3 — Ranked Attention List
Sorted list of junctions by risk, each with score, trend arrow (rising/falling), current coverage status (manned/unmanned), and one-line reason.

### F4 — Personnel Allocation Optimizer
Given N officers and M junctions, solves a weighted assignment problem (risk-weighted coverage maximization, e.g. greedy/Hungarian-algorithm-based) respecting travel time/zone constraints, producing a deployment plan.

### F5 — Dynamic Incident Simulation
Operator (or auto-demo script) injects an incident (e.g., "accident at Wardha Rd/Ring Rd junction"); system recalculates risk + redeployment within seconds and animates the change.

### F6 — Unmanned High-Risk Detector
Cross-references risk ranking with current deployment; flags any junction above a risk threshold with no assigned officer.

### F7 — Explainability Layer
Every score and recommendation has a natural-language explanation generated from the underlying feature weights (template-based, optionally polished via LLM call) — e.g. *"Ranked #2: accident density is 3x zone average and a waterlogging alert is active; currently unmanned."*

### F8 — Operator Override & Audit Trail
Accept / Modify (reassign manually) / Reject buttons per recommendation; every action timestamped and logged for accountability — a key government-trust feature.

### F9 — Baseline vs. Recommended Comparison
Side-by-side or toggle view: "what a fixed/manual roster would cover" vs. "what RakshaGrid recommends," with a coverage-gap % delta — this is the single most persuasive judge-facing visual.

## 7. Non-Functional Requirements
- **Explainability by design** — no unexplained score anywhere in the UI.
- **Latency** — recommendation refresh <3s after new data/incident.
- **Resilience** — works fully on offline/seeded demo data (no dependency on live internet during the pitch).
- **Auditability** — every override logged with operator ID, timestamp, reason.
- **Privacy/Ethics** — no facial recognition, no individual vehicle tracking beyond aggregate/violation counts; all demo data is simulated or anonymized.
- **Scalability note (for write-up)** — architecture must show a credible path from 50 demo junctions to city-wide (thousands of junctions).

## 8. Differentiators (Why This Wins)
1. **Explainable-by-default** — every judge question ("why did it pick this junction?") is answered on-screen, not in the code.
2. **Optimization, not just visualization** — actual allocation algorithm, not just a pretty heatmap.
3. **Human-in-the-loop** — override/audit trail directly answers the government trust & accountability concern.
4. **Dynamic, not static** — live incident injection demo is the most memorable 90 seconds of the pitch.
5. **Baseline comparison** — quantifies impact ("40% fewer uncovered high-risk minutes") instead of just "looks cool."

## 9. Risks & Mitigations
| Risk | Mitigation |
|---|---|
| No real data access | Use OSM Nagpur junction coordinates + realistic synthetic incident/traffic generator |
| ML model complexity eats time | Start with transparent weighted-rule model; upgrade to XGBoost only if time remains |
| Real-time infra flaky on stage | Pre-seed a scripted demo scenario; don't rely on live external APIs during pitch |
| Team coordination in 24h | Strict role split + hourly syncs (see Implementation Plan) |

## 10. Deliverables for Submission
- Working prototype (deployed link + local run instructions)
- Dashboard demo (recorded backup video)
- Technical write-up (architecture, model, accuracy/performance)
- Scalability, cost, retrofit note
- Privacy/ethics note