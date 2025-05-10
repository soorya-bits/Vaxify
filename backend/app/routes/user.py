from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal, get_db
from app.dependencies import get_current_user
from app.actions.user_actions import create_user, get_user_by_id, get_users, update_user, delete_user
from app.schemas.user_schema import UserCreate, UserUpdate, UserOut
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])

# Create a new user
@router.post("/", response_model=UserOut)
def add_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return create_user(db, user_in)

# Get a single user by ID
@router.get("/{user_id}", response_model=UserOut)
def get_single_user(
    user_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Get all users
@router.get("/", response_model=List[UserOut])
def get_all_users(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    users = get_users(db, skip, limit)
    print("User roles:", [type(user.role) for user in users])
    return users

# Update user details
@router.put("/{user_id}", response_model=UserOut)
def update_single_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return update_user(db, user_id, user_update.username, user_update.full_name, user_update.email, user_update.role)

# Delete a user by ID
@router.delete("/{user_id}", response_model=dict)
def delete_single_user(
    user_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return delete_user(db, user_id)
