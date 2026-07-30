import { useState, useEffect } from "react";

// Interfaces que coinciden con la estructura de la base de datos
interface Opcion {
  id: number;
  texto: string;
}

interface Pregunta {
  id: number;
  texto: string;
  opciones: Opcion[];
}

interface CursoInfo {
  id: number;
  nombre: string;
  abreviatura: string;
}

interface Modulo {
  id: number;
  nombre: string;
}

export default function EvaluacionEstudiante() {
  // Estados de navegación y datos
  const [cursoActivo, setCursoActivo] = useState<CursoInfo | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [moduloActivo, setModuloActivo] = useState<number | null>(null);

  // Estados del examen
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState<
    Record<number, number>
  >({});

  // Estado para manejar la UX mientras la API responde
  const [cargandoPreguntas, setCargandoPreguntas] = useState<boolean>(false);

  // Cargar la información del curso y sus módulos desde FastAPI
  useEffect(() => {
    const obtenerDatosCurso = async () => {
      try {
        const responseCurso = await fetch("http://localhost:8000/courses/1");
        const cursoData = await responseCurso.json();
        setCursoActivo(cursoData);

        const responseModulos = await fetch(
          "http://localhost:8000/courses/1/modules",
        );
        const modulosData = await responseModulos.json();
        setModulos(modulosData);
      } catch (error) {
        console.error("Error al cargar los datos del curso:", error);
      }
    };

    obtenerDatosCurso();
  }, []);

  // Cargar las preguntas cada vez que el alumno selecciona un módulo
  useEffect(() => {
    if (!moduloActivo) return;

    const obtenerPreguntas = async () => {
      setCargandoPreguntas(true);
      try {
        // Petición real al endpoint de FastAPI para traer las preguntas del módulo
        const response = await fetch(
          `http://localhost:8000/modules/${moduloActivo}/questions`,
        );
        const data = await response.json();
        setPreguntas(data);

        setRespuestasSeleccionadas({});
      } catch (error) {
        console.error("Error al cargar las preguntas:", error);
      } finally {
        setCargandoPreguntas(false);
      }
    };

    obtenerPreguntas();
  }, [moduloActivo]);

  // Función para registrar la selección del alumno
  const manejarSeleccion = (preguntaId: number, opcionId: number) => {
    setRespuestasSeleccionadas((prev) => ({
      ...prev,
      [preguntaId]: opcionId,
    }));
  };

  // Función para enviar el examen completo a calificar hacia FastAPI
  const enviarExamen = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(respuestasSeleccionadas).length < preguntas.length) {
      alert("Por favor, responde todas las preguntas antes de enviar.");
      return;
    }

    try {
      const payload = {
        modulo_id: moduloActivo,
        respuestas: respuestasSeleccionadas,
      };

      const response = await fetch("http://localhost:8000/evaluaciones/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error en el servidor al procesar la evaluación.");
      }

      const resultado = await response.json();
      console.log("Resultado guardado en Supabase:", resultado);
      alert("¡Examen enviado y calificado con éxito!");
    } catch (error) {
      console.error("Error al enviar el examen:", error);
      alert("Hubo un error al enviar tus respuestas.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/*BARRA LATERAL*/}
      <aside className="w-[30%] bg-gray-300 p-5 border-r-2 border-gray-400">
        <div className="flex items-center gap-4 mb-8 min-h-[50px]">
          {cursoActivo ? (
            <>
              <div className="bg-yellow-400 p-2.5 font-bold text-xl rounded shadow-sm text-gray-900">
                {cursoActivo.abreviatura}
              </div>
              <h3 className="text-blue-900 m-0 text-base font-bold">
                {cursoActivo.nombre}
              </h3>
            </>
          ) : (
            <p className="text-gray-500 italic text-sm">Cargando curso...</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {modulos.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay módulos disponibles.</p>
          ) : (
            modulos.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setModuloActivo(mod.id)}
                className={`h-12 rounded-lg cursor-pointer w-full transition-all duration-200 px-4 text-left font-medium truncate ${
                  moduloActivo === mod.id
                    ? "bg-white border-2 border-blue-900 shadow-md text-blue-900"
                    : "bg-white border-2 border-transparent hover:bg-gray-50 text-gray-700"
                }`}
              >
                {mod.nombre}
              </button>
            ))
          )}
        </div>
      </aside>

      {/*CONTENIDO PRINCIPAL*/}
      <main className="w-[70%] p-10 flex flex-col">
        <h2 className="text-blue-900 mt-0 mb-5 text-2xl font-bold h-[32px]">
          {moduloActivo && modulos.length > 0
            ? `Evaluación: ${modulos.find((m) => m.id === moduloActivo)?.nombre}`
            : "Mis Evaluaciones"}
        </h2>

        <div className="bg-gray-300 rounded-xl p-8 grow overflow-y-auto flex flex-col">
          {!moduloActivo ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-gray-600 text-lg text-center max-w-md">
                Selecciona un módulo en el panel izquierdo para comenzar tu
                evaluación.
              </p>
            </div>
          ) : cargandoPreguntas ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-gray-600 text-lg text-center animate-pulse">
                Cargando preguntas de la evaluación...
              </p>
            </div>
          ) : preguntas.length === 0 ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-gray-600 text-lg text-center">
                Este módulo aún no tiene preguntas asignadas.
              </p>
            </div>
          ) : (
            <form
              onSubmit={enviarExamen}
              className="flex flex-col gap-8 max-w-[800px] w-full mx-auto"
            >
              {preguntas.map((pregunta, index) => (
                <div
                  key={pregunta.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <h4 className="text-lg font-bold text-gray-800 mb-4">
                    {index + 1}. {pregunta.texto}
                  </h4>

                  <div className="flex flex-col gap-3">
                    {pregunta.opciones.map((opcion) => (
                      <label
                        key={opcion.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          respuestasSeleccionadas[pregunta.id] === opcion.id
                            ? "bg-blue-50 border-blue-900"
                            : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`pregunta_${pregunta.id}`}
                          value={opcion.id}
                          checked={
                            respuestasSeleccionadas[pregunta.id] === opcion.id
                          }
                          onChange={() =>
                            manejarSeleccion(pregunta.id, opcion.id)
                          }
                          className="scale-125 cursor-pointer accent-blue-900"
                        />
                        <span className="text-gray-700 font-medium">
                          {opcion.texto}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="text-right mt-4 pb-10">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-900 text-white border-none rounded-lg font-bold cursor-pointer text-base hover:bg-blue-800 transition-colors shadow-md w-full sm:w-auto"
                >
                  Enviar Respuestas
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
