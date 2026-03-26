from pydantic import BaseModel
from datetime import date, time


class AvailabilityCreate(BaseModel):
    employee_id: int
    date: date
    start_time: time
    end_time: time
    ward_id: int
