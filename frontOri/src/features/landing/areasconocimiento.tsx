import { Compass, CodeXml, Sigma } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Area {
  titulo: string;
  descripcion: string;
  temas: string[];
  icono: LucideIcon;
  estiloTarjeta: string;
  estiloIcono: string;
}

const areas: Area[] = [
  {
    titulo: "Matemáticas",
    descripcion:
      "Construye bases sólidas resolviendo problemas, no memorizando fórmulas.",
    temas: ["Álgebra", "Ecuaciones", "Lógica"],
    icono: Sigma,
    estiloTarjeta: "bg-oriza-lila-suave",
    estiloIcono: "bg-white text-oriza-lila-fuerte",
  },
  {
    titulo: "Programación",
    descripcion:
      "Escribe y ejecuta código real desde el primer módulo, directamente en la plataforma.",
    temas: ["Python", "Algoritmos", "Buenas prácticas"],
    icono: CodeXml,
    estiloTarjeta: "bg-oriza-menta-suave",
    estiloIcono: "bg-white text-oriza-menta-fuerte",
  },
];

export default function AreasConocimiento() {
  return (
    <section id="areas" className="scroll-mt-16 bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-oriza-coral-fuerte">
            Áreas de conocimiento
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-oriza-tinta">
            Una sola montaña, muchos caminos
          </h2>
          <p className="mt-4 text-lg text-oriza-tinta/70">
            Elige por dónde empezar. Cada área está organizada en módulos
            breves que te llevan de lo básico a lo avanzado.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {areas.map((area) => (
            <article
              key={area.titulo}
              className={`rounded-3xl p-7 hover:-translate-y-1 transition-transform ${area.estiloTarjeta}`}
            >
              <div className={`inline-flex p-3 rounded-2xl ${area.estiloIcono}`}>
                <area.icono className="w-7 h-7" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-oriza-tinta">
                {area.titulo}
              </h3>
              <p className="mt-2 text-oriza-tinta/70">{area.descripcion}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {area.temas.map((tema) => (
                  <li
                    key={tema}
                    className="px-3 py-1 rounded-full bg-white/70 text-xs font-bold text-oriza-tinta"
                  >
                    {tema}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          {/* Tarjeta de áreas futuras */}
          <article className="rounded-3xl border-2 border-dashed border-oriza-tinta/15 p-7 flex flex-col justify-center">
            <div className="inline-flex self-start p-3 rounded-2xl bg-oriza-sol-suave text-oriza-tinta">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="mt-5 text-xl font-extrabold text-oriza-tinta">
              Más áreas en camino
            </h3>
            <p className="mt-2 text-oriza-tinta/70">
              Estamos trazando nuevas rutas para que sigas aprendiendo lo que
              te apasiona.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
