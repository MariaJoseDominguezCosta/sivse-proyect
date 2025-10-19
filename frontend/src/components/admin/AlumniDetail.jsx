import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AlumniDetail = () => {
  const { id } = useParams();
  const [alumni, setAlumni] = useState({});

  useEffect(() => {
    const fetchAlumniDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/admin/egresados/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlumni(res.data);
      } catch (err) {
        console.error('Error fetching alumni detail:', err);
      }
    };
    fetchAlumniDetail();
  }, [id]);

  return (
    <div className="profile-container">
      <h2>{alumni.name} {alumni.location}</h2>
      <p>{alumni.generation}</p>
      <p>{alumni.career}</p>
      <h3>Información de empresa actual</h3>
      <p>Nombre: {alumni.company}</p>
      <p>Puesto: {alumni.position}</p>
      <p>Modalidad: {alumni.modality}</p>
      <h3>Datos de contacto</h3>
      <p>Teléfono: {alumni.phone}</p>
      <h3>Redes sociales</h3>
      <p>LinkedIn: {alumni.linkedin}</p>
      <p>Instagram: {alumni.instagram}</p>
      <p>otro: {alumni.other}</p>
    </div>
  );
};

export default AlumniDetail;