from pydantic import BaseModel
from typing import List

# ESQUEMAS PARA OPCIONES 
class OpcionBase(BaseModel):
    texto: str  
    es_correcta: bool = False

class OpcionCreate(OpcionBase):
    pass

class OpcionResponse(OpcionBase):
    id: int
    pregunta_id: int

    class Config:
        from_attributes = True

# ESQUEMAS PARA PREGUNTAS 
class PreguntaBase(BaseModel):
    modulo_id: int
    texto: str 

class PreguntaCreate(PreguntaBase):
    opciones: List[OpcionCreate]

class PreguntaResponse(PreguntaBase):
    id: int
    opciones: List[OpcionResponse] = []

    class Config:
        from_attributes = True