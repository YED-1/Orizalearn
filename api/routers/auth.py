from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.user import UserCreate, UserResponse, UserLogin
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

@router.post("/login")
def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    # Busca al usuario por su correo
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    # Si el correo no existe en la base de datos
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El usuario no existe."
        )
    
    # 2. Verificamos que la contraseña coincida
    if not auth_service.verify_password(user_credentials.password, user.hashed_password): #Usa la contraseña ya hasheada
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta."
        )
    
    # Si todo está bien, le mandamos el nombre al frontend para el localStorage
    return {
        "mensaje": "Login exitoso", 
        "nombre": user.nombre 
    }