import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/authlayout";

// Componentes temporales (Mockups) para ver el enrutamiento funcionar
const LoginMock = () => (
  <div className="text-center">
    <h1 className="text-3xl font-bold text-oriza-header mb-8">
      Inicio de sesión
    </h1>
    <div className="h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
      Inicia sesión aquí
    </div>
  </div>
);

const RegisterMock = () => (
  <div className="text-center">
    <h1 className="text-3xl font-bold text-oriza-header mb-8">Registro</h1>
    <div className="h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
      Registrate aquí
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de Autenticación envueltas en su Layout */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginMock />
            </AuthLayout>
          }
        />

        <Route
          path="/registro"
          element={
            <AuthLayout>
              <RegisterMock />
            </AuthLayout>
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
