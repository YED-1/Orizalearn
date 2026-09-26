---
paths:
  - "api/**/*.py"
---

# Reglas del backend (FastAPI + SQLAlchemy)

- **Imports relativos a `api/`:** usa `from core.database import get_db`, `from models.course import Module`, `from schemas.x import ...`. Nunca `from api.core...` dentro de `api/` (solo `crear_tablas.py`, en la raíz, usa ese estilo).
- **Routers nuevos:** crea el archivo en `api/routers/` con `APIRouter(prefix="/<recurso_en_español>", tags=[...])` y **regístralo en `api/main.py`** con `app.include_router(...)`; si no, el endpoint no existe.
- **Sesión de BD:** obtén la sesión siempre con `db: Session = Depends(get_db)`. Patrón de escritura existente: `db.add(obj)` → `db.commit()` → `db.refresh(obj)`. Para crear un padre con hijos en una sola transacción usa `db.flush()` para obtener el id antes del `commit` (ver `routers/questions.py`).
- **Validación de existencia:** antes de crear un hijo (módulo, ejercicio, pregunta) comprueba que el padre exista y responde `HTTPException(404, detail="El ... especificado no existe")`.
- **Errores:** usa `HTTPException` con `detail` en español; el frontend muestra `data.detail` directamente al usuario.
- **Schemas Pydantic v2:** los de respuesta necesitan `from_attributes=True` (`model_config = ConfigDict(from_attributes=True)` en código nuevo). Convierte entrada a modelo con `Modelo(**schema.model_dump())`.
- **Schemas duplicados:** un cambio de campo en `models/course.py` debe reflejarse en `schemas/course.py` (versiones anidadas para `GET /cursos/`) **y** en el schema plano correspondiente (`module.py`, `exercise.py`, `question.py`).
- **Nunca expongas `hashed_password`** ni la bandera `es_correcta` de las opciones en endpoints que consume el estudiante al rendir un examen.
