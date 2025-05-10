from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.actions.vaccine_actions import create_vaccine, list_vaccines, get_vaccine, update_vaccine

router = APIRouter(prefix="/vaccines", tags=["Vaccines"])

# Route to create a new vaccine
@router.post("/")
def add_vaccine(
    name: str, description: str = "", manufacturer: str = "", db: Session = Depends(get_db)
):
    return create_vaccine(db, name, description, manufacturer)

# Route to get a list of all vaccines
@router.get("/")
def get_all_vaccines(db: Session = Depends(get_db)):
    return list_vaccines(db)

# Route to get a single vaccine by ID
@router.get("/{vaccine_id}")
def get_single_vaccine(vaccine_id: int, db: Session = Depends(get_db)):
    vaccine = get_vaccine(db, vaccine_id)
    if vaccine is None:
        raise HTTPException(status_code=404, detail="Vaccine not found")
    return vaccine

# Route to update an existing vaccine by ID
@router.put("/{vaccine_id}")
def update_vaccine_details(
    vaccine_id: int, name: str = None, description: str = None, manufacturer: str = None, db: Session = Depends(get_db)
):
    return update_vaccine(db, vaccine_id, name, description, manufacturer)
