from fastapi import FastAPI, HTTPException, Depends, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, List
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import engine, SessionLocal
from app.database.base_class import Base as ModelBase
import app.database.base

from app.models.student import Student
from app.models.teacher import Teacher
from app.models.class_ import Class
from app.models.semester import Semester
from app.models.student_class import StudentClass
from app.models.subject import Subject

from app.crud.crud_student import student_crud
from app.crud.crud_teacher import teacher_crud
from app.crud.crud_class import class_crud
from app.crud.crud_semester import semester_crud
from app.crud.crud_student_class import student_class_crud

from app.schemas.student import StudentCreate, StudentInDB, StudentUpdate
from app.schemas.teacher import TeacherCreate, TeacherInDB, TeacherUpdate
from app.schemas.class_ import ClassCreate, ClassInDB, ClassUpdate
from app.schemas.semester import SemesterCreate, SemesterInDB, SemesterUpdate
from app.schemas.student_class import StudentClassCreate, StudentClassInDB
from app.schemas.subject import SubjectCreate, SubjectInDB

from app.routers import student, teacher, class_, semester, student_class

app = FastAPI(title="School Management API", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    # Cho phép tất cả các phương thức (GET, POST, PUT, DELETE)
    allow_methods=["*"],
    allow_headers=["*"],  # Cho phép tất cả các header
)

ModelBase.metadata.create_all(bind=engine)

api_router = APIRouter()
api_router.include_router(student.router)
api_router.include_router(teacher.router)
api_router.include_router(class_.router)
api_router.include_router(semester.router)
api_router.include_router(student_class.router)

app.include_router(api_router, prefix="/api")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


DBSession = Annotated[Session, Depends(get_db)]


