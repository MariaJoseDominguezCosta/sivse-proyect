import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EgresadoList = () => {
  const [egresados, setEgresados] = useState([]);
  const [generacion, setGeneracion] = useState('');
  const [estadoLaboral, setEstadoLaboral] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/egresados')
      .then(response => setEgresados(response.data))
      .catch(error => console.error('Error fetching egresados:', error));
  }, []);

  const handleFilter = () => {
    // Lógica de filtrado
    console.log('Filtrando por', { generacion, estadoLaboral });
  };

  return (
    <div className="table-container">
      <h1>Seguimiento de Egresados</h1>
      <div className="filters">
        <select value={generacion} onChange={(e) => setGeneracion(e.target.value)}>
          <option value="">Generación</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
        </select>
        <select value={estadoLaboral} onChange={(e) => setEstadoLaboral(e.target.value)}>
          <option value="">Estado Laboral</option>
          <option value="Desempleado">Desempleado</option>
          <option value="Empleador">Empleador</option>
        </select>
        <input type="text" placeholder="Hinted search text" />
        <button onClick={handleFilter}>🔍</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Puesto</th>
            <th>Ubicación</th>
            <th>Ver detalles</th>
          </tr>
        </thead>
        <tbody>
          {egresados.map((egresado, index) => (
            <tr key={egresado.id}>
              <td>{index + 1}</td>
              <td>{egresado.nombre_completo}</td>
              <td>{egresado.puesto}</td>
              <td>{egresado.ubicacion}</td>
              <td><button>ℹ️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EgresadoList;