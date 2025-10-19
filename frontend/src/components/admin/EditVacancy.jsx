import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditVacancy = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    titulo: '',
    salario: '',
    descripcion: '',
    modalidad: '',
    requisitos: '',
    estado: false,
    empresaAsociada: '',
    fechaPublicacion: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/admin/vacantes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error('Error fetching vacancy:', err);
      }
    };
    fetchVacancy();
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/vacantes/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/admin/vacantes');
    } catch (err) {
      console.error('Error updating vacancy:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* Mismo JSX del form que en RegisterVacancy */}
      <div className="form-group">
        <input name="titulo" placeholder="Título" value={formData.titulo} onChange={handleChange} />
        <input name="salario" placeholder="Salario" value={formData.salario} onChange={handleChange} />
      </div>
      <input name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} style={{ width: '100%', marginBottom: '15px' }} />
      <div className="form-group">
        <input name="modalidad" placeholder="Modalidad" value={formData.modalidad} onChange={handleChange} />
      </div>
      <div className="form-group">
        <input name="requisitos" placeholder="Requisitos (Separados con comas)" value={formData.requisitos} onChange={handleChange} />
        <label>Estado: Activa/Inactiva <input type="checkbox" name="estado" checked={formData.estado} onChange={handleChange} /></label>
      </div>
      <div className="form-group">
        <select name="empresaAsociada" value={formData.empresaAsociada} onChange={handleChange}><option>Empresa asociada ▼</option>{/* Opciones desde API si necesitas */}</select>
        <input name="fechaPublicacion" placeholder="Fecha de publicación" value={formData.fechaPublicacion} onChange={handleChange} />
      </div>
      <div className="buttons">
        <button type="button" className="btn btn-cancel" onClick={() => navigate('/admin/vacantes')}>Cancelar</button>
        <button type="submit" className="btn btn-save">Guardar</button>
      </div>
    </form>
  );
};

export default EditVacancy;