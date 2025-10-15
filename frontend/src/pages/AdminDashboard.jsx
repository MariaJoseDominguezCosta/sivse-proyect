// pages/AdminDashboard.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ egresados: 0, empresas: 0, vacantes: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get('http://localhost:5000/api/admin/stats').then(res => setStats(res.data));
  }, []);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-pink-100 p-4 rounded">Egresados Registrados: {stats.egresados}</div>
        <div className="bg-pink-100 p-4 rounded">Empresas: {stats.empresas}</div>
        <div className="bg-pink-100 p-4 rounded">Vacantes Activos: {stats.vacantes}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;