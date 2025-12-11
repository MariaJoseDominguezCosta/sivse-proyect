import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/common/PrivateRoute';

// Common Pages
import Login from './pages/common/Login';
import RegisterEgresado from './pages/common/RegisterEgresado';
import RecoverPassword from './pages/common/RecoverPassword';
import AdminLayout from './layouts/AdminLayout';
import EgresadoLayout from './layouts/EgresadoLayout';
import PublicLayout from './layouts/PublicLayout';

// Pages Admin
import DashboardAdmin from './pages/admin/DashboardAdmin';
import CompanyManagement from './pages/admin/CompanyManagement';
import EditCompany from './pages/admin/EditCompany';
import RegisterCompany from './pages/admin/RegisterCompany';
import JobBoard from './pages/admin/BolsaTrabajo';
import EditVacancy from './pages/admin/EditVacancy';
import RegisterVacancy from './pages/admin/RegisterVacancy';
import AlumniTracking from './pages/admin/SeguimientoEgresados';
import AlumniDetail from './pages/admin/AlumniDetail';
import ReportsStats from './pages/admin/ReportsStats';
import VacanteManagement from './pages/admin/VacanteManagement';
import RegisterAdmin from './pages/admin/RegisterAdmin';

// Pages Egresados
import DashboardEgresado from './pages/egresados/DashboardEgresado';
import EditPerfil from './pages/egresados/EditPerfil';
import FavoritesList from './pages/egresados/FavoritesList';
import VacantesList from './pages/egresados/VacantesList';
import VacanteDetail from './pages/egresados/VacanteDetail';

// **NUEVO COMPONENTE:** Lógica de Inactividad Separada
const InactivityMonitor = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  
  // La lógica de inactividad solo debe ejecutarse si isAuthenticated es TRUE
  useEffect(() => {
    if (!isAuthenticated) return; // Salir si no está autenticado

    let inactivityTimeoutId;
    let warningTimeoutId;

    // Configuración del tiempo de inactividad
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
    const WARNING_TIMEOUT = 1 * 60 * 1000;

    const resetTimeout = () => {
      clearTimeout(inactivityTimeoutId);
      clearTimeout(warningTimeoutId);

      // ... (Lógica de advertencia de timeout, es la misma) ...
      warningTimeoutId = setTimeout(() => {
        toast.warn('Tu sesión está a punto de expirar. ¿Deseas permanecer activo?', {
          position: 'top-right',
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          onClose: () => resetTimeout(), 
          action: {
            label: 'Permanecer Activo',
            onClick: () => resetTimeout(),
          },
        });
      }, INACTIVITY_TIMEOUT - WARNING_TIMEOUT);


      // Cierre de sesión después del tiempo total
      inactivityTimeoutId = setTimeout(() => {
        localStorage.removeItem('token');
        navigate('/');
        toast.info('Sesión cerrada por inactividad.', { autoClose: 3000 });
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimeout));
    resetTimeout();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimeout));
      clearTimeout(inactivityTimeoutId);
      clearTimeout(warningTimeoutId);
    };
  }, [navigate, isAuthenticated]); // Re-ejecutar solo si isAuthenticated cambia

  return null; // Este componente no renderiza nada visible
};


const AppContent = () => {
  // Se usa useNavigate aquí, pero el hook no se usa directamente en esta función
  return (
    <Routes>
      {/* Common views */}
      <Route path="/" element={<PublicLayout> <Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><RegisterEgresado /></PublicLayout>} />
      <Route path="/recover" element={<PublicLayout><RecoverPassword /></PublicLayout>} />

      {/* Admin routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout title="Bienvenido/a"><DashboardAdmin /></AdminLayout>} />
        <Route path="/admin/empresas" element={<AdminLayout title="Empresas"><CompanyManagement /></AdminLayout>} />
        <Route path="/admin/empresas/register" element={<AdminLayout title="Registrar Empresa"><RegisterCompany /></AdminLayout>} />
        <Route path="/admin/empresas/edit/:id" element={<AdminLayout title="Editar Empresa"><EditCompany /></AdminLayout>} />
        <Route path="/admin/vacantes" element={<AdminLayout title="Bolsa de Trabajo"><JobBoard /></AdminLayout>} />
        <Route path="/admin/vacantes/register" element={<AdminLayout title="Registrar Vacante"><RegisterVacancy /></AdminLayout>} />
        <Route path="/admin/vacantes/edit/:id" element={<AdminLayout title="Editar Vacante"><EditVacancy /></AdminLayout>} />
        <Route path="/admin/empresas/:empresa_id/vacantes" element={<AdminLayout title="Gestión de Vacantes"><VacanteManagement /></AdminLayout>} />
        <Route path="/admin/egresados" element={<AdminLayout title="Egresados"><AlumniTracking /></AdminLayout>} />
        <Route path="/admin/egresados/:id" element={<AdminLayout title="Detalle de Egresado"><AlumniDetail /></AdminLayout>} />
        <Route path="/admin/register-admin" element={<AdminLayout title="Registrar Administrador"><RegisterAdmin /></AdminLayout>} />
        <Route path="/admin/reportes" element={<AdminLayout title="Reportes"><ReportsStats /></AdminLayout>} />
      </Route>

       {/* Egresado routes */}
      <Route element={<PrivateRoute allowedRoles={['egresado']} />}>
        <Route path="/egresado" element={<EgresadoLayout title=""><DashboardEgresado /></EgresadoLayout>} />
        <Route path="/egresados/perfil/edit" element={<EgresadoLayout title="Perfil del Egresado"><EditPerfil /></EgresadoLayout>} /> {/* Título corregido según imagen */}
        <Route path="/egresados/favoritos" element={<EgresadoLayout title="Favoritos"><FavoritesList /></EgresadoLayout>} />
        <Route path="/egresados/vacantes" element={<EgresadoLayout title="Vacantes"><VacantesList /></EgresadoLayout>} />
        <Route path="/egresados/vacantes/:id" element={<EgresadoLayout title="Detalle de Vacante"><VacanteDetail /></EgresadoLayout>} /> {/* Título corregido según imagen */}
      </Route>
    </Routes>
  );
};

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <Router>
      <ToastContainer />
      <InactivityMonitor isAuthenticated={isAuthenticated} /> {/* Renderizar el monitor aquí */}
      <AppContent />
    </Router>
  );
}

export default App;