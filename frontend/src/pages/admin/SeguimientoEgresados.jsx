import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, IconButton } from '@mui/material';
import { Info } from '@mui/icons-material';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AlumniTracking = () => {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState('');
  const [generacionFilter, setGeneracionFilter] = useState('');
  const [estadoLaboralFilter, setEstadoLaboralFilter] = useState('');
  const navigate = useNavigate();

  const filteredAlumni = alumni.filter(alum => {
    const matchesSearch = alum?.nombre_completo && 
                          typeof alum.nombre_completo === 'string' && 
                          alum.nombre_completo.toLowerCase().includes(search.toLowerCase());
                          
    // Filtro por Generación
    const matchesGeneracion = !generacionFilter || (alum.generacion === generacionFilter);
    
    // Filtro por Estado Laboral
    const matchesEstado = !estadoLaboralFilter || (alum.estado_laboral === estadoLaboralFilter);

    return matchesSearch && matchesGeneracion && matchesEstado;
  });

  // Opciones de Generación y Estado Laboral (deberían ser dinámicas, pero aquí son estáticas para el ejemplo)
  const uniqueGeneraciones = [...new Set(alumni.map(a => a.generacion).filter(Boolean))];
  const uniqueEstados = [...new Set(alumni.map(a => a.estado_laboral).filter(Boolean))];

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

  // // Filtra solo si nombre existe, evitando undefined
  // const filteredAlumni = alumni.filter(alum => 
  //   alum?.nombre_completo && typeof alum.nombre_completo === 'string' && alum.nombre_completo.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div className="table-container">
      <div className="search-bar">
        <TextField placeholder="Hinted search text" value={search} onChange={(e) => setSearch(e.target.value)} />
        {/* Filtro Generación */}
        <Select 
          value={generacionFilter} 
          onChange={(e) => setGeneracionFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Generación</MenuItem>
          {uniqueGeneraciones.map(gen => (
            <MenuItem key={gen} value={gen}>{gen}</MenuItem>
          ))}
        </Select>
        
        {/* Filtro Estado Laboral */}
        <Select 
          value={estadoLaboralFilter} 
          onChange={(e) => setEstadoLaboralFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Estado Laboral</MenuItem>
          {uniqueEstados.map(estado => (
            <MenuItem key={estado} value={estado}>{estado}</MenuItem>
          ))}
        </Select>
      </div>
      <div style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Generación</TableCell>
              <TableCell>Puesto</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Empresa Actual</TableCell>
              <TableCell>Ver detalles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAlumni.map((alum, index) => (
              <TableRow key={alum.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{alum.nombre_completo}</TableCell>
                <TableCell>{alum.generacion}</TableCell>
                <TableCell>{alum.puesto}</TableCell>
                <TableCell>{alum.ubicacion}</TableCell>
                <TableCell>{alum.empresa_actual}</TableCell>
                <TableCell><IconButton onClick={() => navigate(`/admin/egresados/${alum.id}`)}><Info /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </div>
  );
};

export default AlumniTracking;