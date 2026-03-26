from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.assignment import Assignment
from app.models.employee import Employee
from app.models.shift import Shift
from app.models.ward import Ward
from app.schemas.assignment import AssignmentCreate

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/assignments")
def get_assignments(employee_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    query = db.query(
        Assignment.assignment_id,
        Assignment.employee_id,
        Employee.name.label("employee_name"),
        Shift.shift_id,
        Shift.date,
        Shift.start_time,
        Shift.end_time,
        Shift.ward_id,
        Ward.name.label("ward_name")
    ).join(Employee, Assignment.employee_id == Employee.employee_id)\
     .join(Shift, Assignment.shift_id == Shift.shift_id)\
     .join(Ward, Shift.ward_id == Ward.ward_id)

    if employee_id is not None:
        query = query.filter(Assignment.employee_id == employee_id)

    results = query.all()

    return [
        {
            "assignment_id": r.assignment_id,
            "employee_id": r.employee_id,
            "employee_name": r.employee_name,
            "shift_id": r.shift_id,
            "date": str(r.date),
            "start_time": str(r.start_time),
            "end_time": str(r.end_time),
            "ward_id": r.ward_id,
            "ward_name": r.ward_name
        }
        for r in results
    ]


def _to_minutes(t) -> int:
    """Convert a time or timedelta to minutes since midnight."""
    if hasattr(t, "seconds"):          # timedelta (SQLite stores times this way)
        return t.seconds // 60
    return t.hour * 60 + t.minute


def _shifts_overlap(start1, end1, start2, end2) -> bool:
    """
    Return True if two shifts overlap on the same calendar day.
    Handles overnight shifts where end < start (e.g. 20:00–08:00).
    Each shift is normalised to a [start, end) interval in minutes;
    overnight shifts get end += 1440 so the interval always goes forward.
    """
    s1, e1 = _to_minutes(start1), _to_minutes(end1)
    s2, e2 = _to_minutes(start2), _to_minutes(end2)

    if e1 <= s1:   # overnight
        e1 += 1440
    if e2 <= s2:   # overnight
        e2 += 1440

    return s1 < e2 and s2 < e1


@router.post("/assignments")
def create_assignment(data: AssignmentCreate, db: Session = Depends(get_db)):

    employee = db.query(Employee).filter(Employee.employee_id == data.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    shift = db.query(Shift).filter(Shift.shift_id == data.shift_id).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")

    # Duplicate assignment guard
    duplicate = db.query(Assignment).filter(
        Assignment.employee_id == data.employee_id,
        Assignment.shift_id == data.shift_id,
    ).first()
    if duplicate:
        raise HTTPException(status_code=400, detail="Employee is already assigned to this shift")

    # Time-conflict guard: employee cannot work two overlapping shifts on the same date
    same_day_shifts = (
        db.query(Shift)
        .join(Assignment, Assignment.shift_id == Shift.shift_id)
        .filter(
            Assignment.employee_id == data.employee_id,
            Shift.date == shift.date,
        )
        .all()
    )
    for existing in same_day_shifts:
        if _shifts_overlap(existing.start_time, existing.end_time,
                           shift.start_time, shift.end_time):
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Conflict: employee already has an overlapping shift on {shift.date} "
                    f"({existing.start_time}–{existing.end_time})"
                ),
            )

    assignment = Assignment(
        employee_id=data.employee_id,
        shift_id=data.shift_id,
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return assignment


# Endpoint to delete an assignment by assignment_id
@router.delete("/assignments/{assignment_id}")
def delete_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(
        Assignment.assignment_id == assignment_id
    ).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    db.delete(assignment)
    db.commit()

    return {"message": "Assignment deleted successfully"}