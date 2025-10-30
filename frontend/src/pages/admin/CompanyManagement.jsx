import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, IconButton } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('/admin/empresas');
        setCompanies(res.data);
      } catch (err) {
        console.error('Error fetching companies', err);
      }
    };
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que quieres remover esta empresa?')) {
      try {
        await axios.delete(`/admin/empresas/${id}`);
        setCompanies(companies.filter(company => company.id !== id));
      } catch (err) {
        console.error('Error deleting company', err);
      }
    }
  };

  const filteredCompanies = companies.filter(company => 
    company?.razon_social && typeof company.razon_social === 'string' && company.razon_social.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="table-container">
      <div className="search-bar">
        <TextField placeholder="Hinted search text" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select defaultValue=""><MenuItem>Tipo Convenio ▼</MenuItem></Select>
        <Select defaultValue=""><MenuItem>Sector ▼</MenuItem></Select>
        <Button className="btn-save" onClick={() => navigate('/admin/empresas/register')}>Registrar nueva empresa</Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Razón Social</TableCell>
              <TableCell>Sector</TableCell>
              <TableCell>Tipo Convenio</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Vacantes</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Remover</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCompanies.map((company, index) => (
              <TableRow key={company.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{company.razon_social}</TableCell>
                <TableCell>{company.sector}</TableCell>
                <TableCell>{company.tipo_convenio}</TableCell>
                <TableCell>{company.telefono}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/admin/empresas/${company.id}/vacantes`)}>
                    {company.vacantes?.length || 0} Vacantes
                  </Button>
                </TableCell>
                <TableCell><IconButton onClick={() => navigate(`/admin/empresas/edit/${company.id}`)}><Edit /></IconButton></TableCell>
                <TableCell><IconButton onClick={() => handleDelete(company.id)}><Delete /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CompanyManagement;