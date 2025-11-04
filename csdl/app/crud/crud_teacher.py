from app.crud.base import CRUDBase
from app.models.teacher import Teacher
from app.schemas.teacher import TeacherCreate, TeacherUpdate

teacher_crud = CRUDBase[Teacher, TeacherCreate, TeacherUpdate](Teacher)