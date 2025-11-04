from sqlalchemy import Column, String, Date
from sqlalchemy.types import BigInteger
from sqlalchemy.orm import relationship
from app.database.base_class import Base


class Semester(Base):
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    student_classes = relationship('StudentClass', back_populates='semester')
