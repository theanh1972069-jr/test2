from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.student_class import StudentClass
from app.schemas.student_class import StudentClassCreate, StudentClassInDB
from app.dependencies import get_db

router = APIRouter(prefix="/student-classes", tags=["StudentClass"])

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=StudentClassInDB)
def create_student_class(student_class: StudentClassCreate, db: Session = Depends(get_db)):
    db_entry = StudentClass(**student_class.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/{student_id}/{class_id}/{semester_id}", response_model=StudentClassInDB)
def read_student_class(student_id: int, class_id: int, semester_id: int, db: Session = Depends(get_db)):
    entry = db.query(StudentClass).filter(
        StudentClass.student_id == student_id,
        StudentClass.class_id == class_id,
        StudentClass.semester_id == semester_id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="StudentClass not found")
    return entry