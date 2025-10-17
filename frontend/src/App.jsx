// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EgresadoLayout from './layouts/EgresadoLayout';
import AdminLayout from './layouts/AdminLayout';
import Profile from './pages/EgresadoDashboard';
import Vacantes from './pages/Vacantes';
import Favoritos from './pages/Favoritos';
import AdminDashboard from './pages/AdminDashboard';
import SeguimientoEgresados from './pages/SeguimientoEgresados';
import BolsaTrabajo from './pages/BolsaTrabajo';
import GestionEmpresas from './pages/GestionEmpresas';
import Reportes from './pages/Reportes';
import PrivateRoute from './components/PrivateRoute';
import './app.css';

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
          element={<PrivateRoute allowedRoles={['egresado']} />}
        >
          <Route path="" element={<EgresadoLayout />}>
            <Route path="profile" element={<Profile />} />
            <Route path="vacantes" element={<Vacantes />} />
            <Route path="favoritos" element={<Favoritos />} />
          </Route>
        </Route>
        <Route
          path="/admin-dashboard"
          element={<PrivateRoute allowedRoles={['admin']} />}
        >
          <Route path="" element={<AdminLayout />}>
            <Route path="" element={<AdminDashboard />} />
            <Route path="seguimiento-egresados" element={<SeguimientoEgresados />} />
            <Route path="bolsa-trabajo" element={<BolsaTrabajo />} />
            <Route path="gestion-empresas" element={<GestionEmpresas />} />
            <Route path="reportes" element={<Reportes />} />
          </Route>
        </Route>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;