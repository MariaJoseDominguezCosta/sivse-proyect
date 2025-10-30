import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const JobBoard = () => {
  const [vacantes, setVacantes] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacantes = async () => {
      try {
        const res = await axios.get('/admin/vacantes');
        setVacantes(res.data);
        console.log('Vacantes fetched:', res.data);
      } catch (err) {
        console.error('Error fetching vacantes', err);
      }
    };
    fetchVacantes();
  }, []);

  const filteredVacantes = vacantes.filter(vac => vac.titulo.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="table-container">
      <div className="search-bar">
        <TextField placeholder="Hinted search text" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select defaultValue=""><MenuItem>Ubicación ▼</MenuItem></Select>
        <Select defaultValue=""><MenuItem>Empresa ▼</MenuItem></Select>
        <Button className="btn-save" onClick={() => navigate('/admin/vacantes/register')}>Publicar nueva vacante</Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
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
  );
};

export default JobBoard;