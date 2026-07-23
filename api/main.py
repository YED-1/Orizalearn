from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth
from routers import courses
from routers import exercises
from core.database import engine, Base
from models.user import User
from models.course import Course


# Crea las tablas en la base de datos (si no existen)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Oriza LMS API", version='0.1.0') 

# Registramos el router en la aplicación
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(exercises.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción cambia esto por la URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Oriza"}
