// src/pages/AdminDashboard.js
import React from 'react';
import { Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const AdminDashboard = () => (
  <Container>
    <Typography variant="h4">Dashboard Admin</Typography>
    <Link to="/logout">Logout</Link>
    {/* Lógica futura: Listas de egresados, vacantes */}
  </Container>
);

export default AdminDashboard;