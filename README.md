# RakshaGrid

**AI Traffic Risk Heatmap & Police Deployment Decision Support (Nagpur)**

A living, explainable map of risk across Nagpur that tells a traffic commander—every few minutes—where danger is building, why, and exactly how to move the officers they already have to cover it. Built for the 24-Hour Government ITMS Hackathon.

## 🚀 One-Command Run Instructions

The entire system (Frontend, Backend, Database, Redis) is containerized using Docker.

1. Clone the repository:
   ```bash
   git clone https://github.com/OmkarPanchal06/RakshaGrid.git
   cd RakshaGrid
   ```
2. Start the services:
   ```bash
   docker-compose up --build
   ```
3. Open the Dashboard in your browser:
   - **Frontend:** http://localhost:3000
   - **Backend API Docs:** http://localhost:8000/docs

*Note: On first run, you will need to seed the simulated database. Open a new terminal and run:*
```bash
docker-compose exec backend python /app/scripts/seed_db.py
```

## 🏗 Architecture

RakshaGrid acts as a **decision-support layer** sitting on top of existing ICCC infrastructure.
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui. Map visualizations using Leaflet and `react-leaflet`.
- **Backend:** Python 3.11 + FastAPI + PostgreSQL (PostGIS) + Redis.
- **ML & Analytics:** scikit-learn + v1 explainable weighted-risk scoring model. Allocation optimized using SciPy's bipartite assignment solver.

### Scalability & Retrofit Note
Deployable on top of existing ICCC infrastructure as a read-only decision-support layer. It does not require ripping and replacing existing ATCS/RLVD/ANPR systems. Junction ingestion is source-agnostic—we can ingest from CSV/OSM today, and directly from live ICCC camera feeds tomorrow using the exact same `Ingestion Service` interface.

## 🛡 Privacy & Ethics

RakshaGrid strictly preserves citizen privacy:
- **No Facial Recognition** or individual vehicle re-identification.
- Analyzes only **aggregated, anonymized data** (violation counts, average congestion).
- **Human-in-the-loop:** The AI recommends deployments, but human commanders decide. Every override is logged for government accountability and trust.

## 📚 Documentation
For complete technical details, workflows, and UI specifications, refer to our comprehensive documentation suite in `/docs`:
- [AI Development Master Prompt](docs/01_AI_DEVELOPMENT_MASTER_PROMPT.md)
- [Product Requirements Document (PRD)](docs/02_PRD.md)
- [Technical Requirements Document (TRD)](docs/03_TRD.md)
- [Application Flow](docs/04_APP_FLOW.md)
- [UI/UX Brief](docs/05_UI_UX_BRIEF.md)
- [Backend Schema](docs/06_BACKEND_SCHEMA.md)
- [Implementation Plan](docs/07_IMPLEMENTATION_PLAN.md)

## 👥 Team Roles
1. **Backend/API Lead:** FastAPI service, DB schema, WebSocket gateway, deployment endpoints
2. **ML/Data Lead:** Risk scoring model, synthetic data generator, allocation optimizer
3. **Frontend Lead:** React dashboard shell, heatmap, ranked list, state management
4. **Frontend/Integration Engineer:** Recommendation panel, incident console, WebSocket client, explainability UI
5. **PM / Design / Data-Prep / Pitch Lead:** Nagpur junction dataset curation, UI/UX polish, demo script, slides, write-up docs