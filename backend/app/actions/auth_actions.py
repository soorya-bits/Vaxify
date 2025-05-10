from app.models.user import User
from app.utils.security import verify_password, create_access_token
from fastapi import HTTPException
from sqlalchemy.orm import Session

def login_and_get_token(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={
        "sub": user.username,
        "user_id": user.id,
        "role": user.role.value
    })

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.value
        }
    }
