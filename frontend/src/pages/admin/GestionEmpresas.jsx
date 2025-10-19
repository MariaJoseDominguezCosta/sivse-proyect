import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/empresas', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(res.data);
        setFilteredCompanies(res.data);
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    setFilteredCompanies(
      companies.filter((company) =>
        company.razonSocial.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, companies]);

  const deleteCompany = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar esta empresa?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/empresas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(companies.filter((c) => c.id !== id));
      } catch (err) {
        console.error('Error deleting company:', err);
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
        <select className="filter-select"><option>Tipo Convenio ▼</option></select>
        <select className="filter-select"><option>Sector ▼</option></select>
        <button className="btn-new" onClick={() => navigate('/admin/empresas/register')}>
          Registrar nueva empresa
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Razón Social</th>
              <th>Sector</th>
              <th>Tipo Convenio</th>
              <th>Telefono</th>
              <th>Editar</th>
              <th>Remover</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company, index) => (
              <tr key={company.id}>
                <td>{index + 1}</td>
                <td>{company.razonSocial}</td>
                <td>{company.sector}</td>
                <td>{company.tipoConvenio}</td>
                <td>{company.telefono}</td>
                <td>
                  <FaPencilAlt onClick={() => navigate(`/admin/empresas/edit/${company.id}`)} />
                </td>
                <td>
                  <FaTrashAlt onClick={() => deleteCompany(company.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyManagement;