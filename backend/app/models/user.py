from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import validates
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from enum import Enum as PyEnum
from app.database import Base

# Enum class for User Roles
class Role(PyEnum):
    ADMIN = "Admin"
    STAFF = "Staff"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(Enum(Role), default=Role.ADMIN)  # Enum for roles with default 'Admin'
    full_name = Column(String(100), index=True)  # Full name of the user
    email = Column(String(100), unique=True, index=True)  # Email of the user
    created_at = Column(DateTime, default=datetime.utcnow)  # Timestamp of user creation
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Timestamp for updates

    @validates('email')
    def validate_email(self, key, email):
        # You can add an email validation logic here
        if '@' not in email:
            raise ValueError("Invalid email address")
        return email
