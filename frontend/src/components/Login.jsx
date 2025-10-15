// src/components/Login.js - Formulario de login con validaciones
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, TextField, Typography, Container } from "@mui/material";

const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required("Requerido"),
    password: Yup.string().min(8, "Mínimo 8 caracteres").required("Requerido"),
});

const Login = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
        <Typography variant="h4">Login SIVSE</Typography>
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
                const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                values
                );
                localStorage.setItem("token", response.data.token);
                const decoded = JSON.parse(atob(response.data.token.split(".")[1]));
                if (decoded.role === "admin") navigate("/admin/dashboard");
                else if (decoded.role === "egresado") navigate("/egresado/dashboard");
                else navigate("/login"); // Fallback si el rol no es reconocido
            } catch (err) {
                console.error("Login error:", err);
                setErrors({ submit: "Credenciales inválidas" });
            }
            setSubmitting(false);
            }}
        >
            {({ isSubmitting, errors }) => (
            <Form>
                <Field
                as={TextField}
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                />
                <ErrorMessage
                name="email"
                component="div"
                style={{ color: "red" }}
                />
                <Field
                as={TextField}
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                />
                <ErrorMessage
                name="password"
                component="div"
                style={{ color: "red" }}
                />
                {errors.submit && (
                <div style={{ color: "red" }}>{errors.submit}</div>
                )}
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                Login
                </Button>
            </Form>
            )}
        </Formik>
        </Container>
    );
};

export default Login;