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
      <aside className="w-[30%] bg-oriza-crema p-5 border-r border-oriza-tinta/10">
        <div className="flex items-center gap-4 mb-8 min-h-[50px]">
          {cursoActivo ? (
            <>
              <div className="bg-oriza-sol p-2.5 font-extrabold text-xl rounded-xl text-oriza-tinta">
                {cursoActivo.abreviatura}
              </div>
              <h3 className="text-oriza-tinta m-0 text-base font-extrabold">
                {cursoActivo.nombre}
              </h3>
            </>
          ) : (
            <p className="text-oriza-tinta/70 italic text-sm">Cargando curso...</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {modulos.length === 0 ? (
            <p className="text-oriza-tinta/70 text-sm">No hay módulos disponibles.</p>
          ) : (
            modulos.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setModuloActivo(mod.id)}
                className={`h-12 rounded-2xl cursor-pointer w-full transition-all duration-200 px-4 text-left font-medium truncate ${
                  moduloActivo === mod.id
                    ? "bg-oriza-coral-suave border-2 border-oriza-coral text-oriza-coral-fuerte font-bold"
                    : "bg-white border-2 border-transparent hover:border-oriza-tinta/10 text-oriza-tinta/80"
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
        <h2 className="text-oriza-tinta mt-0 mb-5 text-2xl font-extrabold h-[32px]">
          {moduloActivo && modulos.length > 0
            ? `Evaluación: ${modulos.find((m) => m.id === moduloActivo)?.nombre}`
            : "Mis Evaluaciones"}
        </h2>

        <div className="bg-oriza-crema rounded-3xl p-8 grow overflow-y-auto flex flex-col">
          {!moduloActivo ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-oriza-tinta/70 text-lg text-center max-w-md">
                Selecciona un módulo en el panel izquierdo para comenzar tu
                evaluación.
              </p>
            </div>
          ) : cargandoPreguntas ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-oriza-tinta/70 text-lg text-center animate-pulse">
                Cargando preguntas de la evaluación...
              </p>
            </div>
          ) : preguntas.length === 0 ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-oriza-tinta/70 text-lg text-center">
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
                  className="bg-white p-6 rounded-3xl shadow-sm shadow-oriza-tinta/5"
                >
                  <h4 className="text-lg font-extrabold text-oriza-tinta mb-4">
                    {index + 1}. {pregunta.texto}
                  </h4>

                  <div className="flex flex-col gap-3">
                    {pregunta.opciones.map((opcion) => (
                      <label
                        key={opcion.id}
                        className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-colors ${
                          respuestasSeleccionadas[pregunta.id] === opcion.id
                            ? "bg-oriza-coral-suave border-oriza-coral"
                            : "bg-white border-oriza-tinta/10 hover:border-oriza-tinta/20"
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
                          className="scale-125 cursor-pointer accent-oriza-coral-fuerte"
                        />
                        <span className="text-oriza-tinta font-semibold">
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
                  className="px-8 py-3 bg-oriza-coral-fuerte text-white border-none rounded-full font-bold cursor-pointer text-base hover:bg-oriza-coral-oscuro transition-colors w-full sm:w-auto"
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
