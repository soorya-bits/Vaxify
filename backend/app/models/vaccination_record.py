from sqlalchemy import Column, Integer, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base

class VaccinationRecord(Base):
    __tablename__ = "vaccination_records"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    vaccine_id = Column(Integer, ForeignKey("vaccines.id"))
    drive_id = Column(Integer, ForeignKey("vaccination_drives.id"))
    vaccination_date = Column(Date)
    
    student = relationship("Student", back_populates="vaccinations")
    vaccine = relationship("Vaccine", back_populates="vaccination_records")
    drive = relationship("VaccinationDrive", back_populates="vaccination_records")
    
    # Ensure that a student cannot receive the same vaccine twice
    def is_already_vaccinated(self, student_id: int, vaccine_id: int, db):
        existing_record = db.query(VaccinationRecord).filter_by(
            student_id=student_id, vaccine_id=vaccine_id).first()
        return existing_record is not None
