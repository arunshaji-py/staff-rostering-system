from fastapi import APIRouter, Depends, HTTPException
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
def get_assignments(db: Session = Depends(get_db)):
    results = db.query(
        Assignment.assignment_id,
        Employee.name.label("employee_name"),
        Shift.shift_id,
        Shift.date,
        Shift.start_time,
        Shift.end_time,
        Shift.ward_id,
        Ward.name.label("ward_name")
    ).join(Employee, Assignment.employee_id == Employee.employee_id)\
     .join(Shift, Assignment.shift_id == Shift.shift_id)\
     .join(Ward, Shift.ward_id == Ward.ward_id)\
     .all()

    return [
        {
            "assignment_id": r.assignment_id,
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


@router.post("/assignments")
def create_assignment(data: AssignmentCreate, db: Session = Depends(get_db)):

    employee = db.query(Employee).filter(Employee.employee_id == data.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    shift = db.query(Shift).filter(Shift.shift_id == data.shift_id).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")

    assignment = Assignment(
        employee_id=data.employee_id,
        shift_id=data.shift_id
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