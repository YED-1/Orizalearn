import axios from "axios";
import { cerrarSesion, obtenerToken } from "./sesion";

// Cliente HTTP centralizado: el código nuevo debe llamar a la API a través de él
export const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Adjunta el token de sesión a cada petición
api.interceptors.request.use((config) => {
  const token = obtenerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Un 401 en una petición con token significa sesión expirada o inválida
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.headers?.Authorization
    ) {
      cerrarSesion();
      window.location.replace("/login");
    }
    return Promise.reject(error);
  },
);

// Devuelve el "detail" del backend (ya en español) o un mensaje por defecto
export function obtenerMensajeError(error: unknown, porDefecto: string): string {
  if (axios.isAxiosError(error)) {
    const detalle: unknown = error.response?.data?.detail;
    if (typeof detalle === "string" && detalle.trim() !== "") {
      return detalle;
    }
  }
  return porDefecto;
}
