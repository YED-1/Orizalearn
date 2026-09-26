# Script para validar la estructura exacta de datos de los usuarios

from datetime import date
from typing import Annotated, Literal
from pydantic import BaseModel, ConfigDict, EmailStr, Field, StringConstraints, field_validator, model_validator

# Límites que coinciden con las columnas de la tabla users
Nombre = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=50)]
Correo = Annotated[EmailStr, Field(max_length=100)]
Genero = Literal["Masculino", "Femenino", "Otro", "Prefiero no decirlo"]

# Lo que que necesita el sistema para crear un usuario; Contiene los campos comunes para el registro
class UserBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    fecha_nacimiento: date
    genero: str


# Lo que necesita el sistema para crear un usuario; hereda directamente a UserBase y añade las contraseñas
class UserCreate(UserBase):
    nombre: Nombre
    apellido: Nombre
    email: Correo
    genero: Genero
    password: str
    confirm_password: str

    @field_validator('password')
    @classmethod
    def validar_longitud_password(cls, valor: str) -> str:
        if len(valor) < 12:
            raise ValueError('La contraseña debe tener al menos 12 caracteres.')
        # Un símbolo es cualquier carácter que no sea letra, número ni espacio (p. ej. ! @ # - _ .)
        if not any(not c.isalnum() and not c.isspace() for c in valor):
            raise ValueError('La contraseña debe incluir al menos un símbolo (por ejemplo: ! @ # $ % - _).')
        # bcrypt solo usa los primeros 72 bytes; más allá los ignoraría en silencio
        if len(valor.encode('utf-8')) > 72:
            raise ValueError('La contraseña no puede superar los 72 caracteres.')
        return valor

    @model_validator(mode='after')
    def check_passwords_match(self) -> 'UserCreate':
        if self.password != self.confirm_password:
            raise ValueError('Las contraseñas no coinciden.')
        return self

# Lo que necesita el sistema para loguear al usuario
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Es lo que unicamente se verá en el front
class UserResponse(UserBase):
    id: int
    cursos: int
    score: float

    model_config = ConfigDict(from_attributes=True)
