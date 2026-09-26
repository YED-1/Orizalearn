---
paths:
  - "api/importar_curso.py"
  - "api/routers/evaluaciones.py"
  - "**/*.csv"
---

# Reglas de ingesta de cursos generados por IA

- Los cursos se generan fuera de la plataforma y llegan como **CSV separado por `;`** en UTF-8. Léelos con `pd.read_csv(..., sep=';', encoding='utf-8')`.
- Columnas esperadas: `modulo_numero`, `modulo_titulo`, `teoria`, `ejemplo_codigo`, `pregunta_reactivo`, `opcion_a`..`opcion_d`, `respuesta_correcta` (letra A–D), y opcionales `pregunta_nivel_bloom`, `pregunta_texto_base`, `pregunta_enunciado`, `justificacion_docente`, `bibliografia_url`.
- **Mapeo a los modelos reales** (`api/models/course.py`), como hace `importar_curso.py`:
  - `modulo_numero` → `Module.orden`; `modulo_titulo` → `Module.titulo`; `teoria` + `ejemplo_codigo` → `Module.contenido_texto`.
  - `pregunta_reactivo` → `Pregunta.texto`.
  - Cada `opcion_x` → una `Opcion`, con `es_correcta = (letra == respuesta_correcta.strip().upper())`.
  - Las columnas opcionales no tienen campo en el modelo; no las uses sin antes agregar las columnas al modelo y a Supabase.
- Cada pregunta debe quedar con exactamente una opción correcta; si `respuesta_correcta` no es A–D, rechaza la fila en lugar de insertarla sin respuesta.
- Ante cualquier error, `db.rollback()` y reporta la fila que falló. No dejes cursos a medio importar.
- `routers/evaluaciones.py` usa nombres que no existen (`Modulo`, `numero`, `teoria`, ...). Si lo arreglas, adáptalo al mapeo de arriba y regístralo en `api/main.py`.
