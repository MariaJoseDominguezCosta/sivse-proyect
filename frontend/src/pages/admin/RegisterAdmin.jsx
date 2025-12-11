// src/pages/admin/RegisterAdmin.jsx - Página de registro de administradores
import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RegisterAdmin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirm_password: "",
    });

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
        try {
            // Usar la instancia de axios configurada
            const res = await axios.post("/admin/register", dataToSend);
            
            // Mostrar mensaje de éxito y redirigir
            toast.success(res.data.message || "Administrador registrado exitosamente.");
            navigate("/admin"); // Redirigir al dashboard de admin tras el registro
        } catch (err) {
            console.error("Error registering admin:", err.response?.data || err.message);
            toast.error(err.response?.data?.error || "Error al registrar el administrador.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Typography variant="h4" gutterBottom>Registro de Administrador</Typography>                
                <form onSubmit={handleSubmit}>
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
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Registrar
                    </Button>
                </form>
            </Box>
        </Container>
    );
    
};

export default RegisterAdmin;