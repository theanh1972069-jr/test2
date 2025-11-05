from pydantic import BaseModel
from app.schemas.student import StudentInDB
from app.schemas.class_ import ClassInDB
from app.schemas.semester import SemesterInDB
from app.schemas.teacher import TeacherInDB
from app.schemas.subject import SubjectInDB  # ✅ Thêm import

# ---------------------------------------------------------
# Base Schema
# ---------------------------------------------------------


class StudentClassBase(BaseModel):
    student_id: int
    class_id: int
    teacher_id: int
    subject_id: int             # ✅ Thêm trường subject_id
    grade: float | None = None


# ---------------------------------------------------------
# Create & Update Schemas
# ---------------------------------------------------------
class StudentClassCreate(StudentClassBase):
    pass


class StudentClassUpdate(StudentClassBase):
    pass


# ---------------------------------------------------------
# InDB Schema
# ---------------------------------------------------------
class StudentClassInDB(StudentClassBase):
    student: StudentInDB
    class_: ClassInDB
    teacher: TeacherInDB
    subject: SubjectInDB        # ✅ Thêm quan hệ subject

    class Config:
        from_attributes = True


# ✅ Rebuild model for nested relationships
StudentClassInDB.model_rebuild()
