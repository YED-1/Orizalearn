from pydantic import BaseModel
from typing import Optional

class EjercicioBase(BaseModel):
    modulo_id: int
    instrucciones: str
    codigo_inicial: str
    solucion_esperada: str
    casos_prueba: Optional[str] = None

class EjercicioCreate(EjercicioBase):
    pass

class EjercicioResponse(EjercicioBase):
    id: int

    class Config:
        from_attributes = True