import React from "react";
import Logo from "../components/logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Panel Izquierdo - Branding (Oculto en móviles, visible desde pantallas medianas) */}
      <div className="hidden md:flex md:w-1/2 bg-oriza-darkest flex-col justify-center items-center relative overflow-hidden">
        {/* Aquí irán los íconos tecnológicos flotantes después */}
        <div className="z-10">
          <Logo size="lg" />
        </div>

        {/* Un pequeño resplandor de fondo para darle profundidad al azul */}
        <div className="absolute w-96 h-96 bg-oriza-header rounded-full blur-3xl opacity-50 -top-10 -left-10"></div>
      </div>

      {/* Panel Derecho - Contenido Dinámico (Formularios) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-oriza-light sm:bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
