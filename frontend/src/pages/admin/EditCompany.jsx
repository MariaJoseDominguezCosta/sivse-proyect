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
    <Box component="form" onSubmit={handleSubmit}
      sx={{
        gap: "10px",
        top: {
          xs: "200px",
          lg: "250px",
        },
        p: {
          xs: "10px",
          sm: "15px",
          md: "20px",
          lg: "25px",
          xl: "30px",
        },
        width: {
          xs: "450px",
          md: "500px",
          lg: "600px",
          xl: "700px",
        },
        justifySelf: "center",
        alignSelf: "center",
        backgroundColor: "#FFFDFD",
        borderRadius: "8px",
        boxShadow: 3,
        display: "grid",
        flexDirection: "column",
        position: "absolute",
        WebkitAlignItems: "center",
        alignItems: "center",
        justifyContent: "center",
        WebkitJustifyContent: "center",
        gridTemplateRows: "repeat(5, 1fr)",
        gridTemplateColumns: "repeat(2, 1fr)",
      }}>
      <TextField name="razon_social" label="Razón Social" value={formData.razon_social} onChange={handleChange} placeholder="Nombre de la empresa"
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "1",
          gridRowEnd: "2",
          gridColumnStart: "1",
          gridColumnEnd: "2",
        }} />
      <TextField name="direccion" label="Dirección" value={formData.direccion} onChange={handleChange} placeholder="Dirección de la empresa"
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "1",
          gridRowEnd: "2",
          gridColumnStart: "2",
          gridColumnEnd: "3",
        }} />
      <TextField name="sector" label="Sector" value={formData.sector} onChange={handleChange} placeholder="Sector de la empresa"
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "2",
          gridRowEnd: "3",
          gridColumnStart: "1",
          gridColumnEnd: "2",
        }} />
      <TextField name="correo_contacto" label="Correo" value={formData.correo_contacto} onChange={handleChange} placeholder="Correo de contacto"
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "2",
          gridRowEnd: "3",
          gridColumnStart: "2",
          gridColumnEnd: "3",
        }}
      />
      <TextField name="tipo_convenio" label="Tipo de convenio" value={formData.tipo_convenio} onChange={handleChange} placeholder="Tipo de convenio"
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "3",
          gridRowEnd: "4",
          gridColumnStart: "1",
          gridColumnEnd: "2",
        }} />
      <TextField name="telefono" label="Teléfono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono"
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "3",
          gridRowEnd: "4",
          gridColumnStart: "2",
          gridColumnEnd: "3",
        }} />
      <TextField name="sitio_web" label="Sitio web" value={formData.sitio_web} onChange={handleChange} placeholder="Sitio web"
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "4",
          gridRowEnd: "5",
          gridColumnStart: "1",
          gridColumnEnd: "2",
          display: "flex",
          justifySelf: "center",
        }} />
      <Box component="div"
        sx={{
          gridColumn: "span 2",
          display: "flex",
          gap: 2,
          justifyContent: "center",
          marginTop: 2,
        }}>
        <Button variant='outlined' onClick={() => navigate('/admin/empresas')}
          sx={{
            p: {
              xs: 1,
            },
            color: "rgba(30, 30, 30, 1)",
            borderColor: "rgba(118, 118, 118, 1)",
          }}>Cancelar</Button>
        <Button variant='contained' type="submit"
          sx={{ p: { xs: 1 }, bgcolor: "rgba(44, 44, 44, 1)" }}>Guardar</Button>
      </Box>
    </Box>
  );
};

export default EditCompany;