// src/components/VacanteDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography } from '@mui/material';
import api from '../utils/axiosConfig';

const VacanteDetail = () => {
    const { id } = useParams();
    const [vacante, setVacante] = useState(null);

    useEffect(() => {
        const fetchVacante = async () => {
        const res = await api.get(`/vacantes/${id}`);
        setVacante(res.data.data);
        };
        fetchVacante();
    }, [id]);

    const handleAplicar = async () => {
        try {
            await api.post(`/vacantes/${id}/aplicar`);
            alert('Postulación enviada');
        } catch (err) {
            alert('Error al postular: ' + (err.response?.data?.message || err.message));
        }
    };

    if (!vacante) return <div>Cargando...</div>;

    return (
        <Card>
        <CardContent>
            <Typography variant="h5">{vacante.titulo}</Typography>
            <Typography>{vacante.Empresa.nombre}</Typography>
            <Typography>{vacante.ubicacion}</Typography>
            <Typography>{vacante.fecha_publicacion}</Typography>
            <Typography>{vacante.descripcion}</Typography>
            <Typography>Requisitos: {vacante.requisitos}</Typography>
            <Typography>Salario: ${vacante.salario_estimado}</Typography>
            <Typography>Modalidad: {vacante.modalidad}</Typography>
            <Typography>Contacto: {vacante.Empresa.correo_contacto}, {vacante.Empresa.telefono}, {vacante.Empresa.sitio_web}</Typography>
            <Button onClick={handleAplicar}>Postular</Button>
        </CardContent>
        </Card>
    );
};

export default VacanteDetail;