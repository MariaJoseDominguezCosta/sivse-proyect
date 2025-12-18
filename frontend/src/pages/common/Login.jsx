import React from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";
import axios from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import "../../assets/login.css";

const validationSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
});

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const res = await axios.post("/auth/login", values);
      const { token } = res.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      const rol = decoded.role;
      if (rol === "admin") {
        navigate("/admin");
      } else if (rol === "egresado") {
        navigate("/egresado");
      } else {
        throw new Error("Rol inválido");
      }
      toast.success("Inicio de sesión exitoso.");
    } catch (err) {
      console.error("Login error details:", err.response?.data || err.message);
      if (err.response?.status === 500) {
        setFieldError(
          "general",
          "Error interno del servidor. Contacta al administrador."
        );
      } else if (err.response?.data?.error) {
        setFieldError("general", err.response.data.error);
      } else {
        setFieldError("general", "Credenciales inválidas o error desconocido");
      }
      toast.error("Error al iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="login-container">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        className="login-login-elm"
      >
        {({ isSubmitting, errors }) => (
          <Form className="login-form-log-in-elm">
            {/* Campos de Formik Field */}
            <Field
              as={TextField}
              name="email"
              label="Email"
              fullWidth
              margin="normal"
              variant="outlined"
              placeholder="Value"
              className="login-input-elm1"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="login-text-elm6"
            />
            <Field
              as={TextField}
              name="password"
              type="password"
              label="Password"
              fullWidth
              margin="normal"
              variant="outlined"
              placeholder="Value"
              className="login-input-elm2"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="login-text-elm6"
            />
            {errors.general && (
              <div
                className="login-text-elm6"
              >
                {errors.general}
              </div>
            )}

            {/* Botón de Iniciar Sesión (Estilo de la maqueta: negro, sin contorno) */}
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              className="login-button-elm"
            >
              <span className="login-text-elm4">Iniciar Sesión</span>
            </Button>

            {/* Links de recuperación y registro */}
            <Link href="/recover" variant="body2" className="login-link-elm">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link href="/register" variant="body2" className="login-link-elm">
              Regístrate como egresado
            </Link>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
