from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.domain import Junction, RiskScore, ScoreFactor

router = APIRouter()

@router.get("/")
def get_junctions(db: Session = Depends(get_db)):
    """
    Returns a list of junctions with their latest risk scores.
    """
    junctions = db.query(Junction).all()
    result = []
    
    for j in junctions:
        # Get the latest risk score for the junction
        latest_score = db.query(RiskScore).filter(RiskScore.junction_id == j.id).order_by(RiskScore.computed_at.desc()).first()
        
        # Determine coverage status
        coverage_status = "unmanned"
        # Since deployments aren't fully integrated in this endpoint yet, we just stub it based on existing DB state if any
        # Real implementation would join with Deployments table where status in ('accepted', 'recommended')
        
        result.append({
            "id": str(j.id),
            "name": j.name,
            "zone": j.zone,
            "lat": j.lat,
            "lng": j.lng,
            "road_class": j.road_class,
            "score": float(latest_score.score) if latest_score else 0.0,
            "coverage_status": coverage_status
        })
        
    return result

@router.get("/{id}/explain")
def explain_junction_score(id: str, db: Session = Depends(get_db)):
    """
    Returns the score breakdown and NL explanation for a specific junction.
    """
    junction = db.query(Junction).filter(Junction.id == id).first()
    if not junction:
        raise HTTPException(status_code=404, detail="Junction not found")
        
    latest_score = db.query(RiskScore).filter(RiskScore.junction_id == id).order_by(RiskScore.computed_at.desc()).first()
    if not latest_score:
        raise HTTPException(status_code=404, detail="Risk score not found for junction")
        
    factors = db.query(ScoreFactor).filter(ScoreFactor.risk_score_id == latest_score.id).all()
    
    factor_list = [
        {
            "name": f.factor_name,
            "contribution": float(f.contribution)
        }
        for f in factors
    ]
    
    return {
        "id": str(junction.id),
        "name": junction.name,
        "score": float(latest_score.score),
        "nl_explanation": latest_score.nl_explanation,
        "factors": factor_list
    }
