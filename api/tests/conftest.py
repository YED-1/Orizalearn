# Configuración común de las pruebas: la API usa una base SQLite en memoria y nunca toca Supabase
import os

# Debe definirse antes de importar la app; load_dotenv no sobrescribe variables ya existentes
os.environ["DATABASE_URL"] = "postgresql://pruebas:pruebas@localhost:5432/pruebas"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from core.database import get_db
from main import app
from models.user import User

motor_pruebas = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
SesionPruebas = sessionmaker(autocommit=False, autoflush=False, bind=motor_pruebas)


@pytest.fixture
def db():
    # Solo se crea la tabla users; se borra al terminar cada prueba
    User.__table__.create(bind=motor_pruebas)
    sesion = SesionPruebas()
    try:
        yield sesion
    finally:
        sesion.close()
        User.__table__.drop(bind=motor_pruebas)


@pytest.fixture
def cliente(db):
    def get_db_pruebas():
        yield db

    app.dependency_overrides[get_db] = get_db_pruebas
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def datos_registro():
    return {
        "nombre": "Ana",
        "apellido": "Pérez",
        "email": "ana@example.com",
        "fecha_nacimiento": "2000-01-01",
        "genero": "Femenino",
        "password": "clave-segura-123",
        "confirm_password": "clave-segura-123",
    }
