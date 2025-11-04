from datetime import date, datetime
from pydantic import BaseModel, validator


class SemesterBase(BaseModel):
    name: str
    start_date: date
    end_date: date

    @validator("start_date", "end_date", pre=True)
    def parse_dates(cls, value):
        if isinstance(value, date):
            return value
        return datetime.strptime(value, "%Y-%m-%d").date()

    @validator("end_date")
    def validate_dates(cls, end_date, values):
        if "start_date" in values and end_date <= values["start_date"]:
            raise ValueError("End date must be after start date.")
        return end_date


class SemesterCreate(SemesterBase):
    pass


class SemesterUpdate(SemesterBase):
    pass


class SemesterInDB(SemesterBase):
    id: int

    class Config:
        from_attributes = True
