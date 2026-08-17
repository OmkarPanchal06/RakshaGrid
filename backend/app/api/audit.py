from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.domain import AuditLog, Deployment, Junction, Officer

router = APIRouter()

@router.get("/")
def get_audit_logs(db: Session = Depends(get_db), limit: int = 20):
    """
    Get the most recent deployment overrides and actions.
    """
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    
    result = []
    for log in logs:
        # Fetch related deployment to get junction and officer info
        # In a real app, this would be a JOIN for performance
        deployment = db.query(Deployment).filter(Deployment.id == log.deployment_id).first()
        junction_name = "Unknown Junction"
        officer_name = "Unknown Officer"
        
        if deployment:
            junction = db.query(Junction).filter(Junction.id == deployment.junction_id).first()
            if junction:
                junction_name = junction.name
                
            if deployment.officer_id:
                officer = db.query(Officer).filter(Officer.id == deployment.officer_id).first()
                if officer:
                    officer_name = officer.name
                    
        result.append({
            "id": str(log.id),
            "action": log.action,
            "reason": log.reason,
            "junction_name": junction_name,
            "officer_name": officer_name,
            "operator_id": str(log.operator_id),
            "created_at": log.created_at.isoformat() + "Z"
        })
        
    return result
