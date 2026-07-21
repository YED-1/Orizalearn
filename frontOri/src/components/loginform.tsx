import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Añadimos useNavigate

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados para manejar los mensajes de éxito o error
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  // Inicializamos el hook de navegación
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiamos mensajes previos
    setMensajeError("");
    setMensajeExito("");

    const payload = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMensajeExito("¡Inicio de sesión exitoso!");
        // Redirigimos al dashboard tras el éxito
        localStorage.setItem("userName", data.nombre || email);
        navigate("/dashboard");
      } else {
        setMensajeError(
          data.detail || "Error al iniciar sesión. Verifica tus credenciales.",
        );
      }
    } catch {
      setMensajeError(
        "No se pudo conectar con el servidor. Asegúrate de que FastAPI esté corriendo.",
      );
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-oriza-header mb-2">
          Bienvenido de vuelta
        </h2>
        <p className="text-gray-500">
          Ingresa tus credenciales para continuar tu aprendizaje.
        </p>
      </div>

      {/* Alertas de error o éxito */}
      {mensajeError && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">
          {mensajeError}
        </div>
      )}
      {mensajeExito && (
        <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center font-medium">
          {mensajeExito}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo de Correo */}
        <div>
          <label
            className="block text-sm font-medium text-oriza-header mb-2"
            htmlFor="email"
          >
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oriza-darkest focus:border-oriza-darkest sm:text-sm transition-colors outline-none"
            />
          </div>
        </div>

        {/* Campo de Contraseña */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              className="block text-sm font-medium text-oriza-header"
              htmlFor="password"
            >
              Contraseña
            </label>
            {/* Opción de recuperar contraseña */}
            <a
              href="#"
              className="text-sm font-medium text-oriza-darkest hover:text-blue-700 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oriza-darkest focus:border-oriza-darkest sm:text-sm transition-colors outline-none"
            />
          </div>
        </div>

        {/* Botón de Submit */}
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-oriza-darkest hover:bg-oriza-header focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oriza-darkest transition-all"
        >
          Iniciar Sesión
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Enlace al registro */}
      <div className="mt-8 text-center text-sm text-gray-600">
        ¿No tienes una cuenta?{" "}
        <Link
          to="/registro"
          className="font-medium text-oriza-darkest hover:text-blue-700 transition-colors"
        >
          Regístrate gratis
        </Link>
      </div>
    </div>
  );
}
