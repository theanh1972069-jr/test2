from sqlalchemy.orm import Session, joinedload
from app.models.student_class import StudentClass
from app.schemas.student_class import StudentClassCreate
from app.models.student import Student
from app.schemas.student import StudentInDB
from app.crud.base import CRUDBase


class CRUDStudentClass:

    def create(self, db: Session, obj_in: StudentClassCreate):
        db_obj = StudentClass(**obj_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_student_classes_with_student_info(self, db: Session, skip: int = 0, limit: int = 100):
        return (
            db.query(
                StudentClass.student_id,
                Student.fullname
            )
            .join(Student, StudentClass.student_id == Student.id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get(self, db: Session, student_id: int, class_id: int, subject_id: int):
        return db.query(StudentClass).filter(
            StudentClass.student_id == student_id,
            StudentClass.class_id == class_id,
            StudentClass.subject_id == subject_id
        ).first()

    def remove(self, db: Session, student_id: int, class_id: int, subject_id: int):
        obj = self.get(db, student_id, class_id, subject_id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj


student_class_crud = CRUDStudentClass()
