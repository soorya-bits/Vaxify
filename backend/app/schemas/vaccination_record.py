class VaccinationRecordOut(BaseModel):
    id: int
    student_id: int
    vaccine_id: int
    drive_id: int
    vaccination_date: date
    student: StudentOut
    vaccine: VaccineOut

    class Config:
        orm_mode = True
