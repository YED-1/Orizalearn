from fastapi import FastAPI
from routers import auth
from core.database import engine, Base
from models.user import User

# Crea las tablas en la base de datos (si no existen)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Oriza LMS API") 

# Registramos el router en la aplicación
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Oriza"}
