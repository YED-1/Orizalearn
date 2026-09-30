import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AlertCircle,
  Camera,
  Loader2,
  Lock,
  Mail,
  RotateCcw,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";
import Avatar from "../avatar";
import { api, obtenerMensajeError } from "../../lib/api";
import {
  cargarFoto,
  obtenerFoto,
  quitarFoto,
  subirFoto,
  suscribirFoto,
} from "../../lib/fotoperfil";
import {
  prepararFotoPerfil,
  TAMANO_MAXIMO_ORIGINAL,
  TIPOS_FOTO,
} from "../../lib/imagen";
import { actualizarNombre } from "../../lib/sesion";
import { validarPassword } from "../../lib/validaciones";

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

// Estado de envío de cada sección del formulario
interface EstadoEnvio {
  enviando: boolean;
  mensajeError: string;
  mensajeExito: string;
}

const ENVIO_INICIAL: EstadoEnvio = {
  enviando: false,
  mensajeError: "",
  mensajeExito: "",
};

const GENEROS = ["Masculino", "Femenino", "Otro", "Prefiero no decirlo"];

const CLASE_ETIQUETA = "block text-sm font-semibold text-oriza-tinta/80 mb-2";
const CLASE_CAMPO =
  "block w-full px-3 py-2.5 bg-white border border-oriza-tinta/15 rounded-xl focus:ring-2 focus:ring-oriza-coral/40 focus:border-oriza-coral sm:text-sm transition-colors outline-none";
const CLASE_BOTON =
  "inline-flex items-center gap-2 bg-oriza-coral-fuerte text-white px-5 py-2.5 rounded-full font-bold hover:bg-oriza-coral-oscuro transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
const CLASE_BOTON_SECUNDARIO =
  "inline-flex items-center gap-2 bg-white text-oriza-tinta border border-oriza-tinta/15 px-5 py-2.5 rounded-full font-bold hover:bg-oriza-crema transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
const CLASE_TARJETA = "bg-white rounded-3xl p-6 sm:p-8 shadow-sm shadow-oriza-tinta/5";

// Fecha local de hoy en formato AAAA-MM-DD, límite del campo de fecha
const ahora = new Date();
const hoy = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;

// Alertas de error y éxito de una sección (patrón mensajeError / mensajeExito)
function alertas(estado: EstadoEnvio) {
  return (
    <div aria-live="polite">
      {estado.mensajeError && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
          {estado.mensajeError}
        </div>
      )}
      {estado.mensajeExito && (
        <div className="mb-5 p-3 bg-oriza-menta-suave text-oriza-menta-fuerte rounded-lg text-sm text-center font-medium">
          {estado.mensajeExito}
        </div>
      )}
    </div>
  );
}

function icono(enviando: boolean, Icono: typeof Save) {
  return enviando ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : (
    <Icono className="w-4 h-4" />
  );
}

