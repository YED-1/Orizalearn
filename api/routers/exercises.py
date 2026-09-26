import docker
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from core.database import get_db
from models.course import Module, Ejercicio
from schemas.exercise import EjercicioCreate, EjercicioResponse


router = APIRouter(prefix="/ejercicios", tags=["Ejercicios"])
# El cliente de Docker se crea en el primer uso para que la API arranque aunque Docker no esté disponible
_cliente_docker = None

def obtener_cliente_docker():
    global _cliente_docker
    if _cliente_docker is None:
        try:
            # Nos conectamos al socket de Docker que mapeamos en el compose
            _cliente_docker = docker.from_env()
        except docker.errors.DockerException:
            raise HTTPException(status_code=500, detail="El entorno de ejecución no está disponible en este momento.")
    return _cliente_docker

class EjecucionRequest(BaseModel):
    codigo: str

# Enpoints de ejercicios

@router.post("/crear", response_model=EjercicioResponse, status_code=201)
def crear_ejercicio(ejercicio: EjercicioCreate, db: Session = Depends(get_db)):
    # Validar que el módulo al que se asigna el ejercicio exista
    modulo_existente = db.query(Module).filter(Module.id == ejercicio.modulo_id).first()
    if not modulo_existente:
        raise HTTPException(status_code=404, detail="El módulo especificado no existe")
    # Guardar el ejercicio en BD
    nuevo_ejercicio = Ejercicio(**ejercicio.model_dump())
    db.add(nuevo_ejercicio)
    db.commit()
    db.refresh(nuevo_ejercicio)
    
    return nuevo_ejercicio

@router.get("/modulo/{modulo_id}", response_model=List[EjercicioResponse])
def obtener_ejercicios_por_modulo(modulo_id: int, db: Session = Depends(get_db)):
    # Validar que el módulo exista
    modulo = db.query(Module).filter(Module.id == modulo_id).first()
    if not modulo:
        raise HTTPException(status_code=404, detail="El módulo especificado no existe")
    
    ejercicios = db.query(Ejercicio).filter(Ejercicio.modulo_id == modulo_id).all()
    return ejercicios

# Endpoint del sandbox docker

@router.post("/ejecutar-python")
def ejecutar_codigo_python(payload: EjecucionRequest):
    client = obtener_cliente_docker()
    try:
        # Se crea y ejecuta el sandbox desechable
        container_output = client.containers.run(
            image="python:3.11-alpine",
            command=["python", "-c", payload.codigo],
            remove=True,                  # Destruir automáticamente al terminar
            network_disabled=True,        # Sin internet (evita descargas o hackeos)
            mem_limit="50m",              # Máximo 50 MB de RAM
            cpu_quota=50000,              # Limita el uso del procesador
            environment=["PYTHONUNBUFFERED=1"] # Fuerza a Python a escupir los prints de inmediato
        )
        
        # Si todo sale bien, la salida viene en bytes, la decodificamos
        return {
            "salida": container_output.decode("utf-8"),
            "errores": ""
        }
        
    except docker.errors.ContainerError as exc:
        # Este error atrapa los fallos sintácticos o de lógica del código del estudiante
        error_msg = exc.stderr.decode("utf-8") if exc.stderr else str(exc)
        return {
            "salida": "",
            "errores": error_msg
        }
    except docker.errors.ImageNotFound:
        raise HTTPException(status_code=500, detail="La imagen base de Python no se encuentra.")
    except Exception as e:
        # Atrapa cualquier otro error catastrófico del servidor
        raise HTTPException(status_code=500, detail=f"Error interno del sandbox: {str(e)}")