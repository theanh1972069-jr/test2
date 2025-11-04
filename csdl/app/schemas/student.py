# import re
# from datetime import date, datetime
# from pydantic import BaseModel, validator


# class StudentBase(BaseModel):
#     student_id: str
#     fullname: str
#     firstname: str
#     gender: bool
#     date_of_birth: date
#     phone: str
#     guardian: str | None = None
#     guardian_phone: str | None = None
#     admission_date: date | None = None

#     @validator("fullname", "firstname", pre=True)
#     def validate_name(cls, value: str):
#         value = value.strip()
#         if not value:
#             raise ValueError("Name fields must not be empty.")
#         return value

#     @validator("phone")
#     def validate_phone(cls, value: str):
#         value = value.strip()
#         if not re.match(r"^\d{9,15}$", value):
#             raise ValueError("Please enter a valid phone number.")
#         return value

#     @validator("guardian_phone", always=True)
#     def validate_guardian_phone(cls, value):
#         if value and not re.match(r"^\d{9,15}$", value):
#             raise ValueError("Please enter a valid guardian phone number.")
#         return value

#     @validator("date_of_birth", pre=True)
#     def parse_date_of_birth(cls, value):
#         if isinstance(value, date):
#             return value
#         return datetime.strptime(value, "%Y-%m-%d").date()

#     @validator("admission_date", pre=True, always=True)
#     def parse_admission_date(cls, value):
#         if not value:
#             return date.today()
#         if isinstance(value, date):
#             return value
#         return datetime.strptime(value, "%Y-%m-%d").date()


# class StudentCreate(StudentBase):
#     pass


# class StudentUpdate(StudentBase):
#     pass


# class StudentInDB(StudentBase):
#     id: int

#     class Config:
#         from_attributes = True
import re
from datetime import date, datetime
from pydantic import BaseModel, field_validator, ConfigDict
from typing import Optional


class StudentBase(BaseModel):
    # Khai báo kiểu dữ liệu
    student_id: str
    fullname: str
    firstname: str
    gender: bool
    date_of_birth: date
    phone: str
    # Sử dụng Optional[T] thay vì T | None = None
    guardian: Optional[str] = None
    guardian_phone: Optional[str] = None
    admission_date: Optional[date] = None

    @field_validator("fullname", "firstname", mode="before")
    @classmethod
    def validate_name(cls, value: str):
        """Xác thực và loại bỏ khoảng trắng thừa cho tên."""
        if not isinstance(value, str):
             # Cho phép Pydantic xử lý các kiểu không phải string nếu cần
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
            raise ValueError("Please enter a valid phone number (9-15 digits).")
        return value

    @field_validator("guardian_phone", mode="after")
    @classmethod
    def validate_guardian_phone(cls, value: Optional[str]):
        """Xác thực định dạng số điện thoại người giám hộ (nếu có)."""
        if value is None or value == "": # Cho phép None hoặc chuỗi rỗng
            return None
            
        if not re.match(r"^\d{9,15}$", value):
            raise ValueError("Please enter a valid guardian phone number (9-15 digits).")
        return value

    @field_validator("date_of_birth", "admission_date", mode="before")
    @classmethod
    def parse_date(cls, value):
        """Chuyển đổi chuỗi ngày tháng thành đối tượng date."""
        if isinstance(value, date):
            return value
        
        if value is None or value == "":
            # Pydantic sẽ xử lý Optional/None nếu trường không bắt buộc
            return value 
            
        try:
            # Chỉ chấp nhận định dạng YYYY-MM-DD từ chuỗi
            return datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Date format must be YYYY-MM-DD.")

    # Xử lý giá trị mặc định cho admission_date
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

    # Cú pháp mới cho model config trong Pydantic V2
    model_config = ConfigDict(
        from_attributes=True, # Thay thế orm_mode=True
        json_encoders={
            # Tùy chọn: Đảm bảo các đối tượng date được chuyển thành chuỗi ISO format
            date: lambda v: v.isoformat()
        }
    )