from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from enum import Enum


class TipoModulo(str, Enum):
    TEORIA = "teoria"
    PRACTICA = "practica"
    EXAMEN = "examen"

# ESQUEMAS PARA OPCIONES
class OpcionBase(BaseModel):
    texto: str
    es_correcta: bool = False

class OpcionCreate(OpcionBase):
    pass

class OpcionResponse(OpcionBase):
    id: int
    pregunta_id: int

    model_config = ConfigDict(from_attributes=True)

# ESQUEMAS PARA PREGUNTAS 
class PreguntaBase(BaseModel):
    texto: str

class PreguntaCreate(PreguntaBase):
    opciones: List[OpcionCreate] = []

class PreguntaResponse(PreguntaBase):
    id: int
    modulo_id: int
    opciones: List[OpcionResponse] = []

    model_config = ConfigDict(from_attributes=True)

# ESQUEMAS PARA EJERCICIOS (Sandbox) 
class EjercicioBase(BaseModel):
    instrucciones: str
    codigo_inicial: str
    solucion_esperada: str
    casos_prueba: Optional[str] = None

class EjercicioCreate(EjercicioBase):
    pass

class EjercicioResponse(EjercicioBase):
    id: int
    modulo_id: int

    model_config = ConfigDict(from_attributes=True)

# ESQUEMAS PARA MÓDULOS 
class ModuleBase(BaseModel):
    titulo: str
    orden: int
    contenido_texto: str
    recurso_url: Optional[str] = None
    tipo_modulo: TipoModulo = TipoModulo.TEORIA

class ModuleCreate(ModuleBase):
    # Permite crear ejercicios o preguntas anidadas si se desea
    ejercicios: Optional[List[EjercicioCreate]] = []
    preguntas: Optional[List[PreguntaCreate]] = []

class ModuleResponse(ModuleBase):
    id: int
    curso_id: int
    ejercicios: List[EjercicioResponse] = []
    preguntas: List[PreguntaResponse] = []

    model_config = ConfigDict(from_attributes=True)

# ESQUEMAS PARA CURSOS
class CourseBase(BaseModel):
    titulo: str
    descripcion: str
    imagen: str
    examen: str

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int
    modulos: List[ModuleResponse] = []

    model_config = ConfigDict(from_attributes=True)

# ESQUEMAS DE LECTURA PARA EL ESTUDIANTE (catálogo y detalle)
# No anidan ejercicios ni preguntas: nunca exponen solucion_esperada ni es_correcta
class ModuloResumen(BaseModel):
    id: int
    titulo: str
    orden: int
    tipo_modulo: TipoModulo
    contenido_texto: str
    recurso_url: Optional[str] = None
    total_ejercicios: int
    total_preguntas: int

    model_config = ConfigDict(from_attributes=True)

class CursoResumen(BaseModel):
    id: int
    titulo: str
    descripcion: str
    imagen: str
    total_modulos: int
    total_ejercicios: int
    total_preguntas: int

    model_config = ConfigDict(from_attributes=True)

class CursoDetalle(CursoResumen):
    modulos: List[ModuloResumen] = []