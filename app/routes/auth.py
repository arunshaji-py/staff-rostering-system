from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.employee import Employee
from app.auth import create_access_token

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login")
def login(username: str, db: Session = Depends(get_db)):

    user = db.query(Employee).filter(Employee.name == username).first()

    if not user:
        return {"error": "User not found"}

    token = create_access_token({
        "sub": user.name,
        "user_id": user.employee_id
    })

    return {
        "access_token": token,
        "role": "admin" if user.name == "Arun" else "employee"
    }
