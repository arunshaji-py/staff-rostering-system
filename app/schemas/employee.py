from pydantic import BaseModel


class EmployeeCreate(BaseModel):
    name: str
    skill: str
    max_hours: int
