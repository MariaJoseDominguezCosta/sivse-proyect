// pages/BolsaTrabajo.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const BolsaTrabajo = () => {
    const [vacantes, setVacantes] = useState([]);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:5000/api/admin/vacantes', {
        headers: { Authorization: `Bearer ${token}` },
        }).then(res => {
        setVacantes(res.data);
        setNotification('Vacantes cargadas.');
        setTimeout(() => setNotification(''), 3000);
        }).catch(() => setNotification('Error al cargar vacantes.'));
    }, []);

    return (
        <div>
        <h2 className="text-2xl mb-4">Bolsa de Trabajo</h2>
        <ul>
            {vacantes.map(vacante => (
            <li key={vacante.id} className="border-b py-2">{vacante.titulo} - {vacante.empresa_nombre}</li>
            ))}
        </ul>
        {notification && <p className="text-green-500 mt-4">{notification}</p>}
        </div>
    );
};

export default BolsaTrabajo;