import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv'; // Instala npm install react-csv para generar CSV

const ReportsStats = () => {
  const [stats, setStats] = useState({ egresados: [], empresas: [], vacantes: [] }); // Asume backend devuelve arrays para reportes

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/stats', { // Asume /stats devuelve datos detallados para reportes
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats for reports:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-cards">
      <CSVLink data={stats.egresados} filename="egresados_por_generacion.csv">
        <button className="btn">Generar reporte de egresados por generación</button>
      </CSVLink>
      <CSVLink data={stats.empresas} filename="empresas_por_sector.csv">
        <button className="btn">Generar reporte de empresas por sector</button>
      </CSVLink>
      <CSVLink data={stats.vacantes} filename="vacantes_activas.csv">
        <button className="btn">Generar reporte de vacantes activas</button>
      </CSVLink>
    </div>
  );
};

export default ReportsStats;