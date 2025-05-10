from pydantic import BaseModel
from typing import Optional
from datetime import date

# Schema for creating a student
class StudentCreate(BaseModel):
    name: str
    student_class: str
    unique_id: str
    date_of_birth: Optional[date]
    gender: Optional[str]
    address: Optional[str]
    phone_number: Optional[str]
    email: Optional[str]

# Schema for returning student data
class StudentOut(BaseModel):
    id: int
    name: str
    student_class: str
    unique_id: str
    date_of_birth: Optional[date]
    gender: Optional[str]
    address: Optional[str]
    phone_number: Optional[str]
    email: Optional[str]

    class Config:
        orm_mode = True
