from sqlalchemy import Column, Integer, String, Date, Boolean
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import date

class VaccinationDrive(Base):
    __tablename__ = "vaccination_drives"
    id = Column(Integer, primary_key=True, index=True)
    vaccine_name = Column(String(100), index=True)
    date = Column(Date)
    available_doses = Column(Integer)
    applicable_classes = Column(String(200))  # E.g. "5,6,7"
    is_editable = Column(Boolean, default=True)
    vaccination_records = relationship("VaccinationRecord", back_populates="drive")

    def check_editable(self):
        if self.date < date.today():
            self.is_editable = False
