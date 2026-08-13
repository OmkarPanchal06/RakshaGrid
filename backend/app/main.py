from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import junctions, deployment, incidents, websocket

app = FastAPI(title="RakshaGrid API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(junctions.router, prefix="/api/junctions", tags=["Junctions"])
app.include_router(deployment.router, prefix="/api/deployment", tags=["Deployment"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
app.include_router(websocket.router, tags=["WebSocket"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "RakshaGrid API"}
