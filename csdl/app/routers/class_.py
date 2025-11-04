from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.class_ import Class
from app.schemas.class_ import ClassCreate, ClassInDB
from app.dependencies import get_db

router = APIRouter(prefix="/classes", tags=["Classes"])

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ClassInDB)
def create_class(class_: ClassCreate, db: Session = Depends(get_db)):
    db_class = Class(**class_.dict())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

@router.get("/{class_id}", response_model=ClassInDB)
def read_class(class_id: int, db: Session = Depends(get_db)):
    class_ = db.query(Class).filter(Class.id == class_id).first()
    if not class_:
        raise HTTPException(status_code=404, detail="Class not found")
    return class_