import re
from pydantic import BaseModel, validator


class TeacherBase(BaseModel):
    fullname: str
    firstname: str
    phone: str
    email: str

    @validator("fullname", "firstname")
    def validate_names(cls, v: str):
        v = v.strip()
        if not v:
            raise ValueError("Name fields must not be empty.")
        return v

    @validator("phone")
    def validate_phone(cls, v: str):
        v = v.strip()
        if not re.match(r"^\d{9,15}$", v):
            raise ValueError("Please enter a valid phone number.")
        return v

    @validator("email")
    def validate_email(cls, v: str):
        v = v.strip()
        if "@" not in v:
            raise ValueError("Invalid email format.")
        return v


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(TeacherBase):
    pass


class TeacherInDB(TeacherBase):
    id: int

    class Config:
        from_attributes = True
