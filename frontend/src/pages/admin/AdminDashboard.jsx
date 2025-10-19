import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserGraduate, FaBuilding, FaBriefcase } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({ egresados: 0, empresas: 0, vacantes: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-cards">
      <div className="card">
        <FaUserGraduate />
        <p>Egresados Registrados</p>
        <h3>{stats.egresados}</h3>
      </div>
      <div className="card">
        <FaBuilding />
        <p>Empresas</p>
        <h3>{stats.empresas}</h3>
      </div>
      <div className="card">
        <FaBriefcase />
        <p>Vacantes Activos</p>
        <h3>{stats.vacantes}</h3>
      </div>
    </div>
  );
};

export default Dashboard;