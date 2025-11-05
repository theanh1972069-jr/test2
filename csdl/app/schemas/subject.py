from pydantic import BaseModel


class SubjectBase(BaseModel):
    subject_id: str
    name: str


class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(SubjectBase):
    pass


class SubjectInDB(SubjectBase):
    id: int

    class Config:
        from_attributes = True
