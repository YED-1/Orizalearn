import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Panel Izquierdo - Branding (Oculto en móviles, visible desde pantallas medianas) */}
      <div className="hidden md:flex md:w-1/2 bg-oriza-coral-suave flex-col justify-center items-center relative overflow-hidden">
        {/* Sol del amanecer */}
        <div
          className="absolute w-80 h-80 rounded-full bg-oriza-sol/70 top-[18%] left-1/2 -translate-x-1/2"
          aria-hidden="true"
        ></div>

        <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
          <Link to="/" aria-label="Volver al inicio">
            <Logo size="lg" />
          </Link>
          <p className="text-lg font-bold text-oriza-tinta/80">
            Aprender no debería costar nada.
          </p>
        </div>

        {/* Colinas al pie del panel */}
        <svg
          className="absolute bottom-0 left-0 w-full h-40"
          viewBox="0 0 720 200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="fill-oriza-coral/30"
            d="M0 200V100c120-50 240-50 360 0s240 40 360-10v110z"
          />
          <path
            className="fill-white/70"
            d="M0 200v-50c160-40 320-30 460 0s180 20 260-10v60z"
          />
        </svg>
      </div>

      {/* Panel Derecho - Contenido Dinámico (Formularios) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-oriza-crema sm:bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
