---
paths:
  - "frontOri/**/*.{ts,tsx,css,js}"
---

# Reglas del frontend (React 19 + Vite + TypeScript + Tailwind 3)

- **Estilos solo con Tailwind:** usa las clases utilitarias y la paleta propia "Amanecer" definida en `tailwind.config.js`: `oriza-crema` (fondo), `oriza-tinta` (texto), `oriza-coral` (color principal), `oriza-sol`, `oriza-menta` y `oriza-lila` (agrega colores ahí, no valores hex sueltos). Los tonos base y `-suave` son decorativos o de fondo; el texto de color y los botones con texto blanco usan la variante `-fuerte` (contraste ≥ 4.5:1), y sobre `oriza-sol` el texto va en `oriza-tinta`. Estilo visual: fondos claros, tarjetas `rounded-3xl` con fondos pastel planos, botones `rounded-full`, sin fondos oscuros ni brillos difuminados. No agregues estilos nuevos a `App.css` (residuo de la plantilla de Vite).
- **Iconos:** `lucide-react`. No instales otra librería de iconos ni de componentes UI sin consultarlo.
- **Componentes:** funciones con `export default function NombreComponente()`, un componente por archivo, nombres de archivo en minúsculas (`loginform.tsx`, `dashboardlayout.tsx`). Tipa las respuestas de la API con `interface` cuyos campos coincidan exactamente con los schemas de `api/schemas/`.
- **Rutas:** se declaran en `src/App.tsx`. Las páginas del alumno van envueltas en `<DashboardLayout>` y las de acceso en `<AuthLayout>`. Un componente que no esté en `App.tsx` no es accesible.
- **Llamadas a la API:** la base es `http://localhost:8000` y los endpoints están en español (`/cursos/`, `/modulos/curso/{id}`, `/ejercicios/...`). Comprueba que el endpoint exista en `api/routers/` antes de consumirlo. Si existe un cliente HTTP centralizado en `src/`, úsalo; no agregues más URLs codificadas en componentes.
- **Estados de UI:** todo componente que consuma la API debe manejar carga, error y vacío. El patrón actual para formularios es `mensajeError` / `mensajeExito` mostrados en una alerta sobre el formulario, con el texto de `data.detail` del backend.
- **Barra lateral del dashboard:** debe poder minimizarse; abierta muestra logo + nombre "OrizaLearn" y texto de los enlaces, cerrada muestra solo el logo e iconos.
- **Validar antes de terminar:** `npm run build` (incluye `tsc -b`) y `npm run lint` deben pasar sin errores.
