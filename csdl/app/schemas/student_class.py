from pydantic import BaseModel
from app.schemas.student import StudentInDB
from app.schemas.class_ import ClassInDB
from app.schemas.semester import SemesterInDB
from app.schemas.teacher import TeacherInDB
from app.schemas.subject import SubjectInDB


class StudentClassBase(BaseModel):
    student_id: int
    class_id: int
    teacher_id: int
    subject_id: int
    grade: float | None = None


class StudentClassCreate(StudentClassBase):
    pass


class StudentClassUpdate(StudentClassBase):
    pass


class StudentClassInDB(StudentClassBase):
    student: StudentInDB
    class_: ClassInDB
    teacher: TeacherInDB
    subject: SubjectInDB

    class Config:
        from_attributes = True


StudentClassInDB.model_rebuild()
