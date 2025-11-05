from app.crud.base import CRUDBase
from app.models.teacher import Teacher
from app.schemas.teacher import TeacherCreate, TeacherUpdate
from sqlalchemy.orm import Session

teacher_crud = CRUDBase[Teacher, TeacherCreate, TeacherUpdate](Teacher)


def get_by_teacher_id(db: Session, teacher_id: str) -> Teacher:
    return db.query(Teacher).filter(Teacher.teacher_id == teacher_id).first()
