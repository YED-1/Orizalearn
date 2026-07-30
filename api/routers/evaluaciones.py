import pandas as pd
from io import BytesIO
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Modulo, Pregunta, Opcion
from core.database import get_db

router = APIRouter()

@router.post("/api/cursos/{curso_id}/migrar-csv")
async def cargar_preguntas_csv(curso_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Validar que sea un archivo CSV
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="El archivo debe tener extensión .csv")

    try:
        # Leer el archivo directamente desde la memoria
        contents = await file.read()
        
        # Uso Pandas para parsear el CSV usando el punto y coma como separador
        df = pd.read_csv(BytesIO(contents), sep=';')
        
        # Se limpian posibles valores nulos (NaN) reemplazándolos por strings vacíos
        df = df.fillna("")

        modulos_creados = 0
        preguntas_insertadas = 0

        # Iterar sobre cada fila del DataFrame
        for _, row in df.iterrows():
            numero_mod = int(row['modulo_numero'])
            
            # GESTIÓN DEL MÓDULO
            # Buscamos si el módulo ya existe para este curso. Si no, lo creamos.
            modulo = db.query(Modulo).filter(
                Modulo.numero == numero_mod, 
                Modulo.curso_id == curso_id
            ).first()
            
            if not modulo:
                modulo = Modulo(
                    curso_id=curso_id,
                    numero=numero_mod,
                    titulo=str(row['modulo_titulo']),
                    teoria=str(row['teoria']),
                    ejemplo_codigo=str(row['ejemplo_codigo'])
                )
                db.add(modulo)
                db.commit()
                db.refresh(modulo)
                modulos_creados += 1

            # CREACIÓN DE LA PREGUNTA 
            pregunta = Pregunta(
                modulo_id=modulo.id,
                nivel_bloom=str(row['pregunta_nivel_bloom']),
                texto_base=str(row['pregunta_texto_base']),
                enunciado=str(row['pregunta_enunciado']),
                reactivo=str(row['pregunta_reactivo']),
                justificacion_docente=str(row['justificacion_docente']),
                bibliografia_url=str(row['bibliografia_url'])
            )
            db.add(pregunta)
            db.commit()
            db.refresh(pregunta)

            # CREACIÓN DE LAS 4 OPCIONES
            # Se Mapean las columnas del CSV con su letra correspondiente
            opciones_data = [
                ("A", str(row['opcion_a'])),
                ("B", str(row['opcion_b'])),
                ("C", str(row['opcion_c'])),
                ("D", str(row['opcion_d']))
            ]

            # Limpia la letra correcta por si trae espacios vacíos
            correcta_letra = str(row['respuesta_correcta']).strip().upper()

            for letra, texto_opcion in opciones_data:
                opcion_db = Opcion(
                    pregunta_id=pregunta.id,
                    texto=texto_opcion,
                    # Evalua si la letra actual es la que el CSV marcó como correcta
                    es_correcta=(letra == correcta_letra) 
                )
                db.add(opcion_db)
            
            # Guardamos las opciones de esta pregunta
            db.commit()
            preguntas_insertadas += 1

        return {
            "estatus": "Éxito",
            "mensaje": "Migración de CSV completada",
            "detalles": {
                "modulos_nuevos": modulos_creados,
                "preguntas_insertadas": preguntas_insertadas
            }
        }

    except Exception as e:
        # Si algo falla (ej. error de tipado o de base de datos), se revierten los cambios
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno al procesar el CSV: {str(e)}")