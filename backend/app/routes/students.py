from fastapi import APIRouter, Depends, UploadFile, File, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.actions.student_actions import (
    create_student, list_students, bulk_import_students,
    mark_student_vaccinated, update_student, delete_student
)
from app.schemas.student_schema import StudentOut, StudentCreate
from typing import Optional, List

router = APIRouter(prefix="/students", tags=["Students"])

# Create a new student
@router.post("/", response_model=StudentOut)
def add_student(data: StudentCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return create_student(db, data)

# Get a list of students with optional filters
@router.get("/", response_model=List[StudentOut])
def get_students( 
    name: Optional[str] = Query(None),
    student_class: Optional[str] = Query(None),
    vaccinated: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return list_students(db, name, student_class, vaccinated)

# Update an existing student's details
@router.put("/{student_id}", response_model=StudentOut)
def update_student_details(student_id: int, data: StudentCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return update_student(db, student_id, data)

# Delete a student by ID
@router.delete("/{student_id}")
def delete_student_by_id(student_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return delete_student(db, student_id)

# Import students in bulk from a CSV file
@router.post("/import")
def import_csv(file: UploadFile = File(...), user=Depends(get_current_user), db: Session = Depends(get_db)):
    return bulk_import_students(db, file)

# Mark a student as vaccinated for a given drive
@router.post("/{student_id}/vaccinate/{drive_id}")
def vaccinate_student(student_id: int, drive_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return mark_student_vaccinated(db, student_id, drive_id)