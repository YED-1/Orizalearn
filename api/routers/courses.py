from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from models.course import Course
from schemas.course import CourseCreate, CourseResponse

# Configuración el prefijo para que todas las rutas empiecen con /cursos
router = APIRouter(prefix="/cursos", tags=["Cursos"])

@router.post("/crear", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def crear_curso(curso: CourseCreate, db: Session = Depends(get_db)):
    # Mapeamos los datos recibidos (Pydantic) al modelo de base de datos (SQLAlchemy)
    nuevo_curso = Course(
        titulo=curso.titulo,
        descripcion=curso.descripcion,
        imagen=curso.imagen,
        examen=curso.examen
    )
    
    # Guardamos en la base de datos
    db.add(nuevo_curso)
    db.commit()
    db.refresh(nuevo_curso) # Actualizamos para obtener el 'id' generado
    
    # Retornamos el curso creado
    return nuevo_curso

@router.get("/", response_model=List[CourseResponse])
def obtener_cursos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    # Retorna la lista de cursos. FastAPI anidará los módulos y ejercicios automáticamente.
    cursos = db.query(Course).offset(skip).limit(limit).all()
    return cursos