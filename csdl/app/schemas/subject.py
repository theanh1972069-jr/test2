from pydantic import BaseModel


# ---------------------------------------------------------
# Base Schema
# ---------------------------------------------------------
class SubjectBase(BaseModel):
    subject_id: str
    name: str


# ---------------------------------------------------------
# Create & Update Schemas
# ---------------------------------------------------------
class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(SubjectBase):
    pass


# ---------------------------------------------------------
# InDB Schema (dùng cho dữ liệu đọc ra từ DB)
# ---------------------------------------------------------
class SubjectInDB(SubjectBase):
    id: int

    class Config:
        from_attributes = True
