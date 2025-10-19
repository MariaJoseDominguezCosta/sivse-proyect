import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPencilAlt } from 'react-icons/fa';

const JobBoard = () => {
  const [vacancies, setVacancies] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/vacantes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVacancies(res.data);
        setFilteredVacancies(res.data);
      } catch (err) {
        console.error('Error fetching vacancies:', err);
      }
    };
    fetchVacancies();
  }, []);

  useEffect(() => {
    setFilteredVacancies(
      vacancies.filter((vacancy) =>
        vacancy.titulo.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, vacancies]);

  const deleteVacancy = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar esta vacante?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/vacantes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVacancies(vacancies.filter((v) => v.id !== id));
      } catch (err) {
        console.error('Error deleting vacancy:', err);
      }
    }
  };

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
        <select className="filter-select"><option>Ubicación ▼</option></select>
        <select className="filter-select"><option>Empresa ▼</option></select>
        <button className="btn-new" onClick={() => navigate('/admin/vacantes/register')}>
          Publicar nueva vacante
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Titulo</th>
              <th>Empresa</th>
              <th>Ubicación</th>
              <th>Editor</th>
              <th>Remover</th>
            </tr>
          </thead>
          <tbody>
            {filteredVacancies.map((vacancy, index) => (
              <tr key={vacancy.id}>
                <td>{index + 1}</td>
                <td>{vacancy.titulo}</td>
                <td>{vacancy.empresa}</td> {/* Asume que backend devuelve empresa */}
                <td>{vacancy.ubicacion}</td>
                <td>
                  <FaPencilAlt onClick={() => navigate(`/admin/vacantes/edit/${vacancy.id}`)} />
                </td>
                <td>
                  <FaTrashAlt onClick={() => deleteVacancy(vacancy.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobBoard;