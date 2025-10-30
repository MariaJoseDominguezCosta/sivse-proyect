import React, { useState } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar } from '@mui/material';
import { Home, People, Work, Business, BarChart, Logout } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(location.pathname); // Estado inicial basado en la ruta actual

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleClick = (path) => {
    setActiveSection(path); // Actualiza la sección activa al hacer clic
  };

  return (
    <Box sx={{ width: 250, bgcolor: '#223373', color: '#FFFDFD', height: '100vh', p: 2 }}>
      {/* Logo del Tecnológico */}
      <img src="/logo-tecnologico.png" alt="Logo" style={{ width: '100%', marginBottom: '16px' }} />
      {/* Ícono de usuario (Administrador) */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#FFFDFD' }}>
        <Avatar sx={{ bgcolor: '#4F378A', mr: 1 }}>A</Avatar>
        <span>Administrador</span>
      </Box>
      <List>
        <ListItem
          component={Link}
          to="/admin"
          onClick={() => handleClick('/admin')}
          sx={{
            bgcolor: activeSection === '/admin' ? '#FFE0E0' : 'transparent',
            color: activeSection === '/admin' ? '#1E1E1E' : '#FFFDFD',
            '&:hover': { bgcolor: activeSection === '/admin' ? '#FFE0E0' : 'rgba(255, 255, 255, 0.1)' },
            padding: '10px 15px',
            margin: '5px 0',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
          }}
        >
          <ListItemIcon>
            <Home sx={{ color: activeSection === '/admin' ? '#1E1E1E' : '#FFFDFD' }} />
          </ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItem>
        <ListItem
          component={Link}
          to="/admin/egresados"
          onClick={() => handleClick('/admin/egresados')}
          sx={{
            bgcolor: activeSection === '/admin/egresados' ? '#FFE0E0' : 'transparent',
            color: activeSection === '/admin/egresados' ? '#1E1E1E' : '#FFFDFD',
            '&:hover': { bgcolor: activeSection === '/admin/egresados' ? '#FFE0E0' : 'rgba(255, 255, 255, 0.1)' },
            padding: '10px 15px',
            margin: '5px 0',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
          }}
        >
          <ListItemIcon>
            <People sx={{ color: activeSection === '/admin/egresados' ? '#1E1E1E' : '#FFFFFF' }} />
          </ListItemIcon>
          <ListItemText primary="Seguimiento de Egresados" />
        </ListItem>
        <ListItem
          component={Link}
          to="/admin/vacantes"
          onClick={() => handleClick('/admin/vacantes')}
          sx={{
            bgcolor: activeSection === '/admin/vacantes' ? '#FFE0E0' : 'transparent',
            color: activeSection === '/admin/vacantes' ? '#1E1E1E' : '#FFFDFD',
            '&:hover': { bgcolor: activeSection === '/admin/vacantes' ? '#FFE0E0' : 'rgba(255, 255, 255, 0.1)' },
            padding: '10px 15px',
            margin: '5px 0',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
          }}
        >
          <ListItemIcon>
            <Work sx={{ color: activeSection === '/admin/vacantes' ? '#1E1E1E' : '#FFFDFD' }} />
          </ListItemIcon>
          <ListItemText primary="Bolsa de Trabajo" />
        </ListItem>
        <ListItem
          component={Link}
          to="/admin/empresas"
          onClick={() => handleClick('/admin/empresas')}
          sx={{
            bgcolor: activeSection === '/admin/empresas' ? '#FFE0E0' : 'transparent',
            color: activeSection === '/admin/empresas' ? '#1E1E1E' : '#FFFDFD',
            '&:hover': { bgcolor: activeSection === '/admin/empresas' ? '#FFE0E0' : 'rgba(255, 255, 255, 0.1)' },
            padding: '10px 15px',
            margin: '5px 0',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
          }}
        >
          <ListItemIcon>
            <Business sx={{ color: activeSection === '/admin/empresas' ? '#1E1E1E' : '#FFFDFD' }} />
          </ListItemIcon>
          <ListItemText primary="Gestión de Empresas" />
        </ListItem>
        <ListItem
          component={Link}
          to="/admin/reportes"
          onClick={() => handleClick('/admin/reportes')}
          sx={{
            bgcolor: activeSection === '/admin/reportes' ? '#FFE0E0' : 'transparent',
            color: activeSection === '/admin/reportes' ? '#1E1E1E' : '#FFFDFD',
            '&:hover': { bgcolor: activeSection === '/admin/reportes' ? '#FFE0E0' : 'rgba(255, 255, 255, 0.1)' },
            padding: '10px 15px',
            margin: '5px 0',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
          }}
        >
          <ListItemIcon>
            <BarChart sx={{ color: activeSection === '/admin/reportes' ? '#1E1E1E' : '#FFFDFD' }} />
          </ListItemIcon>
          <ListItemText primary="Reportes y Estadísticas" />
        </ListItem>
      </List>
      <Divider sx={{ bgcolor: '#FFFDFD' }} />
      <ListItem onClick={handleLogout} sx={{ color: '#FFFDFD',
        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
        padding: '10px 15px',
        margin: '5px 0',
        borderRadius: '5px',
      }}>
        <ListItemIcon><Logout sx={{ color: '#FFFDFD' }} /></ListItemIcon>
        <ListItemText primary="Cerrar Sesión" />
      </ListItem>
    </Box>
  );
};

export default SidebarAdmin;