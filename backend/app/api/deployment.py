from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_deployments():
    return [{"junction_id": 1, "officers_assigned": 2}]
