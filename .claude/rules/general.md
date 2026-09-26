# Reglas generales del proyecto

- **Idioma:** código, nombres de variables/funciones, comentarios, rutas de la API, mensajes de error y textos de UI se escriben en español (sin traducir los nombres existentes como `Course`/`Module`, que ya están en inglés).
- **Base de datos en Supabase:** no reactives `Base.metadata.create_all` en `api/main.py` ni crees tablas locales. Los cambios de esquema se aplican a Supabase de forma explícita (p. ej. con `crear_tablas.py`), nunca al arrancar la API.
- **Sin tablas duplicadas:** todo el dominio de cursos y exámenes (`Course`, `Module`, `Ejercicio`, `Pregunta`, `Opcion`) vive en `api/models/course.py`. No crees `api/models/questions.py` ni modelos alternativos para lo mismo.
- **Secretos:** credenciales y URLs de conexión solo en `.env` (ignorado por git). La API lee `DATABASE_URL`; no codifiques cadenas de conexión.
- **Contrato frontend ↔ backend:** si cambias un campo en un modelo o schema, busca y actualiza su uso en `frontOri/src` (las interfaces TypeScript están declaradas dentro de cada componente).
- **La documentación puede estar desfasada:** antes de apoyarte en algo que dicen `AGENTS.md` o `README.md` (JWT, validaciones, endpoints), verifica que exista en el código. La sección "Estado real vs. documentación" de `CLAUDE.md` lista lo que falta.
