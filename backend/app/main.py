from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.junctions import router as junctions_router
from app.api.deployment import router as deployment_router
from app.api.incidents import router as incidents_router
from app.api.websocket import router as websocket_router
from app.api.audit import router as audit_router

app = FastAPI(title="RakshaGrid API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(junctions_router, prefix="/api/junctions", tags=["Junctions"])
app.include_router(deployment_router, prefix="/api/deployment", tags=["Deployments"])
app.include_router(incidents_router, prefix="/api/incidents", tags=["Incidents"])
app.include_router(websocket_router, tags=["WebSocket"])
app.include_router(audit_router, prefix="/api/audit", tags=["Audit"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "RakshaGrid API"}
