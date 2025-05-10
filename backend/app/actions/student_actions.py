from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.utils import parse_applicable_classes
from app.models.student import Student
from app.models.vaccination_record import VaccinationRecord
from app.models.drive import VaccinationDrive
from app.models.vaccine import Vaccine
from app.schemas.student_schema import StudentCreate, StudentOut
from typing import Optional
from datetime import datetime
import csv
from io import StringIO

# Create a new student
def create_student(db: Session, data: dict) -> Student:
    student = Student(
        name=data.name,
        student_class=data.student_class,
        unique_id=data.unique_id,
        date_of_birth=data.date_of_birth,
        gender=data.gender,
        address=data.address,
        phone_number=data.phone_number,
        email=data.email
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

# List all students with optional filters
def list_students(
    db: Session, name: Optional[str], student_class: Optional[str], vaccinated: Optional[bool]
) -> list:
    query = db.query(Student)
    
    if name:
        query = query.filter(Student.name.like(f"%{name}%"))
    if student_class:
        query = query.filter(Student.student_class == student_class)
    if vaccinated is not None:
        query = query.join(VaccinationRecord).filter(VaccinationRecord.vaccinated == vaccinated)

    return query.all()

# Update student details
def update_student(
    db: Session, student_id: int, data: dict
) -> Student:
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if data.name:
        db_student.name = data.name
    if data.student_class:
        db_student.student_class = data.student_class
    if data.unique_id:
        db_student.unique_id = data.unique_id
    if data.date_of_birth:
        db_student.date_of_birth = data.date_of_birth
    if data.gender:
        db_student.gender = data.gender
    if data.address:
        db_student.address = data.address
    if data.phone_number:
        db_student.phone_number = data.phone_number
    if data.email:
        db_student.email = data.email

    db_student.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(db_student)
    return db_student

# Delete student by ID
def delete_student(db: Session, student_id: int) -> dict:
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(db_student)
    db.commit()
    return {"message": "Student successfully deleted"}


# Bulk import students from CSV
def bulk_import_students(db: Session, file) -> dict:
    """
    Bulk import students from a CSV file.
    The CSV file should have headers: 'name', 'student_class', 'unique_id'.
    """
    # Read the CSV file
    file_contents = file.file.read().decode("utf-8")
    file.file.close()

    csv_reader = csv.DictReader(StringIO(file_contents))
    
    students_to_create = []
    
    for row in csv_reader:
        # Prepare student data
        student_data = StudentCreate(
            name=row['name'],
            student_class=row['student_class'],
            unique_id=row['unique_id'],
            date_of_birth=row.get('date_of_birth'),
            gender=row.get('gender'),
            address=row.get('address'),
            phone_number=row.get('phone_number'),
            email=row.get('email')
        )
        students_to_create.append(student_data)

    # Insert all students into the database
    try:
        db.bulk_insert_mappings(Student, [student.dict() for student in students_to_create])
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to bulk import students")
    
    return {"message": f"{len(students_to_create)} students have been successfully imported."}


def mark_student_vaccinated(db: Session, student_id: int, drive_id: int) -> dict:
    # Fetch the student, vaccination drive, and vaccine details
    student = db.query(Student).filter(Student.id == student_id).first()
    vaccination_drive = db.query(VaccinationDrive).filter(VaccinationDrive.id == drive_id).first()
    vaccine_id = vaccination_drive.vaccine_id if vaccination_drive else None
    vaccine = db.query(Vaccine).filter(Vaccine.id == vaccine_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if not vaccination_drive:
        raise HTTPException(status_code=404, detail="Vaccination drive not found")
    if not vaccine:
        raise HTTPException(status_code=404, detail="Vaccine not found")

    # Validate if the student belongs to a class applicable for the vaccination drive
    applicable_classes = parse_applicable_classes(vaccination_drive.applicable_classes)
    if student.student_class not in applicable_classes:
        raise HTTPException(status_code=400, detail="Student's class is not applicable for this vaccination drive")

    # Check if the drive has available doses
    if vaccination_drive.available_doses <= 0:
        raise HTTPException(status_code=400, detail="No available doses for this vaccination drive")

    # Check if the student has already been vaccinated with this vaccine
    existing_record = db.query(VaccinationRecord).filter(
        VaccinationRecord.student_id == student_id,
        VaccinationRecord.vaccine_id == vaccine_id
    ).first()

    if existing_record:
        raise HTTPException(status_code=400, detail="Student has already been vaccinated with this vaccine")

    # Create a new vaccination record if the student hasn't been vaccinated yet
    vaccination_record = VaccinationRecord(
        student_id=student_id,
        vaccine_id=vaccine_id,
        drive_id=drive_id,
        vaccination_date=datetime.utcnow()  # mark the date of vaccination
    )

    # Add the vaccination record to the session
    db.add(vaccination_record)

    # Decrease the available doses of the drive by 1
    vaccination_drive.available_doses -= 1

    try:
        db.commit()
        db.refresh(vaccination_record)
        db.refresh(vaccination_drive)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to mark student as vaccinated")

    return {"message": "Student successfully vaccinated", "vaccination_record": vaccination_record, "updated_drive": vaccination_drive}
