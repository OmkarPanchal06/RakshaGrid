# Backend Schema Document
## RakshaGrid — AI Traffic Risk Heatmap & Police Deployment Decision Support

---

## 1. Entity Relationship Diagram

```mermaid
erDiagram
    JUNCTION ||--o{ RISK_SCORE : has
    JUNCTION ||--o{ INCIDENT : experiences
    JUNCTION ||--o{ TRAFFIC_SIGNAL_READING : has
    JUNCTION ||--o{ DEPLOYMENT : covered_by
    OFFICER ||--o{ DEPLOYMENT : assigned_to
    RISK_SCORE ||--o{ SCORE_FACTOR : composed_of
    DEPLOYMENT ||--o{ AUDIT_LOG : generates
    OPERATOR ||--o{ AUDIT_LOG : performs
    EVENT_CALENDAR ||--o{ JUNCTION : affects

    JUNCTION {
        uuid id PK
        string name
        string zone
        float lat
        float lng
        string road_class
    }

    RISK_SCORE {
        uuid id PK
        uuid junction_id FK
        float score
        timestamp computed_at
        string nl_explanation
    }

    SCORE_FACTOR {
        uuid id PK
        uuid risk_score_id FK
        string factor_name
        float raw_value
        float weight
        float contribution
    }

    INCIDENT {
        uuid id PK
        uuid junction_id FK
        string type
        int severity
        timestamp reported_at
        boolean simulated
    }

    TRAFFIC_SIGNAL_READING {
        uuid id PK
        uuid junction_id FK
        float congestion_index
        timestamp recorded_at
    }

    OFFICER {
        uuid id PK
        string name
        string zone
        float current_lat
        float current_lng
        string shift
        boolean available
    }

    DEPLOYMENT {
        uuid id PK
        uuid junction_id FK
        uuid officer_id FK
        string status
        string source
        timestamp assigned_at
    }

    OPERATOR {
        uuid id PK
        string name
        string role
    }

    AUDIT_LOG {
        uuid id PK
        uuid deployment_id FK
        uuid operator_id FK
        string action
        string reason
        timestamp created_at
    }

    EVENT_CALENDAR {
        uuid id PK
        string name
        date event_date
        uuid junction_id FK
        float impact_radius_km
    }
```

## 2. Table Definitions (PostgreSQL + PostGIS)

### `junctions`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | TEXT | |
| zone | TEXT | e.g. "Sitabuldi", "Sadar" |
| location | GEOGRAPHY(Point, 4326) | PostGIS point for lat/lng |
| road_class | TEXT | arterial / collector / local |
| created_at | TIMESTAMPTZ | |

### `risk_scores`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| junction_id | UUID FK → junctions | |
| score | NUMERIC(5,2) | 0–100 |
| nl_explanation | TEXT | generated reason |
| computed_at | TIMESTAMPTZ | indexed, latest-per-junction query pattern |

### `score_factors`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| risk_score_id | UUID FK → risk_scores | |
| factor_name | TEXT | accident_density / congestion / violations / weather / event / obstruction / time_pattern |
| raw_value | NUMERIC | normalized 0–1 |
| weight | NUMERIC | model weight |
| contribution | NUMERIC | raw_value * weight |

### `incidents`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| junction_id | UUID FK | |
| type | TEXT | accident / waterlogging / vip_movement / festival / obstruction |
| severity | SMALLINT | 1–5 |
| reported_at | TIMESTAMPTZ | |
| simulated | BOOLEAN | true for hackathon demo data |

### `traffic_signal_readings`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| junction_id | UUID FK | |
| congestion_index | NUMERIC | 0–1 |
| recorded_at | TIMESTAMPTZ | |

### `officers`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | TEXT | synthetic |
| zone | TEXT | |
| location | GEOGRAPHY(Point, 4326) | current position |
| shift | TEXT | |
| available | BOOLEAN | |

### `deployments`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| junction_id | UUID FK | |
| officer_id | UUID FK (nullable) | null = unmanned |
| status | TEXT | recommended / accepted / modified / rejected |
| source | TEXT | optimizer / manual |
| assigned_at | TIMESTAMPTZ | |

### `operators`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | TEXT | |
| role | TEXT | control_room_operator / commander |

### `audit_log`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| deployment_id | UUID FK | |
| operator_id | UUID FK | |
| action | TEXT | accept / modify / reject |
| reason | TEXT | |
| created_at | TIMESTAMPTZ | |

### `event_calendar`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | TEXT | e.g. "Ganesh Visarjan Procession" |
| event_date | DATE | |
| junction_id | UUID FK (nullable) | |
| impact_radius_km | NUMERIC | |

## 3. API Endpoints (REST + WebSocket)

| Method | Endpoint | Purpose | Response (key fields) |
|---|---|---|---|
| GET | `/api/junctions` | List junctions with latest risk score | `[{id, name, lat, lng, score, coverage_status}]` |
| GET | `/api/junctions/{id}/explain` | Score breakdown | `{score, factors:[{name, contribution}], nl_explanation}` |
| GET | `/api/deployment/current` | Current officer assignment | `[{junction_id, officer_id, status}]` |
| GET | `/api/deployment/recommended` | Optimizer output | `[{junction_id, officer_id, eta_min, reason}]` |
| POST | `/api/deployment/{id}/override` | Accept/modify/reject | body: `{action, officer_id?, reason}` |
| POST | `/api/incidents` | Inject simulated incident | body: `{junction_id, type, severity}` |
| GET | `/api/deployment/comparison` | Baseline vs recommended stats | `{baseline_uncovered, recommended_uncovered, pct_improvement}` |
| GET | `/api/officers` | Officer roster + status | `[{id, name, available, location}]` |
| GET | `/api/audit` | Audit trail feed | `[{action, reason, operator, timestamp}]` |
| WS | `/ws/live` | Push risk/deployment/incident updates | event-typed JSON messages |

### Sample WebSocket message
```json
{
  "event": "risk_update",
  "junction_id": "b3f1...",
  "score": 92.4,
  "nl_explanation": "Accident density 3x zone average with active waterlogging alert.",
  "coverage_status": "unmanned",
  "timestamp": "2026-08-13T14:32:10Z"
}
```

## 4. Indexing & Performance Notes
- `risk_scores(junction_id, computed_at DESC)` composite index for "latest score per junction" queries.
- PostGIS GIST index on `junctions.location` and `officers.location` for nearest-officer queries.
- Materialized view `latest_risk_scores` refreshed on each scoring cycle to keep `GET /api/junctions` O(1)-ish for dashboard load.