from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Esto busca y carga automáticamente tu archivo .env
load_dotenv()

# Extraemos la URL de forma segura
SQLALCHEMY_DATABASE_URL = os.getenv("POSTGRES_URL")

# Si por alguna razón no encuentra la variable, lanzará un error
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("No se encontró POSTGRES_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()