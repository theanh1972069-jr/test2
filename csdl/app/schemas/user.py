from pydantic import BaseModel
from enum import Enum


class UserRole(str, Enum):
    student = "student"
    teacher = "teacher"
    admin = "admin"


class UserBase(BaseModel):
    username: str
    role: UserRole


# Dùng khi tạo user mới (đăng ký)
class UserCreate(UserBase):
    password: str


# Dùng khi cập nhật user
class UserUpdate(BaseModel):
    password: str | None = None
    role: UserRole | None = None


# Dùng khi trả dữ liệu ra ngoài API
class UserInDB(UserBase):
    id: int

    class Config:
        from_attributes = True
