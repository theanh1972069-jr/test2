from app.crud.base import CRUDBase
from app.models.semester import Semester
from app.schemas.semester import SemesterCreate, SemesterUpdate

semester_crud = CRUDBase[Semester, SemesterCreate, SemesterUpdate](Semester)