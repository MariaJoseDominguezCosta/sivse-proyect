import React, { useState, useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material';
import axios from '../../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';


const EditCompany = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    razon_social: '', direccion: '', sector: '', correo_contacto: '', tipo_convenio: '', telefono: '', sitio_web: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`/admin/empresas/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error('Error fetching company', err);
      }
    };
    fetchCompany();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/empresas/${id}`, formData);
      navigate('/admin/empresas');
    } catch (err) {
      console.error('Error updating company', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="form-container">
      <TextField name="razon_social" label="Razón Social" value={formData.razon_social} onChange={handleChange} fullWidth margin="normal" placeholder="Nombre de la empresa" />
      <TextField name="direccion" label="Dirección" value={formData.direccion} onChange={handleChange} fullWidth margin="normal" placeholder="Value" />
      <TextField name="sector" label="Sector" value={formData.sector} onChange={handleChange} fullWidth margin="normal" placeholder="Value" />
      <TextField name="correo_contacto" label="Correo" value={formData.correo_contacto} onChange={handleChange} fullWidth margin="normal" placeholder="Value" />
      <TextField name="tipo_convenio" label="Tipo de convenio" value={formData.tipo_convenio} onChange={handleChange} fullWidth margin="normal" placeholder="Value" />
      <TextField name="telefono" label="Teléfono" value={formData.telefono} onChange={handleChange} fullWidth margin="normal" placeholder="Value" />
      <TextField name="sitio_web" label="Sitio web" value={formData.sitio_web} onChange={handleChange} fullWidth margin="normal" placeholder="Value" />
      <Box className="buttons">
        <Button className="btn-cancel" onClick={() => navigate('/admin/empresas')}>Cancelar</Button>
        <Button className="btn-save" type="submit">Guardar</Button>
      </Box>
    </Box>
  );
};

export default EditCompany;