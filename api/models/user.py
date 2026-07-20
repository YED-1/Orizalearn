# Creación de tabla para definir como se guardará la información en PostgreSQL
from fastapi import FastAPI
from sqlalchemy import Column, Integer, String, Boolean, Date, Float
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    genero = Column(String(10), nullable=False)
    cursos = Column(Integer, nullable=False)
    score = Column(Float(10), nullable=False)
    hashed_password = Column(String(255), nullable=False) #No ponemos la doble contraseña ya que guarda la contraseña final hasheada
    # si quieres suspender a un usuario
    is_active = Column(Boolean, default=True)

app = FastAPI(title="OrizaLearn API")

@app.get("/")
def read_root():
    return {"message": "API de OrizaLearn funcionando y conectada a PostgreSQL"}