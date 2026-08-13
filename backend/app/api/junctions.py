from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_junctions():
    return [{"id": 1, "name": "Sitabuldi Square", "risk_score": 85}]

@router.get("/{id}/explain")
def explain_junction_score(id: int):
    return {"id": id, "explanation": "High traffic volume with recent incident."}
