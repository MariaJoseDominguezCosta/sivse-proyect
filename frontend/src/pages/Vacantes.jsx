// pages/Vacantes.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const Vacantes = () => {
    const [vacantes, setVacantes] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get('http://localhost:5000/api/egresado/vacantes/recommended').then(res => setVacantes(res.data));
    }, []);

    return (
        <div>
        <h2 className="text-2xl mb-4">Vacantes Recomendadas</h2>
        <div className="grid grid-cols-3 gap-4">
            {vacantes.map(vacante => (
            <div key={vacante.id} className="bg-gray-100 p-4 rounded">
                <h3 className="font-bold">{vacante.titulo}</h3>
                <p>{vacante.descripcion || 'Sin descripción'}</p>
                <p><strong>Empresa:</strong> {vacante.empresa_nombre}</p>
            </div>
            ))}
        </div>
        </div>
    );
};

export default Vacantes;