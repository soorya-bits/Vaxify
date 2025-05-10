from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.actions.vaccination_drive_actions import (
    create_vaccination_drive, list_vaccination_drives, get_vaccination_drive, update_vaccination_drive
)

router = APIRouter(prefix="/vaccination-drives", tags=["Vaccination Drives"])

# Route to create a new vaccination drive
@router.post("/")
def add_vaccination_drive(
    vaccine_id: int, date: str, applicable_classes: str, available_doses: int, db: Session = Depends(get_db)
):
    return create_vaccination_drive(db, vaccine_id, date, applicable_classes, available_doses)

# Route to get a list of all vaccination drives
@router.get("/")
def get_all_vaccination_drives(db: Session = Depends(get_db)):
    return list_vaccination_drives(db)

# Route to get a single vaccination drive by ID
@router.get("/{drive_id}")
def get_single_vaccination_drive(drive_id: int, db: Session = Depends(get_db)):
    drive = get_vaccination_drive(db, drive_id)
    if drive is None:
        raise HTTPException(status_code=404, detail="Vaccination drive not found")
    return drive

# Route to update an existing vaccination drive by ID
@router.put("/{drive_id}")
def update_vaccination_drive_details(
    drive_id: int, date: str = None, applicable_classes: str = None, available_doses: int = None, db: Session = Depends(get_db)
):
    return update_vaccination_drive(db, drive_id, date, applicable_classes, available_doses)
