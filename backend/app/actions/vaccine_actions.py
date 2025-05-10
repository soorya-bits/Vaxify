from sqlalchemy.orm import Session
from app.models.vaccine import Vaccine

# Create a new vaccine
def create_vaccine(db: Session, name: str, description: str = "", manufacturer: str = "") -> Vaccine:
    db_vaccine = Vaccine(name=name, description=description, manufacturer=manufacturer)
    db.add(db_vaccine)
    db.commit()
    db.refresh(db_vaccine)
    return db_vaccine

# List all vaccines
def list_vaccines(db: Session) -> list:
    return db.query(Vaccine).all()

# Get a single vaccine by ID
def get_vaccine(db: Session, vaccine_id: int) -> Vaccine:
    return db.query(Vaccine).filter(Vaccine.id == vaccine_id).first()

# Update an existing vaccine by ID
def update_vaccine(
    db: Session, vaccine_id: int, name: str = None, description: str = None, manufacturer: str = None
) -> Vaccine:
    db_vaccine = db.query(Vaccine).filter(Vaccine.id == vaccine_id).first()
    
    if not db_vaccine:
        raise HTTPException(status_code=404, detail="Vaccine not found")
    
    if name:
        db_vaccine.name = name
    if description:
        db_vaccine.description = description
    if manufacturer:
        db_vaccine.manufacturer = manufacturer

    db.commit()
    db.refresh(db_vaccine)
    return db_vaccine
