import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, IconButton, Box, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const sectors = ['Tecnológica', 'Salud', 'Local', 'Nacional', 'Internacional', 'Otros'];
const convenios = ['Local', 'Nacional', 'Internacional'];

const EmpresasList = () => {
    const navigate = useNavigate();
    const [empresas, setEmpresas] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({ sector: '', tipo_convenio: '', razon_social: '', page: 1, limit: 10, sort: 'razon_social', order: 'ASC' });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchEmpresas = async () => {
        try {
            const params = new URLSearchParams(filters);
            const res = await axios.get(`/empresas?${params.toString()}`);
            setEmpresas(res.data.data.map((e, index) => ({ ...e, num: index + 1 })));
            setTotal(res.data.total);
            setSnackbarMessage(res.data.message);
            setSnackbarSeverity('info');
        } catch (error) {
            console.error('Error al listar empresas', error);
            setSnackbarMessage('Error al listar empresas');
            setSnackbarSeverity('error');
        } finally {
            setLoading(false);
            setOpenSnackbar(true);
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
            setSnackbarMessage('Empresa eliminada exitosamente');
            setSnackbarSeverity('success');
            setFilters({ ...filters }); // Refresca
        } catch (error) {
            setSnackbarMessage(error.response?.data?.message || 'Error al eliminar');
            setSnackbarSeverity('error');
        } finally {
            setOpenSnackbar(true);
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
        field: 'actions',
        headerName: 'Acciones',
        width: 150,
        renderCell: (params) => (
            <>
            <IconButton onClick={() => navigate(`/admin/empresas/${params.row.id}/editar`)}><EditIcon /></IconButton>
            <IconButton onClick={() => handleDelete(params.row.id)}><DeleteIcon /></IconButton>
            </>
        ),
        },
    ];

    return (
        <Box sx={{ p: 2 }}>
        <TextField name="razon_social" label="Buscar por razón social" onChange={handleFilterChange} sx={{ mr: 2 }} />
        <FormControl sx={{ mr: 2, minWidth: 120 }}>
            <InputLabel>Tipo Convenio</InputLabel>
            <Select name="tipo_convenio" onChange={handleFilterChange}>
            <MenuItem value="">Todos</MenuItem>
            {convenios.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
        </FormControl>
        <FormControl sx={{ mr: 2, minWidth: 120 }}>
            <InputLabel>Sector</InputLabel>
            <Select name="sector" onChange={handleFilterChange}>
            <MenuItem value="">Todos</MenuItem>
            {sectors.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
        </FormControl>
        <Button variant="contained" onClick={() => navigate('/admin/empresas/nueva')} disabled={loading}>
            {loading ? 'Cargando...' : 'Registrar nueva empresa'}
        </Button>
        <div style={{ height: 400, width: '100%', mt: 2 }}>
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
            loading={loading}
            />
        </div>
        <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
            </Alert>
        </Snackbar>
        </Box>
    );
};

export default EmpresasList;