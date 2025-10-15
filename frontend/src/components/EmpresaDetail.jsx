import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const EmpresaDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [empresa, setEmpresa] = useState(null);
    const [vacantes, setVacantes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const empRes = await axios.get(`/empresas/${id}`);
            setEmpresa(empRes.data.data);
            const vacRes = await axios.get(`/empresas/${id}/vacantes`);
            setVacantes(vacRes.data.data);
        } catch (error) {
            console.error('Error al cargar detalle', error);
        }
        };
        fetchData();
    }, [id]);

    if (!empresa) return <Typography>Cargando...</Typography>;

    return (
        <div>
        <Typography variant="h4">{empresa.nombre}</Typography>
        <Typography>Sector: {empresa.sector}</Typography>
        <Typography>Contacto: {empresa.contacto}</Typography>
        <Button variant="contained" onClick={() => navigate(`/admin/empresas/${id}/editar`)}>Editar</Button>
        <Typography variant="h6">Vacantes Asociadas:</Typography>
        <List>
            {vacantes.map((vac) => (
            <ListItem key={vac.id}>
                <ListItemText primary={vac.titulo} secondary={vac.descripcion} />
                {/* Enlace a detalle de vacante */}
                <Button onClick={() => navigate(`/vacantes/${vac.id}`)}>Ver Detalle</Button>
            </ListItem>
            ))}
        </List>
        <Button variant="contained" color="secondary" onClick={() => navigate(`/admin/vacantes/nueva?empresaId=${id}`)}>
            Agregar Vacante
        </Button>
        </div>
    );
};

export default EmpresaDetail;