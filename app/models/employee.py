from sqlalchemy import Column, Integer, String
from app.database.db import Base


class Employee(Base):
    __tablename__ = "employee"

    employee_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    skill = Column(String)
    max_hours = Column(Integer)

    gender = Column(String)   