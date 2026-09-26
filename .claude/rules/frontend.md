---
paths:
  - "frontOri/**/*.{ts,tsx,css,js}"
---

# Reglas del frontend (React 19 + Vite + TypeScript + Tailwind 3)

- **Estilos solo con Tailwind:** usa las clases utilitarias y la paleta propia `oriza-darkest`, `oriza-header`, `oriza-light` definida en `tailwind.config.js` (agrega colores ahí, no valores hex sueltos). No agregues estilos nuevos a `App.css` (residuo de la plantilla de Vite).
- **Iconos:** `lucide-react`. No instales otra librería de iconos ni de componentes UI sin consultarlo.
- **Componentes:** funciones con `export default function NombreComponente()`, un componente por archivo, nombres de archivo en minúsculas (`loginform.tsx`, `dashboardlayout.tsx`). Tipa las respuestas de la API con `interface` cuyos campos coincidan exactamente con los schemas de `api/schemas/`.
- **Rutas:** se declaran en `src/App.tsx`. Las páginas del alumno van envueltas en `<DashboardLayout>` y las de acceso en `<AuthLayout>`. Un componente que no esté en `App.tsx` no es accesible.
- **Llamadas a la API:** la base es `http://localhost:8000` y los endpoints están en español (`/cursos/`, `/modulos/curso/{id}`, `/ejercicios/...`). Comprueba que el endpoint exista en `api/routers/` antes de consumirlo. Si existe un cliente HTTP centralizado en `src/`, úsalo; no agregues más URLs codificadas en componentes.
- **Estados de UI:** todo componente que consuma la API debe manejar carga, error y vacío. El patrón actual para formularios es `mensajeError` / `mensajeExito` mostrados en una alerta sobre el formulario, con el texto de `data.detail` del backend.
- **Barra lateral del dashboard:** debe poder minimizarse; abierta muestra logo + nombre "OrizaLearn" y texto de los enlaces, cerrada muestra solo el logo e iconos.
- **Validar antes de terminar:** `npm run build` (incluye `tsc -b`) y `npm run lint` deben pasar sin errores.
