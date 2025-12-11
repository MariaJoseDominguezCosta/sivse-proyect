import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Grid,
  Avatar,
} from "@mui/material";
import api, { IMAGE_BASE_URL } from "../../utils/axiosConfig";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Función para formatear fechas al formato YYYY-MM-DD para inputs tipo date
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // Formato YYYY-MM-DD
    return date.toISOString().split("T")[0];
  } catch (e) {
    console.error("Error al formatear la fecha:", e);
    return "";
  }
};

const EditPerfil = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Eliminamos el estado isEditing, ya que esta página es SIEMPRE la edición.
  const navigate = useNavigate(); // Necesario para el botón Cancelar

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/egresado/profile");
        if (res.data?.foto_perfil) {
          setPreviewImage(`${IMAGE_BASE_URL}${res.data.foto_perfil}?v=${Date.now()}`);
        }
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("No se pudo cargar tu perfil. Intenta de nuevo.");
        toast.error("Error al cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Función para manejar el cambio de archivo de foto de perfil
  const handlePhotoUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("foto_perfil", file); // 'photo' DEBE coincidir con el nombre del campo de Multer

    try {
      const res = await api.put("/egresado/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Actualizar el estado del perfil con la nueva URL
      setProfile((prev) => ({ ...prev, foto_perfil: res.data?.foto_perfil }));
      toast.success("Foto de perfil actualizada.");
    } catch (err) {
      console.error(
        "Error al subir la foto:",
        err.response?.data || err.message
      );
      toast.error("Error al subir la foto.");
    }
  };

  const validationSchema = Yup.object({
    nombre_completo: Yup.string().required("Requerido"),
    generacion: Yup.string().required("Requerido"),
    carrera: Yup.string().required("Requerido"),
    empresa_actual: Yup.string(),
    puesto: Yup.string(),
    modalidad: Yup.string(),
    telefono: Yup.string().matches(/^\+?[\d\s-]{10,}$/, "Teléfono inválido"),
    linkedin: Yup.string().url("URL inválida"),
    instagram: Yup.string().url("URL inválida"),
    otro: Yup.string(),
  });

  const handleSave = async (values, { setSubmitting }) => {
    // Determinar si está empleado (si hay empresa O puesto O modalidad)
    const isEmployed =
      values.empresa_actual || values.puesto || values.modalidad;
    const newEstadoLaboral = isEmployed ? "Empleado" : "Desempleado";
    try {
      // Ajustar los valores antes de enviar (ej. combinar campos de redes)
      const dataToSend = {
        ...values,
        estado_laboral: newEstadoLaboral,
        redes: {
          linkedin: values.linkedin,
          instagram: values.instagram,
          otro: values.otro,
        },
        // Convertir la fecha de vuelta a formato Date si es necesario
        fecha_inicio: values.fecha_inicio
          ? new Date(values.fecha_inicio)
          : null,
      };
      // Eliminar campos de redes del nivel superior
      delete dataToSend.linkedin;
      delete dataToSend.instagram;
      delete dataToSend.otro;

      await api.put("/egresado/profile", dataToSend);
      toast.success("Perfil actualizado exitosamente.");
      navigate("/egresado"); // Redirigir al dashboard
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Error al guardar los cambios. Intenta de nuevo.");
      toast.error("Error al guardar los cambios.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box sx={{ padding: "20px", color: "red", textAlign: "center" }}>
        {error || "Perfil no encontrado"}
      </Box>
    );
  }

  // --- MANEJADOR DE CAMBIO DE INPUT ---
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 1. Crear una URL de objeto temporal para la vista previa
      setPreviewImage(URL.createObjectURL(file));
      // 2. Subir el archivo
      handlePhotoUpload(file);
    }
    event.target.value = null; // Resetear el input para permitir subir el mismo archivo nuevamente si se desea
  };

  // Mapeo inicial de datos del perfil a la estructura del formulario de Formik
  const initialData = {
    // Campos principales (Asegurarse de que el nombre del campo coincida con el del backend)
    nombre_completo: profile.nombre_completo || "",
    email: profile.email || "",
    telefono: profile.telefono || "",
    ubicacion: profile.ubicacion || "",
    generacion: profile.generacion || "",
    carrera: profile.carrera || "",
    estado_laboral: profile.estado_laboral || "Desempleado",
    empresa_actual: profile.empresa_actual || "",
    puesto: profile.puesto || "",
    modalidad: profile.modalidad || "",
    fecha_inicio: formatDateForInput(profile.fecha_inicio), // Usar función de formato de fecha

    // Campos de Redes Sociales (desanidar del objeto JSON)
    linkedin: profile.redes?.linkedin || "",
    instagram: profile.redes?.instagram || "",
    otro: profile.redes?.otro || "",
  };

  return (
    // Aplicar estilos del formulario
    <Box
      className="form-container"
      sx={{ maxWidth: "900px", margin: "30px auto" }}
    >
      {/* -- Campo de foto de perfil -- */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Avatar
          src={previewImage}
          alt="Foto de Perfil"
          sx={{ width: 100, height: 100, mb: 2, bgcolor: "var(--accent)" }}
        />
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="photo-upload-button"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="photo-upload-button">
          <Button
            variant="outlined"
            component="span" // Permite que el botón active el input de archivo
            sx={{ textTransform: "none" }}
          >
            Cambiar Foto
          </Button>
        </label>
      </Box>

      <Formik
        initialValues={initialData}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Grid container spacing={2}>
              {/* Columna Izquierda */}
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="nombre_completo"
                  label="Nombre Completo"
                  fullWidth
                  margin="normal"
                  error={touched.nombre_completo && !!errors.nombre_completo}
                  helperText={touched.nombre_completo && errors.nombre_completo}
                />
                <Field
                  as={TextField}
                  name="email"
                  label="Correo"
                  type="email"
                  fullWidth
                  margin="normal"
                  disabled
                />{" "}
                {/* Email suele ser deshabilitado */}
                <Field
                  as={TextField}
                  name="telefono"
                  label="Teléfono"
                  fullWidth
                  margin="normal"
                  error={touched.telefono && !!errors.telefono}
                  helperText={touched.telefono && errors.telefono}
                />
                <Field
                  as={TextField}
                  name="ubicacion"
                  label="Ubicación"
                  fullWidth
                  margin="normal"
                />
                <Field
                  as={TextField}
                  name="empresa_actual"
                  label="Empresa Actual"
                  fullWidth
                  margin="normal"
                />
                <Field
                  as={TextField}
                  name="puesto"
                  label="Puesto"
                  fullWidth
                  margin="normal"
                />
              </Grid>

              {/* Columna Derecha */}
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="fecha_inicio"
                  label="Fecha de Inicio"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <Field
                  as={TextField}
                  name="modalidad"
                  label="Modalidad"
                  fullWidth
                  margin="normal"
                />
                <Field
                  as={TextField}
                  name="generacion"
                  label="Generación"
                  fullWidth
                  margin="normal"
                  error={touched.generacion && !!errors.generacion}
                  helperText={touched.generacion && errors.generacion}
                />
                <Field
                  as={TextField}
                  name="carrera"
                  label="Carrera"
                  fullWidth
                  margin="normal"
                  error={touched.carrera && !!errors.carrera}
                  helperText={touched.carrera && errors.carrera}
                />
                <Field
                  as={TextField}
                  name="linkedin"
                  label="LinkedIn"
                  fullWidth
                  margin="normal"
                  error={touched.linkedin && !!errors.linkedin}
                  helperText={touched.linkedin && errors.linkedin}
                />
                <Field
                  as={TextField}
                  name="instagram"
                  label="Instagram"
                  fullWidth
                  margin="normal"
                />
                <Field
                  as={TextField}
                  name="otro"
                  label="Otra Red Social"
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>

            {/* Botones */}
            <Box className="buttons">
              <Button
                className="btn-cancel"
                onClick={() => navigate("/egresado")}
              >
                Cancelar
              </Button>
              <Button
                className="btn-save"
                type="submit"
                disabled={isSubmitting}
              >
                Guardar
              </Button>
            </Box>
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditPerfil;
