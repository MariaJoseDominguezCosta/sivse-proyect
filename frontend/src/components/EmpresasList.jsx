import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const sectors = ['Tecnología', 'Manufactura', 'Servicios', 'Otros'];

const EmpresasList = () => {
    const navigate = useNavigate();
    const [empresas, setEmpresas] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({ sector: '', nombre: '', page: 1, limit: 10, sort: 'nombre', order: 'ASC' });

    useEffect(() => {
        const fetchEmpresas = async () => {
        try {
            const params = new URLSearchParams(filters);
            const res = await axios.get(`/empresas?${params.toString()}`);
            setEmpresas(res.data.data);
            setTotal(res.data.total);
        } catch (error) {
            console.error('Error al listar empresas:', error);
        }
        };
        fetchEmpresas();
    }, [filters]);

    // Function to handle deletion of an empresa
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/empresas/${id}`);
            setFilters({ ...filters }); // Trigger re-fetch
        } catch (error) {
            console.error('Error al eliminar empresa:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
    };

    const columns = [
        { field: 'nombre', headerName: 'Nombre', width: 200 },
        { field: 'sector', headerName: 'Sector', width: 150 },
        { field: 'contacto', headerName: 'Contacto', width: 200 },
        {
        field: 'actions',
        headerName: 'Acciones',
        width: 150,
        renderCell: (params) => (
            <>
                <Button onClick={() => navigate(`/admin/empresas/${params.row.id}/editar`)}>Editar</Button>
                <Button onClick={() => handleDelete(params.row.id)} color="error" style={{ marginLeft: 8 }}>Eliminar</Button>
            </>
        ),
    },

    
];

    return (
        <div>
        <TextField name="nombre" label="Buscar por nombre" onChange={handleFilterChange} margin="normal" />
        <FormControl margin="normal">
            <InputLabel>Sector</InputLabel>
            <Select name="sector" onChange={handleFilterChange}>
            <MenuItem value="">Todos</MenuItem>
            {sectors.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
        </FormControl>
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
            rows={empresas}
            columns={columns}
            pageSize={filters.limit}
            rowCount={total}
            paginationMode="server"
            onPaginationModelChange={(model) => setFilters({ ...filters, page: model.page + 1, limit: model.pageSize })}
            sortingMode="server"
            onSortModelChange={(model) => {
                if (model.length > 0) {
                setFilters({ ...filters, sort: model[0].field, order: model[0].sort.toUpperCase() });
                }
            }}
            />
        </div>
        </div>
    );
};

export default EmpresasList;