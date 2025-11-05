from datetime import date
from sqlalchemy import Column, String, Date, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.types import BigInteger
from app.database.base_class import Base


class Student(Base):
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    student_id = Column(String(50), nullable=False, unique=True, index=True)
    fullname = Column(String(100), nullable=False)
    firstname = Column(String(50), nullable=False)
    # True = Nam, False = Nữ
    gender = Column(Boolean, default=True, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    phone = Column(String(15), nullable=False)
    guardian = Column(String(100), nullable=True)
    guardian_phone = Column(String(15), nullable=True)
    admission_date = Column(Date, nullable=False, default=date.today)

    student_enrollments = relationship(
        'StudentClass', back_populates='student')
