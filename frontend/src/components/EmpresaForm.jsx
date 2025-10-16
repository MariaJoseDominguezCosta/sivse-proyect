import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Paper, Snackbar, Alert, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const sectors = ['Tecnológica', 'Salud', 'Local', 'Nacional', 'Internacional', 'Otros'];
const convenios = ['Local', 'Nacional', 'Internacional'];

const validationSchema = Yup.object({
    razon_social: Yup.string().min(3, 'Mínimo 3 caracteres').required('Requerido'),
    sector: Yup.string().required('Requerido'),
    direccion: Yup.string().required('Requerido'),
    correo: Yup.string().email('Correo inválido').required('Requerido'),
    telefono: Yup.string().required('Requerido'),
    tipo_convenio: Yup.string().required('Requerido'),
    sitio_web: Yup.string().url('URL inválida').nullable(),
    });

    const EmpresaForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
        razon_social: '', sector: '', direccion: '', correo: '', telefono: '', tipo_convenio: '', sitio_web: '',
        },
        validationSchema,
        onSubmit: async (values) => {
        setLoading(true);
        try {
            if (id) {
            const res = await axios.put(`/empresas/${id}`, values);
            setSnackbarMessage(res.data.message);
            setSnackbarSeverity('success');
            } else {
            const res = await axios.post('/empresas', values);
            setSnackbarMessage(res.data.message);
            setSnackbarSeverity('success');
            }
            setTimeout(() => navigate('/admin/empresas'), 2000); // Redirige tras notificación
        } catch (error) {
            setSnackbarMessage(error.response?.data?.message || 'Error al guardar');
            setSnackbarSeverity('error');
        } finally {
            setLoading(false);
            setOpenSnackbar(true);
        }
        },
    });

    useEffect(() => {
        if (id) {
            setLoading(true);
            const fetchEmpresa = async () => {
                try {
                    const res = await axios.get(`/empresas/${id}`);
                    formik.setValues(res.data.data);
                    setSnackbarMessage(res.data.message);
                    setSnackbarSeverity('info');
                    setOpenSnackbar(true);
                } catch (error) {
                    console.error('Error al cargar datos', error);
                    setSnackbarMessage('Error al cargar datos' );
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                } finally {
                    setLoading(false);
                }
            };
            fetchEmpresa();
        }
    }, [id]);

    return (
        <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f0f0f0', borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
            {id ? 'Editar Empresa' : 'Registrar nueva empresa'}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField
                label="Razón Social"
                name="razon_social"
                value={formik.values.razon_social}
                onChange={formik.handleChange}
                error={formik.touched.razon_social && Boolean(formik.errors.razon_social)}
                helperText={formik.touched.razon_social && formik.errors.razon_social}
                fullWidth
                placeholder="Nombre de la empresa"
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                label="Dirección"
                name="direccion"
                value={formik.values.direccion}
                onChange={formik.handleChange}
                error={formik.touched.direccion && Boolean(formik.errors.direccion)}
                helperText={formik.touched.direccion && formik.errors.direccion}
                fullWidth
                />
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth>
                <InputLabel>Sector</InputLabel>
                <Select
                    name="sector"
                    value={formik.values.sector}
                    onChange={formik.handleChange}
                    error={formik.touched.sector && Boolean(formik.errors.sector)}
                >
                    {sectors.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <TextField
                label="Correo"
                name="correo"
                value={formik.values.correo}
                onChange={formik.handleChange}
                error={formik.touched.correo && Boolean(formik.errors.correo)}
                helperText={formik.touched.correo && formik.errors.correo}
                fullWidth
                />
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth>
                <InputLabel>Tipo de Convenio</InputLabel>
                <Select
                    name="tipo_convenio"
                    value={formik.values.tipo_convenio}
                    onChange={formik.handleChange}
                    error={formik.touched.tipo_convenio && Boolean(formik.errors.tipo_convenio)}
                >
                    {convenios.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <TextField
                label="Teléfono"
                name="telefono"
                value={formik.values.telefono}
                onChange={formik.handleChange}
                error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                helperText={formik.touched.telefono && formik.errors.telefono}
                fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                label="Sitio Web"
                name="sitio_web"
                value={formik.values.sitio_web}
                onChange={formik.handleChange}
                error={formik.touched.sitio_web && Boolean(formik.errors.sitio_web)}
                helperText={formik.touched.sitio_web && formik.errors.sitio_web}
                fullWidth
                />
            </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
            <Grid item>
                <Button variant="outlined" onClick={() => navigate('/admin/empresas')}>Cancelar</Button>
            </Grid>
            <Grid item>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
                </Button>
            </Grid>
            </Grid>
        </form>
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
        </Paper>
    );
};

export default EmpresaForm;