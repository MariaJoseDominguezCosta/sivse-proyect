import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const tiposConvenio = ['Local', 'Nacional', 'Internacional'];  // Opciones predefinidas basadas en maquetado
const sectors = ['Tecnológica', 'Salud', 'Manufactura'];  // Ejemplos; ajusta según necesidades

const EmpresasList = () => {
    const navigate = useNavigate();
    const [empresas, setEmpresas] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({ tipo_convenio: '', sector: '', search: '', page: 1, limit: 10 });

    useEffect(() => {
        const fetchEmpresas = async () => {
        try {
            const params = new URLSearchParams(filters);
            const res = await axios.get(`/empresas?${params.toString()}`);
            setEmpresas(res.data.data.map((e, index) => ({ ...e, num: index + 1 })));  // Agrega #
            setTotal(res.data.total);
        } catch (error) {
            console.error('Error al listar empresas: ', error.response?.data?.message || error.message);
        }
        };
        fetchEmpresas();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Confirmar eliminación?')) {
        try {
            await axios.delete(`/empresas/${id}`);
            // Refrescar lista
            setFilters({ ...filters });
        } catch (error) {
            console.error('Error al eliminar empresa:', error.response?.data?.message || error.message);
        }
        }
    };

    const columns = [
        { field: 'num', headerName: '#', width: 50 },
        { field: 'razon_social', headerName: 'Razón Social', width: 200 },
        { field: 'sector', headerName: 'Sector', width: 150 },
        { field: 'tipo_convenio', headerName: 'Tipo Convenio', width: 150 },
        { field: 'telefono', headerName: 'Teléfono', width: 150 },
        {
        field: 'editar',
        headerName: 'Editar',
        width: 100,
        renderCell: (params) => <IconButton onClick={() => navigate(`/admin/empresas/${params.row.id}/editar`)}><EditIcon /></IconButton>,
        },
        {
        field: 'remover',
        headerName: 'Remover',
        width: 100,
        renderCell: (params) => <IconButton onClick={() => handleDelete(params.row.id)}><DeleteIcon /></IconButton>,
        },
    ];

    return (
        <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField name="search" label="Hinted search text" onChange={handleFilterChange} sx={{ flex: 1, mr: 2 }} />
            <FormControl sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel>Tipo Convenio</InputLabel>
            <Select name="tipo_convenio" onChange={handleFilterChange}>
                <MenuItem value="">Todos</MenuItem>
                {tiposConvenio.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel>Sector</InputLabel>
            <Select name="sector" onChange={handleFilterChange}>
                <MenuItem value="">Todos</MenuItem>
                {sectors.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={() => navigate('/admin/empresas/nueva')}>
            Registrar nueva empresa
            </Button>
        </Box>
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
            rows={empresas}
            columns={columns}
            pageSize={filters.limit}
            rowCount={total}
            paginationMode="server"
            onPaginationModelChange={(model) => setFilters({ ...filters, page: model.page + 1, limit: model.pageSize })}
            />
        </div>
        </Box>
    );
};

export default EmpresasList;