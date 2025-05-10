from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime
from sqlalchemy.orm import relationship

class Vaccine(Base):
    __tablename__ = "vaccines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    description = Column(String(255), nullable=True)
    manufacturer = Column(String(100), nullable=True)  # Manufacturer of the vaccine
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    vaccination_drives = relationship("VaccinationDrive", back_populates="vaccine")
    vaccination_records = relationship("VaccinationRecord", back_populates="vaccine")
