import { BookOpen, Award } from "lucide-react";

export default function MisCursos() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Columna Izquierda: Mis Cursos */}
      <div className="lg:col-span-2 flex flex-col">
        <h2 className="text-blue-900 font-bold text-xl mb-6">Mis cursos:</h2>

        {/* Estado vacío de cursos */}
        <div className="bg-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[300px] border-2 border-dashed border-gray-300">
          <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-600 font-bold text-xl">
            No tienes cursos activos
          </p>
          <p className="text-gray-500 text-sm mt-2 max-w-sm">
            Actualmente no estás inscrito en ningún curso. Ve a la sección de
            inicio para buscar e iniciar tu aprendizaje.
          </p>
        </div>
      </div>

      {/* Columna Derecha: Mis logros y certificaciones */}
      <div className="bg-gray-200/50 rounded-2xl p-6 border-l border-gray-300">
        <h2 className="text-blue-900 font-bold text-lg mb-6">
          Mis logros y certificaciones:
        </h2>

        {/* Estado vacío de logros */}
        <div className="flex flex-col gap-6">
          <div className="bg-white/60 rounded-xl h-24 shadow-sm flex flex-col items-center justify-center border border-gray-200 text-gray-400">
            <Award className="w-6 h-6 mb-1 opacity-50" />
            <span className="text-sm font-medium">Aún no hay logros</span>
          </div>
          <div className="bg-white/60 rounded-xl h-24 shadow-sm flex flex-col items-center justify-center border border-gray-200 text-gray-400">
            <Award className="w-6 h-6 mb-1 opacity-50" />
            <span className="text-sm font-medium">
              Aún no hay certificaciones
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
