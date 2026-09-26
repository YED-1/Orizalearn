# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Lee también `AGENTS.md` (propósito del proyecto, flujo de cursos generados por IA y reglas de negocio). Este archivo añade comandos exactos y el **estado real del código**, que en varios puntos difiere de lo que describen `AGENTS.md` y `README.md`.

Idioma del proyecto: todo el código, comentarios, nombres de rutas y mensajes de UI están en español. Mantén esa convención.

## Comandos

### Frontend (`frontOri/`, React 19 + Vite + TypeScript + Tailwind 3)

```bash
cd frontOri
npm install
npm run dev       # servidor Vite (http://localhost:5173)
npm run build     # tsc -b && vite build  (sirve también como type-check)
npm run lint      # eslint .
```

No hay framework de tests configurado (ni en el frontend ni en el backend).

### Backend (`api/`, FastAPI + SQLAlchemy 2)

```bash
cd api
pip install -r requirements.txt          # ojo: el archivo está codificado en UTF-16
uvicorn main:app --reload --port 8000    # docs interactivas en /docs
```

Hay un virtualenv local en `api/venv/` (ignorado por git). Requiere `DATABASE_URL` (Supabase) en el `.env` de la raíz; `core/database.py` lo carga con `python-dotenv`.

### Scripts de base de datos (ignorados por git, existen solo localmente)

- `crear_tablas.py` (raíz): usa imports `api.core...` / `api.models...` → ejecútalo **desde la raíz**: `python crear_tablas.py`.
- `api/importar_curso.py`: usa imports `core...` / `models...` y abre `curso_python_basico.csv` con ruta relativa al directorio actual → ejecútalo con `PYTHONPATH=api` y desde el directorio donde esté el CSV.

### Docker

`docker compose up --build` levanta `db` (Postgres 15 local en el puerto 5433) y `api`. El frontend no está en el compose. Nota: el compose inyecta `POSTGRES_URL`, pero el código solo lee `DATABASE_URL`, así que la API usa Supabase aunque corra en Docker.

## Arquitectura (lo que no se ve en un solo archivo)

### Backend

- Los imports son relativos a `api/` (`from core.database import get_db`, `from models.course import ...`), por eso uvicorn debe arrancar desde `api/`. Los paquetes no tienen `__init__.py`.
- `main.py` registra solo los routers `auth`, `courses`, `exercises`, `modules` y `questions`. CORS abierto (`*`). La creación automática de tablas está desactivada a propósito (la BD vive en Supabase).
- Modelos: todo el dominio está en `models/course.py` (`Course` → `Module` → `Ejercicio` / `Pregunta` → `Opcion`, con cascada). Tablas con nombres en español: `cursos`, `modulos`, `ejercicios`, `preguntas`, `opciones`; más `users` y `evaluaciones`. `Module.tipo_modulo` (`teoria` | `practica` | `examen`) indica al frontend qué renderizar.
- Schemas duplicados: `schemas/course.py` define versiones anidadas (Course → Modules → Ejercicios/Preguntas) usadas por `GET /cursos/`; `schemas/module.py`, `exercise.py` y `question.py` definen versiones planas usadas por los routers de creación. Al cambiar un campo del modelo, actualiza ambos.
- Endpoints existentes: `/auth/register`, `/auth/login`, `/cursos/`, `/cursos/crear`, `/modulos/crear`, `/modulos/curso/{curso_id}`, `/ejercicios/crear`, `/ejercicios/modulo/{modulo_id}`, `/ejercicios/ejecutar-python` (sandbox Docker), `/preguntas/crear`.
- Sandbox: `routers/exercises.py` ejecuta `docker.from_env()` **al importar el módulo**, así que la API no arranca si Docker no está disponible.

### Frontend

- Rutas en `src/App.tsx`: `/login`, `/registro`, `/dashboard`, `/dashboard/courses`; cualquier otra redirige a `/login`. Los layouts (`AuthLayout`, `DashboardLayout`) envuelven cada página mediante `children`, no con `<Outlet>`.
- Llamadas a la API: URLs codificadas en cada componente, mezclando `fetch` y `axios`, y `localhost` con `127.0.0.1`. No hay cliente HTTP centralizado ni variable de entorno para la URL base.
- Sesión: solo `localStorage.userName` (lo guarda `loginform.tsx`, lo borra el logout de `dashboardlayout.tsx`). No hay rutas protegidas.
- Estilos: Tailwind con la paleta propia `oriza.darkest` / `oriza.header` / `oriza.light` (`tailwind.config.js`); iconos con `lucide-react`. `App.css` es un residuo de la plantilla de Vite.

## Estado real vs. documentación (verificar antes de asumir)

- **JWT no está implementado**: `/auth/login` devuelve solo `{mensaje, nombre}`; `services/auth_service.py` únicamente hace hash/verificación con bcrypt.
- **La contraseña de 12 caracteres no se valida** todavía ni en `signform.tsx` ni en `schemas/user.py` (solo se valida que ambas contraseñas coincidan).
- **`routers/evaluaciones.py` (migración CSV) está roto y no registrado** en `main.py`: importa `from models import Modulo` (no existe; el modelo es `Module`) y usa campos (`numero`, `teoria`, `nivel_bloom`, ...) que no existen en los modelos.
- **`features/evaluations/evaluacionestudiante.tsx` no está enrutado** y llama a endpoints inexistentes (`/courses/1`, `/courses/1/modules`, `/modules/{id}/questions`, `POST /evaluaciones/`) esperando campos (`nombre`, `abreviatura`) que el backend no devuelve.
- `components/dashboard/detallecurso.tsx` está vacío; `MisCursos` es solo un estado vacío estático.
- La barra lateral colapsable del dashboard aún no existe (`dashboardlayout.tsx` tiene ancho fijo `w-64`).
- Pendientes listados en el README: telemetría, verificación de correo, chatbot y calificación automática comparando la salida del sandbox con `solucion_esperada`.
