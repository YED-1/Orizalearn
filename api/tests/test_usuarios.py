# Pruebas del login con JWT y de los ajustes de la propia cuenta (/usuarios/yo)
from datetime import datetime, timedelta, timezone

import jwt
import pytest

from models.user import User
from services import auth_service

PASSWORD = "clave-segura-123"


@pytest.fixture
def usuario(cliente, datos_registro):
    r = cliente.post("/auth/register", json=datos_registro)
    assert r.status_code == 201
    return r.json()


def iniciar_sesion(cliente, email="ana@example.com", password=PASSWORD):
    return cliente.post("/auth/login", json={"email": email, "password": password})


@pytest.fixture
def cabeceras(cliente, usuario):
    token = iniciar_sesion(cliente).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


# --- Login y token ---

def test_login_devuelve_token_del_usuario(cliente, usuario):
    r = iniciar_sesion(cliente)

    assert r.status_code == 200
    cuerpo = r.json()
    assert cuerpo["nombre"] == "Ana"
    assert cuerpo["token_type"] == "bearer"
    assert auth_service.leer_token(cuerpo["access_token"]) == usuario["id"]


def test_login_sin_clave_jwt_devuelve_500(cliente, usuario, monkeypatch):
    monkeypatch.delenv("JWT_SECRET")

    r = iniciar_sesion(cliente)

    assert r.status_code == 500
    assert r.json() == {"detail": "No se pudo iniciar sesión. Intenta de nuevo más tarde."}


@pytest.mark.parametrize("cabeceras_invalidas", [
    {},
    {"Authorization": "Bearer no-es-un-token"},
    {"Authorization": "Basic abc"},
])
def test_sin_token_valido_devuelve_401(cliente, usuario, cabeceras_invalidas):
    r = cliente.get("/usuarios/yo", headers=cabeceras_invalidas)

    assert r.status_code == 401
    assert r.json() == {"detail": auth_service.SESION_INVALIDA}


def test_token_expirado_devuelve_401(cliente, usuario):
    vencido = datetime.now(timezone.utc) - timedelta(minutes=1)
    token = jwt.encode({"sub": str(usuario["id"]), "exp": vencido}, "clave-solo-para-pruebas", algorithm="HS256")

    r = cliente.get("/usuarios/yo", headers={"Authorization": f"Bearer {token}"})

    assert r.status_code == 401


def test_token_firmado_con_otra_clave_devuelve_401(cliente, usuario):
    token = jwt.encode({"sub": str(usuario["id"])}, "otra-clave", algorithm="HS256")

    r = cliente.get("/usuarios/yo", headers={"Authorization": f"Bearer {token}"})

    assert r.status_code == 401


def test_usuario_inactivo_devuelve_401(cliente, db, cabeceras):
    db.query(User).update({User.is_active: False})
    db.commit()

    assert cliente.get("/usuarios/yo", headers=cabeceras).status_code == 401


# --- Ver la cuenta ---

def test_ver_mi_cuenta(cliente, cabeceras):
    r = cliente.get("/usuarios/yo", headers=cabeceras)

    assert r.status_code == 200
    cuerpo = r.json()
    assert cuerpo["email"] == "ana@example.com"
    assert cuerpo["apellido"] == "Pérez"
    assert "hashed_password" not in cuerpo


# --- Datos personales ---

def test_actualizar_datos_personales(cliente, db, cabeceras):
    r = cliente.put("/usuarios/yo", headers=cabeceras, json={
        "nombre": "  Ana María ",
        "apellido": "López",
        "fecha_nacimiento": "1999-05-10",
        "genero": "Otro",
    })

    assert r.status_code == 200
    assert r.json()["nombre"] == "Ana María"
    usuario = db.query(User).one()
    assert (usuario.apellido, usuario.genero, str(usuario.fecha_nacimiento)) == ("López", "Otro", "1999-05-10")


def test_actualizar_datos_invalidos_devuelve_422(cliente, cabeceras):
    r = cliente.put("/usuarios/yo", headers=cabeceras, json={
        "nombre": "",
        "apellido": "López",
        "fecha_nacimiento": "1999-05-10",
        "genero": "Otro",
    })

    assert r.status_code == 422
    assert r.json() == {"detail": "El campo 'nombre' debe tener al menos 1 caracteres."}


# --- Correo ---

def test_cambiar_correo(cliente, cabeceras):
    r = cliente.put("/usuarios/yo/correo", headers=cabeceras, json={
        "email": "ana.nueva@example.com", "password_actual": PASSWORD,
    })

    assert r.status_code == 200
    assert r.json()["email"] == "ana.nueva@example.com"
    assert iniciar_sesion(cliente, email="ana.nueva@example.com").status_code == 200


def test_cambiar_correo_con_contrasena_incorrecta_devuelve_400(cliente, cabeceras):
    r = cliente.put("/usuarios/yo/correo", headers=cabeceras, json={
        "email": "ana.nueva@example.com", "password_actual": "incorrecta-123!",
    })

    assert r.status_code == 400
    assert r.json() == {"detail": "La contraseña actual es incorrecta."}


def test_cambiar_a_correo_de_otro_usuario_devuelve_400(cliente, cabeceras, datos_registro):
    cliente.post("/auth/register", json={**datos_registro, "email": "otro@example.com"})

    r = cliente.put("/usuarios/yo/correo", headers=cabeceras, json={
        "email": "otro@example.com", "password_actual": PASSWORD,
    })

    assert r.status_code == 400
    assert r.json() == {"detail": "El correo ya está registrado."}


# --- Contraseña ---

def test_cambiar_contrasena(cliente, cabeceras):
    r = cliente.put("/usuarios/yo/contrasena", headers=cabeceras, json={
        "password_actual": PASSWORD,
        "password": "nueva-clave-456!",
        "confirm_password": "nueva-clave-456!",
    })

    assert r.status_code == 200
    assert iniciar_sesion(cliente).status_code == 401
    assert iniciar_sesion(cliente, password="nueva-clave-456!").status_code == 200


@pytest.mark.parametrize("cambios, mensaje", [
    ({"password_actual": "incorrecta-123!"}, "La contraseña actual es incorrecta."),
    ({"password": PASSWORD, "confirm_password": PASSWORD}, "La nueva contraseña debe ser distinta de la actual."),
])
def test_cambiar_contrasena_rechazada_devuelve_400(cliente, cabeceras, cambios, mensaje):
    datos = {"password_actual": PASSWORD, "password": "nueva-clave-456!", "confirm_password": "nueva-clave-456!"}

    r = cliente.put("/usuarios/yo/contrasena", headers=cabeceras, json={**datos, **cambios})

    assert r.status_code == 400
    assert r.json() == {"detail": mensaje}


@pytest.mark.parametrize("password, confirmacion, mensaje", [
    ("corta-1!", "corta-1!", "La contraseña debe tener al menos 12 caracteres."),
    ("sinsimbolos123", "sinsimbolos123", "La contraseña debe incluir al menos un símbolo (por ejemplo: ! @ # $ % - _)."),
    ("nueva-clave-456!", "otra-clave-456!", "Las contraseñas no coinciden."),
])
def test_cambiar_contrasena_invalida_devuelve_422(cliente, cabeceras, password, confirmacion, mensaje):
    r = cliente.put("/usuarios/yo/contrasena", headers=cabeceras, json={
        "password_actual": PASSWORD, "password": password, "confirm_password": confirmacion,
    })

    assert r.status_code == 422
    assert r.json() == {"detail": mensaje}
