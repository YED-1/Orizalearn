import { Link } from "react-router-dom";
import Logo from "../../components/logo";

export default function FooterLanding() {
  const anio = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-oriza-tinta/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Logo size="sm" direccion="horizontal" />
          <p className="text-sm text-oriza-tinta/70">
            Educación gratuita, paso a paso.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-oriza-tinta/70">
          <a href="#areas" className="hover:text-oriza-tinta transition-colors">
            Áreas
          </a>
          <a href="#caracteristicas" className="hover:text-oriza-tinta transition-colors">
            Características
          </a>
          <a href="#como-funciona" className="hover:text-oriza-tinta transition-colors">
            Cómo funciona
          </a>
          <Link to="/login" className="hover:text-oriza-tinta transition-colors">
            Iniciar sesión
          </Link>
          <Link to="/registro" className="hover:text-oriza-tinta transition-colors">
            Registro
          </Link>
        </nav>
      </div>
      <div className="border-t border-oriza-tinta/5 py-5 text-center text-xs text-oriza-tinta/70">
        © {anio} OrizaLearn. Todos los derechos reservados.
      </div>
    </footer>
  );
}
