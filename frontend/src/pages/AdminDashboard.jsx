// pages/AdminDashboard.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import "../assets/adminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ egresados: 0, empresas: 0, vacantes: 0 });
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setStats(res.data);
      setNotification('Estadísticas cargadas exitosamente.');
      setTimeout(() => setNotification(''), 3000);
    }).catch((err) => {
        console.error('Error en frontend:', err);  // Log para depuración
        setNotification('Error al cargar estadísticas: ' + (err.response?.data?.error) || 'Error en la solicitud');
      });
  }, []);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-pink-100 p-4 rounded"> 
        <h2 className="text-2xl mb-4">Egresados Registrados: {stats.egresados}</h2> 
        </div>
        <div className="bg-pink-100 p-4 rounded">
          <h2 className="text-2xl mb-4">Empresas: {stats.empresas}</h2>
        </div>
        <div className="bg-pink-100 p-4 rounded">
          <h2 className="text-2xl mb-4">Vacantes Activos: {stats.vacantes}</h2>
        </div>
      </div>
      {notification && <p className="text-green-500 mt-4">{notification}</p>}
    </div>
  );
};

export default AdminDashboard;