import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const RegisterEgresado = () => {
  const [formData, setFormData] = useState({
    nombre: '', telefono: '', generacion: '', carrera: '', email: '', password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/egresados/register`, formData);
      navigate('/');
    } catch (err) {
      console.error('Register error', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
      <Typography variant="h4">Registro de Egresado</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Nombre completo" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} fullWidth margin="normal" />
        <Select name="generacion" value={formData.generacion} onChange={handleChange} fullWidth margin="normal">
          <MenuItem value="">Generación</MenuItem>
          {/* Opciones de generaciones */}
        </Select>
        <Select name="carrera" value={formData.carrera} onChange={handleChange} fullWidth margin="normal">
          <MenuItem value="">Carrera</MenuItem>
          {/* Opciones de carreras */}
        </Select>
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth margin="normal" />
        <Button variant="contained" type="submit" fullWidth> Registrar </Button>
      </form>
      <Link href="/">¿Ya tienes cuenta? Inicia sesión</Link>
    </Box>
  );
};

export default RegisterEgresado;