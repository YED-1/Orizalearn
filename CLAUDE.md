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

El frontend no tiene framework de tests.

### Backend (`api/`, FastAPI + SQLAlchemy 2)

```bash
cd api
pip install -r requirements.txt          # ojo: el archivo está codificado en UTF-16
uvicorn main:app --reload --port 8000    # docs interactivas en /docs

pip install -r requirements-dev.txt      # pytest (solo desarrollo)
python -m pytest                         # todas las pruebas (api/tests/)
python -m pytest tests/test_registro.py::test_correo_duplicado_devuelve_400   # una sola
```

Las pruebas (`api/tests/`) sustituyen `get_db` por una SQLite en memoria (`conftest.py`) y fijan un `DATABASE_URL` ficticio: nunca tocan Supabase. Si un modelo nuevo necesita tablas en las pruebas, créalas en la fixture `db`.

Hay un virtualenv local en `api/venv/` (ignorado por git). Requiere `DATABASE_URL` (Supabase) y `JWT_SECRET` (clave de las sesiones; opcional `JWT_MINUTOS_EXPIRACION`, 1440 por defecto) en el `.env` de la raíz; `core/database.py` lo carga con `python-dotenv`. Sin `JWT_SECRET` el login responde 500.

### Scripts de base de datos (ignorados por git, existen solo localmente)

- `crear_tablas.py` (raíz): usa imports `api.core...` / `api.models...` → ejecútalo **desde la raíz**: `python crear_tablas.py`.
- `api/importar_curso.py`: usa imports `core...` / `models...` → ejecútalo **desde `api/`**: `python importar_curso.py [ruta.csv]` (por defecto `api/curso_python_basico.csv`). Valida todo el CSV antes de insertar, inserta el curso en una sola transacción y se niega a importar si ya existe un curso con el mismo título. `importar_curso(db, ruta)` recibe la sesión, así que se puede probar con SQLite. Formato del CSV en `.claude/rules/ingesta-cursos.md`.
- `api/curso_python_basico.csv`: curso introductorio (8 temas × teoría/práctica/evaluación = 24 módulos, 16 ejercicios, 40 preguntas).

### Docker

`docker compose up --build` levanta solo `api` (la BD es Supabase vía `DATABASE_URL`; no hay Postgres local). El frontend no está en el compose. `env_file` se lee al **crear** el contenedor: tras editar `.env` usa `docker compose up -d --force-recreate`. El contenedor y el uvicorn local comparten el puerto 8000: no los corras a la vez.

## Arquitectura (lo que no se ve en un solo archivo)

### Backend

- Los imports son relativos a `api/` (`from core.database import get_db`, `from models.course import ...`), por eso uvicorn debe arrancar desde `api/`. Los paquetes no tienen `__init__.py`.
- `main.py` registra solo los routers `auth`, `courses`, `exercises`, `modules`, `questions` y `usuarios`. CORS abierto (`*`). La creación automática de tablas está desactivada a propósito (la BD vive en Supabase).
- Modelos: todo el dominio está en `models/course.py` (`Course` → `Module` → `Ejercicio` / `Pregunta` → `Opcion`, con cascada). Tablas con nombres en español: `cursos`, `modulos`, `ejercicios`, `preguntas`, `opciones`; más `users`, `fotos_perfil` (`FotoPerfil` en `models/user.py`: una foto por usuario guardada como bytes, en tabla aparte para no alterar `users`) y `evaluaciones`. `Module.tipo_modulo` (`teoria` | `practica` | `examen`) indica al frontend qué renderizar.
- Schemas duplicados: `schemas/course.py` define versiones anidadas (Course → Modules → Ejercicios/Preguntas, usadas por `POST /cursos/crear`) y las de lectura del estudiante `CursoResumen` / `CursoDetalle` / `ModuloResumen` (solo totales, sin `solucion_esperada` ni `es_correcta`); `schemas/module.py`, `exercise.py` y `question.py` definen versiones planas usadas por los routers de creación. Al cambiar un campo del modelo, actualiza ambos.
- Endpoints existentes: `/auth/register`, `/auth/login`, `GET /cursos/` (catálogo: `CursoResumen`), `GET /cursos/{curso_id}` (detalle con temario ordenado: `CursoDetalle`), `/cursos/crear`, `/modulos/crear`, `/modulos/curso/{curso_id}`, `/ejercicios/crear`, `/ejercicios/modulo/{modulo_id}`, `/ejercicios/ejecutar-python` (sandbox Docker), `/preguntas/crear`, y los protegidos con token `GET`/`PUT /usuarios/yo`, `PUT /usuarios/yo/correo` y `PUT /usuarios/yo/contrasena` (estos dos piden `password_actual`; si es incorrecta responden 400, no 401, para no cerrar la sesión), y `GET`/`PUT`/`DELETE /usuarios/yo/foto`: la foto viaja como cuerpo binario (no hay `python-multipart`), máximo 2 MB, el tipo (JPG/PNG/WEBP) se detecta por los bytes y `GET` responde 204 si no hay foto.
- Sesiones: `services/auth_service.py` emite (`crear_token`) y verifica (`leer_token`) el JWT (HS256, `sub` = id del usuario) y expone la dependencia `obtener_usuario_actual` para endpoints protegidos (401 en español si falta, expiró o el usuario está inactivo). Las pruebas fijan `JWT_SECRET` en `conftest.py`.
- Sandbox: `routers/exercises.py` crea el cliente con `obtener_cliente_docker()` en el primer uso; si Docker no está disponible, la API arranca igual y el endpoint responde 500 con mensaje amigable.
- Errores de validación: `main.py` convierte los 422 de FastAPI en `{"detail": "<texto en español>"}` (`traducir_error_validacion`), porque el frontend muestra `data.detail` tal cual. Los mensajes de validadores propios (`ValueError`) se muestran sin cambios.

