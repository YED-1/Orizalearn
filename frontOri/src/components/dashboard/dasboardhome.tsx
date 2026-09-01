import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";

interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  examen: string;
}

export default function DashboardHome() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/cursos/")
      .then((res) => {
        setCursos(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar los cursos:", err);
      });
  }, []);

  const cursosFiltrados = cursos.filter(
    (curso) =>
      curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      curso.descripcion.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto space-y-6 p-4">
      {/* Barra de búsqueda */}
      <div className="relative w-full max-w-lg mt-4">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
          <Search className="h-6 w-6" />
        </span>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar cursos..."
          className="w-full pl-12 pr-4 py-3 bg-gray-200 rounded-xl outline-none text-blue-900 font-medium shadow-sm"
        />
      </div>

      <h2 className="text-gray-700 font-semibold text-lg w-full max-w-lg text-left mt-4">
        {busqueda ? "Resultados de búsqueda" : "Cursos Disponibles"}
      </h2>

      {cursosFiltrados.length > 0 ? (
        <div className="w-full max-w-lg space-y-4">
          {cursosFiltrados.map((curso) => (
            <div
              key={curso.id}
              className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-blue-900">
                  {curso.titulo}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  {curso.descripcion}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Ver curso
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Estado vacío de búsquedas */
        <div className="bg-gray-200 rounded-2xl p-10 w-full max-w-lg shadow-sm flex flex-col items-center justify-center text-center">
          <Search className="w-12 h-12 mb-4 text-gray-400" />
          <p className="text-gray-600 font-bold text-lg">
            No se encontraron cursos
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Intenta con otro término de búsqueda o explora los cursos
            disponibles.
          </p>
        </div>
      )}
    </div>
  );
}
