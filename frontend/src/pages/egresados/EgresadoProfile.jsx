import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button, TextField, Grid } from '@mui/material';
import axios from '../../utils/axiosConfig';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const EgresadoProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/egresados/profile');
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
    nombre: Yup.string().required('Requerido'),
    generacion: Yup.string().required('Requerido'),
    carrera: Yup.string().required('Requerido'),
    empresa: Yup.string(),
    puesto: Yup.string(),
    modalidad: Yup.string(),
    telefono: Yup.string().matches(/^\+?[\d\s-]{10,}$/, 'Teléfono inválido'),
    linkedin: Yup.string().url('URL inválida'),
    instagram: Yup.string().url('URL inválida'),
    otro: Yup.string(),
  });

  const handleSave = async (values, { setSubmitting }) => {
    try {
      await axios.put('/egresados/profile', values);
      setProfile(values);
      setIsEditing(false);
      toast.success('Perfil actualizado exitosamente.');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error al guardar los cambios. Intenta de nuevo.');
      toast.error('Error al guardar los cambios.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
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

  return (
    <Box className="form-container">
      {!isEditing ? (
        <>
          <Typography variant="h5" gutterBottom>
            {profile.nombre_completo || 'Sin nombre'} - {profile.ubicacion || 'Sin ubicación'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Generación: {profile.generacion || 'No especificada'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Carrera: {profile.carrera || 'No especificada'}
          </Typography>
          <Typography variant="h6" mt={2} gutterBottom>
            Información de empresa actual
          </Typography>
          <Typography>Nombre: {profile.empresa || 'No empleada'}</Typography>
          <Typography>Puesto: {profile.puesto || 'No especificado'}</Typography>
          <Typography>Modalidad: {profile.modalidad || 'No especificada'}</Typography>
          <Typography variant="h6" mt={2} gutterBottom>
            Datos de contacto
          </Typography>
          <Typography>Teléfono: {profile.telefono || 'No proporcionado'}</Typography>
          <Typography variant="h6" mt={2} gutterBottom>
            Redes sociales
          </Typography>
          <Typography>LinkedIn: {profile.linkedin || 'No proporcionado'}</Typography>
          <Typography>Instagram: {profile.instagram || 'No proporcionado'}</Typography>
          <Typography>Otro: {profile.otro || 'No proporcionado'}</Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => setIsEditing(true)}>Editar Perfil</Button>
          </Box>
        </>
      ) : (
        <Formik
          initialValues={{
            nombre: profile.nombre_completo || '',
            generacion: profile.generacion || '',
            carrera: profile.carrera || '',
            empresa: profile.empresa || '',
            puesto: profile.puesto || '',
            modalidad: profile.modalidad || '',
            telefono: profile.telefono || '',
            linkedin: profile.linkedin || '',
            instagram: profile.instagram || '',
            otro: profile.otro || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="nombre"
                    label="Nombre"
                    fullWidth
                    error={touched.nombre && !!errors.nombre}
                    helperText={touched.nombre && errors.nombre}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="generacion"
                    label="Generación"
                    fullWidth
                    error={touched.generacion && !!errors.generacion}
                    helperText={touched.generacion && errors.generacion}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="carrera"
                    label="Carrera"
                    fullWidth
                    error={touched.carrera && !!errors.carrera}
                    helperText={touched.carrera && errors.carrera}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="empresa"
                    label="Empresa"
                    fullWidth
                    error={touched.empresa && !!errors.empresa}
                    helperText={touched.empresa && errors.empresa}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="puesto"
                    label="Puesto"
                    fullWidth
                    error={touched.puesto && !!errors.puesto}
                    helperText={touched.puesto && errors.puesto}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="modalidad"
                    label="Modalidad"
                    fullWidth
                    error={touched.modalidad && !!errors.modalidad}
                    helperText={touched.modalidad && errors.modalidad}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="telefono"
                    label="Teléfono"
                    fullWidth
                    error={touched.telefono && !!errors.telefono}
                    helperText={touched.telefono && errors.telefono}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="linkedin"
                    label="LinkedIn"
                    fullWidth
                    error={touched.linkedin && !!errors.linkedin}
                    helperText={touched.linkedin && errors.linkedin}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="instagram"
                    label="Instagram"
                    fullWidth
                    error={touched.instagram && !!errors.instagram}
                    helperText={touched.instagram && errors.instagram}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="otro"
                    label="Otro"
                    fullWidth
                    error={touched.otro && !!errors.otro}
                    helperText={touched.otro && errors.otro}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" type="submit" disabled={isSubmitting}>Guardar</Button>
                <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>Cancelar</Button>
              </Box>
              {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
};

export default EgresadoProfile;