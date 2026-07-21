import { Search } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto space-y-6">
      {/* Barra de búsqueda */}
      <div className="relative w-full max-w-lg mt-4">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
          <Search className="h-6 w-6" />
        </span>
        <input
          type="text"
          placeholder="Buscar cursos..."
          className="w-full pl-12 pr-4 py-3 bg-gray-200 rounded-xl outline-none text-blue-900 font-medium shadow-sm"
        />
      </div>

      <h2 className="text-gray-700 font-semibold text-lg w-full max-w-lg text-center mt-4">
        Últimas búsquedas
      </h2>

      {/* Estado vacío de búsquedas */}
      <div className="bg-gray-200 rounded-2xl p-10 w-full max-w-lg shadow-sm flex flex-col items-center justify-center text-center">
        <Search className="w-12 h-12 mb-4 text-gray-400" />
        <p className="text-gray-600 font-bold text-lg">
          Aún no has realizado búsquedas
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Utiliza la barra superior para explorar los cursos generados.
        </p>
      </div>
    </div>
  );
}
