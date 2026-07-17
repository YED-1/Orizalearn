import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/authlayout";
import LoginForm from "./components/loginform";
import SignForm from "./components/signform";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de Autenticación envueltas en su Layout */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginForm />
            </AuthLayout>
          }
        />

        <Route
          path="/registro"
          element={
            <AuthLayout>
              <SignForm />
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
