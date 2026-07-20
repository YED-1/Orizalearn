from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.user import UserCreate, UserResponse
from services import auth_service
from models.user import User

# router con un prefijo para que todas sus rutas empiecen con /auth
router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Valida que el correo no exista ya en la base de datos
    usuario_existente = db.query(User).filter(User.email == user.email).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado."
        )
    
    # Si el correo está libre, llamamos a al servicio para crear y encriptar
    nuevo_usuario = auth_service.create_user(db=db, user=user)
    
    # FastAPI automáticamente filtrará la respuesta usando UserResponse
    return nuevo_usuario