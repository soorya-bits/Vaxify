from pydantic import BaseModel
from enum import Enum
from typing import Optional

class Role(str, Enum):
    ADMIN = "Admin"
    STAFF = "Staff"

class UserCreate(BaseModel):
    username: str
    hashed_password: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    role: Role = "Staff"

class UserUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[Role] = None

class UserOut(BaseModel):
    id: int
    username: str
    full_name: Optional[str]
    email: Optional[str]
    role: Role

    class Config:
        orm_mode = True