@app.get("/")
def root():
    return {"message": "School Management API", "version": "1.0.0", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/dashboard/summary")
def get_dashboard_summary(db: DBSession):
    try:
        total_students = db.query(Student).count()

        total_teachers = db.query(Teacher).count()

        total_classes = db.query(Class).count()

        summary_data = {
            "totalStudents": total_students,
            "totalTeachers": total_teachers,
            "totalClasses": total_classes,
            "leaveApplied": 5,
            "leaveApproved": 3,
            "leavePending": 1,
            "leaveRejected": 1,
        }

        return summary_data

    except Exception as e:
        print(f"Error fetching dashboard summary: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching dashboard summary data."
        )


@app.get("/all-students/", response_model=List[StudentInDB])
def get_all_students(skip: int = 0, limit: int = 100, db: DBSession = None):
    return student_crud.get_multi(db, skip=skip, limit=limit)


@app.post("/students/", status_code=status.HTTP_201_CREATED, response_model=StudentInDB)
def create_student(student: StudentCreate, db: DBSession):
    return student_crud.create(db, student)


@app.get("/students/{student_id}", response_model=StudentInDB)
def read_student(student_id: int, db: DBSession):
    student = student_crud.get(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@app.get("/all-students/", response_model=List[StudentInDB])
def get_all_students(skip: int = 0, limit: int = 100, db: DBSession = None):
    return student_crud.get_multi(db, skip=skip, limit=limit)


@app.put("/students/{student_id}", response_model=StudentInDB)
def update_student(student_id: int, student_update: StudentUpdate, db: DBSession):
    db_student = student_crud.get(db, student_id)
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student_crud.update(db, db_student, student_update)


@app.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, db: DBSession):
    student = student_crud.remove(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return None


@app.get("/all-teachers/", response_model=List[TeacherInDB])
def get_all_teachers(skip: int = 0, limit: int = 100, db: DBSession = None):
    return teacher_crud.get_multi(db, skip=skip, limit=limit)


@app.post("/teachers/", status_code=status.HTTP_201_CREATED, response_model=TeacherInDB)
def create_teacher(teacher: TeacherCreate, db: DBSession):
    return teacher_crud.create(db, teacher)


@app.get("/teachers/{teacher_id}", response_model=TeacherInDB)
def read_teacher(teacher_id: int, db: DBSession):
    teacher = teacher_crud.get(db, teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher


@app.put("/teachers/{teacher_id}", response_model=TeacherInDB)
def update_teacher(teacher_id: int, teacher_update: TeacherUpdate, db: DBSession):
    db_teacher = teacher_crud.get(db, teacher_id)
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher_crud.update(db, db_teacher, teacher_update)


@app.delete("/teachers/{teacher_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_teacher(teacher_id: int, db: DBSession):
    teacher = teacher_crud.remove(db, teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return None


@app.get("/all-classes/", response_model=List[ClassInDB])
def get_all_classes(skip: int = 0, limit: int = 100, db: DBSession = None):
    return class_crud.get_multi(db, skip=skip, limit=limit)


@app.post("/classes/", status_code=status.HTTP_201_CREATED, response_model=ClassInDB)
def create_class(class_: ClassCreate, db: DBSession):
    return class_crud.create(db, class_)


@app.get("/classes/{class_id}", response_model=ClassInDB)
def read_class(class_id: int, db: DBSession):
    class_ = class_crud.get(db, class_id)
    if not class_:
        raise HTTPException(status_code=404, detail="Class not found")
    return class_


@app.put("/classes/{class_id}", response_model=ClassInDB)
def update_class(class_id: int, class_update: ClassUpdate, db: DBSession):
    db_class = class_crud.get(db, class_id)
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    return class_crud.update(db, db_class, class_update)


@app.delete("/classes/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_class(class_id: int, db: DBSession):
    class_ = class_crud.remove(db, class_id)
    if not class_:
        raise HTTPException(status_code=404, detail="Class not found")
    return None

# 🧮 Endpoint: Đếm số học sinh trong mỗi lớp


@app.get("/class-student-counts")
def get_class_student_counts(db: Session = Depends(get_db)):
    """
    Trả về danh sách tất cả lớp và số lượng học sinh trong từng lớp
    """
    try:
        results = (
            db.query(
                Class.id.label("class_id"),
                Class.name.label("class_name"),
                func.count(StudentClass.student_id).label("student_count")
            )
            .outerjoin(StudentClass, Class.id == StudentClass.class_id)
            .group_by(Class.id, Class.name)
            .all()
        )

        # Trả kết quả dạng list of dict
        data = [
            {"class_id": r.class_id, "class_name": r.class_name,
                "student_count": r.student_count}
            for r in results
        ]
        return data

    except Exception as e:
        print("Error fetching class-student counts:", e)
        raise HTTPException(
            status_code=500, detail="Cannot fetch student counts for classes")


@app.get("/classes/{class_id}/students/")
def get_students_by_class(class_id: int, db: Session = Depends(get_db)):
    results = (
        db.query(Student.student_id, Student.fullname)
        .join(StudentClass, Student.id == StudentClass.student_id)
        .filter(StudentClass.class_id == class_id)
        .all()
    )

    # ✅ Chuyển đổi sang list[dict]
    return [{"student_id": r.student_id, "fullname": r.fullname} for r in results]


@app.get("/all-semesters/", response_model=List[SemesterInDB])
def get_all_semesters(skip: int = 0, limit: int = 100, db: DBSession = None):
    return semester_crud.get_multi(db, skip=skip, limit=limit)


@app.post("/semesters/", status_code=status.HTTP_201_CREATED, response_model=SemesterInDB)
def create_semester(semester: SemesterCreate, db: DBSession):
    return semester_crud.create(db, semester)


@app.get("/semesters/{semester_id}", response_model=SemesterInDB)
def read_semester(semester_id: int, db: DBSession):
    semester = semester_crud.get(db, semester_id)
    if not semester:
        raise HTTPException(status_code=404, detail="Semester not found")
    return semester


@app.put("/semesters/{semester_id}", response_model=SemesterInDB)
def update_semester(semester_id: int, semester_update: SemesterUpdate, db: DBSession):
    db_semester = semester_crud.get(db, semester_id)
    if not db_semester:
        raise HTTPException(status_code=404, detail="Semester not found")
    return semester_crud.update(db, db_semester, semester_update)


@app.delete("/semesters/{semester_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_semester(semester_id: int, db: DBSession):
    semester = semester_crud.remove(db, semester_id)
    if not semester:
        raise HTTPException(status_code=404, detail="Semester not found")
    return None


@app.get("/all-student-classes/", response_model=List[StudentClassInDB])
def get_all_student_classes(skip: int = 0, limit: int = 100, db: DBSession = None):
    # return student_class_crud.get_multi(db, skip=skip, limit=limit)
    return student_class_crud.get_multi_student_classes_with_student_info(db, skip=skip, limit=limit)


@app.get("/all-student-classes/")
def get_all_student_classes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return student_class_crud.get_multi_student_classes_with_student_info(db, skip=skip, limit=limit)


@app.post("/student-classes/", status_code=status.HTTP_201_CREATED, response_model=StudentClassInDB)
def create_student_class(student_class: StudentClassCreate, db: DBSession):
    return student_class_crud.create(db, student_class)


@app.get("/student-classes/{student_id}/{class_id}/{semester_id}", response_model=StudentClassInDB)
def read_student_class(student_id: int, class_id: int, semester_id: int, db: DBSession):
    entry = db.query(StudentClass).filter(
        StudentClass.student_id == student_id,
        StudentClass.class_id == class_id,
        StudentClass.semester_id == semester_id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="StudentClass not found")
    return entry


@app.delete("/student-classes/{student_id}/{class_id}/{semester_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student_class(student_id: int, class_id: int, semester_id: int, db: DBSession):
    entry = db.query(StudentClass).filter(
        StudentClass.student_id == student_id,
        StudentClass.class_id == class_id,
        StudentClass.semester_id == semester_id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="StudentClass not found")
    db.delete(entry)
    db.commit()
    return None


@app.get("/subjects/", response_model=List[SubjectInDB])
def get_all_subjects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Subject).offset(skip).limit(limit).all()

# Lấy 1 subject theo id


@app.get("/subjects/{subject_id}", response_model=SubjectInDB)
def read_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

# Tạo mới subject


@app.post("/subjects/", status_code=status.HTTP_201_CREATED, response_model=SubjectInDB)
def create_subject(subject_create: SubjectCreate, db: Session = Depends(get_db)):
    db_subject = Subject(**subject_create.dict())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

# Cập nhật subject


@app.put("/subjects/{subject_id}", response_model=SubjectInDB)
def update_subject(subject_id: int, subject_update: SubjectCreate, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    subject.subject_id = subject_update.subject_id
    subject.name = subject_update.name

    db.commit()
    db.refresh(subject)
    return subject

# Xóa subject


@app.delete("/subjects/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    db.delete(subject)
    db.commit()
    return None
