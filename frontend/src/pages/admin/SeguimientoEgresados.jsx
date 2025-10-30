import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, IconButton } from '@mui/material';
import { Info } from '@mui/icons-material';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AlumniTracking = () => {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get('/admin/egresados');
        setAlumni(res.data);
        console.log('Egresados fetched:', res.data);
      } catch (err) {
        console.error('Error fetching alumni', err);
      }
    };
    fetchAlumni();
  }, []);

  // Filtra solo si nombre existe, evitando undefined
  const filteredAlumni = alumni.filter(alum => 
    alum?.nombre_completo && typeof alum.nombre_completo === 'string' && alum.nombre_completo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="table-container">
      <div className="search-bar">
        <TextField placeholder="Hinted search text" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select defaultValue=""><MenuItem>Generación ▼</MenuItem></Select>
        <Select defaultValue=""><MenuItem>Estado Laboral ▼</MenuItem></Select>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Puesto</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Ver detalles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAlumni.map((alum, index) => (
              <TableRow key={alum.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{alum.nombre_completo}</TableCell>
                <TableCell>{alum.puesto}</TableCell>
                <TableCell>{alum.ubicacion}</TableCell>
                <TableCell><IconButton onClick={() => navigate(`/admin/egresados/${alum.id}`)}><Info /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AlumniTracking;