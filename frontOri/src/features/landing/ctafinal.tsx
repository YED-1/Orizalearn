import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CtaFinal() {
  return (
    <section className="relative overflow-hidden bg-oriza-darkest py-20 sm:py-28">
      <div
        className="absolute w-[36rem] h-[36rem] bg-oriza-acento rounded-full blur-3xl opacity-20 left-1/2 -translate-x-1/2 -top-72"
        aria-hidden="true"
      ></div>

      {/* Silueta de montaña de fondo */}
      <svg
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[48rem] max-w-none h-auto opacity-[0.06]"
        viewBox="0 0 24 12"
        aria-hidden="true"
      >
        <path className="fill-white" d="M12 0L0 12h24L12 0z" />
      </svg>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          La cima es para todos
        </h2>
        <p className="mt-5 text-lg text-slate-300">
          Crea tu cuenta gratuita y da hoy tu primer paso. El camino es tuyo;
          nosotros te acompañamos.
        </p>
        <Link
          to="/registro"
          className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-oriza-acento text-white text-lg font-semibold shadow-lg shadow-oriza-acento/30 hover:bg-blue-600 transition-colors"
        >
          Crear mi cuenta gratis
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
