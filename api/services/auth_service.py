# Script para autenticar al usuario registrado, agregando un algoritmo de hashing

import logging
import os
from datetime import datetime, timedelta, timezone
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from core.database import get_db
from models.user import User 
from schemas.user import UserCreate 

logger = logging.getLogger(__name__)

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
    
    # Se guardan los cambios en la base de datos; si falla, se deshace la transacción
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except SQLAlchemyError:
        db.rollback()
        raise
    
    return db_user


# --- Sesiones con JWT ---

ALGORITMO_JWT = "HS256"
MINUTOS_EXPIRACION_POR_DEFECTO = 60 * 24

class ErrorConfiguracionJWT(RuntimeError):
    pass

# El .env solo se lee al arrancar: si falta la clave, avisarlo en la consola desde el inicio
if not os.getenv("JWT_SECRET"):
    logger.warning("Falta JWT_SECRET en el .env: el inicio de sesión fallará hasta definirla y reiniciar la API.")

# La clave se lee del .env en cada uso, para que las pruebas puedan fijarla
def _clave_jwt() -> str:
    clave = os.getenv("JWT_SECRET")
    if not clave:
        raise ErrorConfiguracionJWT("Falta la variable JWT_SECRET en el .env")
    return clave

def crear_token(usuario_id: int) -> str:
    minutos = int(os.getenv("JWT_MINUTOS_EXPIRACION", MINUTOS_EXPIRACION_POR_DEFECTO))
    ahora = datetime.now(timezone.utc)
    datos = {"sub": str(usuario_id), "iat": ahora, "exp": ahora + timedelta(minutes=minutos)}
    return jwt.encode(datos, _clave_jwt(), algorithm=ALGORITMO_JWT)

# Devuelve el id del usuario del token, o None si el token no es válido o expiró
def leer_token(token: str) -> int | None:
    try:
        datos = jwt.decode(token, _clave_jwt(), algorithms=[ALGORITMO_JWT])
        return int(datos["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        return None

# auto_error=False para responder nosotros con 401 y mensaje en español
esquema_bearer = HTTPBearer(auto_error=False)

SESION_INVALIDA = "Tu sesión expiró o no es válida. Inicia sesión de nuevo."

# Dependencia para los endpoints protegidos: devuelve el usuario dueño del token
def obtener_usuario_actual(
    credenciales: HTTPAuthorizationCredentials | None = Depends(esquema_bearer),
    db: Session = Depends(get_db),
) -> User:
    no_autorizado = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=SESION_INVALIDA,
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credenciales is None:
        raise no_autorizado
    try:
        usuario_id = leer_token(credenciales.credentials)
    except ErrorConfiguracionJWT:
        logger.exception("No se pudo verificar el token de sesión")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo verificar tu sesión. Intenta de nuevo más tarde.",
        )
    if usuario_id is None:
        raise no_autorizado
    usuario = db.query(User).filter(User.id == usuario_id).first()
    if not usuario or usuario.is_active is False:
        raise no_autorizado
    return usuario
