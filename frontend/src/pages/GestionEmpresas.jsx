// pages/GestionEmpresas.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const GestionEmpresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:5000/api/admin/empresas', {
        headers: { Authorization: `Bearer ${token}` },
        }).then(res => {
        setEmpresas(res.data);
        setNotification('Empresas cargadas.');
        setTimeout(() => setNotification(''), 3000);
        }).catch(() => setNotification('Error al cargar empresas.'));
    }, []);

    return (
        <div>
        <h2 className="text-2xl mb-4">Gestión de Empresas</h2>
        <ul>
            {empresas.map(empresa => (
            <li key={empresa.id} className="border-b py-2">{empresa.nombre} - {empresa.contacto}</li>
            ))}
        </ul>
        {notification && <p className="text-green-500 mt-4">{notification}</p>}
        </div>
    );
};

export default GestionEmpresas;