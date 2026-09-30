import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/authlayout";
import LoginForm from "./components/loginform";
import SignForm from "./components/signform";
import DashboardLayout from "./layouts/dashboardlayout";
import DashboardHome from "./components/dashboard/dasboardhome";
import MisCursos from "./components/dashboard/miscursos";
import DetalleCurso from "./components/dashboard/detallecurso";
import LandingPage from "./features/landing/landingpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página pública de inicio */}
        <Route path="/" element={<LandingPage />} />

        {/* Rutas de Autenticación */}
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

        {/* Rutas del Dashboard */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          }
        />

        <Route
          path="/dashboard/courses"
          element={
            <DashboardLayout>
              <MisCursos />
            </DashboardLayout>
          }
        />

        <Route
          path="/dashboard/cursos/:cursoId"
          element={
            <DashboardLayout>
              <DetalleCurso />
            </DashboardLayout>
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
