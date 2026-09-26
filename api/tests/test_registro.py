# Pruebas del endpoint POST /auth/register
import pytest
from sqlalchemy.exc import IntegrityError, OperationalError

from models.user import User
from routers import auth as router_auth
from schemas.user import UserCreate
from services import auth_service

URL = "/auth/register"


def registrar(cliente, datos, **cambios):
    return cliente.post(URL, json={**datos, **cambios})


# --- Registros válidos ---

def test_registro_valido_crea_usuario(cliente, db, datos_registro):
    r = registrar(cliente, datos_registro)

    assert r.status_code == 201
    cuerpo = r.json()
    assert cuerpo["email"] == "ana@example.com"
    assert cuerpo["cursos"] == 0
    assert cuerpo["score"] == 0.0
    assert "password" not in cuerpo
    assert "hashed_password" not in cuerpo

    usuario = db.query(User).filter(User.email == "ana@example.com").one()
    assert usuario.hashed_password != datos_registro["password"]
    assert auth_service.verify_password(datos_registro["password"], usuario.hashed_password)


@pytest.mark.parametrize("genero", ["Masculino", "Femenino", "Otro", "Prefiero no decirlo"])
def test_acepta_todas_las_opciones_de_genero(cliente, datos_registro, genero):
    r = registrar(cliente, datos_registro, genero=genero)
    assert r.status_code == 201
    assert r.json()["genero"] == genero


def test_quita_espacios_del_nombre(cliente, datos_registro):
    r = registrar(cliente, datos_registro, nombre="  Ana  ", apellido=" Pérez ")
    assert r.status_code == 201
    assert r.json()["nombre"] == "Ana"
    assert r.json()["apellido"] == "Pérez"


@pytest.mark.parametrize("password", ["clave segura 1!", "Contraseña#2026", "abcdefghijk.", "____________"])
def test_acepta_contrasenas_con_simbolo(cliente, datos_registro, password):
    r = registrar(cliente, datos_registro, password=password, confirm_password=password)
    assert r.status_code == 201


# --- Correo duplicado ---

def test_correo_duplicado_devuelve_400(cliente, datos_registro):
    assert registrar(cliente, datos_registro).status_code == 201

    r = registrar(cliente, datos_registro)
    assert r.status_code == 400
    assert r.json() == {"detail": "El correo ya está registrado."}


def test_carrera_de_correo_duplicado_devuelve_400(cliente, datos_registro, monkeypatch):
    # Otro registro con el mismo correo se guardó entre la consulta y el commit
    def falla_por_duplicado(db, user):
        raise IntegrityError("INSERT INTO users", {}, Exception("duplicate key"))

    monkeypatch.setattr(router_auth.auth_service, "create_user", falla_por_duplicado)
    r = registrar(cliente, datos_registro)
    assert r.status_code == 400
    assert r.json() == {"detail": "El correo ya está registrado."}


def test_error_de_base_de_datos_devuelve_500_con_mensaje(cliente, datos_registro, monkeypatch):
    def falla_conexion(db, user):
        raise OperationalError("INSERT INTO users", {}, Exception("conexión perdida"))

    monkeypatch.setattr(router_auth.auth_service, "create_user", falla_conexion)
    r = registrar(cliente, datos_registro)
    assert r.status_code == 500
    assert r.json() == {"detail": "No se pudo registrar el usuario. Intenta de nuevo más tarde."}


def test_servicio_hace_rollback_si_falla_el_commit(db, datos_registro):
    usuario = UserCreate(**datos_registro)
    auth_service.create_user(db=db, user=usuario)

    with pytest.raises(IntegrityError):
        auth_service.create_user(db=db, user=usuario)

    # Tras el rollback la sesión sigue utilizable
    assert db.query(User).count() == 1


# --- Validación de la contraseña ---

@pytest.mark.parametrize(
    ("password", "mensaje"),
    [
        ("corta-1!", "La contraseña debe tener al menos 12 caracteres."),
        ("sinsimbolo1234", "La contraseña debe incluir al menos un símbolo (por ejemplo: ! @ # $ % - _)."),
        ("solo letras y espacios", "La contraseña debe incluir al menos un símbolo (por ejemplo: ! @ # $ % - _)."),
        ("contraseñalarga", "La contraseña debe incluir al menos un símbolo (por ejemplo: ! @ # $ % - _)."),
        ("a!" * 37, "La contraseña no puede superar los 72 caracteres."),
    ],
)
def test_rechaza_contrasenas_invalidas(cliente, datos_registro, password, mensaje):
    r = registrar(cliente, datos_registro, password=password, confirm_password=password)
    assert r.status_code == 422
    assert r.json() == {"detail": mensaje}


def test_rechaza_contrasenas_que_no_coinciden(cliente, datos_registro):
    r = registrar(cliente, datos_registro, confirm_password="otra-clave-123")
    assert r.status_code == 422
    assert r.json() == {"detail": "Las contraseñas no coinciden."}


# --- Validación del resto de campos ---

@pytest.mark.parametrize(
    ("cambios", "mensaje"),
    [
        ({"genero": "xyz"}, "El valor del campo 'genero' no es una opción válida."),
        ({"nombre": "a" * 51}, "El campo 'nombre' no puede superar los 50 caracteres."),
        ({"apellido": "   "}, "El campo 'apellido' debe tener al menos 1 caracteres."),
        ({"email": "no-es-correo"}, "El correo electrónico no es válido."),
        ({"email": "a" * 60 + "@" + "b" * 40 + ".com"}, "El campo 'email' no puede superar los 100 caracteres."),
        ({"fecha_nacimiento": "31-12-2000"}, "La fecha del campo 'fecha_nacimiento' no es válida."),
    ],
)
def test_rechaza_campos_invalidos(cliente, datos_registro, cambios, mensaje):
    r = registrar(cliente, datos_registro, **cambios)
    assert r.status_code == 422
    assert r.json() == {"detail": mensaje}


def test_rechaza_campo_faltante(cliente, datos_registro):
    datos = {k: v for k, v in datos_registro.items() if k != "genero"}
    r = cliente.post(URL, json=datos)
    assert r.status_code == 422
    assert r.json() == {"detail": "Falta el campo 'genero'."}


def test_datos_invalidos_no_guardan_nada(cliente, db, datos_registro):
    registrar(cliente, datos_registro, password="corta")
    assert db.query(User).count() == 0
