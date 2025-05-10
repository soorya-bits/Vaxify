from sqlalchemy.orm import Session
from app.models.drive import VaccinationDrive
from datetime import date, timedelta
from fastapi import HTTPException

def create_drive(db: Session, data: dict):
    drive_date = date.fromisoformat(data["date"])
    if drive_date < date.today() + timedelta(days=15):
        raise HTTPException(status_code=400, detail="Drive must be scheduled at least 15 days in advance.")

    # Prevent overlapping drives with same vaccine on same date
    conflict = db.query(VaccinationDrive).filter_by(
        vaccine_name=data["vaccine_name"],
        date=drive_date
    ).first()
    if conflict:
        raise HTTPException(status_code=400, detail="Overlapping drive exists.")

    drive = VaccinationDrive(**data)
    db.add(drive)
    db.commit()
    db.refresh(drive)
    return drive

def edit_drive(db: Session, drive_id: int, data: dict):
    drive = db.query(VaccinationDrive).filter_by(id=drive_id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")
    if drive.date < date.today():
        raise HTTPException(status_code=400, detail="Cannot edit past drive")

    for key, value in data.items():
        setattr(drive, key, value)
    db.commit()
    return drive

def list_upcoming_drives(db: Session):
    today = date.today()
    future = today + timedelta(days=30)
    drives = db.query(VaccinationDrive).filter(
        VaccinationDrive.date >= today,
        VaccinationDrive.date <= future
    ).all()
    return drives
