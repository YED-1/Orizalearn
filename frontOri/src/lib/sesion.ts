// Todo lo que se guarda al iniciar sesión vive aquí y se borra junto en cerrarSesion()
const CLAVE_TOKEN = "token";
const CLAVE_NOMBRE = "userName";
const EVENTO_SESION = "oriza-sesion";

function avisarCambio() {
  window.dispatchEvent(new Event(EVENTO_SESION));
}

export function guardarSesion(token: string, nombre: string) {
  localStorage.setItem(CLAVE_TOKEN, token);
  localStorage.setItem(CLAVE_NOMBRE, nombre);
  avisarCambio();
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_NOMBRE);
  avisarCambio();
}

export function obtenerToken(): string | null {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function obtenerNombre(): string | null {
  return localStorage.getItem(CLAVE_NOMBRE);
}

// Al editar el nombre en Ajustes, la barra superior se actualiza sin recargar
export function actualizarNombre(nombre: string) {
  localStorage.setItem(CLAVE_NOMBRE, nombre);
  avisarCambio();
}

// Para useSyncExternalStore: escucha cambios de esta pestaña y de otras
export function suscribirSesion(alCambiar: () => void) {
  window.addEventListener(EVENTO_SESION, alCambiar);
  window.addEventListener("storage", alCambiar);
  return () => {
    window.removeEventListener(EVENTO_SESION, alCambiar);
    window.removeEventListener("storage", alCambiar);
  };
}
