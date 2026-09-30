import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, LogOut, User } from "lucide-react";
import Logo from "../components/logo";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Obtenemos la ruta actual para saber qué botón del menú debe verse "activo"
  const location = useLocation();
  const navigate = useNavigate();

  // Leemos el nombre guardado en el login. Si por alguna razón no hay nada, muestra "Usuario"
  const userName = localStorage.getItem("userName") || "Usuario";

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("userName"); // Limpiamos la memoria

    navigate("/login"); // Redirigimos al inicio de sesión
  };

  return (
    <div className="flex h-screen bg-oriza-crema text-oriza-tinta">
      {/* ================= BARRA LATERAL (SIDEBAR) ================= */}
      <aside className="w-64 bg-white border-r border-oriza-tinta/10 flex flex-col z-20">
        {/* Logo / Título */}
        <div className="h-16 flex items-center px-6 border-b border-oriza-tinta/10">
          <Link to="/dashboard" aria-label="OrizaLearn, ir al inicio del panel">
            <Logo size="sm" direccion="horizontal" />
          </Link>
        </div>

        {/* Enlaces de navegación */}
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors font-bold ${
              // El detalle de un curso forma parte del catálogo de Inicio
              location.pathname === "/dashboard" ||
              location.pathname.startsWith("/dashboard/cursos/")
                ? "bg-oriza-coral-suave text-oriza-coral-fuerte"
                : "text-oriza-tinta/70 hover:bg-oriza-crema hover:text-oriza-tinta"
            }`}
          >
            <Home className="w-5 h-5" />
            Inicio
          </Link>

          <Link
            to="/dashboard/courses"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors font-bold ${
              location.pathname === "/dashboard/courses"
                ? "bg-oriza-coral-suave text-oriza-coral-fuerte"
                : "text-oriza-tinta/70 hover:bg-oriza-crema hover:text-oriza-tinta"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Mis cursos
          </Link>
        </nav>

        {/* Botón de cerrar sesión al fondo */}
        <div className="p-4 border-t border-oriza-tinta/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ================= ÁREA PRINCIPAL ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra superior (Topbar) */}
        <header className="h-16 bg-white border-b border-oriza-tinta/10 flex items-center justify-end px-8 z-10">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-oriza-tinta leading-tight">
                {userName}
              </span>
              <span className="text-xs text-oriza-tinta/70 font-semibold">
                Estudiante
              </span>
            </div>

            {/* Foto de perfil o Ícono */}
            <div className="w-10 h-10 bg-oriza-sol-suave rounded-full flex items-center justify-center border-2 border-oriza-coral overflow-hidden">
              <User className="w-6 h-6 text-oriza-tinta/70" />
            </div>
          </div>
        </header>

        {/* Contenedor del contenido inyectado (DashboardHome o MisCursos) */}
        <main className="flex-1 overflow-y-auto p-8 bg-oriza-crema">
          <div className="max-w-7xl mx-auto h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
