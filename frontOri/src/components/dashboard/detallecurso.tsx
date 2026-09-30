import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ClipboardCheck,
  Code2,
  ExternalLink,
  Loader2,
  RotateCcw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { api, obtenerMensajeError } from "../../lib/api";

type TipoModulo = "teoria" | "practica" | "examen";

// Coinciden con ModuloResumen y CursoDetalle de api/schemas/course.py
interface ModuloResumen {
  id: number;
  titulo: string;
  orden: number;
  tipo_modulo: TipoModulo;
  contenido_texto: string;
  recurso_url: string | null;
  total_ejercicios: number;
  total_preguntas: number;
}

interface CursoDetalle {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  total_modulos: number;
  total_ejercicios: number;
  total_preguntas: number;
  modulos: ModuloResumen[];
}

// Respuesta guardada junto con el id pedido, para saber si corresponde a la ruta actual
interface Resultado {
  id: string;
  curso?: CursoDetalle;
  error?: string;
}

const ESTILO_TIPO: Record<
  TipoModulo,
  { etiqueta: string; Icono: LucideIcon; insignia: string }
> = {
  teoria: {
    etiqueta: "Teoría",
    Icono: BookOpen,
    insignia: "bg-oriza-lila-suave text-oriza-lila-fuerte",
  },
  practica: {
    etiqueta: "Práctica",
    Icono: Code2,
    insignia: "bg-oriza-menta-suave text-oriza-menta-fuerte",
  },
  examen: {
    etiqueta: "Evaluación",
    Icono: ClipboardCheck,
    insignia: "bg-oriza-coral-suave text-oriza-coral-fuerte",
  },
};

function plural(cantidad: number, singular: string, pluralTexto: string) {
  return `${cantidad} ${cantidad === 1 ? singular : pluralTexto}`;
}

const enlaceVolver = (
  <Link
    to="/dashboard"
    className="inline-flex items-center gap-2 text-oriza-coral-fuerte font-bold hover:underline"
  >
    <ArrowLeft className="w-4 h-4" />
    Volver a los cursos
  </Link>
);

