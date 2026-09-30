import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
from core.database import get_db
from models.user import User
from schemas.user import UserResponse, UsuarioActualizar, CambioCorreo, CambioContrasena
from services import auth_service

logger = logging.getLogger(__name__)

# Cada usuario solo puede ver y editar su propia cuenta: todo cuelga de /usuarios/yo
router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

ERROR_GUARDAR = "No se pudieron guardar los cambios. Intenta de nuevo más tarde."

def _verificar_password_actual(usuario: User, password_actual: str):
    # 400 y no 401: un 401 cerraría la sesión en el frontend
    if not auth_service.verify_password(password_actual, usuario.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña actual es incorrecta."
        )

def _guardar(db: Session, usuario: User) -> User:
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # La única restricción única de users es el correo
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado."
        )
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Error de base de datos al actualizar al usuario")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=ERROR_GUARDAR)
    db.refresh(usuario)
    return usuario

@router.get("/yo", response_model=UserResponse)
def obtener_mi_cuenta(usuario: User = Depends(auth_service.obtener_usuario_actual)):
    return usuario

@router.put("/yo", response_model=UserResponse)
def actualizar_mi_cuenta(
    datos: UsuarioActualizar,
    usuario: User = Depends(auth_service.obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    for campo, valor in datos.model_dump().items():
        setattr(usuario, campo, valor)
    return _guardar(db, usuario)

@router.put("/yo/correo", response_model=UserResponse)
def cambiar_mi_correo(
    datos: CambioCorreo,
    usuario: User = Depends(auth_service.obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    _verificar_password_actual(usuario, datos.password_actual)
    if datos.email == usuario.email:
        return usuario
    if db.query(User).filter(User.email == datos.email, User.id != usuario.id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado."
        )
    usuario.email = datos.email
    return _guardar(db, usuario)

@router.put("/yo/contrasena")
def cambiar_mi_contrasena(
    datos: CambioContrasena,
    usuario: User = Depends(auth_service.obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    _verificar_password_actual(usuario, datos.password_actual)
    if auth_service.verify_password(datos.password, usuario.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La nueva contraseña debe ser distinta de la actual."
        )
    usuario.hashed_password = auth_service.get_password_hash(datos.password)
    _guardar(db, usuario)
    return {"mensaje": "Contraseña actualizada correctamente."}
