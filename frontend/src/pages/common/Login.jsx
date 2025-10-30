import React from 'react';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { jwtDecode } from 'jwt-decode';
import axios from '../../utils/axiosConfig';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
});

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const res = await axios.post('/auth/login', values);
      const { token } = res.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      const rol = decoded.role;
      if (rol === 'admin') {
        navigate('/admin');
      } else if (rol === 'egresado') {
        navigate('/egresado');
      } else {
        throw new Error('Rol inválido');
      }
      toast.success('Inicio de sesión exitoso.');
    } catch (err) {
      console.error('Login error details:', err.response?.data || err.message);
      if (err.response?.status === 500) {
        setFieldError('general', 'Error interno del servidor. Contacta al administrador.');
      } else if (err.response?.data?.error) {
        setFieldError('general', err.response.data.error);
      } else {
        setFieldError('general', 'Credenciales inválidas o error desconocido');
      }
      toast.error('Error al iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
      <Typography variant="h4">SIVSE</Typography>
      <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, errors }) => (
          <Form>
            <Field as={TextField} name="email" label="Email" fullWidth margin="normal" />
            <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
            <Field as={TextField} name="password" type="password" label="Password" fullWidth margin="normal" />
            <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
            {errors.general && <div style={{ color: 'red' }}>{errors.general}</div>}
            <Button variant="contained" type="submit" fullWidth disabled={isSubmitting}>Iniciar Sesión</Button>
          </Form>
        )}
      </Formik>
      <Link href="/recover">¿Olvidaste tu contraseña?</Link>
      <Link href="/register">Regístrate como egresado</Link>
    </Box>
  );
};

export default Login;