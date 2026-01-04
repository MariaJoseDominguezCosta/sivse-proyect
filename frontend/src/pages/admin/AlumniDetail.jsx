import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import axios from '../../utils/axiosConfig';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AlumniDetail = () => {
  const { id } = useParams();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlumniDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/admin/egresados/${id}`);
        setAlumni(res.data);
      } catch (err) {
        console.error('Error fetching alumni detail:', err);
        setError('No se pudo cargar la información del egresado. Intenta de nuevo.');
        toast.error('Error al cargar los datos del egresado.');
      } finally {
        setLoading(false);
      }
    };
    fetchAlumniDetail();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !alumni) {
    return (
      <Box sx={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        {error || 'Egresado no encontrado'}
      </Box>
    );
  }

  return (
    <Box sx={{
      position: "absolute",
      top: {
        xs: "200px", sm: "250px", lg: "200px", xl: "250px"
      },
      margin: "auto",
      backgroundColor: "background.paper",
      padding: "20px",
      borderRadius: "8px",
      width: {
        xs: "300px",
        sm: "400px",
        md: "500px",
        lg: "600px",
        xl: "700px",
      },
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
      display: "flex",
      flexDirection: "column",
      justifySelf: "center",
      alignSelf: "center",
    }}>
      <Typography variant="h5" gutterBottom sx={{
        fontWeight: "bold", fontSize: {
          xs: "0.8rem",
          sm: "1rem",
          md: "1.2rem",
          lg: "1.4rem",
          xl: "1.6rem",
        }
      }}>
        {alumni.nombre_completo || 'Sin nombre'} - {alumni.ubicacion || 'Sin ubicación'}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary"
        sx={{
          fontSize: {
            xs: "0.6rem",
            sm: "0.8rem",
            md: "1rem",
            lg: "1.2rem",
            xl: "1.4rem"
          },
          fontWeight: "normal"
        }}>
        Generación: {alumni.generacion || 'No especificada'}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary"
        sx={{
          fontSize: {
            xs: "0.6rem",
            sm: "0.8rem",
            md: "1rem",
            lg: "1.2rem",
            xl: "1.4rem"
          },
          fontWeight: "normal"
        }}  >
        Carrera: {alumni.carrera || 'No especificada'}
      </Typography>
      <Typography variant="h6" mt={2} gutterBottom
        sx={{
          fontSize: {
            xs: "0.6rem",
            sm: "0.8rem",
            md: "1rem",
            lg: "1.2rem",
            xl: "1.4rem"
          },
          fontWeight: "bold"
        }}>
        Información de empresa actual
      </Typography>
      <Typography
        sx={{
          fontSize: {
            xs: "0.4rem",
            sm: "0.6rem",
            md: "0.8rem",
            lg: "1rem",
            xl: "1.2rem"
          }
        }}>Nombre: {alumni.empresa_actual || 'No empleada'}</Typography>
      <Typography sx={{ fontSize: { xs: "0.4rem", sm: "0.6rem", md: "0.8rem", lg: "1rem", xl: "1.2rem" } }}>Puesto: {alumni.puesto || 'No especificado'}</Typography>
      <Typography sx={{ fontSize: { xs: "0.4rem", sm: "0.6rem", md: "0.8rem", lg: "1rem", xl: "1.2rem" } }}>Modalidad: {alumni.modalidad || 'No especificada'}</Typography>
      <Typography variant="h6" mt={2} gutterBottom sx={{ fontSize: { xs: "0.6rem", sm: "0.8rem", md: "1rem", lg: "1.2rem", xl: "1.4rem" }, fontWeight: "bold" }}>
        Datos de contacto
      </Typography>
      <Typography sx={{ fontSize: { xs: "0.4rem", sm: "0.6rem", md: "0.8rem", lg: "1rem", xl: "1.2rem" } }}>Teléfono: {alumni.telefono || 'No proporcionado'}</Typography>
      <Typography variant="h6" mt={2} gutterBottom sx={{ fontSize: { xs: "0.6rem", sm: "0.8rem", md: "1rem", lg: "1.2rem", xl: "1.4rem" }, fontWeight: "bold" }}>
        Redes sociales
      </Typography>
      <Typography sx={{ fontSize: { xs: "0.4rem", sm: "0.6rem", md: "0.8rem", lg: "1rem", xl: "1.2rem" } }}>LinkedIn: {alumni.redes.linkedin || 'No proporcionado'}</Typography>
      <Typography sx={{ fontSize: { xs: "0.4rem", sm: "0.6rem", md: "0.8rem", lg: "1rem", xl: "1.2rem" } }}>Instagram: {alumni.redes.instagram || 'No proporcionado'}</Typography>
      <Typography sx={{ fontSize: { xs: "0.4rem", sm: "0.6rem", md: "0.8rem", lg: "1rem", xl: "1.2rem" } }}>Otro: {alumni.redes.otro || 'No proporcionado'}</Typography>
    </Box>
  );
};

export default AlumniDetail;