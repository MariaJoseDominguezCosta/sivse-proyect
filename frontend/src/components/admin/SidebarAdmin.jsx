import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  Typography,
} from "@mui/material";
import {
  Home,
  People,
  Work,
  Business,
  BarChart,
  Logout,
  AdminPanelSettings,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../assets/sidebarAdmin.css";

const drawerWidth = 280; // Ancho estándar para sidebar

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Elementos del menú para evitar repetición
  const menuItems = [
    { text: "Inicio", icon: <Home />, path: "/admin" },
    {
      text: "Seguimiento de Egresados",
      icon: <People />,
      path: "/admin/egresados",
    },
    { text: "Bolsa de Trabajo", icon: <Work />, path: "/admin/vacantes" },
    {
      text: "Gestión de Empresas",
      icon: <Business />,
      path: "/admin/empresas",
    },
    {
      text: "Reportes y Estadísticas",
      icon: <BarChart />,
      path: "/admin/reportes",
    },
    {
      text: "Administradores",
      icon: <AdminPanelSettings />,
      path: "/admin/register-admin",
    },
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
          <Avatar className="sidebar-avatar">A</Avatar>
          <Typography className="sidebar-role">Administrador</Typography>
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
        <Divider sx={{ bgcolor: '#FFFDFD', mx: 2 }} />
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
      {/* NAVBAR PARA MÓVILES (Solo visible en xs y sm) */}
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

      {/* NAVEGACIÓN (Drawer) */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Drawer para Móvil */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Mejora el rendimiento en móvil
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

export default SidebarAdmin;
