---
paths:
  - "api/importar_curso.py"
  - "api/routers/evaluaciones.py"
  - "**/*.csv"
---

# Reglas de ingesta de cursos generados por IA

- Los cursos se generan fuera de la plataforma y llegan como **CSV separado por `;`** en UTF-8. Léelos con `pd.read_csv(..., sep=';', encoding='utf-8')`.
- Columnas esperadas: `modulo_numero`, `modulo_titulo`, `tipo_modulo` (`teoria` | `practica` | `examen`; si falta la columna, todo es `examen`), `teoria`, `ejemplo_codigo`, `pregunta_reactivo`, `opcion_a`..`opcion_d`, `respuesta_correcta` (letra A–D), `ejercicio_instrucciones`, `ejercicio_codigo_inicial`, `ejercicio_solucion_esperada`, `ejercicio_casos_prueba`, y opcionales `pregunta_nivel_bloom`, `pregunta_texto_base`, `pregunta_enunciado`, `justificacion_docente`, `bibliografia_url`.
- Una fila por pregunta o ejercicio; las columnas de módulo se repiten igual en todas las filas del mismo `modulo_numero`:
  - `teoria`: una sola fila, sin columnas de pregunta ni de ejercicio.
  - `practica`: una fila por ejercicio (solo columnas `ejercicio_*`).
  - `examen`: una fila por pregunta (solo columnas de pregunta).
  - `teoria` es obligatoria en todos los tipos (`contenido_texto` no admite nulos): en práctica y examen lleva una introducción breve.
- Ejercicios: el sandbox ejecuta `python -c` sin entrada estándar → **nunca uses `input()`**; los datos van en variables del código inicial. `ejercicio_solucion_esperada` es la **salida exacta por consola** (sin el salto de línea final), que es lo que comparará la calificación automática.
- Límites de los modelos: `modulo_titulo` ≤ 100 caracteres, cada opción ≤ 255.
- **Mapeo a los modelos reales** (`api/models/course.py`), como hace `importar_curso.py`:
  - `modulo_numero` → `Module.orden`; `modulo_titulo` → `Module.titulo`; `tipo_modulo` → `Module.tipo_modulo`; `teoria` + `ejemplo_codigo` → `Module.contenido_texto`.
  - `pregunta_reactivo` → `Pregunta.texto`.
  - Cada `opcion_x` → una `Opcion`, con `es_correcta = (letra == respuesta_correcta.strip().upper())`.
  - `ejercicio_*` → `Ejercicio` (`instrucciones`, `codigo_inicial`, `solucion_esperada`, `casos_prueba`).
  - Las columnas opcionales no tienen campo en el modelo; no las uses sin antes agregar las columnas al modelo y a Supabase.
- Cada pregunta debe quedar con exactamente una opción correcta; si `respuesta_correcta` no es A–D, rechaza la fila en lugar de insertarla sin respuesta.
- Ante cualquier error, `db.rollback()` y reporta la fila que falló. No dejes cursos a medio importar.
- `routers/evaluaciones.py` usa nombres que no existen (`Modulo`, `numero`, `teoria`, ...). Si lo arreglas, adáptalo al mapeo de arriba y regístralo en `api/main.py`.
