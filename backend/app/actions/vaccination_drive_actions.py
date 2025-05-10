from sqlalchemy.orm import Session
from app.models.drive import VaccinationDrive
from datetime import date

# Create a new vaccination drive
def create_vaccination_drive(
    db: Session, vaccine_id: int, date: str, applicable_classes: str, available_doses: int
) -> VaccinationDrive:
    db_vaccination_drive = VaccinationDrive(
        vaccine_id=vaccine_id,
        date=date,
        applicable_classes=applicable_classes,
        available_doses=available_doses
    )
    db.add(db_vaccination_drive)
    db.commit()
    db.refresh(db_vaccination_drive)
    return db_vaccination_drive

# List all vaccination drives
def list_vaccination_drives(db: Session) -> list:
    return db.query(VaccinationDrive).all()

# Get a single vaccination drive by ID
def get_vaccination_drive(db: Session, drive_id: int) -> VaccinationDrive:
    return db.query(VaccinationDrive).filter(VaccinationDrive.id == drive_id).first()

# Update an existing vaccination drive by ID
def update_vaccination_drive(
    db: Session, drive_id: int, date: str = None, applicable_classes: str = None, available_doses: int = None
) -> VaccinationDrive:
    db_drive = db.query(VaccinationDrive).filter(VaccinationDrive.id == drive_id).first()
    
    if not db_drive:
        raise HTTPException(status_code=404, detail="Vaccination drive not found")
    
    if date:
        db_drive.date = date
    if applicable_classes:
        db_drive.applicable_classes = applicable_classes
    if available_doses:
        db_drive.available_doses = available_doses

    db.commit()
    db.refresh(db_drive)
    return db_drive
