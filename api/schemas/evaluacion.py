from pydantic import BaseModel
from datetime import datetime

# Esquema base con los datos comunes
class EvaluacionBase(BaseModel):
    modulo_id: int
    calificacion: float

# Esquema para cuando el frontend manda los datos a guardar (POST)
class EvaluacionCreate(EvaluacionBase):
    usuario_id: int 

# Esquema para cuando pides los datos desde la base de datos (GET)
class EvaluacionOut(EvaluacionBase):
    id: int
    usuario_id: int
    fecha_intento: datetime

    class Config:
        from_attributes = True