import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaBriefcase, FaBuilding, FaChartBar, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    // Redirigir a login, asumiendo ruta /login
    window.location.href = '/login';
  };

  return (
    <div className="sidebar">
      <div>
        <div className="logo">
          <img src="logo-tecnologico.png" alt="TecNM" width="317" height="100" />
        </div>
        <ul>
          <li><Link to="/admin"><FaHome /> Inicio</Link></li>
          <li><Link to="/admin/egresados"><FaUserGraduate /> Seguimiento de Egresados</Link></li>
          <li><Link to="/admin/vacantes"><FaBriefcase /> Bolsa de Trabajo</Link></li>
          <li><Link to="/admin/empresas"><FaBuilding /> Gestión de Empresas</Link></li>
          <li><Link to="/admin/reportes"><FaChartBar /> Reportes y Estadísticas</Link></li>
        </ul>
      </div>
      <div className="logout" onClick={handleLogout}>
        <FaSignOutAlt /> Cerrar Sesión
      </div>
    </div>
  );
};

export default Sidebar;