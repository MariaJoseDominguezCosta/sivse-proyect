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

// Pages Admin
import DashboardAdmin from './pages/admin/DashboardAdmin';
import CompanyManagement from './pages/admin/CompanyManagement';
import EditCompany from './components/admin/EditCompany';
import RegisterCompany from './pages/admin/RegisterCompany';
import JobBoard from './pages/admin/BolsaTrabajo';
import EditVacancy from './components/admin/EditVacancy';
import RegisterVacancy from './components/admin/RegisterVacancy';
import AlumniTracking from './pages/admin/SeguimientoEgresados';
import AlumniDetail from './pages/admin/AlumniDetail';
import ReportsStats from './pages/admin/ReportsStats';
import VacanteManagement from './pages/admin/VacanteManagement';

// Pages Egresados
import DashboardEgresado from './pages/egresados/DashboardEgresado';
import EditPerfil from './pages/egresados/EditPerfil';
import FavoritesList from './pages/egresados/FavoritesList';
import VacantesList from './pages/egresados/VacantesList';
import VacanteDetail from './components/egresados/VacanteDetail';

const AppContent = () => {
  const navigate = useNavigate();

  // Configuración del tiempo de inactividad (15 minutos total, aviso a 1 minuto del final)
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutos
  const WARNING_TIMEOUT = 1 * 60 * 1000; // 1 minuto de advertencia

  useEffect(() => {
    let inactivityTimeoutId;
    let warningTimeoutId;

    // Función para reiniciar el temporizador
    const resetTimeout = () => {
      clearTimeout(inactivityTimeoutId);
      clearTimeout(warningTimeoutId);

      // Establecer advertencia 1 minuto antes del cierre
      warningTimeoutId = setTimeout(() => {
        toast.warn('Tu sesión está a punto de expirar. ¿Deseas permanecer activo?', {
          position: 'top-right',
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          onClose: () => resetTimeout(), // Reinicia si el usuario cierra la notificación
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

    // Agregar event listeners para detectar actividad
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimeout));

    // Iniciar el temporizador al montar el componente
    resetTimeout();

    // Limpieza al desmontar el componente
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimeout));
      clearTimeout(inactivityTimeoutId);
      clearTimeout(warningTimeoutId);
    };
  }, [navigate, INACTIVITY_TIMEOUT, WARNING_TIMEOUT]);

  // Verificar si hay token para redirigir a login si no está autenticado
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      {/* Common views */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/admin" /> : <Login />} />
      <Route path="/register" element={<RegisterEgresado />} />
      <Route path="/recover" element={<RecoverPassword />} />

      {/* Admin routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout title="Dashboard"><DashboardAdmin /></AdminLayout>} />
        <Route path="/admin/empresas" element={<AdminLayout title="Empresas"><CompanyManagement /></AdminLayout>} />
        <Route path="/admin/empresas/register" element={<AdminLayout title="Registrar Empresa"><RegisterCompany /></AdminLayout>} />
        <Route path="/admin/empresas/edit/:id" element={<AdminLayout title="Editar Empresa"><EditCompany /></AdminLayout>} />
        <Route path="/admin/vacantes" element={<AdminLayout title="Vacantes"><JobBoard /></AdminLayout>} />
        <Route path="/admin/vacantes/register" element={<AdminLayout title="Registrar Vacante"><RegisterVacancy /></AdminLayout>} />
        <Route path="/admin/vacantes/edit/:id" element={<AdminLayout title="Editar Vacante"><EditVacancy /></AdminLayout>} />
        <Route path="/admin/empresas/:empresaId/vacantes" element={<AdminLayout title="Gestión de Vacantes"><VacanteManagement /></AdminLayout>} />
        <Route path="/admin/egresados" element={<AdminLayout title="Egresados"><AlumniTracking /></AdminLayout>} />
        <Route path="/admin/egresados/:id" element={<AdminLayout title="Detalle de Egresado"><AlumniDetail /></AdminLayout>} />
        <Route path="/admin/reportes" element={<AdminLayout title="Reportes"><ReportsStats /></AdminLayout>} />
      </Route>

      {/* Egresado routes */}
      <Route element={<PrivateRoute allowedRoles={['egresado']} />}>
        <Route path="/egresado" element={<EgresadoLayout title="Dashboard"><DashboardEgresado /></EgresadoLayout>} />
        <Route path="/egresados/perfil/edit" element={<EgresadoLayout title="Editar Perfil"><EditPerfil /></EgresadoLayout>} />
        <Route path="/egresados/favoritos" element={<EgresadoLayout title="Favoritos"><FavoritesList /></EgresadoLayout>} />
        <Route path="/egresados/vacantes" element={<EgresadoLayout title="Vacantes"><VacantesList /></EgresadoLayout>} />
        <Route path="/egresados/vacantes/:id" element={<EgresadoLayout title="Detalle de Vacante"><VacanteDetail /></EgresadoLayout>} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <ToastContainer />
      <AppContent />
    </Router>
  );
}

export default App;