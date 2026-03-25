from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.db import SessionLocal
from app.models.employee import Employee
from app.models.shift import Shift
from app.models.assignment import Assignment
from app.models.availability import Availability
from app.services.scheduler import generate_schedule

router = APIRouter()


# 🔹 DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/generate-schedule")
def run_scheduler(db: Session = Depends(get_db)):

    # 🔹 Fetch data
    employees = db.query(Employee).all()
    shifts = db.query(Shift).all()
    availability = db.query(Availability).all()

    # 🔹 Safety checks
    if not employees:
        return {"error": "No employees found"}

    if not shifts:
        return {"error": "No shifts found"}

    # 🔹 Convert employees
    emp_data = [
        {
            "id": e.employee_id,
            "max_hours": int(e.max_hours),
            "gender": e.gender ,
        }
        for e in employees
    ]

    # 🔹 Convert shifts (IMPORTANT: include date)
    shift_data = [
        {
            "id": s.shift_id,
            "date": s.date,
            "start_time": s.start_time,
            "end_time": s.end_time,
            "ward_id": s.ward_id   

        }
        for s in shifts
    ]

    # 🔹 Convert availability
    availability_data = [
        {
            "employee_id": a.employee_id,
            "date": a.date,
            "start_time": a.start_time,
            "end_time": a.end_time,
            "ward_id": a.ward_id
        }
        for a in availability
    ]

    # 🔥 Clean old assignments + reset IDs
    db.execute(text("TRUNCATE assignments RESTART IDENTITY CASCADE"))
    db.commit()

    # 🔥 Run scheduler (WITH availability)
    try:
        assignments = generate_schedule(emp_data, shift_data, availability_data)
    except Exception as e:
        return {"error": str(e)}

    # 🔹 Save results
    for emp_id, shift_id in assignments:
        db.add(
            Assignment(
                employee_id=emp_id,
                shift_id=shift_id
            )
        )

    db.commit()

    return {
        "message": "Schedule generated successfully",
        "total_assignments": len(assignments),
        "assignments": assignments
    }

@router.get("/uncovered-shifts")
def get_uncovered_shifts(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT s.shift_id, s.date, s.start_time, s.end_time, s.ward_id, w.name, w.gender
        FROM shifts s
        LEFT JOIN assignments a ON s.shift_id = a.shift_id
        JOIN wards w ON s.ward_id = w.ward_id
        WHERE a.shift_id IS NULL
    """)).fetchall()

    return [
        {
            "shift_id": r[0],
            "date": r[1],
            "start_time": str(r[2]),
            "end_time": str(r[3]),
            "ward_id": r[4],
            "ward_name": r[5],
            "gender": r[6]
        }
        for r in result
    ]