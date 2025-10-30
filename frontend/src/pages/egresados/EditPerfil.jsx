import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EditPerfil = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    fecha_inicio: '',
    modalidad: '',
    redes: { linkedin: '', instagram: '', otro: '' },
    empresa_actual: '',
    puesto: '',
    ubicacion: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/api/egresado/profile', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Error al cargar perfil');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRedesChange = (e) => {
    setFormData({
      ...formData,
      redes: { ...formData.redes, [e.target.name]: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/egresado/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Perfil actualizado correctamente');
        navigate('/egresado');
      } else {
        toast.error('Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar perfil');
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#E1F2FF' }}>
      <Typography variant="h4">Perfil del Egresado</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ mt: 2, bgcolor: '#D9D9D9', p: 2, borderRadius: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField label="Nombre" name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Fecha de inicio" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Correo" name="email" value={formData.email} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Modalidad" name="modalidad" value={formData.modalidad} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Redes sociales - LinkedIn" name="linkedin" value={formData.redes.linkedin} onChange={handleRedesChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Ubicación" name="ubicacion" value={formData.ubicacion} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Instagram" name="instagram" value={formData.redes.instagram} onChange={handleRedesChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Empresa actual" name="empresa_actual" value={formData.empresa_actual} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Otro" name="otro" value={formData.redes.otro} onChange={handleRedesChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Puesto" name="puesto" value={formData.puesto} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" sx={{ mr: 2 }} onClick={() => navigate('/egresado')}>Cancelar</Button>
            <Button variant="contained" sx={{ bgcolor: '#2C2C2C' }} type="submit">Guardar</Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EditPerfil;