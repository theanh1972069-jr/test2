from sqlalchemy.orm import Session, joinedload
from app.models.student_class import StudentClass
from app.schemas.student_class import StudentClassCreate
from app.crud.base import CRUDBase

class CRUDStudentClass:
    # def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
    #     return db.query(StudentClass).offset(skip).limit(limit).all()

    def get_multi_student_classes_with_student_info(db: Session, skip: int = 0, limit: int = 100):
        return db.query(StudentClass).options(joinedload(StudentClass.student)).offset(skip).limit(limit).all()


    def get(self, db: Session, student_id: int, class_id: int, semester_id: int):
        return db.query(StudentClass).filter(
            StudentClass.student_id == student_id,
            StudentClass.class_id == class_id,
            StudentClass.semester_id == semester_id
        ).first()

    def remove(self, db: Session, student_id: int, class_id: int, semester_id: int):
        obj = self.get(db, student_id, class_id, semester_id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

student_class_crud = CRUDStudentClass()