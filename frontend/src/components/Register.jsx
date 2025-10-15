// src/components/Register.js - Formulario de registro con validaciones
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    Button,
    TextField,
    Typography,
    Container,
    MenuItem,
} from "@mui/material";

const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required("Requerido"),
    password: Yup.string().min(8, "Mínimo 8 caracteres").required("Requerido"),
    role: Yup.string()
        .oneOf(["admin", "egresado"], "Rol inválido")
        .required("Requerido"),
});

const Register = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
        <Typography variant="h4">Registro SIVSE</Typography>
        <Formik
            initialValues={{ email: "", password: "", role: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
                await axios.post("http://localhost:5000/api/auth/register", values);
                alert("Registro exitoso. Inicia sesión.");
                navigate("/login");
            } catch (err) {
                setErrors({
                submit: err.response?.data?.message || "Error en registro",
                });
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
                <Field
                as={TextField}
                select
                name="role"
                label="Rol"
                fullWidth
                margin="normal"
                >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="egresado">Egresado</MenuItem>
                </Field>
                <ErrorMessage
                name="role"
                component="div"
                style={{ color: "red" }}
                />
                {errors.submit && (
                <div style={{ color: "red" }}>{errors.submit}</div>
                )}
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                Registrar
                </Button>
            </Form>
            )}
        </Formik>
        </Container>
    );
};

export default Register;
