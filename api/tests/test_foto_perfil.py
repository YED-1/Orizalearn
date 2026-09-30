# Pruebas de la foto de perfil (/usuarios/yo/foto)
import pytest

from models.user import FotoPerfil
from routers import usuarios as router_usuarios

URL = "/usuarios/yo/foto"

# Solo importan los primeros bytes: el tipo se detecta por ellos
JPEG = bytes([0xFF, 0xD8, 0xFF, 0xE0]) + b"contenido-jpeg"
PNG = bytes([0x89]) + b"PNG" + bytes([0x0D, 0x0A, 0x1A, 0x0A]) + b"contenido-png"
WEBP = b"RIFF" + bytes(4) + b"WEBP" + b"contenido-webp"


@pytest.fixture
def cabeceras(cliente, datos_registro):
    assert cliente.post("/auth/register", json=datos_registro).status_code == 201
    r = cliente.post("/auth/login", json={"email": datos_registro["email"], "password": datos_registro["password"]})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def subir(cliente, cabeceras, datos, tipo="image/jpeg"):
    return cliente.put(URL, headers={**cabeceras, "Content-Type": tipo}, content=datos)


def test_sin_foto_devuelve_204(cliente, cabeceras):
    r = cliente.get(URL, headers=cabeceras)

    assert r.status_code == 204
    assert r.content == b""


@pytest.mark.parametrize("datos, tipo", [(JPEG, "image/jpeg"), (PNG, "image/png"), (WEBP, "image/webp")])
def test_subir_y_ver_foto(cliente, cabeceras, datos, tipo):
    r = subir(cliente, cabeceras, datos)

    assert r.status_code == 200
    assert r.json() == {"mensaje": "Foto de perfil actualizada."}
    foto = cliente.get(URL, headers=cabeceras)
    assert foto.status_code == 200
    assert foto.content == datos
    assert foto.headers["content-type"] == tipo
    assert foto.headers["x-content-type-options"] == "nosniff"


def test_subir_otra_foto_la_reemplaza(cliente, db, cabeceras):
    subir(cliente, cabeceras, JPEG)
    subir(cliente, cabeceras, PNG, "image/png")

    assert db.query(FotoPerfil).count() == 1
    assert cliente.get(URL, headers=cabeceras).content == PNG


def test_el_tipo_se_detecta_por_los_bytes_y_no_por_la_cabecera(cliente, cabeceras):
    subir(cliente, cabeceras, PNG, tipo="image/jpeg")

    assert cliente.get(URL, headers=cabeceras).headers["content-type"] == "image/png"


@pytest.mark.parametrize("datos, mensaje", [
    (b"", "No se recibió ninguna foto."),
    (b"GIF89a-no-permitido", "La foto debe ser una imagen JPG, PNG o WEBP."),
    (b"<svg onload='alert(1)'></svg>", "La foto debe ser una imagen JPG, PNG o WEBP."),
])
def test_rechaza_archivos_que_no_son_foto(cliente, db, cabeceras, datos, mensaje):
    r = subir(cliente, cabeceras, datos)

    assert r.status_code == 400
    assert r.json() == {"detail": mensaje}
    assert db.query(FotoPerfil).count() == 0


def test_rechaza_fotos_demasiado_grandes(cliente, db, cabeceras, monkeypatch):
    monkeypatch.setattr(router_usuarios, "TAMANO_MAXIMO_FOTO", 10)

    r = subir(cliente, cabeceras, JPEG)

    assert r.status_code == 413
    assert r.json() == {"detail": "La foto no puede superar los 2 MB."}
    assert db.query(FotoPerfil).count() == 0


def test_quitar_foto(cliente, db, cabeceras):
    subir(cliente, cabeceras, JPEG)

    r = cliente.delete(URL, headers=cabeceras)

    assert r.status_code == 204
    assert db.query(FotoPerfil).count() == 0
    assert cliente.get(URL, headers=cabeceras).status_code == 204


def test_quitar_sin_foto_tambien_devuelve_204(cliente, cabeceras):
    assert cliente.delete(URL, headers=cabeceras).status_code == 204


@pytest.mark.parametrize("metodo", ["get", "put", "delete"])
def test_foto_sin_sesion_devuelve_401(cliente, metodo):
    assert getattr(cliente, metodo)(URL).status_code == 401
