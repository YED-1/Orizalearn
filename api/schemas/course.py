from pydantic import BaseModel

# Los datos básicos y obligatorios que el frontend debe enviar
class CourseBase(BaseModel):
    titulo: str
    descripcion: str
    contenido: str
    imagen: str
    examen: str

# Esquema usado para la creación (hereda todo de CourseBase)
class CourseCreate(CourseBase):
    pass

# Esquema usado para devolver los datos al frontend (añade el ID que genera la BD)
class CourseResponse(CourseBase):
    id: int

    class Config:
        from_attributes = True