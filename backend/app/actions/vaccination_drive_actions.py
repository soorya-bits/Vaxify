from sqlalchemy.orm import Session, joinedload
from app.models.drive import VaccinationDrive
from app.models.vaccination_record import VaccinationRecord
from datetime import date, datetime, timedelta
from fastapi import HTTPException

# Create a new vaccination drive
def create_vaccination_drive(db: Session, vaccine_id: int, date: str, applicable_classes: str, available_doses: int) -> VaccinationDrive:
    scheduled_date = datetime.strptime(date, "%Y-%m-%d").date()
    if scheduled_date < datetime.today().date() + timedelta(days=15):
        raise HTTPException(status_code=400, detail="Drives must be scheduled at least 15 days in advance.")
    
    # Check for overlapping drives (see below)
    existing = db.query(VaccinationDrive).filter(VaccinationDrive.date == scheduled_date).first()
    if existing:
        raise HTTPException(status_code=400, detail="A drive is already scheduled on this date.")

    db_vaccination_drive = VaccinationDrive(
        vaccine_id=vaccine_id,
        date=scheduled_date,
        applicable_classes=applicable_classes,
        available_doses=available_doses
    )
    db.add(db_vaccination_drive)
    db.commit()
    db.refresh(db_vaccination_drive)
    return db_vaccination_drive

# List all vaccination drives
def list_vaccination_drives(db: Session) -> list:
    drives = db.query(VaccinationDrive).options(
        joinedload(VaccinationDrive.vaccine),
        joinedload(VaccinationDrive.vaccination_records).joinedload(VaccinationRecord.student),
        joinedload(VaccinationDrive.vaccination_records).joinedload(VaccinationRecord.vaccine)
    ).all()

    for drive in drives:
        for record in drive.vaccination_records:
            student = record.student
            # Manually add is_vaccinated field
            student.is_vaccinated = True  # Since it's in a vaccination record, we know this is True

    return drives

# Get a single vaccination drive by ID
def get_vaccination_drive(db: Session, drive_id: int) -> VaccinationDrive:
    return db.query(VaccinationDrive).filter(VaccinationDrive.id == drive_id).first()

# Update an existing vaccination drive by ID
def update_vaccination_drive(db: Session, drive_id: int, date: str = None, applicable_classes: str = None, available_doses: int = None) -> VaccinationDrive:
    db_drive = db.query(VaccinationDrive).filter(VaccinationDrive.id == drive_id).first()

    if not db_drive:
        raise HTTPException(status_code=404, detail="Vaccination drive not found")

    if db_drive.date < datetime.today().date():
        raise HTTPException(status_code=400, detail="Cannot edit a drive that has already occurred.")

    if date:
        new_date = datetime.strptime(date, "%Y-%m-%d").date()
        if new_date < datetime.today().date() + timedelta(days=15):
            raise HTTPException(status_code=400, detail="Updated date must be at least 15 days in the future.")
        existing = db.query(VaccinationDrive).filter(VaccinationDrive.date == new_date, VaccinationDrive.id != drive_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Another drive is already scheduled on this date.")
        db_drive.date = new_date

    if applicable_classes:
        db_drive.applicable_classes = applicable_classes
    if available_doses is not None:
        db_drive.available_doses = available_doses

    db.commit()
    db.refresh(db_drive)
    return db_drive
