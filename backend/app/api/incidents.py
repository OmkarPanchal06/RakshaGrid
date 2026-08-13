from fastapi import APIRouter

router = APIRouter()

@router.post("/")
def report_incident(data: dict):
    return {"status": "received", "data": data}
