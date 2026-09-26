import { Compass, CodeXml, Sigma } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Area {
  titulo: string;
  descripcion: string;
  temas: string[];
  icono: LucideIcon;
  estiloIcono: string;
}

const areas: Area[] = [
  {
    titulo: "Matemáticas",
    descripcion:
      "Construye bases sólidas resolviendo problemas, no memorizando fórmulas.",
    temas: ["Álgebra", "Ecuaciones", "Lógica"],
    icono: Sigma,
    estiloIcono: "bg-indigo-50 text-indigo-600",
  },
  {
    titulo: "Programación",
    descripcion:
      "Escribe y ejecuta código real desde el primer módulo, directamente en la plataforma.",
    temas: ["Python", "Algoritmos", "Buenas prácticas"],
    icono: CodeXml,
    estiloIcono: "bg-sky-50 text-sky-600",
  },
];

export default function AreasConocimiento() {
  return (
    <section id="areas" className="scroll-mt-16 bg-oriza-light py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-oriza-acento">
            Áreas de conocimiento
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-oriza-darkest">
            Una sola montaña, muchos caminos
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Elige por dónde empezar. Cada área está organizada en módulos
            breves que te llevan de lo básico a lo avanzado.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {areas.map((area) => (
            <article
              key={area.titulo}
              className="group rounded-2xl bg-white border border-gray-200 p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div
                className={`inline-flex p-3 rounded-xl ${area.estiloIcono}`}
              >
                <area.icono className="w-7 h-7" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-oriza-darkest">
                {area.titulo}
              </h3>
              <p className="mt-2 text-gray-600">{area.descripcion}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {area.temas.map((tema) => (
                  <li
                    key={tema}
                    className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-oriza-header"
                  >
                    {tema}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          {/* Tarjeta de áreas futuras */}
          <article className="rounded-2xl border-2 border-dashed border-gray-300 p-7 flex flex-col justify-center">
            <div className="inline-flex self-start p-3 rounded-xl bg-amber-50 text-amber-600">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-oriza-darkest">
              Más áreas en camino
            </h3>
            <p className="mt-2 text-gray-600">
              Estamos trazando nuevas rutas para que sigas aprendiendo lo que
              te apasiona.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
