import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Button, Tabs, Tab, Grid, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import api from '../../utils/axiosConfig';

const DashboardEgresado = () => {
  const [profile, setProfile] = useState(null);
  const [recommendedVacancies, setRecommendedVacancies] = useState([]);
  const [favoritosCount, setFavoritosCount] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/egresado/dashboard');
        console.log('Dashboard Response Status:', res.status, res.statusText);
        console.log('Dashboard data fetched:', res.data);
        setProfile(res.data.perfil);
        setFavoritosCount(res.data.favoritosCount);
        setRecommendedVacancies(res.data.vacantesRecomendadas);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Error al cargar datos del dashboard: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#E1F2FF' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5">Bienvenido, {profile?.nombre_completo || 'Usuario'}</Typography>
          <Typography variant="subtitle1">Favoritos: {favoritosCount}</Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card sx={{ bgcolor: '#F0E0E0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={profile?.foto_perfil} sx={{ width: 56, height: 56 }} />
              <Box>
                <Typography variant="h6">{profile?.nombre_completo}</Typography>
                <Typography>{profile?.carrera}</Typography>
                <Typography>{profile?.generacion}</Typography>
              </Box>
              <Button variant="outlined" component={Link} to="/egresado/editar-perfil" sx={{ ml: 'auto' }}>
                Editar perfil
              </Button>
            </CardContent>
          </Card>
          <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mt: 2 }}>
            <Tab label="Personal" />
            <Tab label="Empleo" />
            <Tab label="Redes" />
            <Tab label="Historial" />
          </Tabs>
          <Card>
            {tabValue === 0 && (
              <>
                <Typography>Email: {profile?.email}</Typography>
                <Typography>Teléfono: {profile?.telefono}</Typography>
                <Typography>Ubicación: {profile?.ubicacion}</Typography>
              </>
            )}
            {tabValue === 1 && (
              <>
                <Typography>Empresa Actual: {profile?.empresa_actual}</Typography>
                <Typography>Puesto: {profile?.puesto}</Typography>
                <Typography>Modalidad: {profile?.modalidad}</Typography>
                <Typography>Fecha de Inicio: {profile?.fecha_inicio}</Typography>
              </>
            )}
            {tabValue === 2 && (
              <>
                {profile?.redes && Object.entries(profile.redes).map(([key, value]) => (
                  <Typography key={key}>{key}: {value}</Typography>
                ))}
              </>
            )}
            {tabValue === 3 && (
              <>
                {profile?.historial && profile.historial.map((item, index) => (
                  <Typography key={index}>{item.fecha}: {item.descripcion}</Typography>
                ))}
              </>
            )}
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Vacantes recomendadas</Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {recommendedVacancies.map((vac) => (
                <Grid item xs={12} sm={6} md={4} key={vac.id}>
                  <Card sx={{ bgcolor: '#F0E0E0' }}>
                    <CardContent>
                      <Typography variant="h6">{vac.titulo}</Typography>
                      <Typography>{vac.empresa.razon_social}</Typography>
                      <Typography>{vac.ubicacion}, {vac.modalidad}</Typography>
                      <Button variant="outlined" component={Link} to={`/egresados/vacantes/${vac.id}`}>
                        Ver detalles
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardEgresado;