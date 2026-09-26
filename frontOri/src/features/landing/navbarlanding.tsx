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
    <header className="fixed inset-x-0 top-0 z-50 bg-oriza-darkest/80 backdrop-blur-md border-b border-white/10">
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
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {enlace.etiqueta}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/registro"
            className="px-4 py-2 text-sm font-semibold text-white bg-oriza-acento rounded-lg shadow-lg shadow-oriza-acento/30 hover:bg-blue-600 transition-colors"
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
          className="md:hidden p-2 -mr-2 text-slate-200 hover:text-white rounded-lg"
        >
          {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Menú desplegable en móvil */}
      {menuAbierto && (
        <div className="md:hidden border-t border-white/10 bg-oriza-darkest px-4 pb-6 pt-2">
          <div className="flex flex-col">
            {enlaces.map((enlace) => (
              <a
                key={enlace.destino}
                href={enlace.destino}
                onClick={cerrarMenu}
                className="py-3 text-base font-medium text-slate-300 hover:text-white border-b border-white/5"
              >
                {enlace.etiqueta}
              </a>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full text-center px-4 py-3 text-sm font-medium text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="w-full text-center px-4 py-3 text-sm font-semibold text-white bg-oriza-acento rounded-lg hover:bg-blue-600 transition-colors"
            >
              Comenzar gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
