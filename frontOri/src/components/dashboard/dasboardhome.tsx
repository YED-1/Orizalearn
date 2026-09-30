import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, BookOpen, Loader2, RotateCcw, Search } from "lucide-react";
import { api, obtenerMensajeError } from "../../lib/api";

// Coincide con CursoResumen de api/schemas/course.py
interface CursoResumen {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  total_modulos: number;
  total_ejercicios: number;
  total_preguntas: number;
}

// Fondos pastel planos que rotan entre tarjetas
const FONDOS_TARJETA = [
  "bg-oriza-coral-suave",
  "bg-oriza-menta-suave",
  "bg-oriza-lila-suave",
  "bg-oriza-sol-suave",
];

function plural(cantidad: number, singular: string, pluralTexto: string) {
  return `${cantidad} ${cantidad === 1 ? singular : pluralTexto}`;
}

export default function DashboardHome() {
  const [cursos, setCursos] = useState<CursoResumen[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState("");
  // Cambiarlo vuelve a disparar la carga (botón "Reintentar")
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    api
      .get<CursoResumen[]>("/cursos/")
      .then((res) => {
        if (!activo) return;
        setCursos(res.data);
        setMensajeError("");
      })
      .catch((err) => {
        if (!activo) return;
        setMensajeError(
          obtenerMensajeError(
            err,
            "No pudimos cargar los cursos. Revisa tu conexión e inténtalo de nuevo.",
          ),
        );
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [intento]);

  const reintentar = () => {
    setCargando(true);
    setMensajeError("");
    setIntento((n) => n + 1);
  };

  const termino = busqueda.trim().toLowerCase();
  const cursosFiltrados = cursos.filter(
    (curso) =>
      curso.titulo.toLowerCase().includes(termino) ||
      curso.descripcion.toLowerCase().includes(termino),
  );

  let contenido;
  if (cargando) {
    contenido = (
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-10 h-10 text-oriza-coral animate-spin mb-3" />
        <p className="text-oriza-tinta/70 font-semibold">Cargando cursos…</p>
      </div>
    );
  } else if (mensajeError) {
    contenido = (
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 mb-4 text-oriza-coral-fuerte" />
        <p className="text-oriza-tinta font-extrabold text-lg">
          Algo salió mal
        </p>
        <p className="text-oriza-tinta/70 text-sm mt-2 max-w-sm">
          {mensajeError}
        </p>
        <button
          onClick={reintentar}
          className="mt-5 inline-flex items-center gap-2 bg-oriza-coral-fuerte text-white px-5 py-2 rounded-full font-bold hover:bg-oriza-coral-oscuro transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reintentar
        </button>
      </div>
    );
  } else if (cursos.length === 0) {
    contenido = (
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center">
        <BookOpen className="w-12 h-12 mb-4 text-oriza-coral" />
        <p className="text-oriza-tinta font-extrabold text-lg">
          Aún no hay cursos disponibles
        </p>
        <p className="text-oriza-tinta/70 text-sm mt-2">
          Muy pronto encontrarás aquí nuevos cursos para empezar a aprender.
        </p>
      </div>
    );
  } else if (cursosFiltrados.length === 0) {
    /* Estado vacío de búsquedas */
    contenido = (
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center">
        <Search className="w-12 h-12 mb-4 text-oriza-coral" />
        <p className="text-oriza-tinta font-extrabold text-lg">
          No se encontraron cursos
        </p>
        <p className="text-oriza-tinta/70 text-sm mt-2">
          Intenta con otro término de búsqueda o explora los cursos
          disponibles.
        </p>
      </div>
    );
  } else {
    contenido = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursosFiltrados.map((curso) => (
          <article
            key={curso.id}
            className="bg-white rounded-3xl overflow-hidden shadow-sm shadow-oriza-tinta/5 flex flex-col"
          >
            <div
              className={`${FONDOS_TARJETA[curso.id % FONDOS_TARJETA.length]} h-24 flex items-center justify-center`}
            >
              <BookOpen className="w-10 h-10 text-oriza-tinta/70" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-extrabold text-oriza-tinta">
                {curso.titulo}
              </h3>
              <p className="text-oriza-tinta/70 text-sm mt-2 line-clamp-3">
                {curso.descripcion}
              </p>
              <p className="text-oriza-tinta/70 text-xs font-bold mt-4">
                {plural(curso.total_modulos, "módulo", "módulos")} ·{" "}
                {plural(curso.total_ejercicios, "ejercicio", "ejercicios")} ·{" "}
                {plural(curso.total_preguntas, "pregunta", "preguntas")}
              </p>
              <div className="mt-auto pt-5 flex justify-end">
                <Link
                  to={`/dashboard/cursos/${curso.id}`}
                  className="bg-oriza-coral-fuerte text-white px-5 py-2 rounded-full font-bold hover:bg-oriza-coral-oscuro transition-colors"
                >
                  Ver curso
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-4">
      {/* Barra de búsqueda */}
      <div className="relative w-full max-w-lg mx-auto mt-4">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-oriza-coral-fuerte">
          <Search className="h-6 w-6" />
        </span>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar cursos..."
          aria-label="Buscar cursos"
          className="w-full pl-12 pr-4 py-3 bg-white border border-oriza-tinta/10 rounded-full outline-none text-oriza-tinta font-semibold placeholder:text-oriza-tinta/40 focus:ring-2 focus:ring-oriza-coral/40 focus:border-oriza-coral transition-colors"
        />
      </div>

      <h2 className="text-oriza-tinta font-extrabold text-lg mt-4">
        {busqueda ? "Resultados de búsqueda" : "Cursos disponibles"}
      </h2>

      {contenido}
    </div>
  );
}
