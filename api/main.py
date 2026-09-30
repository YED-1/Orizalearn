from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import auth
from routers import courses
from routers import exercises
from routers import modules
from routers import questions
from routers import usuarios

# Se quitó el base metadata para que ya se no se creen nuevas tablas en local, ya migré a supabase

app = FastAPI(title="Oriza LMS API", version='0.1.0') 

# Registramos el router en la aplicación
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(exercises.router)
app.include_router(modules.router)
app.include_router(questions.router)
app.include_router(usuarios.router)

# Configuración CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción cambia esto por la URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Los errores de validación se devuelven como texto en "detail" porque el frontend lo muestra directamente
@app.exception_handler(RequestValidationError)
async def manejar_error_validacion(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": traducir_error_validacion(exc.errors())},
    )

def traducir_error_validacion(errores) -> str:
    if not errores:
        return "Los datos enviados no son válidos."
    error = errores[0]
    tipo = error.get("type", "")
    texto = str(error.get("msg", ""))
    contexto = error.get("ctx") or {}
    campo = next((str(p) for p in reversed(error.get("loc", ())) if isinstance(p, str) and p != "body"), "")

    if tipo == "value_error":
        if texto.startswith("value is not a valid email address"):
            return "El correo electrónico no es válido."
        # Mensajes de nuestros propios validadores, ya en español
        return texto.removeprefix("Value error, ")
    if tipo == "missing":
        return f"Falta el campo '{campo}'."
    if tipo == "string_too_short":
        return f"El campo '{campo}' debe tener al menos {contexto.get('min_length')} caracteres."
    if tipo in ("string_too_long", "too_long"):
        return f"El campo '{campo}' no puede superar los {contexto.get('max_length')} caracteres."
    if tipo == "literal_error":
        return f"El valor del campo '{campo}' no es una opción válida."
    if tipo.startswith("date"):
        return f"La fecha del campo '{campo}' no es válida."
    return f"El campo '{campo}' no es válido." if campo else "Los datos enviados no son válidos."

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Oriza"}
