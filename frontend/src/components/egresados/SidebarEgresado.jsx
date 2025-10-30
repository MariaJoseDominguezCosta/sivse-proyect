import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar } from '@mui/material';
import { Home, Person, Favorite, Work, Logout } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SidebarEgresado = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(location.pathname);

  useEffect(() => {
    setActiveSection(location.pathname); // Sincroniza con la ruta actual
  }, [location.pathname]);

  const handleClick = (path) => {
    setActiveSection(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Box sx={{ width: 250, bgcolor: '#223373', color: '#FFFDFD', height: '100vh', p: 2 }}>
      {/* Logo del Tecnológico */}
      <img src="/logo-tecnologico.png" alt="Logo" style={{ width: '100%', marginBottom: '16px' }} />
      {/* Ícono de usuario (Egresado) */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#FFFDFD' }}>
        <Avatar sx={{ bgcolor: '#4F378A', mr: 1 }}>E</Avatar>
        <span>Egresado</span>
      </Box>
      <List>
        <ListItem
          component={Link}
          to="/egresado"
          onClick={() => handleClick('/egresado')}
          sx={{
            bgcolor: activeSection === '/egresado' ? '#FFE0E0' : 'transparent',
            color: activeSection === '/egresado' ? '#1E1E1E' : '#FFFDFD',
            '&:hover': { bgcolor: activeSection === '/egresado' ? '#FFE0E0' : 'rgba(255, 255, 255, 0.1)' },
            padding: '10px 15px',
            margin: '5px 0',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
          }}
        >
          <ListItemIcon>
            <Home sx={{ color: activeSection === '/egresado' ? '#1E1E1E' : '#FFFDFD' }} />
          </ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItem>
        {/*
        <ListItem
          component={Link}
          to="/egresados/perfil/edit"
          onClick={() => handleClick('/egresados/perfil/edit')}
          sx={{
            bgcolor: activeSection === '/egresados/perfil/edit' ? '#FFE0E0' : 'transparent',
            color: activeSection === '/egresados/perfil/edit' ? '#1E1E1E' : '#FFFDFD',
            '&:hover': { bgcolor: activeSection === '/egresados/perfil/edit' ? '#FFE0E0' : 'rgba(255, 255, 255, 0.1)' },
            padding: '10px 15px',
            margin: '5px 0',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
          }}
        >
          <ListItemIcon>
            <Person sx={{ color: activeSection === '/egresados/perfil/edit' ? '#1E1E1E' : '#FFFDFD' }} />
          </ListItemIcon>
          <ListItemText primary="Editar Perfil" />
        </ListItem>
        */}
        <ListItem
          component={Link}
          to="/egresados/favoritos"
          onClick={() => handleClick('/egresados/favoritos')}
          sx={{
            bgcolor: activeSection === '/egresados/favoritos' ? '#FFE0E0' : 'transparent',
            color: activeSection === '/egresados/favoritos' ? '#1E1E1E' : '#FFFDFD',
            '&:hover': { bgcolor: activeSection === '/egresados/favoritos' ? '#FFE0E0' : 'rgba(255, 255, 255, 0.1)' },
            padding: '10px 15px',
            margin: '5px 0',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
          }}
        >
          <ListItemIcon>
            <Favorite sx={{ color: activeSection === '/egresados/favoritos' ? '#1E1E1E' : '#FFFDFD' }} />
          </ListItemIcon>
          <ListItemText primary="Favoritos" />
        </ListItem>
        <ListItem
          component={Link}
          to="/egresados/vacantes"
          onClick={() => handleClick('/egresados/vacantes')}
          sx={{
            bgcolor: activeSection === '/egresados/vacantes' ? '#FFE0E0' : 'transparent',
            color: activeSection === '/egresados/vacantes' ? '#1E1E1E' : '#FFFDFD',
            '&:hover': { bgcolor: activeSection === '/egresados/vacantes' ? '#FFE0E0' : 'rgba(255, 255, 255, 0.1)' },
            padding: '10px 15px',
            margin: '5px 0',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
          }}
        >
          <ListItemIcon>
            <Work sx={{ color: activeSection === '/egresados/vacantes' ? '#1E1E1E' : '#FFFDFD' }} />
          </ListItemIcon>
          <ListItemText primary="Vacantes" />
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

export default SidebarEgresado;