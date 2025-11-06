from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from sqlalchemy.types import BigInteger
from app.database.base_class import Base


class Teacher(Base):
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    fullname = Column(String(100), nullable=False)
    firstname = Column(String(50), nullable=False)
    phone = Column(String(15), nullable=False)
    email = Column(String(100), unique=True, nullable=False)

    student_classes = relationship(
        'StudentClass', back_populates='teacher', cascade='all, delete-orphan', passive_deletes=True)
