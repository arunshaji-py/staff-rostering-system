from sqlalchemy import Column, Integer, Date, Time, ForeignKey
from app.database.db import Base


class Shift(Base):
    __tablename__ = "shifts"

    shift_id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    # Optional (for later)
    ward_id = Column(Integer, nullable=True)
