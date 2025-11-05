from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from sqlalchemy.types import BigInteger
from app.database.base_class import Base


class Subject(Base):

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    subject_id = Column(String(50), nullable=False, unique=True, index=True)
    name = Column(String(100), nullable=False)

    student_classes = relationship('StudentClass', back_populates='subject')
