from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from models.course import Pregunta, Opcion
from schemas.question import PreguntaCreate, PreguntaResponse

router = APIRouter(
    prefix="/preguntas",
    tags=["Evaluaciones"]
)

@router.post("/crear", response_model=PreguntaResponse, status_code=status.HTTP_201_CREATED)
def crear_pregunta_con_opciones(pregunta: PreguntaCreate, db: Session = Depends(get_db)):
    
    # Separamos los datos de la pregunta base de su lista de opciones
    pregunta_data = pregunta.model_dump(exclude={"opciones"})
    opciones_data = pregunta.opciones

    # Validación de negocio 
    tiene_correcta = any(opcion.es_correcta for opcion in opciones_data)
    if not tiene_correcta:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La pregunta debe tener al menos una opción marcada como correcta."
        )

    # se crea la pregunta en la base de datos
    nueva_pregunta = Pregunta(**pregunta_data)
    db.add(nueva_pregunta)
    
    # El flush() empuja la pregunta a la BD para generar su ID, pero NO cierra la transacción aún
    db.flush() 

    # se iteramos sobre las opciones que llegaron del frontend y las asociamos al nuevo ID
    for opcion in opciones_data:
        nueva_opcion = Opcion(
            pregunta_id=nueva_pregunta.id,
            **opcion.model_dump()
        )
        db.add(nueva_opcion)

    db.commit()
    db.refresh(nueva_pregunta) # Actualiza el objeto para que incluya sus relaciones

    return nueva_pregunta