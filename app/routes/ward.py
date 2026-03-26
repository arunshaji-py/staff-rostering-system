from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.ward import Ward
from app.schemas.ward import WardCreate

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/wards")
def get_wards(db: Session = Depends(get_db)):
    wards = db.query(Ward).order_by(Ward.ward_id).all()
    return [
        {"ward_id": w.ward_id, "name": w.name, "gender": w.gender}
        for w in wards
    ]


@router.post("/wards")
def create_ward(data: WardCreate, db: Session = Depends(get_db)):
    existing = db.query(Ward).filter(Ward.name == data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="A ward with this name already exists")

    ward = Ward(name=data.name, gender=data.gender)
    db.add(ward)
    db.commit()
    db.refresh(ward)
    return {"ward_id": ward.ward_id, "name": ward.name, "gender": ward.gender}


@router.delete("/wards/{ward_id}")
def delete_ward(ward_id: int, db: Session = Depends(get_db)):
    ward = db.query(Ward).filter(Ward.ward_id == ward_id).first()
    if not ward:
        raise HTTPException(status_code=404, detail="Ward not found")

    db.delete(ward)
    db.commit()
    return {"message": f"Ward '{ward.name}' deleted"}
