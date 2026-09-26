import { Gift, Layers, Library, ListChecks, PenLine, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Caracteristica {
  titulo: string;
  descripcion: string;
  icono: LucideIcon;
  estiloIcono: string;
  destacada?: boolean;
}

const caracteristicas: Caracteristica[] = [
  {
    titulo: "Módulos cortos y precisos",
    descripcion:
      "Contenido directo al punto, dividido en pasos que puedes completar en una sola sesión.",
    icono: Layers,
    estiloIcono: "bg-oriza-coral-suave text-oriza-coral-fuerte",
  },
  {
    titulo: "Práctica primero",
    descripcion:
      "La mayor parte de tu tiempo la inviertes haciendo ejercicios, no solo leyendo.",
    icono: PenLine,
    estiloIcono: "bg-oriza-menta-suave text-oriza-menta-fuerte",
  },
  {
    titulo: "Código que se ejecuta",
    descripcion:
      "En los cursos de programación escribes y corres tu código en un entorno seguro, sin instalar nada.",
    icono: Terminal,
    estiloIcono: "bg-oriza-lila-suave text-oriza-lila-fuerte",
  },
  {
    titulo: "Evaluaciones al final",
    descripcion:
      "Exámenes de opción múltiple para comprobar lo que aprendiste antes de seguir avanzando.",
    icono: ListChecks,
    estiloIcono: "bg-oriza-sol-suave text-oriza-tinta",
  },
  {
    titulo: "Catálogo completo",
    descripcion:
      "Al registrarte tienes acceso a todos los cursos. Tú decides qué aprender y cuándo.",
    icono: Library,
    estiloIcono: "bg-oriza-coral-suave text-oriza-coral-fuerte",
  },
  {
    titulo: "100 % gratuito",
    descripcion:
      "Creemos que aprender no debería tener precio. Sin suscripciones ni pagos ocultos.",
    icono: Gift,
    estiloIcono: "bg-oriza-sol text-oriza-tinta",
    destacada: true,
  },
];

export default function Caracteristicas() {
  return (
    <section
      id="caracteristicas"
      className="scroll-mt-16 bg-oriza-crema py-20 sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-oriza-coral-fuerte">
            Características
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-oriza-tinta">
            Todo lo que necesitas para avanzar
          </h2>
          <p className="mt-4 text-lg text-oriza-tinta/70">
            Una experiencia pensada para que aprendas de verdad: menos teoría
            interminable, más práctica guiada.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {caracteristicas.map((caracteristica) => (
            <div
              key={caracteristica.titulo}
              className={`flex gap-4 rounded-3xl p-6 ${
                caracteristica.destacada ? "bg-oriza-sol-suave" : ""
              }`}
            >
              <div
                className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl ${caracteristica.estiloIcono}`}
              >
                <caracteristica.icono className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-oriza-tinta">
                  {caracteristica.titulo}
                </h3>
                <p className="mt-1.5 text-oriza-tinta/70 leading-relaxed">
                  {caracteristica.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
