import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Home,
  People,
  Work,
  Business,
  BarChart,
  Logout,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../App.css";


const SidebarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(location.pathname); // Estado inicial basado en la ruta actual

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleClick = (path) => {
    setActiveSection(path); // Actualiza la sección activa al hacer clic
  };

  return (
    <Box
      sx={{
        width: 250,
        bgcolor: "var(--primary-dark)", // #223373
        color: "#FFFDFD",
        height: "100vh",
        p: 2,
      }}
    >
      {" "}
      {/* Logo del Tecnológico */}
      <img
        src="/logo-tecnologico-comitan-removebg-preview.png"
        alt="Logo"
        style={{ width: "50%", marginBottom: "16px", marginLeft: "25%" }}
      />
      {/* Ícono de usuario (Administrador) */}
      <Box
        sx={{ display: "flex", alignItems: "center", mb: 2, color: "#FFFDFD" }}
      >
        <Avatar sx={{ bgcolor: "#4F378A", mr: 1 }}>A</Avatar>
        <span>Administrador</span>
      </Box>
      <List>
        <ListItem
          component={Link}
          to="/admin"
          onClick={() => handleClick("/admin")}
          sx={{
            bgcolor: activeSection === '/admin' ? 'var(--card-bg)' : 'transparent', // Fondo claro para activo (rosado muy claro)
            color: activeSection === '/admin' ? 'var(--text-dark)' : '#FFFDFD', // Texto oscuro para activo
            '&:hover': { bgcolor: activeSection === '/admin' ? 'var(--card-bg)' : 'rgba(255, 255, 255, 0.1)' },
            padding: "10px 15px",
            margin: "5px 0",
            borderRadius: "5px",
            transition: "background-color 0.3s",
          }}
        >
          <ListItemIcon>
            <Home
              sx={{ color: activeSection === '/admin' ? 'var(--text-dark)' : '#FFFDFD' }}
            />
          </ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItem>
        <ListItem
          component={Link}
          to="/admin/egresados"
          onClick={() => handleClick("/admin/egresados")}
          sx={{
            bgcolor:
              activeSection === "/admin/egresados" ? "#FFE0E0" : "transparent",
            color: activeSection === "/admin/egresados" ? 'var(--text-dark)' : "#FFFDFD",
            "&:hover": {
              bgcolor:
                activeSection === "/admin/egresados"
                  ? "#FFE0E0"
                  : "rgba(255, 255, 255, 0.1)",
            },
            padding: "10px 15px",
            margin: "5px 0",
            borderRadius: "5px",
            transition: "background-color 0.3s",
          }}
        >
          <ListItemIcon>
            <People
              sx={{
                color:
                  activeSection === "/admin/egresados" ? 'var(--text-dark)' : "#FFFFFF",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Seguimiento de Egresados" />
        </ListItem>
        <ListItem
          component={Link}
          to="/admin/vacantes"
          onClick={() => handleClick("/admin/vacantes")}
          sx={{
            bgcolor:
              activeSection === "/admin/vacantes" ? "#FFE0E0" : "transparent",
            color: activeSection === "/admin/vacantes" ? 'var(--text-dark)' : "#FFFDFD",
            "&:hover": {
              bgcolor:
                activeSection === "/admin/vacantes"
                  ? "#FFE0E0"
                  : "rgba(255, 255, 255, 0.1)",
            },
            padding: "10px 15px",
            margin: "5px 0",
            borderRadius: "5px",
            transition: "background-color 0.3s",
          }}
        >
          <ListItemIcon>
            <Work
              sx={{
                color:
                  activeSection === "/admin/vacantes" ? 'var(--text-dark)' : "#FFFDFD",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Bolsa de Trabajo" />
        </ListItem>
        <ListItem
          component={Link}
          to="/admin/empresas"
          onClick={() => handleClick("/admin/empresas")}
          sx={{
            bgcolor:
              activeSection === "/admin/empresas" ? "#FFE0E0" : "transparent",
            color: activeSection === "/admin/empresas" ? 'var(--text-dark)' : "#FFFDFD",
            "&:hover": {
              bgcolor:
                activeSection === "/admin/empresas"
                  ? "#FFE0E0"
                  : "rgba(255, 255, 255, 0.1)",
            },
            padding: "10px 15px",
            margin: "5px 0",
            borderRadius: "5px",
            transition: "background-color 0.3s",
          }}
        >
          <ListItemIcon>
            <Business
              sx={{
                color:
                  activeSection === "/admin/empresas" ? 'var(--text-dark)' : "#FFFDFD",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Gestión de Empresas" />
        </ListItem>
        <ListItem
          component={Link}
          to="/admin/reportes"
          onClick={() => handleClick("/admin/reportes")}
          sx={{
            bgcolor:
              activeSection === "/admin/reportes" ? "#FFE0E0" : "transparent",
            color: activeSection === "/admin/reportes" ? 'var(--text-dark)' : "#FFFDFD",
            "&:hover": {
              bgcolor:
                activeSection === "/admin/reportes"
                  ? "#FFE0E0"
                  : "rgba(255, 255, 255, 0.1)",
            },
            padding: "10px 15px",
            margin: "5px 0",
            borderRadius: "5px",
            transition: "background-color 0.3s",
          }}
        >
          <ListItemIcon>
            <BarChart
              sx={{
                color:
                  activeSection === "/admin/reportes" ? 'var(--text-dark)' : "#FFFDFD",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Reportes y Estadísticas" />
        </ListItem>
      </List>
      <Divider sx={{ bgcolor: "#FFFDFD" }} />
      <ListItem
        onClick={handleLogout}
        sx={{
          color: "#FFFDFD",
          "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
          padding: "10px 15px",
          margin: "5px 0",
          borderRadius: "5px",
        }}
      >
        <ListItemIcon>
          <Logout sx={{ color: "#FFFDFD" }} />
        </ListItemIcon>
        <ListItemText primary="Cerrar Sesión" />
      </ListItem>
    </Box>
  );
};

export default SidebarAdmin;
