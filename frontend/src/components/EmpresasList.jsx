import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmpresaList = () => {
    const [empresas, setEmpresas] = useState([]);
    const [tipoConvenio, setTipoConvenio] = useState('');
    const [sector, setSector] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/empresas')
        .then(response => setEmpresas(response.data))
        .catch(error => console.error('Error fetching empresas:', error));
    }, []);

    const handleFilter = () => {
        // Lógica de filtrado
        console.log('Filtrando por', { tipoConvenio, sector });
    };

    return (
        <div className="table-container">
        <h1>Gestión de Empresas</h1>
        <div className="filters">
            <select value={tipoConvenio} onChange={(e) => setTipoConvenio(e.target.value)}>
            <option value="">Tipo Convenio</option>
            <option value="Local">Local</option>
            <option value="Nacional">Nacional</option>
            </select>
            <select value={sector} onChange={(e) => setSector(e.target.value)}>
            <option value="">Sector</option>
            <option value="Tecnológica">Tecnológica</option>
            <option value="Salud">Salud</option>
            </select>
            <button onClick={handleFilter}>Registrar nueva empresa</button>
        </div>
        <table>
            <thead>
            <tr>
                <th>#</th>
                <th>Razón Social</th>
                <th>Sector</th>
                <th>Tipo Convenio</th>
                <th>Teléfono</th>
                <th>Editar</th>
                <th>Remover</th>
            </tr>
            </thead>
            <tbody>
            {empresas.map((empresa, index) => (
                <tr key={empresa.id}>
                <td>{index + 1}</td>
                <td>{empresa.razon_social}</td>
                <td>{empresa.sector}</td>
                <td>{empresa.tipo_convenio}</td>
                <td>{empresa.telefono}</td>
                <td><button>✏️</button></td>
                <td><button>🗑️</button></td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default EmpresaList;