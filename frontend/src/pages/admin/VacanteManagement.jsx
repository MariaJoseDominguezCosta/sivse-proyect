import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import axios from '../../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';

const VacanteManagement = () => {
  const { empresaId } = useParams();
  const [vacantes, setVacantes] = useState([]);
  const [newVacante, setNewVacante] = useState({ titulo: '', descripcion: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacantes = async () => {
      try {
        const res = await axios.get(`/admin/empresas/${empresaId}/vacantes`);
        setVacantes(res.data);
      } catch (err) {
        console.error('Error fetching vacantes', err);
      }
    };
    fetchVacantes();
  }, [empresaId]);

  const handleAddVacante = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/admin/empresas/${empresaId}/vacantes`, { ...newVacante, empresaId });
      setNewVacante({ titulo: '', descripcion: '' });
      const res = await axios.get(`/admin/empresas/${empresaId}/vacantes`);
      setVacantes(res.data);
    } catch (err) {
      console.error('Error adding vacante', err);
    }
  };

  return (
    <div className="table-container">
      <form onSubmit={handleAddVacante}>
        <TextField name="titulo" label="Título" value={newVacante.titulo} onChange={(e) => setNewVacante({ ...newVacante, titulo: e.target.value })} fullWidth margin="normal" />
        <TextField name="descripcion" label="Descripción" value={newVacante.descripcion} onChange={(e) => setNewVacante({ ...newVacante, descripcion: e.target.value })} fullWidth margin="normal" />
        <Button type="submit" variant="contained" startIcon={<Add />}>Agregar Vacante</Button>
      </form>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha Publicación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vacantes.map((vacante) => (
              <TableRow key={vacante.id}>
                <TableCell>{vacante.titulo}</TableCell>
                <TableCell>{vacante.descripcion}</TableCell>
                <TableCell>{new Date(vacante.fecha_publicacion).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default VacanteManagement;