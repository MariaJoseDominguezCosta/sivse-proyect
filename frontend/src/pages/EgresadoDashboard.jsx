// src/pages/EgresadoDashboard.js
import React from 'react';
import { Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';    

const EgresadoDashboard = () => (
    <Container>
        <Typography variant="h4">Dashboard Egresado</Typography>
        <Link to="/logout">Logout</Link>
        {/* Lógica futura: Listas de egresados, vacantes */}
    </Container>
);

export default EgresadoDashboard;