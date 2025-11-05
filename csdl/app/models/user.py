from sqlalchemy import Column, String, Enum
from sqlalchemy.types import BigInteger
from app.database.base_class import Base
import enum


class UserRole(enum.Enum):
    student = "student"
    teacher = "teacher"
    admin = "admin"


class User(Base):
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
