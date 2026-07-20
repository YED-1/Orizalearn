import React from "react";
import { Home, BookOpen, Calendar, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
}

export default function DashboardLayout({
  children,
  userName,
}: DashboardLayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      {/* Barra superior */}
      <header className="bg-oriza-darkest text-white h-16 px-6 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold">
            🏔️
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/10 px-4 py-1.5 rounded-full">
          <span className="text-sm font-medium">{userName}</span>
          <div className="w-8 h-8 rounded-full bg-white text-oriza-darkest flex items-center justify-center font-bold">
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Contenedor principal con barra lateral y área de contenido */}
      <div className="flex flex-1">
        {/* Barra lateral */}
        <aside className="w-20 bg-gray-100 border-r border-gray-300 flex flex-col items-center py-6 gap-6 shadow-sm">
          <Link
            to="/dashboard"
            className={`p-3 rounded-xl transition-all ${
              isActive("/dashboard")
                ? "bg-blue-900 text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            title="Inicio"
          >
            <Home className="w-6 h-6" />
          </Link>
          <Link
            to="/dashboard/courses"
            className={`p-3 rounded-xl transition-all ${
              isActive("/dashboard/courses")
                ? "bg-blue-900 text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            title="Mis Cursos"
          >
            <BookOpen className="w-6 h-6" />
          </Link>
          <Link
            to="/dashboard/calendar"
            className={`p-3 rounded-xl transition-all ${
              isActive("/dashboard/calendar")
                ? "bg-blue-900 text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            title="Calendario"
          >
            <Calendar className="w-6 h-6" />
          </Link>
        </aside>

        {/* Área dinámica */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
