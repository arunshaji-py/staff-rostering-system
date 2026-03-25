from sqlalchemy import Column, Integer, ForeignKey, Date, Time
from app.database.db import Base


class Availability(Base):
    __tablename__ = "availability"

    availability_id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(Integer, ForeignKey("employee.employee_id"), nullable=False)

    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    ward_id = Column(Integer)