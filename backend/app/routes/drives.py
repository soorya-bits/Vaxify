from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.dependencies import get_current_user
from app.actions.drive_actions import (
    create_drive, edit_drive, list_upcoming_drives
)

router = APIRouter(prefix="/drives", tags=["Vaccination Drives"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_vaccination_drive(data: dict, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return create_drive(db, data)

@router.put("/{drive_id}")
def update_drive(drive_id: int, data: dict, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return edit_drive(db, drive_id, data)

@router.get("/upcoming")
def upcoming_drives(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return list_upcoming_drives(db)
