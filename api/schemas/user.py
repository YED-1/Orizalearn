# Script para validar la estructura exacta de datos de los usuarios

from pydantic import BaseModel, EmailStr, model_validator
from datetime import date

# Lo que que necesita el sistema para crear un usuario; Contiene los campos comunes para el registro
class UserBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    fecha_nacimiento: date
    genero: str


# Lo que necesita el sistema para crear un usuario; hereda directamente a UserBase y añade las contraseñas
class UserCreate(UserBase):
    password: str
    confirm_password: str  

    @model_validator(mode='after')
    def check_passwords_match(self) -> 'UserCreate':
        if self.password != self.confirm_password:
            raise ValueError('Las contraseñas no coinciden')
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


    class Config:
        from_attributes = True

