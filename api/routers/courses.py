from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from typing import List
from core.database import get_db
from models.course import Course, Module
from schemas.course import CourseCreate, CourseResponse, CursoResumen, CursoDetalle

# Configuración el prefijo para que todas las rutas empiecen con /cursos
router = APIRouter(prefix="/cursos", tags=["Cursos"])

# Carga los módulos con sus ejercicios y preguntas en pocas consultas (para contar sin N+1)
CARGA_MODULOS = (
    selectinload(Course.modulos).selectinload(Module.ejercicios),
    selectinload(Course.modulos).selectinload(Module.preguntas),
)

def _resumen_modulo(modulo: Module) -> dict:
    return {
        "id": modulo.id,
        "titulo": modulo.titulo,
        "orden": modulo.orden,
        "tipo_modulo": modulo.tipo_modulo,
        "contenido_texto": modulo.contenido_texto,
        "recurso_url": modulo.recurso_url,
        "total_ejercicios": len(modulo.ejercicios),
        "total_preguntas": len(modulo.preguntas),
    }

def _resumen_curso(curso: Course) -> dict:
    return {
        "id": curso.id,
        "titulo": curso.titulo,
        "descripcion": curso.descripcion,
        "imagen": curso.imagen,
        "total_modulos": len(curso.modulos),
        "total_ejercicios": sum(len(m.ejercicios) for m in curso.modulos),
        "total_preguntas": sum(len(m.preguntas) for m in curso.modulos),
    }

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

@router.get("/", response_model=List[CursoResumen])
def obtener_cursos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    # Catálogo: solo datos del curso y totales, sin el árbol de módulos
    cursos = db.query(Course).options(*CARGA_MODULOS).order_by(Course.id).offset(skip).limit(limit).all()
    return [_resumen_curso(curso) for curso in cursos]

@router.get("/{curso_id}", response_model=CursoDetalle)
def obtener_curso(curso_id: int, db: Session = Depends(get_db)):
    curso = db.query(Course).options(*CARGA_MODULOS).filter(Course.id == curso_id).first()
    if not curso:
        raise HTTPException(status_code=404, detail="El curso especificado no existe")
    # Los módulos se devuelven en el orden del temario
    modulos = sorted(curso.modulos, key=lambda m: m.orden)
    return {**_resumen_curso(curso), "modulos": [_resumen_modulo(m) for m in modulos]}
