import re
from datetime import date, datetime
from pydantic import BaseModel, field_validator, ConfigDict
from typing import Optional


class StudentBase(BaseModel):
    student_id: str
    fullname: str
    firstname: str
    gender: bool
    date_of_birth: date
    phone: str
    guardian: Optional[str] = None
    guardian_phone: Optional[str] = None
    admission_date: Optional[date] = None

    @field_validator("fullname", "firstname", mode="before")
    @classmethod
    def validate_name(cls, value: str):
        """Xác thực và loại bỏ khoảng trắng thừa cho tên."""
        if not isinstance(value, str):
            return value

        value = value.strip()
        if not value:
            raise ValueError("Name fields must not be empty.")
        return value

    @field_validator("phone", mode="after")
    @classmethod
    def validate_phone(cls, value: str):
        """Xác thực định dạng số điện thoại."""
        if not re.match(r"^\d{9,15}$", value):
            raise ValueError(
                "Please enter a valid phone number (9-15 digits).")
        return value

    @field_validator("guardian_phone", mode="after")
    @classmethod
    def validate_guardian_phone(cls, value: Optional[str]):
        """Xác thực định dạng số điện thoại người giám hộ (nếu có)."""
        if value is None or value == "":
            return None

        if not re.match(r"^\d{9,15}$", value):
            raise ValueError(
                "Please enter a valid guardian phone number (9-15 digits).")
        return value

    @field_validator("date_of_birth", "admission_date", mode="before")
    @classmethod
    def parse_date(cls, value):
        """Chuyển đổi chuỗi ngày tháng thành đối tượng date."""
        if isinstance(value, date):
            return value

        if value is None or value == "":
            return value

        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Date format must be YYYY-MM-DD.")

    @field_validator("admission_date", mode="after")
    @classmethod
    def set_admission_date_default(cls, value):
        if value is None:
            return date.today()
        return value


class StudentCreate(StudentBase):
    pass


class StudentUpdate(StudentBase):
    pass


class StudentInDB(StudentBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={
            date: lambda v: v.isoformat()
        }
    )
