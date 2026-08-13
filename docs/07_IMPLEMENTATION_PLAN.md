# Implementation Plan
## RakshaGrid — 24-Hour Hackathon Build Plan (Team of 5)

---

## 1. Team Roles

| # | Role | Owns |
|---|---|---|
| 1 | **Backend/API Lead** | FastAPI service, DB schema, WebSocket gateway, deployment endpoints |
| 2 | **ML/Data Lead** | Risk scoring model, synthetic data generator, allocation optimizer |
| 3 | **Frontend Lead** | React dashboard shell, heatmap, ranked list, state management |
| 4 | **Frontend/Integration Engineer** | Recommendation panel, incident console, WebSocket client, explainability UI |
| 5 | **PM / Design / Data-Prep / Pitch Lead** | Nagpur junction dataset curation, UI/UX polish (Figma or direct CSS), demo script, slides, write-up docs |

> Everyone reviews everyone's PRs at hour checkpoints — no silos beyond hour 16.

## 2. Hour-by-Hour Timeline

### Phase 0 — Setup (Hours 0–2)
- Repo scaffolded (see structure below), Docker Compose skeleton, CI lint job.
- Junction dataset (30–50 Nagpur junctions) curated from OSM by PM/Design lead.
- Backend: DB schema migrated (Alembic), FastAPI skeleton with health check.
- Frontend: Vite + React + Tailwind + shadcn scaffolded, map loads with static markers.
- Agree on API contract (from TRD/Backend Schema) — freeze it here to unblock parallel work.

### Phase 1 — Core Build (Hours 2–10)
- ML Lead: synthetic incident/traffic generator running; v1 weighted risk scoring formula implemented + unit-tested on sample data.
- Backend Lead: `/api/junctions`, `/api/junctions/{id}/explain` live against real DB + scoring engine.
- Frontend Lead: heatmap renders live scores (color-coded), ranked list panel functional.
- Integration Engineer: WebSocket gateway + client wired for live score push.
- **Checkpoint (Hour 10): heatmap shows live, color-coded, explainable scores end-to-end.**

### Phase 2 — Optimization & Interactivity (Hours 10–16)
- ML Lead: allocation optimizer (Hungarian/greedy) producing recommended deployment.
- Backend Lead: `/api/deployment/*` endpoints + override/audit logging.
- Frontend: Recommendation cards + Accept/Modify/Reject flow; audit feed.
- Integration Engineer: Incident injection console wired end-to-end (inject → recompute → live re-render).
- PM/Design: Baseline-vs-recommended comparison view; UI visual polish pass begins.
- **Checkpoint (Hour 16): full loop works — inject incident → re-rank → recommend → operator acts → logged.**

### Phase 3 — Polish, Explainability, Resilience (Hours 16–20)
- Explainability NL generation finalized (template + optional Claude API pass for top-N).
- Edge cases handled: no-officer-available flag, WebSocket reconnect fallback.
- Visual polish pass complete against UI/UX Brief priority order.
- Seed a **scripted demo scenario** (deterministic, no reliance on live external calls) — critical for a reliable pitch.
- Deploy: backend to Render/Railway, frontend to Vercel; verify public URL works from a clean network.

### Phase 4 — Docs, Rehearsal, Buffer (Hours 20–24)
- Finalize technical write-up, scalability/cost/retrofit note, privacy/ethics note (all already drafted in this doc set — adapt to actual build results).
- Record a 2–3 min backup demo video (in case live demo/network fails on stage).
- Full team dry-run of the pitch (target: 5 min demo + 2 min Q&A).
- Buffer time reserved for last-minute bug fixes — **do not schedule new features here.**

## 3. Demo Script (5 minutes)
1. **(30s)** Problem framing — Nagpur's real coverage gap, in one sentence + one stat.
2. **(60s)** Show live heatmap + ranked list — "here's risk across the city right now, and here's exactly why junction X is #1" (open explainability drawer).
3. **(90s)** Inject a live incident on stage — watch re-ranking, new recommendation appear, click **Accept**, watch audit log update. This is the centerpiece.
4. **(60s)** Flip to Baseline vs Recommended — show the quantified coverage-gap improvement number.
5. **(60s)** Close on scalability/retrofit slide — "deploys on top of existing ICCC infrastructure, no rip-and-replace" — this directly answers the government evaluator's real-world adoption concern.

## 4. Recommended Tech Stack (Summary)

| Layer | Choice |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind + shadcn/ui |
| Map/Viz | Leaflet + leaflet.heat, Recharts |
| Backend | FastAPI (Python 3.11), WebSockets |
| ML/Optimization | scikit-learn (optional XGBoost) + SciPy `linear_sum_assignment` |
| Explainability | Template NL + optional Anthropic Claude API for polish |
| Database | PostgreSQL + PostGIS |
| Cache/PubSub | Redis |
| Infra | Docker Compose (local), Render/Railway (backend), Vercel (frontend) |
| CI | GitHub Actions |
