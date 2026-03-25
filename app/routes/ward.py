from fastapi import APIRouter

router = APIRouter()

@router.get("/wards")
def get_wards():
    return [
        {"ward_id": 1, "name": "Arran"},
        {"ward_id": 2, "name": "Low Green"},
        {"ward_id": 3, "name": "Belleisle"},
        {"ward_id": 4, "name": "Gatehouse"},
        {"ward_id": 5, "name": "Lochlea"},
    ]