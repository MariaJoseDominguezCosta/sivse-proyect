import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const EmpresaDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [empresa, setEmpresa] = useState(null);
    const [vacantes, setVacantes] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
        try {
            const empRes = await axios.get(`/empresas/${id}`);
            setEmpresa(empRes.data.data);
            const vacRes = await axios.get(`/empresas/${id}/vacantes`);
            setVacantes(vacRes.data.data);
            setSnackbarMessage(empRes.data.message);
            setSnackbarSeverity('info');
        } catch (error) {
            console.error('Error al cargar datos', error);
            setSnackbarMessage('Error al cargar datos');
            setSnackbarSeverity('error');
        } finally {
            setLoading(false);
            setOpenSnackbar(true);
        }
        };
        fetchData();
    }, [id]);

    if (loading) return <Typography>Cargando...</Typography>;
    if (!empresa) return <Typography>Empresa no encontrada</Typography>;

    return (
        <div>
        <Typography variant="h4">{empresa.razon_social}</Typography>
        <Typography>Sector: {empresa.sector}</Typography>
        <Typography>Dirección: {empresa.direccion}</Typography>
        <Typography>Correo: {empresa.correo}</Typography>
        <Typography>Teléfono: {empresa.telefono}</Typography>
        <Typography>Tipo Convenio: {empresa.tipo_convenio}</Typography>
        <Typography>Sitio Web: {empresa.sitio_web || 'N/A'}</Typography>
        <Button variant="contained" onClick={() => navigate(`/admin/empresas/${id}/editar`)}>Editar</Button>
        <Typography variant="h6">Vacantes Asociadas:</Typography>
        <List>
            {vacantes.map((vac) => (
            <ListItem key={vac.id}>
                <ListItemText primary={vac.titulo} secondary={vac.descripcion} />
                <Button onClick={() => navigate(`/vacantes/${vac.id}`)}>Ver Detalle</Button>
            </ListItem>
            ))}
        </List>
        <Button variant="contained" color="secondary" onClick={() => navigate(`/admin/vacantes/nueva?empresaId=${id}`)}>
            Agregar Vacante
        </Button>
        <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
            </Alert>
        </Snackbar>
        </div>
    );
};

export default EmpresaDetail;