# Pruebas de los endpoints de lectura GET /cursos/ y GET /cursos/{curso_id}
import pytest

from models.course import Course, Module, Ejercicio, Pregunta, Opcion, TipoModulo


@pytest.fixture
def curso(db):
    # Curso con los módulos insertados fuera de orden para comprobar el ordenamiento
    curso = Course(titulo="Python básico", descripcion="Curso de prueba", imagen="python.png", examen="examen_python")
    curso.modulos = [
        Module(
            titulo="Evaluación: Variables", orden=3, tipo_modulo=TipoModulo.EXAMEN, contenido_texto="Responde",
            preguntas=[
                Pregunta(texto="¿Qué es una variable?", opciones=[
                    Opcion(texto="Un nombre para un valor", es_correcta=True),
                    Opcion(texto="Un bucle", es_correcta=False),
                ]),
                Pregunta(texto="¿Cómo se asigna?", opciones=[Opcion(texto="Con =", es_correcta=True)]),
            ],
        ),
        Module(titulo="Variables", orden=1, tipo_modulo=TipoModulo.TEORIA, contenido_texto="Teoría de variables"),
        Module(
            titulo="Práctica: Variables", orden=2, tipo_modulo=TipoModulo.PRACTICA, contenido_texto="Practica",
            ejercicios=[Ejercicio(instrucciones="Imprime 3", codigo_inicial="x = 3", solucion_esperada="3")],
        ),
    ]
    db.add(curso)
    db.commit()
    db.refresh(curso)
    return curso


CLAVES_PROHIBIDAS = ("es_correcta", "solucion_esperada", "opciones", "ejercicios", "preguntas")


def test_lista_devuelve_resumen_con_totales(cliente, curso):
    r = cliente.get("/cursos/")

    assert r.status_code == 200
    assert r.json() == [{
        "id": curso.id,
        "titulo": "Python básico",
        "descripcion": "Curso de prueba",
        "imagen": "python.png",
        "total_modulos": 3,
        "total_ejercicios": 1,
        "total_preguntas": 2,
    }]


def test_lista_vacia(cliente, db):
    r = cliente.get("/cursos/")

    assert r.status_code == 200
    assert r.json() == []


def test_detalle_devuelve_modulos_en_orden(cliente, curso):
    r = cliente.get(f"/cursos/{curso.id}")

    assert r.status_code == 200
    cuerpo = r.json()
    assert cuerpo["titulo"] == "Python básico"
    assert cuerpo["total_modulos"] == 3
    assert [m["orden"] for m in cuerpo["modulos"]] == [1, 2, 3]
    assert [m["tipo_modulo"] for m in cuerpo["modulos"]] == ["teoria", "practica", "examen"]
    assert [(m["total_ejercicios"], m["total_preguntas"]) for m in cuerpo["modulos"]] == [(0, 0), (1, 0), (0, 2)]
    assert cuerpo["modulos"][0]["contenido_texto"] == "Teoría de variables"


def test_detalle_no_expone_respuestas(cliente, curso):
    texto = cliente.get(f"/cursos/{curso.id}").text + cliente.get("/cursos/").text

    for clave in CLAVES_PROHIBIDAS:
        assert f'"{clave}"' not in texto


def test_detalle_curso_inexistente_devuelve_404(cliente, db):
    r = cliente.get("/cursos/9999")

    assert r.status_code == 404
    assert r.json() == {"detail": "El curso especificado no existe"}
