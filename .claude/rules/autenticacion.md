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

- **Contraseña mínima de 12 caracteres y al menos un símbolo** (cualquier carácter que no sea letra, número ni espacio; máximo 72 bytes por bcrypt): se valida en **ambos lados**: en el cliente con `validarPassword` (`src/lib/validaciones.ts`, usada por `signform.tsx` y `settings.tsx`) y en el backend con `validar_password` (`schemas/user.py`, usada por `UserCreate` y `CambioContrasena`). Si cambias la regla, cambia ambos lados, `api/tests/test_registro.py` y `api/tests/test_usuarios.py`. Mantén también la validación de que `password` y `confirm_password` coincidan.
- **Hash con bcrypt** vía `services/auth_service.py` (`get_password_hash`, `verify_password`). Nunca guardes ni devuelvas la contraseña en texto plano, ni `hashed_password` en una respuesta.
- **JWT:** la emisión y verificación viven en `services/auth_service.py` (`crear_token`, `leer_token`, dependencia `obtener_usuario_actual`), la clave secreta se lee de `JWT_SECRET` en `.env` y el token tiene expiración. Los endpoints de la propia cuenta cuelgan de `/usuarios/yo` y nunca reciben un id de usuario en la ruta.
- **Ciclo de vida de la sesión en el frontend:** al cerrar sesión o al recibir un 401 / token expirado, limpia **todo** lo que se guardó al iniciar sesión (`token` y `userName`, gestionados por `src/lib/sesion.ts`) y redirige a `/login`. Todo lo que se agregue a `localStorage` en el login debe eliminarse en el logout.
