import React, { useState, useEffect } from 'react'; // Importar useEffect
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
import api, { IMAGE_BASE_URL } from "../../utils/axiosConfig"; // Importar API

const drawerWidth = 280; 

const SidebarEgresado = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Estado para guardar la información básica del perfil
  const [profile, setProfile] = useState(null);

  // Efecto para obtener el nombre y foto del egresado
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        // Reutilizamos el endpoint del dashboard ya que devuelve la foto y el nombre
        const res = await api.get("/egresado/dashboard");
        setProfile(res.data.perfil);
      } catch (error) {
        console.error("Error al cargar datos del sidebar:", error);
      }
    };

    fetchSidebarData();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const menuItems = [
    { text: "Inicio", icon: <Home />, path: "/egresado" },
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
        
        {/* --- SECCIÓN PERFIL ACTUALIZADA --- */}
        <Box className="sidebar-profile">
          <Avatar 
            className="sidebar-avatar" 
            sx={{ bgcolor: '#4F378A' }}
            // Si hay foto, la mostramos. Si no, usamos la letra inicial o el icono por defecto.
            src={profile?.foto_perfil ? `${IMAGE_BASE_URL}${profile.foto_perfil}` : null}
          >
            {/* Si no hay foto, muestra la inicial del nombre o 'E' */}
            {profile?.nombre_completo ? profile.nombre_completo.charAt(0).toUpperCase() : "E"}
          </Avatar>
          
          <Typography 
            className="sidebar-role"
            sx={{ 
              textAlign: "center", 
              px: 2, 
              fontSize: "0.9rem", // Ajuste ligero de tamaño para nombres largos
              wordBreak: "break-word"
            }}
          >
            {/* Muestra el nombre si existe, sino muestra 'Egresado' */}
            {profile?.nombre_completo || "Egresado"}
          </Typography>
        </Box>
        {/* ---------------------------------- */}

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

        <Divider sx={{ bgcolor: '#FFFDFD', my: 1 }} /> 
        
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

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
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

      <Toolbar sx={{ display: { md: "none" } }} />
    </Box>
  );
};

export default SidebarEgresado;