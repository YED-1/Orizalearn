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
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-14 lg:grid-cols-2 items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-oriza-acento">
            Aprender haciendo
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-oriza-darkest">
            Lo que practicas, se queda contigo
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Leer ayuda, pero practicar transforma. Por eso cada módulo termina
            con retos que ponen a prueba lo que acabas de aprender.
          </p>
          <ul className="mt-8 space-y-4">
            {puntos.map((punto) => (
              <li key={punto} className="flex items-start gap-3">
                <CircleCheck className="w-6 h-6 shrink-0 text-oriza-acento" />
                <span className="text-oriza-header font-medium">{punto}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ejemplo ilustrativo de una pregunta de evaluación */}
        <div className="relative">
          <div
            className="absolute -inset-4 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-3xl rotate-2"
            aria-hidden="true"
          ></div>
          <div className="relative rounded-2xl bg-white border border-gray-200 shadow-xl p-6 sm:p-8">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-oriza-acento uppercase tracking-wider">
                Examen · Pregunta 2 de 5
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                Ejemplo
              </span>
            </div>
            <p className="mt-5 text-lg font-semibold text-oriza-darkest">
              Si 2x + 3 = 11, ¿cuál es el valor de x?
            </p>
            <ul className="mt-6 space-y-3">
              {opciones.map((opcion) => (
                <li
                  key={opcion.letra}
                  className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${
                    opcion.correcta
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-gray-200"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${
                      opcion.correcta
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-oriza-header"
                    }`}
                  >
                    {opcion.letra}
                  </span>
                  <span className="font-mono text-oriza-header">
                    {opcion.texto}
                  </span>
                  {opcion.correcta && (
                    <CircleCheck className="ml-auto w-5 h-5 text-emerald-500" />
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
