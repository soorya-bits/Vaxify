from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import exc, text
from .database import get_db

app = FastAPI()

# Healthcheck endpoint
@app.get("/health")
def healthcheck(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy"}
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")
