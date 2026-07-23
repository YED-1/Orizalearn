import docker
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Nos conectamos al socket de Docker que mapeamos en el compose
client = docker.from_env()

class EjecucionRequest(BaseModel):
    codigo: str

@router.post("/ejecutar-python")
def ejecutar_codigo_python(payload: EjecucionRequest): 
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