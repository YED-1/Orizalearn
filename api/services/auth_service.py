# Script para autenticar al usuario registrado, agregando un algoritmo de hashing

from passlib.context import CryptContext
from sqlalchemy.orm import Session
from models.user import User 
from schemas.user import UserCreate 

# Configuramos bcrypt como nuestro algoritmo de hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Agarra la contraseña y la devuelve en hash seguro
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Verifica si la contraseña ingresada coincide con el hash guardado en la BD.
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Crea un nuevo usuario en la base de datos con la contraseña encriptada.
def create_user(db: Session, user: UserCreate):
    # Encripta la contraseña que viene del frontend
    hashed_password = get_password_hash(user.password)
    
    # se convierte el esquema de Pydantic al modelo de SQLAlchemy.
    db_user = User(

        nombre=user.nombre,
        apellido=user.apellido,
        email=user.email,
        hashed_password=hashed_password,
        fecha_nacimiento=user.fecha_nacimiento,
        genero=user.genero,
        cursos=0,
        score=0.0
        
    )
    
    # Se guardamn los cambios en la base de datos
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user