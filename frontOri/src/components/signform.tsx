import { useState } from "react";
import { Mail, Lock, ArrowRight, User, Calendar } from "lucide-react"; // Importar User
import { Link } from "react-router-dom";

export default function SignForm() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfpassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá la lógica de conexión a la API (FastAPI)
    console.log("Registrando nuevo usuario:", {
      nombre,
      apellido,
      email,
      fechaNacimiento,
      genero,
      password,
      confirmpassword,
    }); // Por el momento estas para el registro
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-oriza-header mb-2">
          Crea tu cuenta
        </h2>
        <p className="text-gray-500">
          Únete a OrizaLearn y comienza a escalar hasta la cima
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid para poner Nombre y Apellido en la misma fila */}
        <div className="grid grid-cols-2 gap-4">
          {/* Campo de Nombre */}
          <div>
            <label
              className="block text-sm font-medium text-oriza-header mb-2"
              htmlFor="nombre"
            >
              Nombre(s)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="nombre"
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oriza-darkest focus:border-oriza-darkest sm:text-sm transition-colors outline-none"
                placeholder="Nombre(s)"
              />
            </div>
          </div>

          {/* Campo de Apellido */}
          <div>
            <label
              className="block text-sm font-medium text-oriza-header mb-2"
              htmlFor="apellido"
            >
              Apellidos
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="apellido"
                type="text"
                required
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oriza-darkest focus:border-oriza-darkest sm:text-sm transition-colors outline-none"
                placeholder="Apellidos"
              />
            </div>
          </div>
        </div>

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
              placeholder="**@correo.com"
            />
          </div>
        </div>

        {/* Campo de fecha de nacimiento */}
        <div>
          <label
            className="block text-sm font-medium text-oriza-header mb-2"
            htmlFor="date"
          >
            Fecha de nacimiento
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              required
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oriza-darkest focus:border-oriza-darkest sm:text-sm transition-colors outline-none"
            />
          </div>
        </div>

        {/* Selección de Género */}
        <div>
          <label className="block text-sm font-medium text-oriza-header mb-2">
            Género
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <select
              required
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oriza-darkest focus:border-oriza-darkest sm:text-sm transition-colors outline-none"
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
            className="block text-sm font-medium text-oriza-header mb-2"
            htmlFor="password"
          >
            Contraseña
          </label>
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
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Campo de  Confirmar Contraseña */}
        <div>
          <label
            className="block text-sm font-medium text-oriza-header mb-2"
            htmlFor="confirmpassword"
          >
            Confirmar Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmpassword"
              type="password"
              required
              value={confirmpassword}
              onChange={(e) => setConfpassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oriza-darkest focus:border-oriza-darkest sm:text-sm transition-colors outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Botón de Submit */}
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-oriza-darkest hover:bg-oriza-header focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oriza-darkest transition-all"
        >
          Crear cuenta
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Enlace al login */}
      <div className="mt-8 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <Link
          to="/login"
          className="font-medium text-oriza-darkest hover:text-blue-700 transition-colors"
        >
          Inicia sesión
        </Link>
      </div>
    </div>
  );
}
