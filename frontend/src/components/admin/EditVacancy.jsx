import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Switch, Select, MenuItem, FormControlLabel } from '@mui/material';
import axios from '../../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';

const EditVacancy = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    titulo: '', salario: '', descripcion: '', modalidad: '', requisitos: '', estado: false, empresaAsociada: '', fechaPublicacion: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const res = await axios.get(`/admin/vacantes/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error('Error fetching vacancy', err);
      }
    };
    fetchVacancy();
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/vacantes/${id}`, formData);
      navigate('/admin/vacantes');
    } catch (err) {
      console.error('Error updating vacancy', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="form-container">
      <TextField name="titulo" label="Título" value={formData.titulo} onChange={handleChange} fullWidth margin="normal" placeholder="Value" />
      <TextField name="salario" label="Salario" value={formData.salario} onChange={handleChange} fullWidth margin="normal" placeholder="Value" />
      <TextField name="descripcion" label="Descripción" value={formData.descripcion} onChange={handleChange} fullWidth margin="normal" multiline placeholder="Value" />
      <TextField name="modalidad" label="Modalidad" value={formData.modalidad} onChange={handleChange} fullWidth margin="normal" placeholder="Value" />
      <TextField name="requisitos" label="Requisitos (Separados con comas)" value={formData.requisitos} onChange={handleChange} fullWidth margin="normal" placeholder="Value" />
      <FormControlLabel control={<Switch name="estado" checked={formData.estado} onChange={handleChange} />} label="Estado Activa/Inactiva" />
      <Select name="empresaAsociada" value={formData.empresaAsociada} onChange={handleChange} fullWidth margin="normal">
        <MenuItem value="">Value</MenuItem>
      </Select>
      <TextField name="fechaPublicacion" label="Fecha de publicación" value={formData.fechaPublicacion} onChange={handleChange} fullWidth margin="normal" placeholder="Value" />
      <Box className="buttons">
        <Button className="btn-cancel" onClick={() => navigate('/admin/vacantes')}>Cancelar</Button>
        <Button className="btn-save" type="submit">Guardar</Button>
      </Box>
    </Box>
  );
};

export default EditVacancy;