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
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-oriza-coral-fuerte">
          <Search className="h-6 w-6" />
        </span>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar cursos..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-oriza-tinta/10 rounded-full outline-none text-oriza-tinta font-semibold placeholder:text-oriza-tinta/40 focus:ring-2 focus:ring-oriza-coral/40 focus:border-oriza-coral transition-colors"
        />
      </div>

      <h2 className="text-oriza-tinta font-extrabold text-lg w-full max-w-lg text-left mt-4">
        {busqueda ? "Resultados de búsqueda" : "Cursos Disponibles"}
      </h2>

      {cursosFiltrados.length > 0 ? (
        <div className="w-full max-w-lg space-y-4">
          {cursosFiltrados.map((curso) => (
            <div
              key={curso.id}
              className="bg-white rounded-3xl p-6 shadow-sm shadow-oriza-tinta/5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-extrabold text-oriza-tinta">
                  {curso.titulo}
                </h3>
                <p className="text-oriza-tinta/70 text-sm mt-2">
                  {curso.descripcion}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="bg-oriza-coral-fuerte text-white px-5 py-2 rounded-full font-bold hover:bg-oriza-coral-oscuro transition-colors">
                  Ver curso
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Estado vacío de búsquedas */
        <div className="bg-white rounded-3xl p-10 w-full max-w-lg flex flex-col items-center justify-center text-center">
          <Search className="w-12 h-12 mb-4 text-oriza-coral" />
          <p className="text-oriza-tinta font-extrabold text-lg">
            No se encontraron cursos
          </p>
          <p className="text-oriza-tinta/70 text-sm mt-2">
            Intenta con otro término de búsqueda o explora los cursos
            disponibles.
          </p>
        </div>
      )}
    </div>
  );
}
