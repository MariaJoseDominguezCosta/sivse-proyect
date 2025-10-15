import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, IconButton, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Inicio', icon: <HomeIcon />, path: '/admin' },
        { text: 'Seguimiento de Egresados', icon: <PeopleIcon />, path: '/admin/seguimiento' },
        { text: 'Bolsa de Trabajo', icon: <WorkIcon />, path: '/admin/bolsa' },
        { text: 'Gestión de Empresas', icon: <BusinessIcon />, path: '/admin/empresas' },
        { text: 'Reportes y Estadísticas', icon: <BarChartIcon />, path: '/admin/reportes' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#E0F7FA' }}>
            <Toolbar>
            <img src="/logo-tecnm.png" alt="TECNOLÓGICO NACIONAL DE MÉXICO" style={{ height: 40, marginRight: 16 }} />  {/* Asume logo */}
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'black' }}>
                {/* Título dinámico se maneja en children */}
            </Typography>
            <Avatar sx={{ bgcolor: '#DDA0DD' }}><PeopleIcon /></Avatar>
            <Typography variant="body1" sx={{ ml: 1, color: 'gray' }}>Administrador</Typography>
            </Toolbar>
        </AppBar>
        <Drawer
            variant="permanent"
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#00008B', color: 'white' },
            }}
        >
            <Toolbar />
            <List>
            {menuItems.map((item) => (
                <ListItem button key={item.text} onClick={() => navigate(item.path)}>
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                </ListItem>
            ))}
            </List>
            <List sx={{ position: 'absolute', bottom: 0 }}>
            <ListItem button onClick={() => { /* Logout logic */ navigate('/login'); }}>
                <ListItemIcon sx={{ color: 'white' }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
            </ListItem>
            </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#E0F7FA' }}>
            <Toolbar />
            {children}
        </Box>
        </Box>
    );
};

export default AdminLayout;