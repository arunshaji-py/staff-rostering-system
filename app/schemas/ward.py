from pydantic import BaseModel
from typing import Literal


class WardCreate(BaseModel):
    name: str
    gender: Literal["Male", "Female"]
