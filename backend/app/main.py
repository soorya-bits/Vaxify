from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import exc, text
from app.database import get_db, Base, engine, SessionLocal
from app.routes import auth, students, vaccine, drive, dashboard, user
from app.models.user import User, Role
from app.utils.security import hash_password
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="Vaxify API",
    description="API for Vaxify application of St. Mary’s High School",
    version="1.0.0"
)

# Add CORS middleware
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

Base.metadata.create_all(bind=engine)

@app.on_event("startup")
def create_default_admin():
    db = SessionLocal()
    try:
        existing_admin = db.query(User).filter_by(username="admin").first()
        if not existing_admin:
            default_password = os.getenv("DEFAULT_ADMIN_PASSWORD", "123")
            default_admin = User(
                username="admin",
                full_name="Admin",
                email="admin@example.com",
                role=Role.ADMIN,
                hashed_password=hash_password("admin123")
            )
            db.add(default_admin)
            db.commit()
            print("Default admin user created.")
        else:
            print("Admin user already exists.")
    finally:
        db.close()

# Healthcheck endpoint
@app.get("/health")
def healthcheck(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy"}
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(students.router)
app.include_router(vaccine.router)
app.include_router(drive.router)
app.include_router(dashboard.router)
