from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.session import get_db, SessionLocal
from app.models.domain import Incident, Junction, RiskScore, ScoreFactor
from ml.risk_model.weighted_model import compute_risk_score, simulate_factors
from app.api.websocket import manager
from pydantic import BaseModel
import asyncio

router = APIRouter()

class IncidentRequest(BaseModel):
    junction_id: str
    type: str
    severity: int

async def recompute_risk(junction_id: str):
    """
    Background async task to recalculate the risk score for a junction after an incident.
    """
    db = SessionLocal()
    try:
        factors = simulate_factors()
        
        # Artificially increase risk based on incident
        factors["accident_density"] = min(1.0, factors["accident_density"] + 0.4)
        factors["congestion_level"] = min(1.0, factors["congestion_level"] + 0.3)
        
        score_result = compute_risk_score(junction_id, factors)
        
        risk_score = RiskScore(
            junction_id=junction_id,
            score=score_result["score"],
            nl_explanation=score_result["nl_explanation"]
        )
        db.add(risk_score)
        db.commit()
        
        for factor in score_result["factors"]:
            score_factor = ScoreFactor(
                risk_score_id=risk_score.id,
                factor_name=factor["factor_name"],
                raw_value=factor["raw_value"],
                weight=factor["weight"],
                contribution=factor["contribution"]
            )
            db.add(score_factor)
        db.commit()

        # Broadcast via WebSocket
        await manager.broadcast_risk_update(
            junction_id=str(junction_id),
            score=score_result["score"],
            nl_explanation=score_result["nl_explanation"]
        )
    finally:
        db.close()

@router.post("/")
def report_incident(data: IncidentRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    junction = db.query(Junction).filter(Junction.id == data.junction_id).first()
    if not junction:
        raise HTTPException(status_code=404, detail="Junction not found")
        
    incident = Incident(
        junction_id=junction.id,
        type=data.type,
        severity=data.severity,
        simulated=True
    )
    db.add(incident)
    db.commit()
    
    # Trigger background recomputation of risk
    background_tasks.add_task(recompute_risk, junction.id)
    
    return {"status": "received", "incident_id": str(incident.id)}