export default function Ajustes() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  // Cambiarlo vuelve a disparar la carga (botón "Reintentar")
  const [intento, setIntento] = useState(0);

  // Foto de perfil
  const foto = useSyncExternalStore(suscribirFoto, obtenerFoto);
  const entradaFotoRef = useRef<HTMLInputElement>(null);
  const [envioFoto, setEnvioFoto] = useState(ENVIO_INICIAL);

  // Datos personales
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [envioDatos, setEnvioDatos] = useState(ENVIO_INICIAL);

  // Correo
  const [email, setEmail] = useState("");
  const [passwordCorreo, setPasswordCorreo] = useState("");
  const [envioCorreo, setEnvioCorreo] = useState(ENVIO_INICIAL);

  // Contraseña
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [envioPassword, setEnvioPassword] = useState(ENVIO_INICIAL);

  const rellenarFormulario = (datos: Usuario) => {
    setUsuario(datos);
    setNombre(datos.nombre);
    setApellido(datos.apellido);
    setFechaNacimiento(datos.fecha_nacimiento);
    setGenero(datos.genero);
    setEmail(datos.email);
  };

  useEffect(() => {
    let activo = true;
    cargarFoto();
    api
      .get<Usuario>("/usuarios/yo")
      .then((res) => {
        if (activo) rellenarFormulario(res.data);
      })
      .catch((err) => {
        if (activo) {
          setErrorCarga(
            obtenerMensajeError(err, "No pudimos cargar tu cuenta. Inténtalo de nuevo."),
          );
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [intento]);

  const reintentar = () => {
    setCargando(true);
    setErrorCarga("");
    setIntento((n) => n + 1);
  };

  const elegirFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    // Se limpia para poder volver a elegir el mismo archivo
    e.target.value = "";
    if (!archivo) return;

    if (!TIPOS_FOTO.includes(archivo.type)) {
      setEnvioFoto({ ...ENVIO_INICIAL, mensajeError: "La foto debe ser una imagen JPG, PNG o WEBP." });
      return;
    }
    if (archivo.size > TAMANO_MAXIMO_ORIGINAL) {
      setEnvioFoto({ ...ENVIO_INICIAL, mensajeError: "La imagen no puede superar los 10 MB." });
      return;
    }

    setEnvioFoto({ ...ENVIO_INICIAL, enviando: true });
    let fotoPreparada: Blob;
    try {
      fotoPreparada = await prepararFotoPerfil(archivo);
    } catch (err) {
      setEnvioFoto({
        ...ENVIO_INICIAL,
        mensajeError: err instanceof Error ? err.message : "No pudimos leer la imagen.",
      });
      return;
    }
    try {
      await subirFoto(fotoPreparada);
      setEnvioFoto({ ...ENVIO_INICIAL, mensajeExito: "Tu foto de perfil se actualizó." });
    } catch (err) {
      setEnvioFoto({
        ...ENVIO_INICIAL,
        mensajeError: obtenerMensajeError(err, "No se pudo subir tu foto."),
      });
    }
  };

  const eliminarFoto = async () => {
    setEnvioFoto({ ...ENVIO_INICIAL, enviando: true });
    try {
      await quitarFoto();
      setEnvioFoto({ ...ENVIO_INICIAL, mensajeExito: "Quitamos tu foto de perfil." });
    } catch (err) {
      setEnvioFoto({
        ...ENVIO_INICIAL,
        mensajeError: obtenerMensajeError(err, "No se pudo quitar tu foto."),
      });
    }
  };

  const guardarDatos = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvioDatos({ ...ENVIO_INICIAL, enviando: true });
    try {
      const res = await api.put<Usuario>("/usuarios/yo", {
        nombre,
        apellido,
        fecha_nacimiento: fechaNacimiento,
        genero,
      });
      rellenarFormulario(res.data);
      actualizarNombre(res.data.nombre);
      setEnvioDatos({ ...ENVIO_INICIAL, mensajeExito: "Tus datos se guardaron correctamente." });
    } catch (err) {
      setEnvioDatos({
        ...ENVIO_INICIAL,
        mensajeError: obtenerMensajeError(err, "No se pudieron guardar tus datos."),
      });
    }
  };

  const guardarCorreo = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvioCorreo({ ...ENVIO_INICIAL, enviando: true });
    try {
      const res = await api.put<Usuario>("/usuarios/yo/correo", {
        email,
        password_actual: passwordCorreo,
      });
      rellenarFormulario(res.data);
      setPasswordCorreo("");
      setEnvioCorreo({ ...ENVIO_INICIAL, mensajeExito: "Tu correo se actualizó correctamente." });
    } catch (err) {
      setEnvioCorreo({
        ...ENVIO_INICIAL,
        mensajeError: obtenerMensajeError(err, "No se pudo actualizar tu correo."),
      });
    }
  };

  const guardarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorPassword = validarPassword(passwordNueva, confirmacion);
    if (errorPassword) {
      setEnvioPassword({ ...ENVIO_INICIAL, mensajeError: errorPassword });
      return;
    }
    setEnvioPassword({ ...ENVIO_INICIAL, enviando: true });
    try {
      await api.put("/usuarios/yo/contrasena", {
        password_actual: passwordActual,
        password: passwordNueva,
        confirm_password: confirmacion,
      });
      setPasswordActual("");
      setPasswordNueva("");
      setConfirmacion("");
      setEnvioPassword({ ...ENVIO_INICIAL, mensajeExito: "Tu contraseña se cambió correctamente." });
    } catch (err) {
      setEnvioPassword({
        ...ENVIO_INICIAL,
        mensajeError: obtenerMensajeError(err, "No se pudo cambiar tu contraseña."),
      });
    }
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-10 h-10 text-oriza-coral animate-spin mb-3" />
        <p className="text-oriza-tinta/70 font-semibold">Cargando tu cuenta…</p>
      </div>
    );
  }

  if (errorCarga || !usuario) {
    return (
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 mb-4 text-oriza-coral-fuerte" />
        <p className="text-oriza-tinta font-extrabold text-lg">Algo salió mal</p>
        <p className="text-oriza-tinta/70 text-sm mt-2 max-w-sm">
          {errorCarga || "No pudimos cargar tu cuenta."}
        </p>
        <button onClick={reintentar} className={`mt-5 ${CLASE_BOTON}`}>
          <RotateCcw className="w-4 h-4" />
          Reintentar
        </button>
      </div>
    );
  }

  const inicialesUsuario =
    `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-oriza-tinta">
          Ajustes de tu cuenta
        </h1>
        <p className="text-oriza-tinta/70 mt-1">
          Actualiza tu foto, tus datos personales, tu correo y tu contraseña.
        </p>
      </div>

      {/* ================= FOTO DE PERFIL ================= */}
      <section className={CLASE_TARJETA}>
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-oriza-tinta mb-5">
          <Camera className="w-5 h-5 text-oriza-coral-fuerte" />
          Foto de perfil
        </h2>
        {alertas(envioFoto)}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar
            tamano="w-24 h-24"
            iniciales={inicialesUsuario}
            claseTexto="text-3xl"
          />
          <div className="flex flex-col items-center sm:items-start gap-3">
            <p className="text-sm text-oriza-tinta/70 text-center sm:text-left">
              JPG, PNG o WEBP de hasta 10 MB. La recortamos en un cuadrado.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <input
                ref={entradaFotoRef}
                type="file"
                accept={TIPOS_FOTO.join(",")}
                onChange={elegirFoto}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => entradaFotoRef.current?.click()}
                disabled={envioFoto.enviando}
                className={CLASE_BOTON}
              >
                {icono(envioFoto.enviando, Camera)}
                {foto ? "Cambiar foto" : "Subir foto"}
              </button>
              {foto && (
                <button
                  type="button"
                  onClick={eliminarFoto}
                  disabled={envioFoto.enviando}
                  className={CLASE_BOTON_SECUNDARIO}
                >
                  <Trash2 className="w-4 h-4" />
                  Quitar foto
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= DATOS PERSONALES ================= */}
      <section className={CLASE_TARJETA}>
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-oriza-tinta mb-5">
          <UserRound className="w-5 h-5 text-oriza-coral-fuerte" />
          Datos personales
        </h2>
        {alertas(envioDatos)}
        <form onSubmit={guardarDatos} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="nombre" className={CLASE_ETIQUETA}>
                Nombre
              </label>
              <input
                id="nombre"
                required
                maxLength={50}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={CLASE_CAMPO}
              />
            </div>
            <div>
              <label htmlFor="apellido" className={CLASE_ETIQUETA}>
                Apellido
              </label>
              <input
                id="apellido"
                required
                maxLength={50}
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className={CLASE_CAMPO}
              />
            </div>
            <div>
              <label htmlFor="fecha_nacimiento" className={CLASE_ETIQUETA}>
                Fecha de nacimiento
              </label>
              <input
                id="fecha_nacimiento"
                type="date"
                required
                max={hoy}
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                className={CLASE_CAMPO}
              />
            </div>
            <div>
              <label htmlFor="genero" className={CLASE_ETIQUETA}>
                Género
              </label>
              <select
                id="genero"
                required
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                className={CLASE_CAMPO}
              >
                {GENEROS.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={envioDatos.enviando} className={CLASE_BOTON}>
              {icono(envioDatos.enviando, Save)}
              Guardar datos
            </button>
          </div>
        </form>
      </section>

      {/* ================= CORREO ================= */}
      <section className={CLASE_TARJETA}>
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-oriza-tinta mb-1">
          <Mail className="w-5 h-5 text-oriza-coral-fuerte" />
          Correo electrónico
        </h2>
        <p className="text-sm text-oriza-tinta/70 mb-5">
          Es el correo con el que inicias sesión. Para cambiarlo, confirma tu
          contraseña actual.
        </p>
        {alertas(envioCorreo)}
        <form onSubmit={guardarCorreo} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="email" className={CLASE_ETIQUETA}>
                Correo
              </label>
              <input
                id="email"
                type="email"
                required
                maxLength={100}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={CLASE_CAMPO}
              />
            </div>
            <div>
              <label htmlFor="password_correo" className={CLASE_ETIQUETA}>
                Contraseña actual
              </label>
              <input
                id="password_correo"
                type="password"
                required
                autoComplete="current-password"
                value={passwordCorreo}
                onChange={(e) => setPasswordCorreo(e.target.value)}
                className={CLASE_CAMPO}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={envioCorreo.enviando || email === usuario.email}
              className={CLASE_BOTON}
            >
              {icono(envioCorreo.enviando, Save)}
              Cambiar correo
            </button>
          </div>
        </form>
      </section>

      {/* ================= CONTRASEÑA ================= */}
      <section className={CLASE_TARJETA}>
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-oriza-tinta mb-1">
          <Lock className="w-5 h-5 text-oriza-coral-fuerte" />
          Contraseña
        </h2>
        <p className="text-sm text-oriza-tinta/70 mb-5">
          Usa al menos 12 caracteres e incluye un símbolo.
        </p>
        {alertas(envioPassword)}
        <form onSubmit={guardarPassword} className="space-y-5">
          <div>
            <label htmlFor="password_actual" className={CLASE_ETIQUETA}>
              Contraseña actual
            </label>
            <input
              id="password_actual"
              type="password"
              required
              autoComplete="current-password"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              className={CLASE_CAMPO}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="password_nueva" className={CLASE_ETIQUETA}>
                Nueva contraseña
              </label>
              <input
                id="password_nueva"
                type="password"
                required
                autoComplete="new-password"
                value={passwordNueva}
                onChange={(e) => setPasswordNueva(e.target.value)}
                className={CLASE_CAMPO}
              />
            </div>
            <div>
              <label htmlFor="confirmacion" className={CLASE_ETIQUETA}>
                Confirmar nueva contraseña
              </label>
              <input
                id="confirmacion"
                type="password"
                required
                autoComplete="new-password"
                value={confirmacion}
                onChange={(e) => setConfirmacion(e.target.value)}
                className={CLASE_CAMPO}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={envioPassword.enviando} className={CLASE_BOTON}>
              {icono(envioPassword.enviando, Save)}
              Cambiar contraseña
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
