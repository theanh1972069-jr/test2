from sqlalchemy import Column, ForeignKey, Float
from app.database.base_class import Base
from sqlalchemy.orm import relationship


class StudentClass(Base):
    __tablename__ = "studentclasses"

    student_id = Column(ForeignKey('students.id'), primary_key=True)
    class_id = Column(ForeignKey('classes.id'), primary_key=True)
    semester_id = Column(ForeignKey('semesters.id'), primary_key=True)
    teacher_id = Column(ForeignKey('teachers.id'), nullable=False)
    grade = Column(Float, nullable=True)

    # student = relationship('Student', back_populates='classes')
    class_ = relationship('Class', back_populates='students')
    semester = relationship('Semester', back_populates='student_classes')
    teacher = relationship('Teacher', back_populates='student_classes')

    student = relationship('Student', back_populates='student_enrollments')