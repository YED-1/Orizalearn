from pydantic import BaseModel
from typing import Optional

class ModuloBase(BaseModel):
    curso_id: int
    titulo: str
    orden: int
    tipo_modulo: str  # Ejemplo: "teoria", "sandbox_python", "quiz"
    contenido_texto: Optional[str] = None #Contenido del módulo
    recurso_url: Optional[str] = None # Multimedia Youtube, PDF, documentación oficial

class ModuloCreate(ModuloBase):
    pass

class ModuloResponse(ModuloBase):
    id: int

    class Config:
        from_attributes = True