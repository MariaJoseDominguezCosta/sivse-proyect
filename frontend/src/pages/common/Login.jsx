import React from "react";
import { Box, Button, TextField, Link } from "@mui/material";
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
    <Box className="login-form">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form style={{ width: "100%" }}>
            {/* Campos de Formik Field */}
            <Field
              name="email"
              margin="normal"
              variant="outlined"
              placeholder="Email"
              className="login-input"
              type="email"
              autoComplete="email"
            />
            <ErrorMessage
              name="email"
              component="div"
              style={{ color: "red", fontSize: "0.8rem", marginBottom: "2px" }}
            />
            <Field
              name="password"
              type="password"
              variant="outlined"
              placeholder="Password"
              className="login-input"
              autoComplete="current-password"
            />
            <ErrorMessage
              name="password"
              component="div"
              style={{ color: "red", fontSize: "0.8rem", marginBottom: "2px" }}
            />
            {errors.general && (
              <div
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                  marginBottom: "2px",
                }}
              >
                {errors.general}
              </div>
            )}

            {/* Botón de Iniciar Sesión (Estilo de la maqueta: negro, sin contorno) */}
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                padding : {
                  xs: "2px",
                  sm: "4px",
                  md: "6px",
                  lg: "8px",
                  xl: "10px",
                },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                justifySelf: "center",
                borderRadius: "8px",
                backgroundColor: "var(--button-save)",
                color: "rgba(245, 245, 245, 1)",
                fontSize: "1rem",
                textTransform: "none",
                marginTop: "10px",
                "&:hover": {
                  backgroundColor: "var(--button-save)", opacity: 0.9
                },

              }}
            >
              Iniciar Sesión
            </Button>
          </Form>
        )}
      </Formik>

      {/* Links de recuperación y registro */}
      <Link href="/recover" variant="body2" className="login-text-link">
        ¿Olvidaste tu contraseña?
      </Link>
      <Link href="/register" variant="body2" className="login-text-link">
        Regístrate como egresado
      </Link>
    </Box>
  );
};

export default Login;
