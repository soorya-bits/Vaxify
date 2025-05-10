from sqlalchemy.orm import Session
from app.models.student import Student
from app.models.vaccination_record import VaccinationRecord
from app.models.drive import VaccinationDrive
from datetime import date, timedelta

def get_dashboard_metrics(db: Session):
    total_students = db.query(Student).count()
    vaccinated_students = db.query(VaccinationRecord.student_id).distinct().count()
    upcoming = db.query(VaccinationDrive).filter(
        VaccinationDrive.date >= date.today(),
        VaccinationDrive.date <= date.today() + timedelta(days=30)
    ).all()

    return {
        "total_students": total_students,
        "vaccinated": vaccinated_students,
        "vaccinated_percentage": round((vaccinated_students / total_students) * 100, 2) if total_students else 0.0,
        "upcoming_drives": [
            {
                "id": d.id,
                "vaccine_name": d.vaccine_name,
                "date": d.date.isoformat()
            } for d in upcoming
        ]
    }
