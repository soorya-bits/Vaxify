from sqlalchemy.orm import Session
from app.models.student import Student
from app.models.vaccine import Vaccine
from app.models.vaccination_record import VaccinationRecord
from app.models.drive import VaccinationDrive
from sqlalchemy import func
from datetime import date, timedelta

def get_dashboard_metrics(db: Session):
    total_students = db.query(Student).count()
    vaccinated_students = db.query(VaccinationRecord.student_id).distinct().count()
    total_vaccines = db.query(VaccinationRecord).count()
    total_drives = db.query(VaccinationDrive).count()
    missing_vaccinations = total_students - vaccinated_students
    recent_vaccinated = db.query(VaccinationRecord).filter(
        VaccinationRecord.vaccination_date >= date.today() - timedelta(days=30)
    ).count()

    most_used = (
        db.query(
            Vaccine.name,
            func.count(VaccinationRecord.id).label("count")
        )
        .join(Vaccine, Vaccine.id == VaccinationRecord.vaccine_id)
        .group_by(Vaccine.name)
        .order_by(func.count(VaccinationRecord.id).desc())
        .first()
    )

    upcoming = db.query(VaccinationDrive).filter(
        VaccinationDrive.date >= date.today(),
        VaccinationDrive.date <= date.today() + timedelta(days=30)
    ).all()

    return {
        "total_students": total_students,
        "vaccinated": vaccinated_students,
        "vaccinated_percentage": round((vaccinated_students / total_students) * 100, 2) if total_students else 0.0,
        "missing_vaccinations": missing_vaccinations,
        "total_vaccines": total_vaccines,
        "total_drives": total_drives,
        "recent_vaccinated": recent_vaccinated,
        "most_used_vaccine": {
            "name": most_used[0],
            "count": most_used[1]
        } if most_used else None,
        "upcoming_drives": [
            {
                "id": d.id,
                "vaccine_name": d.vaccine.name if d.vaccine else None,
                "date": d.date.isoformat()
            } for d in upcoming
        ]
    }
