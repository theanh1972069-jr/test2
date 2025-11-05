from app.crud.base import CRUDBase
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate
from sqlalchemy.orm import Session

student_crud = CRUDBase[Student, StudentCreate, StudentUpdate](Student)


def get_by_student_id(db: Session, student_id: str) -> Student:
    return db.query(Student).filter(Student.student_id == student_id).first()
