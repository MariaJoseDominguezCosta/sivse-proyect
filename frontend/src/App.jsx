// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EgresadoLayout from "./components/EgresadoLayout";
import AdminLayout from "./components/admin/AdminLayout";
import Profile from "./pages/EgresadoDashboard";
import Vacantes from "./pages/Vacantes";
import Favoritos from "./pages/Favoritos";
import Dashboard from './pages/admin/AdminDashboard';
import CompanyManagement from './pages/admin/GestionEmpresas';
import EditCompany from './components/admin/EditCompany';
import RegisterCompany from './components/admin/RegisterCompany';
import JobBoard from './pages/admin/BolsaTrabajo';
import EditVacancy from './components/admin/EditVacancy';
import RegisterVacancy from './components/admin/RegisterVacancy';
import AlumniTracking from './pages/admin/SeguimientoEgresados';
import AlumniDetail from './components/admin/AlumniDetail';
import ReportsStats from './pages/admin/ReportsStats';
import PrivateRoute from "./components/PrivateRoute";
import "./app.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/egresado-dashboard"
          element={<PrivateRoute allowedRoles={["egresado"]} />}
        >
          <Route path="" element={<EgresadoLayout />}>
            <Route path="profile" element={<Profile />} />
            <Route path="vacantes" element={<Vacantes />} />
            <Route path="favoritos" element={<Favoritos />} />
          </Route>
        </Route>
        <Route path="/admin" element={<AdminLayout title="SIVSE"><Dashboard /></AdminLayout>} />
        <Route path="/admin/empresas" element={<AdminLayout title="Gestión de Empresas"><CompanyManagement /></AdminLayout>} />
        <Route path="/admin/empresas/register" element={<AdminLayout title="Registrar Nueva Empresa"><RegisterCompany /></AdminLayout>} />
        <Route path="/admin/empresas/edit/:id" element={<AdminLayout title="Editar Empresa"><EditCompany /></AdminLayout>} />
        <Route path="/admin/vacantes" element={<AdminLayout title="Bolsa de Trabajo"><JobBoard /></AdminLayout>} />
        <Route path="/admin/vacantes/register" element={<AdminLayout title="Registrar Nueva Vacante"><RegisterVacancy /></AdminLayout>} />
        <Route path="/admin/vacantes/edit/:id" element={<AdminLayout title="Editar Vacante"><EditVacancy /></AdminLayout>} />
        <Route path="/admin/egresados" element={<AdminLayout title="Seguimiento de Egresados"><AlumniTracking /></AdminLayout>} />
        <Route path="/admin/egresados/:id" element={<AdminLayout title="Detalle de Perfil de Egresado"><AlumniDetail /></AdminLayout>} />
        <Route path="/admin/reportes" element={<AdminLayout title="Reportes y Estadísticas"><ReportsStats /></AdminLayout>} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
