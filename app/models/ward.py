from sqlalchemy import Column, Integer, String
from app.database.db import Base


class Ward(Base):
    __tablename__ = "wards"

    ward_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    gender = Column(String)