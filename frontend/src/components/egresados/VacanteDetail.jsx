import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const VacanteDetail = () => {
  const { id } = useParams();
  const [vacante, setVacante] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/vacantes/${id}`);
        setVacante(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (id) fetchData();
  }, [id]);

  const addFavorite = async () => {
    const token = localStorage.getItem('token');
    await axios.post(`${API_BASE_URL}/favoritos`, { vacanteId: id }, { headers: { Authorization: `Bearer ${token}` } });
    // Notify
  };

  return (
    <Box>
      <Typography variant="h5">{vacante.titulo}</Typography>
      <Typography>Empresa: {vacante.empresa}</Typography>
      <Typography>Descripción: {vacante.descripcion}</Typography>
      <Typography>Requisitos: {vacante.requisitos}</Typography>
      <Typography>Ubicación: {vacante.ubicacion}</Typography>
      <Typography>Modalidad: {vacante.modalidad}</Typography>
      <Typography>Salario: {vacante.salario}</Typography>
      <Button onClick={addFavorite}>Agregar a Favoritos</Button>
    </Box>
  );
};

export default VacanteDetail;