// src/components/common/Header.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
// import '../../assets/Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null; // Mientras carga o no autenticado

  // Mapa de rutas → título (compartido)
  const getSectionTitle = (path) => {
    const map = {
      // Admin
      '/admin': 'Dashboard',
      '/admin/egresados': 'Seguimiento de Egresados',
      '/admin/egresados/:id': 'Perfil de Egresado',
      '/admin/empresas': 'Gestión de Empresas',
      '/admin/empresas/:id': 'Perfil de Empresa',
      '/admin/vacantes/:id': 'Detalle de Vacante',
      '/admin/vacantes': 'Bolsa de Trabajo',
      '/admin/empresas/register': 'Registrar Empresa',
      '/admin/vacantes/register': 'Publicar Vacante',
      '/admin/reportes': 'Reportes',

      // Egresado
      "/egresado": 'Dashboard',
      "/egresados/perfil": 'Mi Perfil',
      "/egresados/perfil/edit": 'Editar Perfil',
      "/egresados/favoritos": 'Favoritos',
      "/egresados/vacantes": 'Vacantes',
      "/egresados/vacantes/:id": 'Detalle de Vacante'
    };
    return map[path.split('?')[0]] || 'SIVSE';
  };

  const currentSection = getSectionTitle(location.pathname);

  // Navegación por rol
  const navItems = user.role === 'admin' ? [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Egresados', path: '/admin/egresados' },
    
    { label: 'Empresas', path: '/admin/empresas' },

    { label: 'Vacantes', path: '/admin/vacantes' },
    { label: 'Reportes', path: '/admin/reportes' },
  ] : [
    { label: 'Dashboard', path: '/egresado' },
    { label: 'Mi Perfil', path: '/egresados/perfil' },
    { label: 'Favoritos', path: '/egresados/favoritos' },
    { label: 'Vacantes', path: '/egresados/vacantes' },
  ];

  const handleNav = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <img 
          src="https://www.tecnm.mx/wp-content/uploads/2021/01/Logo-TecNM-horizontal-color.png" 
          alt="TecNM" 
          className="tecnm-logo"
        />
        <h1 className="app-title">SIVSE</h1>
        <span className="section-indicator">• {currentSection}</span>
      </div>

      <nav className="nav-desktop">
        <ul>
          {navItems.map(item => (
            <li key={item.path}>
              <button
                className={`nav-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="header-right">
        <span className={`role-badge role-${user.role}`}>
          {user.role === 'admin' ? 'ADMIN' : 'EGRESADO'}
        </span>
        <span className="user-name">{user.nombre_completo}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span></span><span></span><span></span>
      </button>

      {isMenuOpen && (
        <div className="mobile-menu">
          <ul>
            {navItems.map(item => (
              <li key={item.path}>
                <button
                  className={`nav-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                  onClick={() => handleNav(item.path)}
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li><button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;