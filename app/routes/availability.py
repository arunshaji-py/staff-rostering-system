from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.availability import Availability
from app.models.shift import Shift
from app.models.ward import Ward
from app.schemas.availability import AvailabilityCreate

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/availability")
def get_availability(employee_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Availability)
    if employee_id is not None:
        query = query.filter(Availability.employee_id == employee_id)
    records = query.all()
    return [
        {
            "availability_id": r.availability_id,
            "employee_id": r.employee_id,
            "date": str(r.date),
            "start_time": str(r.start_time),
            "end_time": str(r.end_time),
            "ward_id": r.ward_id,
        }
        for r in records
    ]


@router.post("/availability")
def create_availability(data: AvailabilityCreate, db: Session = Depends(get_db)):
    # One shift per day — employee cannot be available for multiple shifts on the same date
    date_conflict = db.query(Availability).filter(
        Availability.employee_id == data.employee_id,
        Availability.date == data.date,
    ).first()
    if date_conflict:
        raise HTTPException(status_code=400, detail="You can only submit availability for one shift per day")

    # Also prevent exact duplicate (safety)
    existing = db.query(Availability).filter(
        Availability.employee_id == data.employee_id,
        Availability.date == data.date,
        Availability.start_time == data.start_time,
        Availability.end_time == data.end_time,
        Availability.ward_id == data.ward_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Availability already submitted for this slot")

    record = Availability(
        employee_id=data.employee_id,
        date=data.date,
        start_time=data.start_time,
        end_time=data.end_time,
        ward_id=data.ward_id,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"availability_id": record.availability_id, "message": "Availability saved"}


@router.delete("/availability/{availability_id}")
def delete_availability(availability_id: int, db: Session = Depends(get_db)):
    record = db.query(Availability).filter(
        Availability.availability_id == availability_id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Availability not found")
    db.delete(record)
    db.commit()
    return {"message": "Availability removed"}


@router.get("/shifts/upcoming")
def get_upcoming_shifts(db: Session = Depends(get_db)):
    """All shifts with ward info, ordered by date — for the availability calendar."""
    from datetime import date as today_date
    results = (
        db.query(Shift, Ward)
        .join(Ward, Shift.ward_id == Ward.ward_id)
        .filter(Shift.date >= today_date.today())
        .order_by(Shift.date, Shift.start_time)
        .all()
    )
    return [
        {
            "shift_id": s.shift_id,
            "date": str(s.date),
            "start_time": str(s.start_time),
            "end_time": str(s.end_time),
            "ward_id": s.ward_id,
            "ward_name": w.name,
            "ward_gender": w.gender,
        }
        for s, w in results
    ]
