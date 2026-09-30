import { api } from "./api";
import { obtenerToken, suscribirSesion } from "./sesion";

// Foto de perfil compartida por la barra superior, la tarjeta de perfil y Ajustes.
// Vive solo en memoria (URL de objeto), nunca en localStorage.
let urlFoto: string | null = null;
let tokenDeLaFoto: string | null = null;
let cargaEnCurso: Promise<void> | null = null;
// Sube con cada cambio hecho por el usuario, para descartar cargas que llegan tarde
let version = 0;
const oyentes = new Set<() => void>();

function reemplazar(nuevaUrl: string | null) {
  if (urlFoto) URL.revokeObjectURL(urlFoto);
  urlFoto = nuevaUrl;
  oyentes.forEach((alCambiar) => alCambiar());
}

// Al cerrar sesión o entrar con otra cuenta se olvida la foto anterior
suscribirSesion(() => {
  if (obtenerToken() !== tokenDeLaFoto) {
    tokenDeLaFoto = null;
    cargaEnCurso = null;
    version++;
    if (urlFoto) reemplazar(null);
  }
});

// Para useSyncExternalStore
export function suscribirFoto(alCambiar: () => void) {
  oyentes.add(alCambiar);
  return () => {
    oyentes.delete(alCambiar);
  };
}

export function obtenerFoto(): string | null {
  return urlFoto;
}

// Descarga la foto una sola vez por sesión; si no hay foto, la API responde 204
export function cargarFoto(): Promise<void> {
  const token = obtenerToken();
  if (!token) return Promise.resolve();
  if (tokenDeLaFoto === token && cargaEnCurso) return cargaEnCurso;

  tokenDeLaFoto = token;
  const versionAlPedir = version;
  cargaEnCurso = api
    .get<Blob>("/usuarios/yo/foto", { responseType: "blob" })
    .then((res) => {
      if (version !== versionAlPedir || obtenerToken() !== token) return;
      reemplazar(
        res.status === 200 && res.data.size > 0
          ? URL.createObjectURL(res.data)
          : null,
      );
    })
    .catch(() => {
      // Sin foto visible; se reintenta la próxima vez que se pida
      cargaEnCurso = null;
    });
  return cargaEnCurso;
}

export async function subirFoto(foto: Blob) {
  await api.put("/usuarios/yo/foto", foto, {
    headers: { "Content-Type": foto.type || "image/jpeg" },
  });
  version++;
  reemplazar(URL.createObjectURL(foto));
}

export async function quitarFoto() {
  await api.delete("/usuarios/yo/foto");
  version++;
  reemplazar(null);
}
