import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, TextField, Button, Snackbar, Alert, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
    razon_social: Yup.string().min(3, 'Mínimo 3 caracteres').required('Requerido'),
    sector: Yup.string().required('Requerido'),
    tipo_convenio: Yup.string().required('Requerido'),
    direccion: Yup.string().required('Requerido'),
    correo: Yup.string().email('Correo inválido').required('Requerido'),
    telefono: Yup.string().matches(/^\+?\d{10,15}$/, 'Teléfono inválido').required('Requerido'),
    sitio_web: Yup.string().url('URL inválida').nullable(),
});

const EmpresaForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const formik = useFormik({
        initialValues: {
        razon_social: '', sector: '', tipo_convenio: '', direccion: '', correo: '', telefono: '', sitio_web: '',
        },
        validationSchema,
        onSubmit: async (values) => {
        try {
            if (id) {
            await axios.put(`/empresas/${id}`, values);
            } else {
            await axios.post('/empresas', values);
            }
            navigate('/admin/empresas');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error al guardar');
            setOpenSnackbar(true);
        }
        },
    });

    useEffect(() => {
        if (id) {
        const fetchEmpresa = async () => {
            try {
            const res = await axios.get(`/empresas/${id}`);
            formik.setValues(res.data.data);
            } catch (error) {
            setErrorMessage('Error al cargar datos', error.response?.data?.message || 'Error al cargar datos');
            setOpenSnackbar(true);
            }
        };
        fetchEmpresa();
        }
    }, [id, formik]);

    return (
        <Paper elevation={3} sx={{ p: 4, backgroundColor: '#F0F0F0', borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
                <TextField
                label="Dirección"
                name="direccion"
                value={formik.values.direccion}
                onChange={formik.handleChange}
                error={formik.touched.direccion && Boolean(formik.errors.direccion)}
                helperText={formik.touched.direccion && formik.errors.direccion}
                fullWidth
                placeholder="Value"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                label="Sector"
                name="sector"
                value={formik.values.sector}
                onChange={formik.handleChange}
                error={formik.touched.sector && Boolean(formik.errors.sector)}
                helperText={formik.touched.sector && formik.errors.sector}
                fullWidth
                placeholder="Value"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                label="Correo"
                name="correo"
                value={formik.values.correo}
                onChange={formik.handleChange}
                error={formik.touched.correo && Boolean(formik.errors.correo)}
                helperText={formik.touched.correo && formik.errors.correo}
                fullWidth
                placeholder="Value"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                label="Tipo de convenio"
                name="tipo_convenio"
                value={formik.values.tipo_convenio}
                onChange={formik.handleChange}
                error={formik.touched.tipo_convenio && Boolean(formik.errors.tipo_convenio)}
                helperText={formik.touched.tipo_convenio && formik.errors.tipo_convenio}
                fullWidth
                placeholder="Value"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                label="Teléfono"
                name="telefono"
                value={formik.values.telefono}
                onChange={formik.handleChange}
                error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                helperText={formik.touched.telefono && formik.errors.telefono}
                fullWidth
                placeholder="Value"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                label="Sitio web"
                name="sitio_web"
                value={formik.values.sitio_web}
                onChange={formik.handleChange}
                error={formik.touched.sitio_web && Boolean(formik.errors.sitio_web)}
                helperText={formik.touched.sitio_web && formik.errors.sitio_web}
                fullWidth
                placeholder="Value"
                />
            </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/admin/empresas')} sx={{ mr: 2 }}>
                Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
                Guardar
            </Button>
            </Box>
        </form>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
            <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
        </Paper>
  );
};

export default EmpresaForm;