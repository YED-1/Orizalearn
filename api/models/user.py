# Creación de tabla para definir como se guardará la información en PostgreSQL
from sqlalchemy import Column, Integer, String, Boolean, Date, Float, ForeignKey, LargeBinary, DateTime
from sqlalchemy.sql import func
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    genero = Column(String(30), nullable=False)
    cursos = Column(Integer, nullable=False)
    score = Column(Float(10), nullable=False)
    hashed_password = Column(String(255), nullable=False) #No ponemos la doble contraseña ya que guarda la contraseña final hasheada
    # si quieres suspender a un usuario
    is_active = Column(Boolean, default=True)

# Foto de perfil en su propia tabla para no alterar users; una por usuario
class FotoPerfil(Base):
    __tablename__ = "fotos_perfil"

    usuario_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    contenido = Column(LargeBinary, nullable=False)
    tipo_mime = Column(String(20), nullable=False)  # detectado por los bytes, no por lo que diga el cliente
    actualizada = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
