import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../../components/logo";

const enlaces = [
  { etiqueta: "Áreas", destino: "#areas" },
  { etiqueta: "Características", destino: "#caracteristicas" },
  { etiqueta: "Cómo funciona", destino: "#como-funciona" },
];

export default function NavbarLanding() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-oriza-crema/85 backdrop-blur-md border-b border-oriza-tinta/5">
      <nav className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#inicio" onClick={cerrarMenu} aria-label="OrizaLearn, ir al inicio">
          <Logo size="sm" direccion="horizontal" />
        </a>

        {/* Enlaces de escritorio */}
        <div className="hidden md:flex items-center gap-8">
          {enlaces.map((enlace) => (
            <a
              key={enlace.destino}
              href={enlace.destino}
              className="text-sm font-semibold text-oriza-tinta/70 hover:text-oriza-tinta transition-colors"
            >
              {enlace.etiqueta}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-oriza-tinta/80 hover:text-oriza-tinta transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/registro"
            className="px-5 py-2 text-sm font-bold text-white bg-oriza-coral-fuerte rounded-full hover:bg-oriza-coral-oscuro transition-colors"
          >
            Comenzar gratis
          </Link>
        </div>

        {/* Botón del menú móvil */}
        <button
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
          className="md:hidden p-2 -mr-2 text-oriza-tinta rounded-lg hover:bg-oriza-tinta/5"
        >
          {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Menú desplegable en móvil */}
      {menuAbierto && (
        <div className="md:hidden border-t border-oriza-tinta/5 bg-oriza-crema px-4 pb-6 pt-2">
          <div className="flex flex-col">
            {enlaces.map((enlace) => (
              <a
                key={enlace.destino}
                href={enlace.destino}
                onClick={cerrarMenu}
                className="py-3 text-base font-semibold text-oriza-tinta/80 hover:text-oriza-tinta border-b border-oriza-tinta/5"
              >
                {enlace.etiqueta}
              </a>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full text-center px-4 py-3 text-sm font-semibold text-oriza-tinta bg-white border border-oriza-tinta/15 rounded-full hover:border-oriza-tinta/30 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="w-full text-center px-4 py-3 text-sm font-bold text-white bg-oriza-coral-fuerte rounded-full hover:bg-oriza-coral-oscuro transition-colors"
            >
              Comenzar gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