export default function DetalleCurso() {
  const { cursoId = "" } = useParams<{ cursoId: string }>();
  const idValido = /^\d+$/.test(cursoId);

  const [resultado, setResultado] = useState<Resultado | null>(null);
  // Cambiarlo vuelve a disparar la carga (botón "Reintentar")
  const [intento, setIntento] = useState(0);
  const [moduloAbierto, setModuloAbierto] = useState<number | null>(null);

  useEffect(() => {
    if (!idValido) return;
    let activo = true;
    api
      .get<CursoDetalle>(`/cursos/${cursoId}`)
      .then((res) => {
        if (activo) setResultado({ id: cursoId, curso: res.data });
      })
      .catch((err) => {
        if (activo) {
          setResultado({
            id: cursoId,
            error: obtenerMensajeError(
              err,
              "No pudimos cargar el curso. Revisa tu conexión e inténtalo de nuevo.",
            ),
          });
        }
      });
    return () => {
      activo = false;
    };
  }, [cursoId, idValido, intento]);

  const reintentar = () => {
    setResultado(null);
    setIntento((n) => n + 1);
  };

  const cargando = idValido && resultado?.id !== cursoId;
  const error = !idValido
    ? "El curso especificado no existe"
    : cargando
      ? ""
      : resultado?.error;
  const curso = !cargando && !error ? resultado?.curso : undefined;

  if (cargando) {
    return (
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-10 h-10 text-oriza-coral animate-spin mb-3" />
        <p className="text-oriza-tinta/70 font-semibold">Cargando curso…</p>
      </div>
    );
  }

  if (error || !curso) {
    return (
      <div className="space-y-6">
        {enlaceVolver}
        <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 mb-4 text-oriza-coral-fuerte" />
          <p className="text-oriza-tinta font-extrabold text-lg">
            No pudimos mostrar este curso
          </p>
          <p className="text-oriza-tinta/70 text-sm mt-2 max-w-sm">
            {error || "El curso especificado no existe"}
          </p>
          {idValido && (
            <button
              onClick={reintentar}
              className="mt-5 inline-flex items-center gap-2 bg-oriza-coral-fuerte text-white px-5 py-2 rounded-full font-bold hover:bg-oriza-coral-oscuro transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  const contarTipo = (tipo: TipoModulo) =>
    curso.modulos.filter((m) => m.tipo_modulo === tipo).length;

  const estadisticas = [
    plural(curso.total_modulos, "módulo", "módulos"),
    plural(contarTipo("teoria"), "lección", "lecciones"),
    plural(contarTipo("practica"), "práctica", "prácticas"),
    plural(contarTipo("examen"), "evaluación", "evaluaciones"),
    plural(curso.total_ejercicios, "ejercicio", "ejercicios"),
    plural(curso.total_preguntas, "pregunta", "preguntas"),
  ];

  return (
    <div className="space-y-6 pb-8">
      {enlaceVolver}

      {/* Encabezado del curso */}
      <section className="bg-oriza-sol-suave rounded-3xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-oriza-tinta">
          {curso.titulo}
        </h1>
        <p className="text-oriza-tinta/80 mt-3 max-w-3xl">
          {curso.descripcion}
        </p>

        <ul className="flex flex-wrap gap-2 mt-5">
          {estadisticas.map((texto) => (
            <li
              key={texto}
              className="bg-white/70 text-oriza-tinta text-sm font-bold px-3 py-1 rounded-full"
            >
              {texto}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            disabled
            className="bg-oriza-coral-fuerte text-white px-6 py-2.5 rounded-full font-bold opacity-60 cursor-not-allowed"
          >
            Empezar curso
          </button>
          <span className="text-sm font-semibold text-oriza-tinta/70">
            Próximamente
          </span>
        </div>
      </section>

      {/* Temario */}
      <section>
        <h2 className="text-oriza-tinta font-extrabold text-xl mb-4">
          Temario
        </h2>

        {curso.modulos.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-oriza-tinta/15">
            <BookOpen className="w-12 h-12 mb-4 text-oriza-coral" />
            <p className="text-oriza-tinta font-extrabold text-lg">
              Este curso aún no tiene módulos
            </p>
            <p className="text-oriza-tinta/70 text-sm mt-2">
              Vuelve pronto para ver su contenido.
            </p>
          </div>
        ) : (
          <ol className="space-y-3">
            {curso.modulos.map((modulo) => {
              const { etiqueta, Icono, insignia } =
                ESTILO_TIPO[modulo.tipo_modulo] ?? ESTILO_TIPO.teoria;
              const abierto = moduloAbierto === modulo.id;
              const idPanel = `modulo-${modulo.id}`;

              return (
                <li
                  key={modulo.id}
                  className="bg-white rounded-3xl shadow-sm shadow-oriza-tinta/5 overflow-hidden"
                >
                  <button
                    onClick={() => setModuloAbierto(abierto ? null : modulo.id)}
                    aria-expanded={abierto}
                    aria-controls={idPanel}
                    className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-oriza-crema/60 transition-colors"
                  >
                    <span className="w-9 h-9 shrink-0 rounded-full bg-oriza-crema flex items-center justify-center text-sm font-extrabold text-oriza-tinta">
                      {modulo.orden}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-bold text-oriza-tinta">
                        {modulo.titulo}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${insignia}`}
                        >
                          <Icono className="w-3.5 h-3.5" />
                          {etiqueta}
                        </span>
                        {modulo.total_ejercicios > 0 && (
                          <span className="text-oriza-tinta/70">
                            {plural(modulo.total_ejercicios, "ejercicio", "ejercicios")}
                          </span>
                        )}
                        {modulo.total_preguntas > 0 && (
                          <span className="text-oriza-tinta/70">
                            {plural(modulo.total_preguntas, "pregunta", "preguntas")}
                          </span>
                        )}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-oriza-tinta/70 transition-transform ${
                        abierto ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {abierto && (
                    <div
                      id={idPanel}
                      className="px-5 pb-5 sm:pl-[4.25rem] text-sm text-oriza-tinta/80"
                    >
                      <p className="whitespace-pre-line line-clamp-6">
                        {modulo.contenido_texto}
                      </p>
                      {modulo.recurso_url && (
                        <a
                          href={modulo.recurso_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 font-bold text-oriza-coral-fuerte hover:underline"
                        >
                          Ver recurso
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
