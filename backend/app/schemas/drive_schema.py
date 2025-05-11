# app/schemas/vaccination_drive_schema.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from app.schemas.student_schema import StudentOut
from app.schemas.vaccine_schema import VaccineOut

class VaccinationDriveCreate(BaseModel):
    vaccine_id: int
    date: str
    applicable_classes: str
    available_doses: int

class VaccinationDriveUpdate(BaseModel):
    date: Optional[str] = None
    applicable_classes: Optional[str] = None
    available_doses: Optional[int] = None

class VaccinationRecordOut(BaseModel):
    id: int
    student_id: int
    vaccine_id: int
    drive_id: int
    vaccination_date: date
    student: StudentOut
    vaccine: VaccineOut

    class Config:
        orm_mode = True

class VaccinationDriveOut(BaseModel):
    id: int
    vaccine_id: int
    date: date
    applicable_classes: str
    available_doses: int
    is_editable: bool
    vaccination_records: List[VaccinationRecordOut] = []

    class Config:
        orm_mode = True