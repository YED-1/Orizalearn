import axios from "axios";

// Cliente HTTP centralizado: el código nuevo debe llamar a la API a través de él
export const api = axios.create({
  baseURL: "http://localhost:8000",
});

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
