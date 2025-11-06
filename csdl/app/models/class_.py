from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import BigInteger
from app.database.base_class import Base


class Class(Base):
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)

    students = relationship('StudentClass', back_populates='class_',
                            cascade='all, delete-orphan', passive_deletes=True)
