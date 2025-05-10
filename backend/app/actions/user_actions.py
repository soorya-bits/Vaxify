from sqlalchemy.orm import Session
from app.models.user import User, Role
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from typing import List, Optional
from app.schemas.user_schema import UserCreate, UserOut
from app.utils.security import hash_password

# Create a new user
def create_user(db: Session, user_in: UserCreate) -> User:
    hashed_password = hash_password(user_in.hashed_password)
    db_user = User(
        username=user_in.username, 
        hashed_password=hashed_password, 
        role=user_in.role, 
        full_name=user_in.full_name, 
        email=user_in.email
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Username or email already exists.")
    
    return UserOut(
        id=db_user.id,
        username=db_user.username,
        full_name=db_user.full_name,
        email=db_user.email,
        role=db_user.role.value
    )

# Get a user by ID
def get_users(db: Session, skip: int = 0, limit: int = 10):
    users = db.query(User).offset(skip).limit(limit).all()
    return [
        UserOut(
            id=user.id,
            username=user.username,
            full_name=user.full_name,
            email=user.email,
            role=user.role.value  # serialize enum to string
        )
        for user in users
    ]

# Get a user by username
def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        return UserOut(
            id=user.id,
            username=user.username,
            full_name=user.full_name,
            email=user.email,
            role=user.role.value
        )
    return None

# Get all users
def get_users(db: Session, skip: int = 0, limit: int = 10) -> List[User]:
    users = db.query(User).offset(skip).limit(limit).all()
    return [
        UserOut(
            id=user.id,
            username=user.username,
            full_name=user.full_name,
            email=user.email,
            role=user.role.value  # serialize enum to string
        )
        for user in users
    ]

# Update user details
def update_user(
    db: Session, 
    user_id: int, 
    username: Optional[str] = None, 
    full_name: Optional[str] = None, 
    email: Optional[str] = None, 
    role: Optional[Role] = None
) -> User:
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if username:
        db_user.username = username
    if full_name:
        db_user.full_name = full_name
    if email:
        db_user.email = email
    if role:
        db_user.role = role

    db.commit()
    db.refresh(db_user)
    
    return UserOut(
        id=db_user.id,
        username=db_user.username,
        full_name=db_user.full_name,
        email=db_user.email,
        role=db_user.role.value
    )   

# Delete a user by ID
def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()

    return {"message": f"User {user_id} deleted successfully"}
