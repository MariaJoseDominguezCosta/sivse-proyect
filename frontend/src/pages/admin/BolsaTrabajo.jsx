import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const JobBoard = () => {
  const [vacantes, setVacantes] = useState([]);
  const [search, setSearch] = useState('');
  const [ubicacionFilter, setUbicacionFilter] = useState('');
  const [empresaFilter, setEmpresaFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacantes = async () => {
      try {
        const res = await axios.get('/admin/vacantes');
        setVacantes(res.data);
      } catch (err) {
        console.error('Error fetching vacantes', err);
      }
    };
    fetchVacantes();
  }, []);

  // Opciones de Ubicación y Empresa (con useMemo)
  const uniqueUbicaciones = useMemo(() => {
    const allUbicaciones = vacantes.map(v => v.ubicacion).filter(Boolean);
    return [...new Set(allUbicaciones)];
  }, [vacantes]);

  const uniqueEmpresas = useMemo(() => {
    // Asegura que vacantes[i].empresa existe antes de acceder a razon_social
    const allEmpresas = vacantes.map(v => v.empresa?.razon_social).filter(Boolean);
    return [...new Set(allEmpresas)];
  }, [vacantes]);

  // Lógica de filtrado MÚLTIPLE
  const filteredVacantes = vacantes.filter(vac => {
    const matchesSearch = vac.titulo.toLowerCase().includes(search.toLowerCase());
    
    // Filtro por Ubicación
    const matchesUbicacion = !ubicacionFilter || (vac.ubicacion === ubicacionFilter);
    
    // Filtro por Empresa (usa el ID o el nombre, aquí usaremos el nombre para simplicidad)
    const matchesEmpresa = !empresaFilter || (vac.empresa?.razon_social === empresaFilter);

    return matchesSearch && matchesUbicacion && matchesEmpresa;
  });

  return (
    <div className="table-container">
      <div className="search-bar">
        <TextField placeholder="Hinted search text" value={search} onChange={(e) => setSearch(e.target.value)} />
         {/* Filtro Ubicación */}
        <Select 
          value={ubicacionFilter} 
          onChange={(e) => setUbicacionFilter(e.target.value)} 
          displayEmpty
        >
          <MenuItem value="">Ubicación</MenuItem>
          {uniqueUbicaciones.map(ubicacion => (
            <MenuItem key={ubicacion} value={ubicacion}>{ubicacion}</MenuItem>
          ))}
        </Select>
        
        {/* Filtro Empresa */}
        <Select 
          value={empresaFilter} 
          onChange={(e) => setEmpresaFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Empresa</MenuItem>
          {uniqueEmpresas.map(empresa => (
            <MenuItem key={empresa} value={empresa}>{empresa}</MenuItem>
          ))}
        </Select>
        <Button className="btn-save" onClick={() => navigate('/admin/vacantes/register')}>Publicar nueva vacante</Button>
      </div>
      <div style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Titulo</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Editor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVacantes.map((vac, index) => (
              <TableRow key={vac.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{vac.titulo}</TableCell>
                <TableCell>{vac.empresa.razon_social}</TableCell>
                <TableCell>{vac.ubicacion}</TableCell>
                <TableCell><IconButton onClick={() => navigate(`/admin/vacantes/edit/${vac.id}`)}><Edit /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </div>
  );
};

export default JobBoard;