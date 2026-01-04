import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
} from '@mui/material';
import { Home, Favorite, Work, Logout, Menu as MenuIcon } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "../../assets/sidebarAdmin.css"; 

const drawerWidth = 280; 

const SidebarEgresado = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // No necesitamos 'activeSection' si usamos location.pathname directamente
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Elementos del menú para evitar repetición
  const menuItems = [
    { text: "Inicio", icon: <Home />, path: "/egresado" },
    // { text: "Editar Perfil", icon: <Person />, path: "/egresados/perfil/edit" },
    { text: "Favoritos", icon: <Favorite />, path: "/egresados/favoritos" },
    { text: "Vacantes", icon: <Work />, path: "/egresados/vacantes" },
  ];
  
  const drawerContent = (
    <Box className="sidebar-content">
      <Box className="sidebar-header">
        <img
          src="/logo-tecnologico-comitan-removebg-preview.png"
          alt="Logo"
          className="sidebar-logo"
        />
        <Box className="sidebar-profile">
          <Avatar className="sidebar-avatar" sx={{ bgcolor: '#4F378A' }}>E</Avatar>
          <Typography className="sidebar-role">Egresado</Typography>
        </Box>
      </Box>

      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`sidebar-item ${isActive ? "active" : ""}`}
            >
              <ListItemIcon className="sidebar-icon">
                {/* Usar React.cloneElement para pasar el color del icono */}
                {React.cloneElement(item.icon, {
                  sx: { color: isActive ? "#FFE0E0" : "#FFFDFD" },
                })}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ className: "sidebar-text" }}
              />
            </ListItem>
          );
        })}

        {/* Separador */}
        <Divider sx={{ bgcolor: '#FFFDFD', my: 1 }} /> 
        
        {/* Botón de Cerrar Sesión */}
        <ListItem
          onClick={handleLogout}
          className="sidebar-item logout-item"
          sx={{ mt: 2, cursor: "pointer" }}
        >
          <ListItemIcon className="sidebar-icon">
            <Logout sx={{ color: "#FFFDFD" }} />
          </ListItemIcon>
          <ListItemText
            primary="Cerrar Sesión"
            primaryTypographyProps={{ className: "sidebar-text" }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* NAVBAR PARA MÓVILES (Solo visible en xs y sm) - Copiado de SidebarAdmin */}
      <AppBar
        position="fixed"
        sx={{
          display: { md: "none" },
          bgcolor: "#223373",
          boxShadow: 3,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <img
            src="/logo-tecnologico-comitan-removebg-preview.png"
            alt="Logo"
            style={{ height: "40px" }}
          />
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* NAVEGACIÓN (Drawer) - Copiado de SidebarAdmin */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Drawer para Móvil */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} 
          sx={{
            display: { xs: "block", sm: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "#223373",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Sidebar para Escritorio */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "#223373",
              borderRight: "none",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Espaciador para que el contenido no quede debajo de la AppBar en móvil */}
      <Toolbar sx={{ display: { md: "none" } }} />
    </Box>
  );
};

export default SidebarEgresado;