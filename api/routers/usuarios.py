import logging
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
from core.database import get_db
from models.user import FotoPerfil, User
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


# --- Foto de perfil ---
# Se envía como cuerpo binario (Content-Type image/...), sin formularios multipart

TAMANO_MAXIMO_FOTO = 2 * 1024 * 1024

async def leer_foto(request: Request) -> bytes:
    # Se lee por partes para cortar en cuanto supere el límite
    datos = bytearray()
    async for trozo in request.stream():
        datos.extend(trozo)
        if len(datos) > TAMANO_MAXIMO_FOTO:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="La foto no puede superar los 2 MB."
            )
    return bytes(datos)

# El tipo se deduce de los primeros bytes; no se confía en el Content-Type del cliente
def detectar_tipo_imagen(datos: bytes) -> str | None:
    if datos.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if datos.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if len(datos) >= 12 and datos[:4] == b"RIFF" and datos[8:12] == b"WEBP":
        return "image/webp"
    return None

@router.get("/yo/foto")
def obtener_mi_foto(
    usuario: User = Depends(auth_service.obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    foto = db.get(FotoPerfil, usuario.id)
    # 204 en lugar de 404: no tener foto no es un error
    if not foto:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    return Response(
        content=foto.contenido,
        media_type=foto.tipo_mime,
        headers={"Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"},
    )

@router.put("/yo/foto")
def subir_mi_foto(
    usuario: User = Depends(auth_service.obtener_usuario_actual),
    datos: bytes = Depends(leer_foto),
    db: Session = Depends(get_db),
):
    if not datos:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se recibió ninguna foto.")
    tipo = detectar_tipo_imagen(datos)
    if tipo is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La foto debe ser una imagen JPG, PNG o WEBP."
        )

    foto = db.get(FotoPerfil, usuario.id)
    if foto:
        foto.contenido = datos
        foto.tipo_mime = tipo
    else:
        db.add(FotoPerfil(usuario_id=usuario.id, contenido=datos, tipo_mime=tipo))
    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Error de base de datos al guardar la foto de perfil")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=ERROR_GUARDAR)
    return {"mensaje": "Foto de perfil actualizada."}

@router.delete("/yo/foto", status_code=status.HTTP_204_NO_CONTENT)
def quitar_mi_foto(
    usuario: User = Depends(auth_service.obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    foto = db.get(FotoPerfil, usuario.id)
    if foto:
        db.delete(foto)
        try:
            db.commit()
        except SQLAlchemyError:
            db.rollback()
            logger.exception("Error de base de datos al quitar la foto de perfil")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=ERROR_GUARDAR)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
