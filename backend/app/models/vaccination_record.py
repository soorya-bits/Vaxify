from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class VaccinationRecord(Base):
    __tablename__ = "vaccination_records"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    drive_id = Column(Integer, ForeignKey("vaccination_drives.id"))
    student = relationship("Student", back_populates="vaccinations")
    drive = relationship("VaccinationDrive", back_populates="vaccination_records")
