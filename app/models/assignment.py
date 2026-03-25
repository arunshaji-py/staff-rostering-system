from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from app.database.db import Base


class Assignment(Base):
    __tablename__ = "assignments"

    assignment_id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(Integer, ForeignKey("employee.employee_id"), nullable=False)
    shift_id = Column(Integer, ForeignKey("shifts.shift_id"), nullable=False)


    __table_args__ = (
        UniqueConstraint('employee_id', 'shift_id', name='unique_employee_shift'),
    )