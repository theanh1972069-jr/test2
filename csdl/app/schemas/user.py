from pydantic import BaseModel
from enum import Enum


class UserRole(str, Enum):
    student = "student"
    teacher = "teacher"
    admin = "admin"


class UserBase(BaseModel):
    username: str
    role: UserRole


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    password: str | None = None
    role: UserRole | None = None


class UserInDB(UserBase):
    id: int

    class Config:
        from_attributes = True
