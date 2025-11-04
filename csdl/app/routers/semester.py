from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.semester import Semester
from app.schemas.semester import SemesterCreate, SemesterInDB
from app.dependencies import get_db

router = APIRouter(prefix="/semesters", tags=["Semesters"])

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=SemesterInDB)
def create_semester(semester: SemesterCreate, db: Session = Depends(get_db)):
    db_semester = Semester(**semester.dict())
    db.add(db_semester)
    db.commit()
    db.refresh(db_semester)
    return db_semester

@router.get("/{semester_id}", response_model=SemesterInDB)
def read_semester(semester_id: int, db: Session = Depends(get_db)):
    semester = db.query(Semester).filter(Semester.id == semester_id).first()
    if not semester:
        raise HTTPException(status_code=404, detail="Semester not found")
    return semester