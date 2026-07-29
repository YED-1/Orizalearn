from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.module import ModuloCreate, ModuloResponse
from models.course import Module, Course 
from core.database import get_db 

router = APIRouter(prefix="/modulos", tags=["Módulos"])

# EndPoint POST
@router.post("/crear", response_model=ModuloResponse, status_code=201)
def crear_modulo(modulo: ModuloCreate, db: Session = Depends(get_db)):
    curso_existente = db.query(Course).filter(Course.id == modulo.curso_id).first()
    if not curso_existente:
        raise HTTPException(status_code=404, detail="El curso especificado no existe")
    # Crear la instancia del modelo SQLAlchemy
    nuevo_modulo = Module(**modulo.model_dump())
    
    # Guardar en la base de datos
    db.add(nuevo_modulo)
    db.commit()
    db.refresh(nuevo_modulo)
    
    return nuevo_modulo

# Endpoint GET
@router.get("/curso/{curso_id}", response_model=List[ModuloResponse])
def obtener_modulos_por_curso(curso_id: int, db: Session = Depends(get_db)):
    # Validar que el curso exista
    curso = db.query(Course).filter(Course.id == curso_id).first()
    if not curso:
        raise HTTPException(status_code=404, detail="El curso especificado no existe")
    # Consultar los módulos filtrando por el ID del curso
    # Se usa .order_by() para que el frontend los reciba en el orden correcto
    modulos = db.query(Module).filter(Module.curso_id == curso_id).order_by(Module.orden.asc()).all()
    # Retornar la lista (FastAPI y Pydantic se encargan de convertirla a JSON)
    return modulos