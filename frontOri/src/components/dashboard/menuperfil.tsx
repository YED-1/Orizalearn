import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Award,
  BookOpen,
  Cake,
  Loader2,
  Mail,
  Settings,
  User,
} from "lucide-react";
import Avatar from "../avatar";
import { api, obtenerMensajeError } from "../../lib/api";
import { cargarFoto } from "../../lib/fotoperfil";

// Coincide con UserResponse de api/schemas/user.py
interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string;
  genero: string;
  cursos: number;
  score: number;
}

interface MenuPerfilProps {
  nombre: string;
}

// "2000-01-31" → "31 de enero de 2000" sin desfase de zona horaria
function formatearFecha(fecha: string) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function iniciales(usuario: Usuario) {
  return `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase();
}

export default function MenuPerfil({ nombre }: MenuPerfilProps) {
  const [abierto, setAbierto] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const contenedorRef = useRef<HTMLDivElement>(null);

  // La foto se descarga una vez por sesión y se comparte con Ajustes
  useEffect(() => {
    cargarFoto();
  }, []);

  // Cierra la tarjeta al hacer clic fuera o con Escape
  useEffect(() => {
    if (!abierto) return;
    const alHacerClic = (e: MouseEvent) => {
      if (!contenedorRef.current?.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    const alPresionarTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("mousedown", alHacerClic);
    document.addEventListener("keydown", alPresionarTecla);
    return () => {
      document.removeEventListener("mousedown", alHacerClic);
      document.removeEventListener("keydown", alPresionarTecla);
    };
  }, [abierto]);

  // Se consulta cada vez que se abre para mostrar siempre los datos al día
  const alternar = () => {
    if (abierto) {
      setAbierto(false);
      return;
    }
    setAbierto(true);
    setCargando(true);
    setMensajeError("");
    api
      .get<Usuario>("/usuarios/yo")
      .then((res) => setUsuario(res.data))
      .catch((err) =>
        setMensajeError(
          obtenerMensajeError(err, "No pudimos cargar tus datos. Inténtalo de nuevo."),
        ),
      )
      .finally(() => setCargando(false));
  };

  return (
    <div ref={contenedorRef} className="relative">
      <button
        onClick={alternar}
        aria-expanded={abierto}
        aria-haspopup="dialog"
        className="flex items-center gap-3 rounded-full pl-3 pr-1 py-1 hover:bg-oriza-crema transition-colors"
      >
        <span className="flex flex-col text-right">
          <span className="text-sm font-bold text-oriza-tinta leading-tight">
            {nombre}
          </span>
          <span className="text-xs text-oriza-tinta/70 font-semibold">
            Estudiante
          </span>
        </span>
        <Avatar tamano="w-10 h-10" />
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-label="Tu perfil"
          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-3xl shadow-lg shadow-oriza-tinta/10 border border-oriza-tinta/10 overflow-hidden z-30"
        >
          {cargando ? (
            <div className="p-8 flex flex-col items-center text-center">
              <Loader2 className="w-8 h-8 text-oriza-coral animate-spin mb-2" />
              <p className="text-sm text-oriza-tinta/70 font-semibold">
                Cargando tus datos…
              </p>
            </div>
          ) : mensajeError || !usuario ? (
            <div className="p-8 flex flex-col items-center text-center">
              <AlertCircle className="w-8 h-8 text-oriza-coral-fuerte mb-2" />
              <p className="text-sm text-oriza-tinta/70">
                {mensajeError || "No pudimos cargar tus datos."}
              </p>
            </div>
          ) : (
            <>
              {/* Encabezado con iniciales */}
              <div className="bg-oriza-sol-suave px-6 pt-6 pb-5 flex items-center gap-4">
                <Avatar tamano="w-14 h-14" iniciales={iniciales(usuario)} />
                <div className="min-w-0">
                  <p className="font-extrabold text-oriza-tinta leading-tight truncate">
                    {usuario.nombre} {usuario.apellido}
                  </p>
                  <p className="text-xs font-semibold text-oriza-tinta/70">
                    Estudiante
                  </p>
                </div>
              </div>

              {/* Datos de la cuenta */}
              <dl className="px-6 py-4 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <dt className="sr-only">Correo</dt>
                  <Mail className="w-4 h-4 shrink-0 text-oriza-tinta/50" />
                  <dd className="text-oriza-tinta truncate">{usuario.email}</dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="sr-only">Fecha de nacimiento</dt>
                  <Cake className="w-4 h-4 shrink-0 text-oriza-tinta/50" />
                  <dd className="text-oriza-tinta">
                    {formatearFecha(usuario.fecha_nacimiento)}
                  </dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="sr-only">Género</dt>
                  <User className="w-4 h-4 shrink-0 text-oriza-tinta/50" />
                  <dd className="text-oriza-tinta">{usuario.genero}</dd>
                </div>
              </dl>

              <div className="px-6 grid grid-cols-2 gap-3">
                <div className="bg-oriza-menta-suave rounded-2xl p-3">
                  <BookOpen className="w-4 h-4 text-oriza-menta-fuerte" />
                  <p className="mt-1 text-lg font-extrabold text-oriza-tinta">
                    {usuario.cursos}
                  </p>
                  <p className="text-xs font-semibold text-oriza-tinta/70">
                    Cursos
                  </p>
                </div>
                <div className="bg-oriza-lila-suave rounded-2xl p-3">
                  <Award className="w-4 h-4 text-oriza-lila-fuerte" />
                  <p className="mt-1 text-lg font-extrabold text-oriza-tinta">
                    {usuario.score}
                  </p>
                  <p className="text-xs font-semibold text-oriza-tinta/70">
                    Puntaje
                  </p>
                </div>
              </div>

              <div className="p-6">
                <Link
                  to="/dashboard/ajustes"
                  onClick={() => setAbierto(false)}
                  className="w-full flex items-center justify-center gap-2 bg-oriza-coral-fuerte text-white px-5 py-2.5 rounded-full font-bold hover:bg-oriza-coral-oscuro transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Ajustes
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
