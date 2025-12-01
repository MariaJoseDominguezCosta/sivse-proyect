import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button, TextField, Grid } from '@mui/material';
import axios from '../../utils/axiosConfig';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Función para formatear fechas al formato YYYY-MM-DD para inputs tipo date
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        // Formato YYYY-MM-DD
        return date.toISOString().split('T')[0]; 
    } catch (e) {
        console.error('Error al formatear la fecha:', e);
        return '';
    }
};

const EditPerfil = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Eliminamos el estado isEditing, ya que esta página es SIEMPRE la edición.
  const navigate = useNavigate(); // Necesario para el botón Cancelar

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // CORRECCIÓN DE ENDPOINT: /egresado/profile
        const res = await axios.get('/egresado/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('No se pudo cargar tu perfil. Intenta de nuevo.');
        toast.error('Error al cargar el perfil.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validationSchema = Yup.object({
    nombre_completo: Yup.string().required('Requerido'),
    generacion: Yup.string().required('Requerido'),
    carrera: Yup.string().required('Requerido'),
    empresa_actual: Yup.string(),
    puesto: Yup.string(),
    modalidad: Yup.string(),
    telefono: Yup.string().matches(/^\+?[\d\s-]{10,}$/, 'Teléfono inválido'),
    linkedin: Yup.string().url('URL inválida'),
    instagram: Yup.string().url('URL inválida'),
    otro: Yup.string(),
  });

  const handleSave = async (values, { setSubmitting }) => {
    // Determinar si está empleado (si hay empresa O puesto O modalidad)
    const isEmployed = values.empresa_actual || values.puesto || values.modalidad;
    const newEstadoLaboral = isEmployed ? 'Empleado' : 'Desempleado';
    try {
      // Ajustar los valores antes de enviar (ej. combinar campos de redes)
      const dataToSend = {
          ...values,
          estado_laboral: newEstadoLaboral,
          redes: { linkedin: values.linkedin, instagram: values.instagram, otro: values.otro },
          // Convertir la fecha de vuelta a formato Date si es necesario
          fecha_inicio: values.fecha_inicio ? new Date(values.fecha_inicio) : null,
          // user_id y email no se deben enviar o deben ser protegidos en el backend.
      };
      // Eliminar campos de redes del nivel superior
      delete dataToSend.linkedin;
      delete dataToSend.instagram;
      delete dataToSend.otro;


      await axios.put('/egresado/profile', dataToSend);
      toast.success('Perfil actualizado exitosamente.');
      navigate('/egresado'); // Redirigir al dashboard
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error al guardar los cambios. Intenta de nuevo.');
      toast.error('Error al guardar los cambios.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box sx={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        {error || 'Perfil no encontrado'}
      </Box>
    );
  }

   // Mapeo inicial de datos del perfil a la estructura del formulario de Formik
  const initialData = {
    // Campos principales (Asegurarse de que el nombre del campo coincida con el del backend)
    nombre_completo: profile.nombre_completo || '',
    email: profile.email || '',
    telefono: profile.telefono || '',
    ubicacion: profile.ubicacion || '',
    generacion: profile.generacion || '',
    carrera: profile.carrera || '',
    estado_laboral: profile.estado_laboral || 'Desempleado',
    empresa_actual: profile.empresa_actual || '',
    puesto: profile.puesto || '',
    modalidad: profile.modalidad || '',
    fecha_inicio: formatDateForInput(profile.fecha_inicio), // Usar función de formato de fecha
    
    // Campos de Redes Sociales (desanidar del objeto JSON)
    linkedin: profile.redes?.linkedin || '',
    instagram: profile.redes?.instagram || '',
    otro: profile.redes?.otro || '',
  };

    return (
    // Aplicar estilos del formulario
    <Box className="form-container" sx={{ maxWidth: '900px', margin: '30px auto' }}>
        <Formik
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ isSubmitting, errors, touched}) => (
            <Form>
              <Grid container spacing={2}>
                {/* Columna Izquierda */}
                <Grid item xs={12} md={6}>
                  <Field as={TextField} name="nombre_completo" label="Nombre Completo" fullWidth margin="normal" error={touched.nombre_completo && !!errors.nombre_completo} helperText={touched.nombre_completo && errors.nombre_completo} />
                  <Field as={TextField} name="email" label="Correo" type="email" fullWidth margin="normal" disabled /> {/* Email suele ser deshabilitado */}
                  <Field as={TextField} name="telefono" label="Teléfono" fullWidth margin="normal" error={touched.telefono && !!errors.telefono} helperText={touched.telefono && errors.telefono} />
                  <Field as={TextField} name="ubicacion" label="Ubicación" fullWidth margin="normal" />
                  <Field as={TextField} name="empresa_actual" label="Empresa Actual" fullWidth margin="normal" />
                  <Field as={TextField} name="puesto" label="Puesto" fullWidth margin="normal" />
                </Grid>

                {/* Columna Derecha */}
                <Grid item xs={12} md={6}>
                  <Field as={TextField} name="fecha_inicio" label="Fecha de Inicio" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
                  <Field as={TextField} name="modalidad" label="Modalidad" fullWidth margin="normal" />
                  <Field as={TextField} name="generacion" label="Generación" fullWidth margin="normal" error={touched.generacion && !!errors.generacion} helperText={touched.generacion && errors.generacion} />
                  <Field as={TextField} name="carrera" label="Carrera" fullWidth margin="normal" error={touched.carrera && !!errors.carrera} helperText={touched.carrera && errors.carrera} />
                  <Field as={TextField} name="linkedin" label="LinkedIn" fullWidth margin="normal" error={touched.linkedin && !!errors.linkedin} helperText={touched.linkedin && errors.linkedin} />
                  <Field as={TextField} name="instagram" label="Instagram" fullWidth margin="normal" />
                  <Field as={TextField} name="otro" label="Otra Red Social" fullWidth margin="normal" />
                </Grid>
              </Grid>
              
              {/* Botones */}
              <Box className="buttons">
                <Button className="btn-cancel" onClick={() => navigate('/egresado')}>Cancelar</Button>
                <Button className="btn-save" type="submit" disabled={isSubmitting}>Guardar</Button>
              </Box>
              {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
            </Form>
          )}
        </Formik>
    </Box>
  );
};

export default EditPerfil;