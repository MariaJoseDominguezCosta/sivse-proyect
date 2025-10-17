// pages/SeguimientoEgresados.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const SeguimientoEgresados = () => {
    const [egresados, setEgresados] = useState([]);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:5000/api/admin/egresados', {
        headers: { Authorization: `Bearer ${token}` },
        }).then(res => {
        setEgresados(res.data);
        setNotification('Lista de egresados cargada.');
        setTimeout(() => setNotification(''), 3000);
        }).catch(() => setNotification('Error al cargar egresados.'));
    }, []);

    return (
        <div>
        <h2 className="text-2xl mb-4">Seguimiento de Egresados</h2>
        <ul>
            {egresados.map(egresado => (
            <li key={egresado.id} className="border-b py-2">{egresado.nombre_completo} - {egresado.email}</li>
            ))}
        </ul>
        {notification && <p className="text-green-500 mt-4">{notification}</p>}
        </div>
    );
};

export default SeguimientoEgresados;