import { Link } from "react-router-dom";
import { ArrowRight, CircleCheck, Flag, Mountain, Sigma } from "lucide-react";

const ventajas = ["Sin costo", "Módulos cortos", "Práctica desde el día uno"];

export default function HeroLanding() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-oriza-darkest pt-28 pb-40 sm:pt-36 lg:pb-56"
    >
      {/* Fondo: retícula de puntos y resplandores */}
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      ></div>
      <div
        className="absolute w-[28rem] h-[28rem] bg-oriza-acento rounded-full blur-3xl opacity-20 -top-32 -left-24"
        aria-hidden="true"
      ></div>
      <div
        className="absolute w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 top-40 -right-24"
        aria-hidden="true"
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
        {/* Columna de texto */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-xs font-medium text-sky-200">
            <Mountain className="w-4 h-4" />
            Educación gratuita para todos
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Aprende lo que quieras.{" "}
            <span className="block bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Paso a paso, hasta la cima.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-300 max-w-xl mx-auto lg:mx-0">
            Matemáticas, programación y mucho más en módulos cortos y
            precisos, pensados para que dediques tu tiempo a practicar. Sin
            costo, a tu ritmo.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/registro"
              className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-lg bg-oriza-acento text-white font-semibold shadow-lg shadow-oriza-acento/30 hover:bg-blue-600 transition-colors"
            >
              Comenzar gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex justify-center items-center px-6 py-3.5 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors"
            >
              Ya tengo cuenta
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start">
            {ventajas.map((ventaja) => (
              <li
                key={ventaja}
                className="flex items-center gap-2 text-sm text-slate-400"
              >
                <CircleCheck className="w-4 h-4 text-sky-400" />
                {ventaja}
              </li>
            ))}
          </ul>
        </div>

        {/* Columna visual: tarjetas flotantes */}
        <div
          className="relative mx-auto w-full max-w-md lg:max-w-lg h-[28rem] sm:h-[27rem]"
          aria-hidden="true"
        >
          {/* Tarjeta: editor de código */}
          <div className="absolute top-0 right-0 w-[90%] rounded-2xl bg-oriza-header/90 border border-white/10 shadow-2xl shadow-black/40 backdrop-blur motion-safe:animate-flotar">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-red-400/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-400/80"></span>
              <span className="ml-3 text-xs text-slate-400 font-mono">
                promedio.py
              </span>
            </div>
            <pre className="px-4 py-4 text-[11px] sm:text-xs leading-6 font-mono text-slate-300 overflow-hidden">
              <span className="text-pink-400">def</span>{" "}
              <span className="text-sky-300">promedio</span>(notas):{"\n"}
              {"    "}
              <span className="text-pink-400">return</span>{" "}
              <span className="text-sky-300">sum</span>(notas) /{" "}
              <span className="text-sky-300">len</span>(notas){"\n\n"}
              <span className="text-sky-300">print</span>(promedio([
              <span className="text-amber-300">8</span>,{" "}
              <span className="text-amber-300">9</span>,{" "}
              <span className="text-amber-300">10</span>]))
            </pre>
            <div className="mx-4 mb-4 rounded-lg bg-oriza-darkest/80 px-4 py-2.5 font-mono text-xs">
              <span className="text-slate-500">Salida ▸ </span>
              <span className="text-emerald-400">9.0</span>
            </div>
          </div>

          {/* Tarjeta: matemáticas */}
          <div className="absolute bottom-0 left-0 w-[68%] rounded-2xl bg-white p-5 shadow-2xl shadow-black/40 motion-safe:animate-flotar-lento">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
              <span className="p-1.5 rounded-md bg-indigo-50">
                <Sigma className="w-4 h-4" />
              </span>
              Matemáticas · Ecuaciones
            </div>
            <div className="mt-4 space-y-1.5 font-mono text-sm text-oriza-header">
              <p>2x + 3 = 11</p>
              <p className="text-gray-400">2x = 8</p>
              <p className="flex items-center gap-2 font-bold">
                x = 4
                <CircleCheck className="w-4 h-4 text-emerald-500" />
              </p>
            </div>
          </div>

          {/* Insignia: progreso del módulo */}
          <div className="absolute top-[14rem] right-0 sm:top-auto sm:bottom-28 sm:right-2 w-44 rounded-xl bg-oriza-darkest/90 border border-white/10 p-3 shadow-xl backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-medium text-white">
              <Flag className="w-4 h-4 text-sky-400" />
              Módulo 3 de 4
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-sky-400 to-oriza-acento"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Cordillera que da paso a la siguiente sección */}
      <svg
        className="absolute bottom-0 left-0 w-full h-28 sm:h-40 lg:h-48"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="fill-slate-700/30"
          d="M0 200V120l140-70 120 60 170-100 150 90 110-50 190 110 140-80 170 70 120-60 130 50v60z"
        />
        <path
          className="fill-oriza-header"
          d="M0 200v-50l180-60 150 70 200-110 170 100 160-60 180 80 170-70 230 90v10z"
        />
        <path
          className="fill-oriza-light"
          d="M0 200v-30l220-40 180 40 240-60 200 50 220-40 380 60v20z"
        />
      </svg>
    </section>
  );
}
