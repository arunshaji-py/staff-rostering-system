from pydantic import BaseModel
from datetime import date, time

class ShiftCreate(BaseModel):
    date: date
    start_time: time
    end_time: time
    ward_id: int   #