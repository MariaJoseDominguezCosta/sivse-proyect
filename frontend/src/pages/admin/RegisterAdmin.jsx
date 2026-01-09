// src/pages/admin/RegisterAdmin.jsx - Página de registro de administradores
import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, CircularProgress } from "@mui/material"; // Importar CircularProgress
import axios from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RegisterAdmin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirm_password: "",
    });
    const [loading, setLoading] = useState(false); // Nuevo estado de carga

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }

        const dataToSend = {
            email: formData.email,
            password: formData.password,
        };

        setLoading(true); // Iniciar carga

        try {
            // Usar la instancia de axios configurada
            const res = await axios.post("/admin/register", dataToSend);

            // Mostrar mensaje de éxito y redirigir
            toast.success(
                res.data.message || "Administrador registrado exitosamente."
            );
            navigate("/admin"); // Redirigir al dashboard de admin tras el registro
        } catch (err) {
            console.error(
                "Error registering admin:",
                err.response?.data || err.message
            );
            toast.error(
                err.response?.data?.error || "Error al registrar el administrador."
            );
        } finally {
            setLoading(false); // Finalizar carga
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center", // Mejor usar alignItems para centrar verticalmente si el Box no ocupa todo el alto
                minHeight: '70vh' // Ajuste para visualizar el centrado
            }}
        >
            <Box
                sx={{
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    width: '100%' // Asegurar que el Box use el ancho de su Container
                }}
            >
                <Typography variant="h4" gutterBottom align="center" sx={{
                    fontWeight: "bold",
                    fontSize: {
                        xs: "1.4rem",
                        sm: "1.6rem",
                        md: "1.8rem",
                    },
                }}>
                    Registro de Administrador
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        name="email"
                        label="Correo"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="password"
                        label="Contraseña"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="confirm_password"
                        label="Confirmar Contraseña"
                        type="password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading} // Deshabilitar el botón durante la carga
                        sx={{
                            p: { xs: 1 },
                            mt: 2,
                            display: "flex",
                            justifySelf: "center",
                            justifyContent: "center", // Centrar contenido (spinner)
                            bgcolor: 'var(--button-save)',
                            '&:hover': { bgcolor: 'var(--button-save)', opacity: 0.9 }
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Registrar"}
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default RegisterAdmin;