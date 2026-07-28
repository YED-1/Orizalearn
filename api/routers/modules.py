from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.module import ModuloCreate, ModuloResponse
from models.course import Module, Course 
from core.database import get_db 

router = APIRouter(prefix="/modulos", tags=["Módulos"])

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