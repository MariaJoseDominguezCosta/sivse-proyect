import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';

const AlumniTracking = () => {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/egresados', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlumni(res.data);
        setFilteredAlumni(res.data);
      } catch (err) {
        console.error('Error fetching alumni:', err);
      }
    };
    fetchAlumni();
  }, []);

  useEffect(() => {
    setFilteredAlumni(
      alumni.filter((a) =>
        a.nombre.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, alumni]);

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Hinted search text"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="filter-select"><option>Generación ▼</option></select>
        <select className="filter-select"><option>Estado Laboral ▼</option></select>
      </div>
      <div className="table-container">
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
            {filteredAlumni.map((alumni, index) => (
              <tr key={alumni.id}>
                <td>{index + 1}</td>
                <td>{alumni.nombre}</td>
                <td>{alumni.puesto}</td>
                <td>{alumni.ubicacion}</td>
                <td>
                  <FaInfoCircle onClick={() => navigate(`/admin/egresados/${alumni.id}`)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlumniTracking;