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
    // Removido Box con mt: 8, ya que PublicLayout centra el contenido
    <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 4, 
        bgcolor: 'white', // Contenedor blanco para el formulario
        borderRadius: 2, 
        boxShadow: 3,
        width: '100%', 
        maxWidth: 350 // Tamaño fijo para el box del formulario
    }}>
      <Typography variant="h4" sx={{ mb: 3 }}>SIVSE</Typography>
      <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, errors }) => (
          <Form style={{ width: '100%' }}>
            {/* Campos de Formik Field */}
            <Field as={TextField} name="email" label="Email" fullWidth margin="normal" variant="outlined" placeholder="Value" />
            <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
            <Field as={TextField} name="password" type="password" label="Password" fullWidth margin="normal" variant="outlined" placeholder="Value" />
            <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
            {errors.general && <div style={{ color: 'red', fontSize: '0.8rem', marginBottom: '10px' }}>{errors.general}</div>}
            
            {/* Botón de Iniciar Sesión (Estilo de la maqueta: negro, sin contorno) */}
            <Button 
                variant="contained" 
                type="submit" 
                fullWidth 
                disabled={isSubmitting}
                sx={{ 
                    mt: 2, 
                    bgcolor: 'var(--button-save)', // Negro
                    '&:hover': { bgcolor: 'var(--button-save)', opacity: 0.9 } 
                }}
            >
                Iniciar Sesión
            </Button>
          </Form>
        )}
      </Formik>
      
      {/* Links de recuperación y registro */}
      <Link href="/recover" variant="body2" sx={{ mt: 2, fontSize: '0.9rem' }}>
          ¿Olvidaste tu contraseña?
      </Link>
      <Link href="/register" variant="body2" sx={{ mt: 1, fontSize: '0.9rem' }}>
          Regístrate como egresado
      </Link>
    </Box>
  );
};

export default Login;