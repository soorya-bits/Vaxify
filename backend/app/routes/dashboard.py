from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.actions.dashboard_actions import get_dashboard_metrics
from app.dependencies import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/")
def dashboard_metrics(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return get_dashboard_metrics(db)
