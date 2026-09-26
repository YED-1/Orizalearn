import { Gift, Layers, Library, ListChecks, PenLine, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Caracteristica {
  titulo: string;
  descripcion: string;
  icono: LucideIcon;
}

const caracteristicas: Caracteristica[] = [
  {
    titulo: "Módulos cortos y precisos",
    descripcion:
      "Contenido directo al punto, dividido en pasos que puedes completar en una sola sesión.",
    icono: Layers,
  },
  {
    titulo: "Práctica primero",
    descripcion:
      "La mayor parte de tu tiempo la inviertes haciendo ejercicios, no solo leyendo.",
    icono: PenLine,
  },
  {
    titulo: "Código que se ejecuta",
    descripcion:
      "En los cursos de programación escribes y corres tu código en un entorno seguro, sin instalar nada.",
    icono: Terminal,
  },
  {
    titulo: "Evaluaciones al final",
    descripcion:
      "Exámenes de opción múltiple para comprobar lo que aprendiste antes de seguir avanzando.",
    icono: ListChecks,
  },
  {
    titulo: "Catálogo completo",
    descripcion:
      "Al registrarte tienes acceso a todos los cursos. Tú decides qué aprender y cuándo.",
    icono: Library,
  },
  {
    titulo: "100 % gratuito",
    descripcion:
      "Creemos que aprender no debería tener precio. Sin suscripciones ni pagos ocultos.",
    icono: Gift,
  },
];

export default function Caracteristicas() {
  return (
    <section
      id="caracteristicas"
      className="scroll-mt-16 bg-white py-20 sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-oriza-acento">
            Características
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-oriza-darkest">
            Todo lo que necesitas para avanzar
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Una experiencia pensada para que aprendas de verdad: menos teoría
            interminable, más práctica guiada.
          </p>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {caracteristicas.map((caracteristica) => (
            <div key={caracteristica.titulo} className="flex gap-4">
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-oriza-darkest text-sky-300 shadow-md">
                <caracteristica.icono className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-oriza-darkest">
                  {caracteristica.titulo}
                </h3>
                <p className="mt-1.5 text-gray-600 leading-relaxed">
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
