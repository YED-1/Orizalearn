---
paths:
  - "api/routers/exercises.py"
  - "docker-compose.yml"
---

# Reglas del sandbox de ejecución de código

El endpoint `POST /ejercicios/ejecutar-python` ejecuta código arbitrario de estudiantes. Trátalo como superficie de seguridad.

- **No relajes los límites del contenedor:** imagen `python:3.11-alpine`, `remove=True`, `network_disabled=True`, `mem_limit="50m"`, `cpu_quota=50000`. Si agregas algo, que sea para endurecerlo (timeout, `pids_limit`, usuario no root, sistema de archivos de solo lectura).
- **Nunca ejecutes código del estudiante en el proceso de la API** (`exec`, `eval`, `subprocess`) ni montes volúmenes del host en el contenedor desechable.
- **Respuesta siempre en JSON con `salida` y `errores`:** los fallos del código del estudiante (`docker.errors.ContainerError`) se devuelven como `{"salida": "", "errores": <stderr>}` con status 200, no como excepción.
- **Errores de sistema** (`ImageNotFound`, Docker caído, etc.) se capturan y devuelven `HTTPException(500)` con mensaje amigable; la API nunca debe caerse por un fallo del sandbox.
- El cliente de Docker se obtiene con `obtener_cliente_docker()` (perezoso y cacheado). No vuelvas a llamar a `docker.from_env()` a nivel de módulo: la API debe arrancar aunque Docker no esté disponible.
