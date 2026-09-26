import { BookOpen, ClipboardCheck, Flag, PenLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Campamento {
  titulo: string;
  descripcion: string;
  icono: LucideIcon;
  // Desplazamiento vertical en escritorio para dibujar el ascenso
  desnivel: string;
  estiloIcono: string;
}

const campamentos: Campamento[] = [
  {
    titulo: "Teoría",
    descripcion: "Conceptos claros y ejemplos concretos, sin rodeos.",
    icono: BookOpen,
    desnivel: "lg:mt-48",
    estiloIcono: "bg-oriza-lila-suave text-oriza-lila-fuerte",
  },
  {
    titulo: "Práctica",
    descripcion: "Ejercicios para aplicar lo aprendido en el momento.",
    icono: PenLine,
    desnivel: "lg:mt-32",
    estiloIcono: "bg-oriza-menta-suave text-oriza-menta-fuerte",
  },
  {
    titulo: "Examen",
    descripcion: "Preguntas de opción múltiple para validar tu avance.",
    icono: ClipboardCheck,
    desnivel: "lg:mt-16",
    estiloIcono: "bg-oriza-coral-suave text-oriza-coral-fuerte",
  },
  {
    titulo: "La cima",
    descripcion: "Completas el módulo y sigues subiendo al siguiente.",
    icono: Flag,
    desnivel: "lg:mt-0",
    estiloIcono: "bg-oriza-sol text-oriza-tinta",
  },
];

export default function RutaAprendizaje() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-16 bg-white py-20 sm:py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-oriza-coral-fuerte">
            Cómo funciona
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-oriza-tinta">
            Cada módulo es un ascenso
          </h2>
          <p className="mt-4 text-lg text-oriza-tinta/70">
            Avanzas de campamento en campamento. Sin saltos bruscos: cada paso
            te prepara para el siguiente.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Sendero diagonal (solo escritorio) */}
          <svg
            className="hidden lg:block absolute left-[12.5%] top-6 h-48 w-[75%]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 100 L33 67 L66 33 L100 0"
              className="stroke-oriza-coral/50"
              fill="none"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Sendero vertical (móvil y tableta) */}
          <div
            className="lg:hidden absolute left-6 top-6 bottom-6 w-px border-l-2 border-dashed border-oriza-coral/40"
            aria-hidden="true"
          ></div>

          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
            {campamentos.map((campamento, indice) => {
              const esCima = indice === campamentos.length - 1;
              return (
                <li
                  key={campamento.titulo}
                  className={`flex gap-5 lg:flex-col lg:items-center lg:text-center ${campamento.desnivel}`}
                >
                  <div
                    className={`relative shrink-0 flex items-center justify-center w-12 h-12 rounded-full ring-8 ring-white ${campamento.estiloIcono}`}
                  >
                    <campamento.icono className="w-5 h-5" />
                  </div>
                  <div
                    className={`flex-1 rounded-3xl p-5 lg:mt-5 lg:w-full ${
                      esCima ? "bg-oriza-sol-suave" : "bg-oriza-crema"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-oriza-coral-fuerte">
                      Paso {indice + 1}
                    </span>
                    <h3 className="mt-1 text-lg font-extrabold text-oriza-tinta">
                      {campamento.titulo}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-oriza-tinta/70">
                      {campamento.descripcion}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
