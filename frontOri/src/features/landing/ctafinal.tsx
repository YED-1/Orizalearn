import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CtaFinal() {
  return (
    <section className="bg-oriza-crema px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
      <div className="relative overflow-hidden max-w-6xl mx-auto rounded-[2rem] bg-oriza-coral-fuerte px-6 py-16 sm:py-20">
        {/* Sol decorativo */}
        <div
          className="absolute w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-oriza-sol -top-16 -right-12 sm:-top-20 sm:-right-16"
          aria-hidden="true"
        ></div>

        {/* Silueta de montaña de fondo */}
        <svg
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[48rem] max-w-none h-auto"
          viewBox="0 0 24 12"
          aria-hidden="true"
        >
          <path className="fill-white/10" d="M12 0L0 12h24L12 0z" />
        </svg>

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            La cima es para todos
          </h2>
          <p className="mt-5 text-lg text-white/90">
            Crea tu cuenta gratuita y da hoy tu primer paso. El camino es tuyo;
            nosotros te acompañamos.
          </p>
          <Link
            to="/registro"
            className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-oriza-coral-fuerte text-lg font-extrabold hover:bg-oriza-crema transition-colors"
          >
            Crear mi cuenta gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-5 text-sm font-semibold text-white/90">
            Sin trucos: gratis hoy y siempre.
          </p>
        </div>
      </div>
    </section>
  );
}
