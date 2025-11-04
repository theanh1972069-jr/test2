from pydantic import BaseModel
from app.schemas.teacher import TeacherInDB


class ClassBase(BaseModel):
    name: str


class ClassCreate(ClassBase):
    pass


class ClassUpdate(ClassBase):
    pass


class ClassInDB(ClassBase):
    id: int

    class Config:
        from_attributes = True
