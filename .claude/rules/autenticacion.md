---
paths:
  - "api/routers/auth.py"
  - "api/services/auth_service.py"
  - "api/schemas/user.py"
  - "api/models/user.py"
  - "frontOri/src/components/loginform.tsx"
  - "frontOri/src/components/signform.tsx"
  - "frontOri/src/layouts/**"
---

# Reglas de autenticación y sesión

- **Contraseña mínima de 12 caracteres:** se valida en **ambos lados**: en `signform.tsx` antes de enviar y en `UserCreate` (`schemas/user.py`) con un validador de Pydantic. Mantén también la validación de que `password` y `confirm_password` coincidan.
- **Hash con bcrypt** vía `services/auth_service.py` (`get_password_hash`, `verify_password`). Nunca guardes ni devuelvas la contraseña en texto plano, ni `hashed_password` en una respuesta.
- **JWT (pendiente de implementar):** cuando se agregue, la emisión y verificación viven en `services/auth_service.py`, la clave secreta se lee de `.env` y el token tiene expiración.
- **Ciclo de vida de la sesión en el frontend:** al cerrar sesión o al recibir un 401 / token expirado, limpia **todo** lo que se guardó al iniciar sesión (hoy `localStorage.userName`; el token cuando exista) y redirige a `/login`. Todo lo que se agregue a `localStorage` en el login debe eliminarse en el logout.
