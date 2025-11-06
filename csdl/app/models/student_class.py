from sqlalchemy import Column, ForeignKey, Float
from app.database.base_class import Base
from sqlalchemy.orm import relationship


class StudentClass(Base):
    __tablename__ = "studentclasses"

    student_id = Column(ForeignKey(
        'students.id', ondelete='CASCADE'), primary_key=True)
    class_id = Column(ForeignKey(
        'classes.id', ondelete='CASCADE'), primary_key=True)
    teacher_id = Column(ForeignKey(
        'teachers.id', ondelete='CASCADE'), nullable=False)
    grade = Column(Float, nullable=True)
    subject_id = Column(ForeignKey(
        'subjects.id', ondelete='CASCADE'), nullable=False)

    class_ = relationship('Class', back_populates='students')
    teacher = relationship('Teacher', back_populates='student_classes')
    student = relationship('Student', back_populates='student_enrollments')
    subject = relationship('Subject', back_populates='student_classes')
