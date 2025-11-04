from app.crud.base import CRUDBase
from app.models.class_ import Class
from app.schemas.class_ import ClassCreate, ClassUpdate

class_crud = CRUDBase[Class, ClassCreate, ClassUpdate](Class)