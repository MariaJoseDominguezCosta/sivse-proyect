import React, { useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/common/PrivateRoute';
import "./app.css";

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


// Función de utilidad para Debounce
// Esto limita la frecuencia con la que se llama a una función.
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

// **NUEVO:** Componente de Acción para el Toast de Advertencia
const InactivityWarningContent = ({ closeToast, resetTimer }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <p style={{ margin: 0 }}>Tu sesión está a punto de expirar. ¿Deseas permanecer activo?</p>
    <button
      onClick={() => {
        resetTimer();   // Llama a la función para reiniciar los temporizadores
        closeToast();   // Cierra la notificación
      }}
      // Estilos para que se vea como un botón de acción simple
      style={{
        alignSelf: 'flex-start',
        padding: '6px 12px',
        backgroundColor: '#4CAF50', // Color verde para "activo"
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      Permanecer Activo
    </button>
  </div>
);


// **NUEVO COMPONENTE:** Lógica de Inactividad Separada
const InactivityMonitor = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  
  // La lógica de inactividad solo debe ejecutarse si isAuthenticated es TRUE
  
  // Usamos useCallback para que startTimer tenga una referencia estable
  const startTimer = useCallback(() => {
    
    // Si no está autenticado, simplemente salimos.
    if (!isAuthenticated) return; 

    // Limpiamos los timeouts si existen (no los manejamos como estado aquí)
    let inactivityTimeoutId = window.__inactivityTimeoutId;
    let warningTimeoutId = window.__warningTimeoutId;

    clearTimeout(inactivityTimeoutId);
    clearTimeout(warningTimeoutId);
    toast.dismiss(); // Asegura que se cierre cualquier toast de advertencia abierto

    // Temporizador de advertencia
    warningTimeoutId = setTimeout(() => {
      const CustomContent = ({ closeToast }) => (
        <InactivityWarningContent closeToast={closeToast} resetTimer={startTimer} />
      );

      toast.warn(CustomContent, {
        position: 'top-right',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      });
      window.__warningTimeoutId = warningTimeoutId;
    }, 15 * 60 * 1000 - 1 * 60 * 1000); // 14 minutos

    // Temporizador principal de inactividad
    inactivityTimeoutId = setTimeout(() => {
      localStorage.removeItem('token');
      navigate('/');
      toast.info('Sesión cerrada por inactividad.', { autoClose: 3000 });
      window.__inactivityTimeoutId = undefined; // Limpiar al expirar
      window.__warningTimeoutId = undefined;
    }, 15 * 60 * 1000); // 15 minutos

    // Almacenamos en el objeto global para poder accederlos desde fuera de este scope
    // Esto es una técnica para persistir timers sin usar useRef o useState, que son difíciles en listeners globales.
    window.__inactivityTimeoutId = inactivityTimeoutId;
    window.__warningTimeoutId = warningTimeoutId;

  }, [navigate, isAuthenticated]); // Dependencias

  useEffect(() => {
    if (!isAuthenticated) {
      // Limpiar en caso de logout manual
      clearTimeout(window.__inactivityTimeoutId);
      clearTimeout(window.__warningTimeoutId);
      toast.dismiss();
      return; 
    }

    // Usamos debouce para limitar la frecuencia con la que se llama a startTimer
    const DEBOUNCE_DELAY_MS = 1000; // Solo permitir una llamada a startTimer por segundo
    const debouncedStartTimer = debounce(startTimer, DEBOUNCE_DELAY_MS);

    // Eventos que reinician el temporizador
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];
    
    // Añadir event listeners
    events.forEach((event) => window.addEventListener(event, debouncedStartTimer));
    
    // Iniciar los temporizadores por primera vez
    startTimer();

    // Limpiar en el desmontaje del componente
    return () => {
      // Limpiar al desmontar
      clearTimeout(window.__inactivityTimeoutId);
      clearTimeout(window.__warningTimeoutId);
      toast.dismiss();

      // Remover listeners usando la misma referencia de función debounced
      events.forEach((event) => window.removeEventListener(event, debouncedStartTimer));
    };

  }, [isAuthenticated, startTimer]); // startTimer es una dependencia estable gracias a useCallback

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
      <InactivityMonitor isAuthenticated={isAuthenticated} /> {/* Renderizar el monitor aquí */}
      <AppContent />
    </Router>
  );
}

export default App;