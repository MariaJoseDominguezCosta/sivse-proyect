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
    <Box className="form-container">
      <Typography variant="h5" gutterBottom>
        {alumni.nombre_completo || 'Sin nombre'} - {alumni.ubicacion || 'Sin ubicación'}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Generación: {alumni.generacion || 'No especificada'}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Carrera: {alumni.carrera || 'No especificada'}
      </Typography>
      <Typography variant="h6" mt={2} gutterBottom>
        Información de empresa actual
      </Typography>
      <Typography>Nombre: {alumni.empresa_actual || 'No empleada'}</Typography>
      <Typography>Puesto: {alumni.puesto || 'No especificado'}</Typography>
      <Typography>Modalidad: {alumni.modalidad || 'No especificada'}</Typography>
      <Typography variant="h6" mt={2} gutterBottom>
        Datos de contacto
      </Typography>
      <Typography>Teléfono: {alumni.telefono || 'No proporcionado'}</Typography>
      <Typography variant="h6" mt={2} gutterBottom>
        Redes sociales
      </Typography>
      <Typography>LinkedIn: {alumni.redes.linkedin || 'No proporcionado'}</Typography>
      <Typography>Instagram: {alumni.redes.instagram || 'No proporcionado'}</Typography>
      <Typography>Otro: {alumni.redes.otro || 'No proporcionado'}</Typography>
    </Box>
  );
};

export default AlumniDetail;