# RakshaGrid
### AI-Based Traffic Risk Heatmap & Police Deployment Decision Support — Nagpur City

Built for a 24-hour government hackathon. RakshaGrid is a **decision-support layer** that scores traffic junctions for real-time risk, shows it on a live heatmap, and recommends how to deploy a limited pool of traffic police — with every recommendation explainable and overridable by a human operator.

> Problem Statement B: *"Where should limited traffic-police personnel be deployed right now, why are they needed there, and how should deployment change when traffic conditions change?"*

---

## Table of Contents
- [Overview](#overview)
- [Team](#team)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Documentation](#documentation)
- [Development Workflow](#development-workflow)
- [Demo Script](#demo-script)
- [Roadmap / Out of Scope](#roadmap--out-of-scope)
- [Privacy & Ethics](#privacy--ethics)
- [License](#license)

---

## Overview

Real deployments across Indian cities are strong at generating challans but weak at flow optimization, proactive safety, and cross-agency trust. RakshaGrid targets the sharper, more solvable slice of that problem for a control room: **rank risk, explain it, and optimize where scarce officers go — live, as incidents happen.**

Core capabilities:
- 🗺️ **Live color-coded risk heatmap** of Nagpur junctions
- 📊 **Ranked attention list** with trend + coverage status
- 🧠 **Explainable risk scoring** — every score shows *why*, not just *what*
- 👮 **Officer allocation optimizer** (Hungarian algorithm / greedy fallback)
- ⚡ **Dynamic incident simulation** — inject an incident, watch re-ranking + redeployment in real time
- ✅ **Human-in-the-loop** — Accept / Modify / Reject every recommendation, fully audited
- 📈 **Baseline vs. Recommended** comparison to quantify impact

---

## Team

| Role | Owns | GitHub |
|---|---|---|
| Backend/API Lead | FastAPI, DB schema, WebSocket gateway | `@handle` |
| ML/Data Lead | Risk scoring model, synthetic data, optimizer | `@handle` |
| Frontend Lead | Dashboard shell, heatmap, ranked list | `@handle` |
| Frontend/Integration Engineer | Recommendation panel, incident console, WS client | `@handle` |
| PM / Design / Pitch Lead | Data curation, UI polish, demo script, docs | `@handle` |

*(Replace handles above once the repo is created.)*

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui |
| Map / Charts | Leaflet + leaflet.heat, Recharts |
| Backend | FastAPI (Python 3.11) + native WebSockets |
| ML / Optimization | scikit-learn (optional XGBoost) + SciPy `linear_sum_assignment` |
| Explainability | Template-based NL generation, optional Anthropic Claude API polish |
| Database | PostgreSQL + PostGIS |
| Cache / PubSub | Redis |
| Infra | Docker Compose (local) · Vercel (frontend) · Render/Railway (backend) |
| CI | GitHub Actions |

Full rationale in [`docs/03_TRD.md`](docs/03_TRD.md).

---

## Repository Structure

```
rakshagrid/
├── README.md
├── docker-compose.yml
├── docs/                     # full project documentation (see below)
├── .github/workflows/ci.yml
├── backend/                  # FastAPI service
│   └── app/{api,core,models,schemas,services,db}/
├── ml/                       # data generator, risk model, allocation optimizer
├── frontend/                 # React + TS dashboard
│   └── src/{components,hooks,lib,store,styles}/
├── data/                     # curated Nagpur junction seed dataset
└── scripts/                  # DB seeding, deterministic demo scenario
```

Full breakdown with file-level detail: [`docs/07_IMPLEMENTATION_PLAN.md`](docs/07_IMPLEMENTATION_PLAN.md#5-github-repository-structure).

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose
- Node.js ≥ 18 & npm/pnpm
- Python ≥ 3.11
- Git

### Clone
```bash
git clone https://github.com/<org>/rakshagrid.git
cd rakshagrid
```

### Environment Variables
Copy the example env files and fill in values before first run:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Key variables:
| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | backend/.env | PostgreSQL connection string |
| `REDIS_URL` | backend/.env | Redis connection string |
| `ANTHROPIC_API_KEY` | backend/.env | Optional — LLM-polished explanations |
| `VITE_API_BASE_URL` | frontend/.env | Backend REST base URL |
| `VITE_WS_URL` | frontend/.env | Backend WebSocket URL |

> Never commit real `.env` files or API keys. `.env` is gitignored — only `.env.example` files are tracked.

---

## Running the Project

### Option A — One command (recommended for judges/demo)
```bash
docker-compose up --build
```
- Frontend → http://localhost:5173
- Backend API → http://localhost:8000
- API docs (Swagger) → http://localhost:8000/docs

### Option B — Manual (for active development)
```bash
# Terminal 1 — database + redis
docker-compose up db redis

# Terminal 2 — backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python scripts/seed_db.py     # loads Nagpur junction dataset + synthetic data
uvicorn app.main:app --reload

# Terminal 3 — frontend
cd frontend
npm install
npm run dev
```

### Run the deterministic demo scenario
```bash
python scripts/demo_scenario.py
```
This replays a scripted, reliable sequence of incidents for the live pitch — no dependency on external APIs.

---

## Documentation

All project docs live in [`/docs`](docs):

| Doc | Purpose |
|---|---|
| [`01_AI_DEVELOPMENT_MASTER_PROMPT.md`](docs/01_AI_DEVELOPMENT_MASTER_PROMPT.md) | Master prompt for AI coding assistants (Claude Code, Cursor, etc.) |
| [`02_PRD.md`](docs/02_PRD.md) | Product requirements, scope, success metrics |
| [`03_TRD.md`](docs/03_TRD.md) | Architecture, tech stack, algorithms |
| [`04_APP_FLOW.md`](docs/04_APP_FLOW.md) | Screen-by-screen and system data flow |
| [`05_UI_UX_BRIEF.md`](docs/05_UI_UX_BRIEF.md) | Design system, wireframes, polish priorities |
| [`06_BACKEND_SCHEMA.md`](docs/06_BACKEND_SCHEMA.md) | Database schema, API contract |
| [`07_IMPLEMENTATION_PLAN.md`](docs/07_IMPLEMENTATION_PLAN.md) | Hour-by-hour build plan, roles, repo structure |

**Start here if you're new:** read `02_PRD.md` → `03_TRD.md` → `07_IMPLEMENTATION_PLAN.md`, then jump to your role's section.

---

## Development Workflow

1. **Branching:** `main` is always demo-ready. Work in `feature/<short-name>` branches.
2. **Commits:** small, descriptive commits — no `wip` or `fix` alone.
3. **PRs:** open a PR into `main` even solo; at least a self-review checklist before merge. Tag the relevant lead for anything touching the shared API contract.
4. **API contract changes:** if you need to change a field in `06_BACKEND_SCHEMA.md`, flag it in the team channel first — frontend and backend build in parallel against this contract.
5. **Hourly syncs:** brief check-in at each phase checkpoint in `07_IMPLEMENTATION_PLAN.md` (hours 2, 10, 16, 20).
6. **CI:** GitHub Actions runs lint + basic tests on every push — keep it green.

---

## Demo Script

1. Problem framing (30s)
2. Live heatmap + explainability drawer (60s)
3. **Inject an incident live** → watch re-ranking + recommendation → Accept → audit log updates (90s) — the centerpiece
4. Baseline vs. Recommended comparison stat (60s)
5. Scalability/retrofit close — deploys on existing ICCC infra, no rip-and-replace (60s)

Full detail in [`07_IMPLEMENTATION_PLAN.md`](docs/07_IMPLEMENTATION_PLAN.md#3-demo-script-5-minutes).

---

## Roadmap / Out of Scope (for this build)

Explicitly **not** built in the 24-hour version — mention as roadmap in the pitch, don't attempt to build:
- Live CCTV/ANPR/RLVD ingestion (architecture supports it via a pluggable ingestion adapter)
- Mobile app for field officers
- Integration with real Nagpur Police backend systems
- Production-grade authentication

---

## Privacy & Ethics

- No facial recognition or individual vehicle re-identification.
- Aggregated/anonymized data only; all demo data is synthetic or public/open.
- No live police CCTV feeds or confidential departmental systems accessed.
- Human-in-the-loop by design — every AI recommendation is overridable and every override is audited.

Full note: [`docs/03_TRD.md`](docs/03_TRD.md#8-privacy--ethics-note-for-submission)

---

## License

Add your chosen license here (e.g., MIT) before public submission if the hackathon requires an open repo.