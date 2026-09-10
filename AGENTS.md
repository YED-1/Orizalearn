# Instrucciones para Agentes (AGENTS.md)

Este archivo sirve como referencia rápida y guía de supervivencia para futuros agentes de OpenCode que trabajen en este repositorio. Evita reinventar la rueda y respeta las decisiones de arquitectura existentes.

---

## 1. Propósito del Proyecto

**Orizalearn** es una plataforma educativa tecnológica gratuita. Su objetivo es democratizar el aprendizaje estructurado mediante la generación de cursos completos (módulos, teoría, ejemplos de código, evaluaciones de opción múltiple y ejercicios prácticos) generados de manera automatizada utilizando Inteligencia Artificial (modelos de lenguaje), sin costo para los estudiantes.

---

## 2. Arquitectura General y Orquestación

Es una arquitectura monolítica desacoplada en dos servicios principales:

- **Backend (`api/`):** Construido con **FastAPI** (Python). Expone endpoints REST en el puerto `8000`.
- **Frontend (`frontOri/`):** Construido con **React + Vite + TypeScript + Tailwind CSS**. Se comunica directamente con la API en `http://localhost:8000`.

### Orquestación e Integraciones Críticas:

- **Docker Compose:** El archivo `docker-compose.yml` en la raíz orquesta el backend (`api`), el frontend (`frontOri` de forma opcional o manual), y una base de datos local de soporte (`db` - PostgreSQL).
- **Sandbox de Ejecución Docker:** Para calificar código de programación de forma segura, el backend de la API monta el socket de Docker local `/var/run/docker.sock:/var/run/docker.sock`. El endpoint `/ejercicios/ejecutar-python` arranca contenedores desechables ligeros `python:3.11-alpine` con límites estrictos de CPU y memoria (50MB RAM, sin acceso a red externa) para ejecutar el código provisto de forma aislada.
- **Base de Datos Supabase:** Las tablas e inicialización de datos reales han sido migradas a la nube mediante Supabase. **IMPORTANTE:** Se desactivó el generador de esquemas automático en `api/main.py` para evitar crear tablas locales por error. La conexión utiliza `DATABASE_URL` definida en el entorno.

---

## 3. Estructura del Proyecto

### Backend (`api/`)

- `core/database.py`: Configura SQLAlchemy (`SessionLocal`, `engine`) cargando la URL de base de datos desde variables de entorno.
- `models/`: Modelos declarativos de SQLAlchemy.
  - `course.py`: Contiene los modelos de `Course`, `Module`, `Ejercicio`, `Pregunta` y `Opcion` (todos relacionados en cascada).
  - `user.py`: Modelo `User` para estudiantes.
  - `evaluacion.py`: Tabla intermedia para almacenar intentos de exámenes y calificaciones (`Evaluacion`).
- `schemas/`: Esquemas de validación y serialización de Pydantic (`course.py`, `module.py`, `exercise.py`, `user.py`, `question.py`, `evaluacion.py`).
- `routers/`: Endpoints de la API (`auth.py`, `courses.py`, `modules.py`, `exercises.py`, `questions.py`, `evaluaciones.py`).
- `services/auth_service.py`: Lógica para hash de contraseñas (`bcrypt`) y emisión/verificación de tokens JWT.

### Frontend (`frontOri/`)

- `src/components/`: Componentes comunes reutilizables (`loginform.tsx`, `signform.tsx`, `logo.tsx`).
- `src/layouts/`: Vistas de estructura base (`authlayout.tsx`, `dashboardlayout.tsx`).
- `src/components/dashboard/`: Vistas dinámicas del dashboard del alumno (`miscursos.tsx`, `detallecurso.tsx`, `dasboardhome.tsx`).
- `src/features/evaluations/`: Módulo de cliente para la resolución de cuestionarios interactivos (`evaluacionestudiante.tsx`).

---

## 4. Flujo de Generación de Cursos con IA

Los cursos estructurados y de opción múltiple no se generan bajo demanda interactiva por el backend; se generan de forma masiva/offline mediante canalizaciones externas de IA (LLMs) que exportan a un formato CSV estructurado con separador `;` (punto y coma).

Existen dos vías de ingesta/sincronización de este contenido generado por IA:

1.  **Script de Importación Directa (`api/importar_curso.py`):** Lee un archivo CSV local (como `curso_python_basico.csv`) empleando `pandas` y realiza la inserción relacional directa (Curso ➔ Módulos ➔ Preguntas de Examen ➔ Opciones A/B/C/D con banderas de respuesta correcta) en el motor Supabase.
2.  **Endpoint de Migración de Cursos por CSV (`api/routers/evaluaciones.py`):** El endpoint POST `/api/cursos/{curso_id}/migrar-csv` acepta la subida de un archivo CSV por multipart form-data, parsea dinámicamente las lecciones/teoría junto con sus preguntas y las asocia al ID de curso provisto.

---

## 5. Convenciones del Código y Reglas de Negocio

- **Evitar Tablas Duplicadas:** No vuelvas a crear un archivo `questions` bajo `api/models/` o a importar esquemas alternativos. Todo el modelo de exámenes y evaluación (`Pregunta`, `Opcion`) está centralizado en `api/models/course.py`.
- **Validación de Contraseña:** Las contraseñas en el registro de usuarios (`signform.tsx` y esquemas de Pydantic) deben requerir estrictamente al menos **12 caracteres**.
- **Limpieza de Sesiones JWT:** Manejar adecuadamente el ciclo de vida del Token limpiando el almacenamiento correspondiente al cerrar sesión o expirar el JWT.
- **Barra Lateral Responsiva:** El dashboard debe soportar minimizado de barra lateral: abierta muestra nombre completo y logo; cerrada muestra únicamente el logo.
- **Gestión de Excepciones del Sandbox:** En `api/routers/exercises.py`, maneja adecuadamente excepciones de Docker de nivel sintáctico (`docker.errors.ContainerError`) y de sistema para asegurar que el backend nunca sufra caídas catastróficas y devuelva un JSON amigable con `salida` y `errores`.

---

## 6. Comandos de Desarrollo Clave

### Preparación del Entorno

Instalar dependencias necesarias de python para herramientas de desarrollo desde la carpeta `api/`:

```bash
pip install -r api/requirements.txt
```

### Orquestación Docker

Levantar toda la suite de desarrollo (Base de datos e infraestructura asociada):

```bash
docker compose up --build
```

### Inicialización y Base de Datos (Supabase)

Para crear las tablas de base de datos desde la raíz del proyecto (requiere configurar `DATABASE_URL` en tu `.env`):

```bash
# En Windows (Powershell) desde la raíz del repositorio:
$env:PYTHONPATH="api"; python api/../crear_tablas.py

# En Linux/macOS:
PYTHONPATH=api python crear_tablas.py
```

### Ingesta de Cursos (Ejecución de Script)

```bash
# Desde la raíz, cargando el CSV de Python Básico:
$env:PYTHONPATH="api"; python api/importar_curso.py
```

### Ejecutar Servicios Individuales para Depuración

- **Backend FastAPI (Locales):**
  ```bash
  cd api
  uvicorn main:app --reload --port 8000
  ```
- **Frontend React/Vite:**
  ```bash
  cd frontOri
  npm install
  npm run dev
  ```
