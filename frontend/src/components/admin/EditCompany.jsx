import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditCompany = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    razonSocial: '',
    direccion: '',
    sector: '',
    correo: '',
    tipoConvenio: '',
    telefono: '',
    sitioWeb: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/admin/empresas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error('Error fetching company:', err);
      }
    };
    fetchCompany();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/empresas/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/admin/empresas');
    } catch (err) {
      console.error('Error updating company:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* Mismo JSX del form que en RegisterCompany, con values de formData */}
      <div className="form-group">
        <input name="razonSocial" placeholder="Razón Social" value={formData.razonSocial} onChange={handleChange} />
        <input name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} />
      </div>
      <div className="form-group">
        <input name="sector" placeholder="Sector" value={formData.sector} onChange={handleChange} />
        <input name="correo" placeholder="Correo" value={formData.correo} onChange={handleChange} />
      </div>
      <div className="form-group">
        <input name="tipoConvenio" placeholder="Tipo de convenio" value={formData.tipoConvenio} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
      </div>
      <input name="sitioWeb" placeholder="Sitio web" value={formData.sitioWeb} onChange={handleChange} style={{ width: '100%', marginBottom: '20px' }} />
      <div className="buttons">
        <button type="button" className="btn btn-cancel" onClick={() => navigate('/admin/empresas')}>Cancelar</button>
        <button type="submit" className="btn btn-save">Guardar</button>
      </div>
    </form>
  );
};

export default EditCompany;