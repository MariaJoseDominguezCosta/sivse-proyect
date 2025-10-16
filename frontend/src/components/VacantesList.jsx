// src/components/VacanteList.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Select, MenuItem } from '@mui/material';
import api from '../utils/axiosConfig';

const VacanteList = () => {
    const [vacantes, setVacantes] = useState([]);
    const [filters, setFilters] = useState({ ubicacion: '', empresa: '', sector: '' });

    const fetchVacantes = async () => {
        const res = await api.get('/vacantes', { params: filters });
        setVacantes(res.data.data);
    };

    useEffect(() => {
        fetchVacantes();
    }, [filters]);

    const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

    const toggleFavorite = async (id) => {
        await api.post(`/vacantes/${id}/toggle-favorite`);
        fetchVacantes();
    };

    return (
        <div>
        <Select name="ubicacion" value={filters.ubicacion} onChange={handleFilterChange}>
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="Ciudad de Mexico">Ciudad de Mexico</MenuItem>
            <MenuItem value="Remoto">Remoto</MenuItem>
        </Select>
        <Select name="empresa" value={filters.empresa} onChange={handleFilterChange}>
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="1">data corp</MenuItem>
        </Select>
        <Table>
            <TableHead>
            <TableRow><TableCell>#</TableCell><TableCell>Título</TableCell><TableCell>Empresa</TableCell><TableCell>Ubicación</TableCell><TableCell>Acciones</TableCell></TableRow>
            </TableHead>
            <TableBody>
            {vacantes.map((v) => (
                <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.titulo}</TableCell>
                <TableCell>{v.Empresa.nombre}</TableCell>
                <TableCell>{v.ubicacion}</TableCell>
                <TableCell>
                    <Button onClick={() => toggleFavorite(v.id)}>Favorito</Button>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </div>
    );
};

export default VacanteList;