### Frontend

- Rutas en `src/App.tsx`: `/` (landing), `/login`, `/registro`, `/dashboard` (catálogo), `/dashboard/courses` (Mis cursos), `/dashboard/cursos/:cursoId` (detalle), `/dashboard/ajustes` (`settings.tsx`: foto, datos personales, correo y contraseña); cualquier otra redirige a `/`. Los layouts (`AuthLayout`, `DashboardLayout`) envuelven cada página mediante `children`, no con `<Outlet>`.
- Llamadas a la API: el código nuevo usa el cliente centralizado `src/lib/api.ts` (`api`, instancia de axios con la URL base, y `obtenerMensajeError` para leer `detail`). `loginform.tsx`, `signform.tsx` y `evaluacionestudiante.tsx` aún usan `fetch` con URLs codificadas.
- Sesión: `src/lib/sesion.ts` guarda `token` y `userName` en `localStorage` (`guardarSesion` en el login, `cerrarSesion` en el logout) y avisa los cambios para `useSyncExternalStore`. `api.ts` adjunta el token y, ante un 401 de una petición con token, cierra la sesión y lleva a `/login`. `DashboardLayout` redirige a `/login` si no hay token. La regla de contraseña del cliente está en `src/lib/validaciones.ts`. El icono de usuario abre la tarjeta de perfil `menuperfil.tsx` (datos de `GET /usuarios/yo`) con el botón "Ajustes". La foto de perfil se comparte en memoria con `src/lib/fotoperfil.ts` (se descarga una vez por sesión y se olvida al cambiar de sesión) y se muestra con `components/avatar.tsx`; `src/lib/imagen.ts` la recorta a 256×256 en JPG antes de subirla.
- Estilos: Tailwind con la paleta propia "Amanecer" (`tailwind.config.js`): `oriza-crema` (fondo), `oriza-tinta` (texto), `oriza-coral`, `oriza-sol`, `oriza-menta` y `oriza-lila`, con variantes `-suave` / `-fuerte`. Tipografía Nunito (Google Fonts, cargada en `index.html`). Iconos con `lucide-react`. `App.css` es un residuo de la plantilla de Vite.

## Estado real vs. documentación (verificar antes de asumir)

- **`routers/evaluaciones.py` (migración CSV) está roto y no registrado** en `main.py`: importa `from models import Modulo` (no existe; el modelo es `Module`) y usa campos (`numero`, `teoria`, `nivel_bloom`, ...) que no existen en los modelos.
- **`features/evaluations/evaluacionestudiante.tsx` no está enrutado** y llama a endpoints inexistentes (`/courses/1`, `/courses/1/modules`, `/modules/{id}/questions`, `POST /evaluaciones/`) esperando campos (`nombre`, `abreviatura`) que el backend no devuelve.
- `MisCursos` es solo un estado vacío estático (no hay inscripciones). En el detalle del curso, "Empezar curso" está deshabilitado ("Próximamente") hasta que exista el visor de módulos.
- La barra lateral colapsable del dashboard aún no existe (`dashboardlayout.tsx` tiene ancho fijo `w-64`).
- Pendientes listados en el README: telemetría, verificación de correo, chatbot y calificación automática comparando la salida del sandbox con `solucion_esperada`.
