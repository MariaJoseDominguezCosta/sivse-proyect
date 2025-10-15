// src/pages/Dashboard.js - Dashboard básico (verifica token)
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
        navigate('/login');
        return;
        }
        // Opcional: Verifica token en backend con una llamada protegida
    }, [navigate]);

    return <h1>Bienvenido al Dashboard de SIVSE</h1>;
};

export default Dashboard;