import { useEffect, useRef, useState } from "react";
import { Mail, Lock, ArrowRight, User, Calendar, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Tiempo máximo de espera de la respuesta del servidor
const TIEMPO_LIMITE_MS = 20000;

// Un símbolo es cualquier carácter que no sea letra, número ni espacio (igual que en schemas/user.py)
const tieneSimbolo = (texto: string) => /[^\p{L}\p{N}\s]/u.test(texto);

export default function SignForm() {
  const navigate = useNavigate();
  const alertaRef = useRef<HTMLDivElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfpassword] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  // Lleva la alerta a la vista: el botón queda al final del formulario y el mensaje arriba
  useEffect(() => {
    if (mensajeError || mensajeExito) {
      alertaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [mensajeError, mensajeExito]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    setMensajeError("");
    setMensajeExito("");

    // Validar la contraseña y que ambas coincidan antes de enviar
    if (password.length < 12) {
      setMensajeError("La contraseña debe tener al menos 12 caracteres.");
      return;
    }

    if (!tieneSimbolo(password)) {
      setMensajeError(
        "La contraseña debe incluir al menos un símbolo (por ejemplo: ! @ # $ % - _).",
      );
      return;
    }

    if (password !== confirmpassword) {
      setMensajeError("Las contraseñas no coinciden.");
      return;
    }

    const payload = {
      nombre,
      apellido,
      email,
      password,
      confirm_password: confirmpassword,
      fecha_nacimiento: fechaNacimiento,
      genero: genero,
    };

    setEnviando(true);
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE_MS);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controlador.signal,
      });

      // Un error del servidor puede no venir en JSON
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setMensajeExito("¡Cuenta creada correctamente! Te llevamos a iniciar sesión...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMensajeError(
          typeof data.detail === "string"
            ? data.detail
            : "Error al registrar la cuenta.",
        );
      }
    } catch (error) {
      setMensajeError(
        error instanceof DOMException && error.name === "AbortError"
          ? "El servidor tardó demasiado en responder. Inténtalo de nuevo."
          : "No se pudo conectar con el servidor. Asegúrate de que FastAPI esté corriendo.",
      );
    } finally {
      clearTimeout(temporizador);
      setEnviando(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-oriza-tinta/5">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-oriza-tinta mb-2">
          Crea tu cuenta
        </h2>
        <p className="text-oriza-tinta/70">
          Únete a OrizaLearn y comienza a escalar hasta la cima
        </p>
      </div>

      <div ref={alertaRef} aria-live="polite">
        {/* Alerta visual de Error */}
        {mensajeError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {mensajeError}
          </div>
        )}

        {/* Alerta visual de Éxito */}
        {mensajeExito && (
          <div className="mb-6 p-3 bg-oriza-menta-suave border border-oriza-menta/40 text-oriza-menta-fuerte rounded-lg text-sm text-center">
            {mensajeExito}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid para poner Nombre y Apellido en la misma fila */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-semibold text-oriza-tinta/80 mb-2"
              htmlFor="nombre"
            >
              Nombre(s)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-oriza-tinta/40" />
              </div>
              <input
                id="nombre"
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-oriza-tinta/15 rounded-xl focus:ring-2 focus:ring-oriza-coral/40 focus:border-oriza-coral sm:text-sm transition-colors outline-none"
                placeholder="Nombre(s)"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-semibold text-oriza-tinta/80 mb-2"
              htmlFor="apellido"
            >
              Apellidos
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-oriza-tinta/40" />
              </div>
              <input
                id="apellido"
                type="text"
                required
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-oriza-tinta/15 rounded-xl focus:ring-2 focus:ring-oriza-coral/40 focus:border-oriza-coral sm:text-sm transition-colors outline-none"
                placeholder="Apellidos"
              />
            </div>
          </div>
        </div>

        {/* Campo de Correo */}
        <div>
          <label
            className="block text-sm font-semibold text-oriza-tinta/80 mb-2"
            htmlFor="email"
          >
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-oriza-tinta/40" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-oriza-tinta/15 rounded-xl focus:ring-2 focus:ring-oriza-coral/40 focus:border-oriza-coral sm:text-sm transition-colors outline-none"
              placeholder="correo@correo.com"
            />
          </div>
        </div>

        {/* Campo de fecha de nacimiento */}
        <div>
          <label
            className="block text-sm font-semibold text-oriza-tinta/80 mb-2"
            htmlFor="date"
          >
            Fecha de nacimiento
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-oriza-tinta/40" />
            </div>
            <input
              type="date"
              required
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-oriza-tinta/15 rounded-xl focus:ring-2 focus:ring-oriza-coral/40 focus:border-oriza-coral sm:text-sm transition-colors outline-none"
            />
          </div>
        </div>

        {/* Selección de Género */}
        <div>
          <label className="block text-sm font-semibold text-oriza-tinta/80 mb-2">
            Género
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-oriza-tinta/40" />
            </div>
            <select
              required
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-oriza-tinta/15 rounded-xl focus:ring-2 focus:ring-oriza-coral/40 focus:border-oriza-coral sm:text-sm transition-colors outline-none bg-white"
            >
              <option value="">Seleccione su género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
            </select>
          </div>
        </div>

        {/* Campo de Contraseña */}
        <div>
          <label
            className="block text-sm font-semibold text-oriza-tinta/80 mb-2"
            htmlFor="password"
          >
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-oriza-tinta/40" />
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-oriza-tinta/15 rounded-xl focus:ring-2 focus:ring-oriza-coral/40 focus:border-oriza-coral sm:text-sm transition-colors outline-none"
              placeholder="••••••••"
            />
          </div>
          <p className="mt-2 text-xs text-oriza-tinta/60">
            Mínimo 12 caracteres e incluir al menos un símbolo (! @ # $ % - _).
          </p>
        </div>

        {/* Campo de Confirmar Contraseña */}
        <div>
          <label
            className="block text-sm font-semibold text-oriza-tinta/80 mb-2"
            htmlFor="confirmpassword"
          >
            Confirmar Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-oriza-tinta/40" />
            </div>
            <input
              id="confirmpassword"
              type="password"
              required
              value={confirmpassword}
              onChange={(e) => setConfpassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-oriza-tinta/15 rounded-xl focus:ring-2 focus:ring-oriza-coral/40 focus:border-oriza-coral sm:text-sm transition-colors outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Botón de Submit */}
        <button
          type="submit"
          disabled={enviando || Boolean(mensajeExito)}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-full text-base font-bold text-white bg-oriza-coral-fuerte hover:bg-oriza-coral-oscuro focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oriza-coral transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {enviando ? (
            <>
              Creando cuenta...
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Crear cuenta
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Enlace al login */}
      <div className="mt-8 text-center text-sm text-oriza-tinta/70">
        ¿Ya tienes una cuenta?{" "}
        <Link
          to="/login"
          className="font-bold text-oriza-coral-fuerte hover:text-oriza-coral-oscuro transition-colors"
        >
          Inicia sesión
        </Link>
      </div>
    </div>
  );
}
