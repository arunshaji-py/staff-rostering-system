from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.shift import Shift
from app.schemas.shift import ShiftCreate

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/shifts")
def create_shift(data: ShiftCreate, db: Session = Depends(get_db)):
    shift = Shift(
        date=data.date,
        start_time=data.start_time,
        end_time=data.end_time,
        ward_id=data.ward_id
    )

    db.add(shift)
    db.commit()
    db.refresh(shift)

    return shift


@router.get("/shifts")
def get_shifts(db: Session = Depends(get_db)):
    return db.query(Shift).all()


@router.delete("/shifts/{shift_id}")
def delete_shift(shift_id: int, db: Session = Depends(get_db)):
    shift = db.query(Shift).filter(Shift.shift_id == shift_id).first()

    if not shift:
        return {"error": "Shift not found"}

    db.delete(shift)
    db.commit()

    return {"message": "Shift deleted successfully"}