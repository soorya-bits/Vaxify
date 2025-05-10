from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class VaccinationDrive(Base):
    __tablename__ = "vaccination_drives"
    id = Column(Integer, primary_key=True, index=True)
    vaccine_id = Column(Integer, ForeignKey("vaccines.id"))
    date = Column(Date)
    applicable_classes = Column(String(200))  # E.g. "5,6,7"
    available_doses = Column(Integer)
    is_editable = Column(Boolean, default=True)
    
    vaccine = relationship("Vaccine", back_populates="vaccination_drives")

    vaccination_records = relationship("VaccinationRecord", back_populates="drive")

    def check_editable(self):
        if self.date < date.today():
            self.is_editable = False
