from pydantic import BaseModel
from datetime import datetime

class VaccineOut(BaseModel):
    id: int
    name: str
    description: str | None = None
    manufacturer: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
