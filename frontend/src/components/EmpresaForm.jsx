import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const sectors = ['Tecnología', 'Manufactura', 'Servicios', 'Otros'];  // Opciones predefinidas

const validationSchema = Yup.object({
    nombre: Yup.string().min(3, 'Mínimo 3 caracteres').required('Requerido'),
    sector: Yup.string().required('Requerido'),
    contacto: Yup.string().required('Requerido'),
    });

    const EmpresaForm = () => {
    const { id } = useParams();  // Para edición
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const formik = useFormik({
        initialValues: { nombre: '', sector: '', contacto: '' },
        validationSchema,
        onSubmit: async (values) => {
        try {
            if (id) {
            await axios.put(`/empresas/${id}`, values);
            } else {
            await axios.post('/empresas', values);
            }
            navigate('/admin/empresas');  // Redirige a lista
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
                console.error(error);
                setErrorMessage('Error al cargar datos');
                setOpenSnackbar(true);
            }
        };
        fetchEmpresa();
        }
    }, [id, formik]);

    return (
        <form onSubmit={formik.handleSubmit}>
        //Input de Nombre (Sector social)
        <TextField
            label="Nombre/Sector social"
            name="nombre"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
            helperText={formik.touched.nombre && formik.errors.nombre}
            fullWidth
            margin="normal"
        />
        <FormControl fullWidth margin="normal">
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
        <TextField
            label="Tipo de Convenio"
            name="tipo_convenio"
            value={formik.values.tipo_convenio}
            onChange={formik.handleChange}
            error={formik.touched.tipo_convenio && Boolean(formik.errors.tipo_convenio)}
            helperText={formik.touched.tipo_convenio && formik.errors.tipo_convenio}
            fullWidth
            margin="normal"
        />
        //Input de direccion
        <TextField
            label="Dirección"
            name="direccion"
            value={formik.values.direccion}
            onChange={formik.handleChange}
            error={formik.touched.direccion && Boolean(formik.errors.direccion)}
            helperText={formik.touched.direccion && formik.errors.direccion}
            fullWidth
            margin="normal"
        />
        //Input de telefono
        <TextField
            label="Teléfono"
            name="telefono"
            value={formik.values.telefono}
            onChange={formik.handleChange}
            error={formik.touched.telefono && Boolean(formik.errors.telefono)}
            helperText={formik.touched.telefono && formik.errors.telefono}
            fullWidth
            margin="normal"
        />
        //Input de email
        <TextField
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
            margin="normal"
        />
        //Input de web
        <TextField
            label="Web"
            name="web"
            value={formik.values.web}
            onChange={formik.handleChange}
            error={formik.touched.web && Boolean(formik.errors.web)}
            helperText={formik.touched.web && formik.errors.web}
            fullWidth
            margin="normal"
        />

        //Input de contacto
        <TextField
            label="Contacto"
            name="contacto"
            value={formik.values.contacto}
            onChange={formik.handleChange}
            error={formik.touched.contacto && Boolean(formik.errors.contacto)}
            helperText={formik.touched.contacto && formik.errors.contacto}
            fullWidth
            margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
            {id ? 'Actualizar' : 'Crear'}
        </Button>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
            <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
        </form>
    );
};

export default EmpresaForm;