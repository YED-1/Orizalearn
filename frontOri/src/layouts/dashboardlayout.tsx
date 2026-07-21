import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, LogOut, User } from "lucide-react";

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
    <div className="flex h-screen bg-gray-50">
      {/* ================= BARRA LATERAL (SIDEBAR) ================= */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20">
        {/* Logo / Título */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-900 tracking-tight">
            Oriza LMS
          </h1>
        </div>

        {/* Enlaces de navegación */}
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              location.pathname === "/dashboard"
                ? "bg-blue-100 text-blue-900 shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-blue-900"
            }`}
          >
            <Home className="w-5 h-5" />
            Inicio
          </Link>

          <Link
            to="/dashboard/courses"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              location.pathname === "/dashboard/courses"
                ? "bg-blue-100 text-blue-900 shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-blue-900"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Mis cursos
          </Link>
        </nav>

        {/* Botón de cerrar sesión al fondo */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 font-medium hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ================= ÁREA PRINCIPAL ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra superior (Topbar) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 shadow-sm z-10">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-blue-900 leading-tight">
                {userName}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Estudiante
              </span>
            </div>

            {/* Foto de perfil o Ícono */}
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-blue-900 overflow-hidden shadow-sm">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Contenedor del contenido inyectado (DashboardHome o MisCursos) */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
