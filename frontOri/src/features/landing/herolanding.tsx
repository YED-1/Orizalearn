import { Link } from "react-router-dom";
import { ArrowRight, CircleCheck, Flag, Heart, Sigma } from "lucide-react";

const ventajas = ["Sin tarjeta", "Sin planes premium", "Todos los cursos incluidos"];

export default function HeroLanding() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-oriza-crema pt-28 pb-36 sm:pt-36 lg:pb-48"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
        {/* Columna de texto */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-oriza-sol-suave text-sm font-bold text-oriza-tinta">
            <Heart className="w-4 h-4 text-oriza-coral-fuerte" />
            100 % gratis, para siempre
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-oriza-tinta leading-tight">
            Aprende lo que quieras.{" "}
            <span className="block text-oriza-coral-fuerte">
              <span className="bg-[linear-gradient(transparent_62%,theme(colors.oriza.sol.DEFAULT)_62%,theme(colors.oriza.sol.DEFAULT)_90%,transparent_90%)] box-decoration-clone">
                Paso a paso, hasta la cima.
              </span>
            </span>
          </h1>

          <p className="mt-6 text-lg text-oriza-tinta/70 max-w-xl mx-auto lg:mx-0">
            Matemáticas, programación y mucho más en módulos cortos y
            precisos, pensados para que dediques tu tiempo a practicar. Sin
            costo, a tu ritmo.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/registro"
              className="inline-flex justify-center items-center gap-2 px-7 py-3.5 rounded-full bg-oriza-coral-fuerte text-white font-bold hover:bg-oriza-coral-oscuro transition-colors"
            >
              Comenzar gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex justify-center items-center px-7 py-3.5 rounded-full bg-white border border-oriza-tinta/15 text-oriza-tinta font-bold hover:border-oriza-tinta/30 transition-colors"
            >
              Ya tengo cuenta
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start">
            {ventajas.map((ventaja) => (
              <li
                key={ventaja}
                className="flex items-center gap-2 text-sm font-semibold text-oriza-tinta/70"
              >
                <CircleCheck className="w-4 h-4 text-oriza-menta-fuerte" />
                {ventaja}
              </li>
            ))}
          </ul>
        </div>

        {/* Columna visual: tarjetas flotantes sobre un sol */}
        <div
          className="relative mx-auto w-full max-w-md lg:max-w-lg h-[28rem] sm:h-[27rem]"
          aria-hidden="true"
        >
          {/* Sol del amanecer */}
          <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-oriza-sol top-6 left-1/2 -translate-x-1/2"></div>
          <div className="absolute w-16 h-16 rounded-full bg-oriza-coral-suave -top-2 left-2"></div>

          {/* Tarjeta: editor de código */}
          <div className="absolute top-0 right-0 w-[90%] rounded-3xl bg-white shadow-xl shadow-oriza-tinta/10 motion-safe:animate-flotar">
            <div className="flex items-center gap-2 px-5 py-3 rounded-t-3xl bg-oriza-crema border-b border-oriza-tinta/5">
              <span className="w-3 h-3 rounded-full bg-oriza-coral"></span>
              <span className="w-3 h-3 rounded-full bg-oriza-sol"></span>
              <span className="w-3 h-3 rounded-full bg-oriza-menta"></span>
              <span className="ml-3 text-xs text-oriza-tinta/70 font-mono">
                promedio.py
              </span>
            </div>
            <pre className="px-5 py-4 text-[11px] sm:text-xs leading-6 font-mono text-oriza-tinta overflow-hidden">
              <span className="text-oriza-lila-fuerte font-bold">def</span>{" "}
              <span className="text-oriza-menta-fuerte">promedio</span>(notas):{"\n"}
              {"    "}
              <span className="text-oriza-lila-fuerte font-bold">return</span>{" "}
              <span className="text-oriza-menta-fuerte">sum</span>(notas) /{" "}
              <span className="text-oriza-menta-fuerte">len</span>(notas){"\n\n"}
              <span className="text-oriza-menta-fuerte">print</span>(promedio([
              <span className="text-oriza-coral-fuerte">8</span>,{" "}
              <span className="text-oriza-coral-fuerte">9</span>,{" "}
              <span className="text-oriza-coral-fuerte">10</span>]))
            </pre>
            <div className="mx-5 mb-5 rounded-xl bg-oriza-menta-suave px-4 py-2.5 font-mono text-xs">
              <span className="text-oriza-tinta/70">Salida ▸ </span>
              <span className="font-bold text-oriza-menta-fuerte">9.0</span>
            </div>
          </div>

          {/* Tarjeta: matemáticas */}
          <div className="absolute bottom-0 left-0 w-[68%] rounded-3xl bg-oriza-lila-suave p-5 shadow-xl shadow-oriza-tinta/10 motion-safe:animate-flotar-lento">
            <div className="flex items-center gap-2 text-xs font-bold text-oriza-lila-fuerte">
              <span className="p-1.5 rounded-lg bg-white">
                <Sigma className="w-4 h-4" />
              </span>
              Matemáticas · Ecuaciones
            </div>
            <div className="mt-4 space-y-1.5 font-mono text-sm text-oriza-tinta">
              <p>2x + 3 = 11</p>
              <p className="text-oriza-tinta/50">2x = 8</p>
              <p className="flex items-center gap-2 font-bold">
                x = 4
                <CircleCheck className="w-4 h-4 text-oriza-menta-fuerte" />
              </p>
            </div>
          </div>

          {/* Insignia: progreso del módulo */}
          <div className="absolute top-[14rem] right-0 sm:top-auto sm:bottom-28 sm:right-2 w-44 rounded-2xl bg-white p-3 shadow-lg shadow-oriza-tinta/10">
            <div className="flex items-center gap-2 text-xs font-bold text-oriza-tinta">
              <Flag className="w-4 h-4 text-oriza-coral-fuerte" />
              Módulo 3 de 4
            </div>
            <div className="mt-2 h-2 rounded-full bg-oriza-sol-suave overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-oriza-sol"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Colinas que dan paso a la siguiente sección */}
      <svg
        className="absolute bottom-0 left-0 w-full h-24 sm:h-32 lg:h-40"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="fill-oriza-coral-suave"
          d="M0 200V110C180 60 320 60 480 100s300 60 460 10 330-70 500-20v110z"
        />
        <path
          className="fill-white"
          d="M0 200v-50c220-40 420-40 620-10s440 40 820-20v80z"
        />
      </svg>
    </section>
  );
}
