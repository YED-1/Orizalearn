import { CircleCheck } from "lucide-react";

const puntos = [
  "Ejercicios al terminar cada bloque de teoría.",
  "Evaluaciones para comprobar lo que dominas.",
  "Avanzas a tu ritmo y repasas cuando lo necesites.",
];

const opciones = [
  { letra: "A", texto: "x = 3", correcta: false },
  { letra: "B", texto: "x = 4", correcta: true },
  { letra: "C", texto: "x = 7", correcta: false },
  { letra: "D", texto: "x = 14", correcta: false },
];

export default function SeccionPractica() {
  return (
    <section className="bg-oriza-crema py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-14 lg:grid-cols-2 items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-oriza-coral-fuerte">
            Aprender haciendo
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-oriza-tinta">
            Lo que practicas, se queda contigo
          </h2>
          <p className="mt-4 text-lg text-oriza-tinta/70">
            Leer ayuda, pero practicar transforma. Por eso cada módulo termina
            con retos que ponen a prueba lo que acabas de aprender.
          </p>
          <ul className="mt-8 space-y-4">
            {puntos.map((punto) => (
              <li key={punto} className="flex items-start gap-3">
                <CircleCheck className="w-6 h-6 shrink-0 text-oriza-menta-fuerte" />
                <span className="text-oriza-tinta font-semibold">{punto}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ejemplo ilustrativo de una pregunta de evaluación */}
        <div className="relative">
          <div
            className="absolute -inset-4 bg-gradient-to-br from-oriza-coral-suave to-oriza-sol-suave rounded-[2rem] rotate-2"
            aria-hidden="true"
          ></div>
          <div className="relative rounded-3xl bg-white shadow-xl shadow-oriza-tinta/5 p-6 sm:p-8">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-oriza-coral-fuerte uppercase tracking-wider">
                Examen · Pregunta 2 de 5
              </span>
              <span className="px-2.5 py-1 rounded-full bg-oriza-sol-suave text-oriza-tinta">
                Ejemplo
              </span>
            </div>
            <p className="mt-5 text-lg font-bold text-oriza-tinta">
              Si 2x + 3 = 11, ¿cuál es el valor de x?
            </p>
            <ul className="mt-6 space-y-3">
              {opciones.map((opcion) => (
                <li
                  key={opcion.letra}
                  className={`flex items-center gap-4 rounded-2xl border-2 px-4 py-3 ${
                    opcion.correcta
                      ? "border-oriza-menta bg-oriza-menta-suave"
                      : "border-oriza-tinta/10"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-xl text-sm font-bold ${
                      opcion.correcta
                        ? "bg-oriza-menta-fuerte text-white"
                        : "bg-oriza-crema text-oriza-tinta"
                    }`}
                  >
                    {opcion.letra}
                  </span>
                  <span className="font-mono text-oriza-tinta">
                    {opcion.texto}
                  </span>
                  {opcion.correcta && (
                    <CircleCheck className="ml-auto w-5 h-5 text-oriza-menta-fuerte" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
