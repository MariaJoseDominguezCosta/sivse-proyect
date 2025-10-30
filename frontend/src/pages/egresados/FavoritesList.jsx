import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField, Select, MenuItem } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FavoritesList = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [search, setSearch] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');

    useEffect(() => {
        const fetchFavorites = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/egresado/favoritos', { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setFavorites(data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            toast.error('Error al cargar favoritos');
        }
        };
        fetchFavorites();
    }, []);

    const handleRemove = async (id) => {
        const token = localStorage.getItem('token');
        try {
        const res = await fetch(`/api/egresado/favoritos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
            setFavorites(favorites.filter(fav => fav.id !== id));
            toast.success('Se ha eliminado de favoritos correctamente');
        } else {
            toast.error('Error al eliminar favorito');
        }
        } catch (error) {
        console.error('Error removing favorite:', error);
        toast.error('Error al eliminar favorito');
        }
    };

    const filteredFavorites = favorites.filter(fav => 
        fav.titulo.toLowerCase().includes(search.toLowerCase()) &&
        (locationFilter ? fav.ubicacion === locationFilter : true) &&
        (companyFilter ? fav.empresa.razon_social === companyFilter : true)
    );

    return (
        <Box sx={{ p: 3, bgcolor: '#E1F2FF' }}>
        <Typography variant="h4">Favoritos</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField label="Búsqueda" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} displayEmpty>
            <MenuItem value="">Ubicación</MenuItem>
            {/* Asumir opciones dinámicas o estáticas */}
            <MenuItem value="Ciudad de México">Ciudad de México</MenuItem>
            <MenuItem value="Trabajo Remoto">Trabajo Remoto</MenuItem>
            </Select>
            <Select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} displayEmpty>
            <MenuItem value="">Empresa</MenuItem>
            <MenuItem value="data corp">data corp</MenuItem>
            <MenuItem value="Soft Solution">Soft Solution</MenuItem>
            </Select>
        </Box>
        <Table sx={{ mt: 2 }}>
            <TableHead>
            <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Ver detalles</TableCell>
                <TableCell>Remover</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {filteredFavorites.map((fav, index) => (
                <TableRow key={fav.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{fav.titulo}</TableCell>
                <TableCell>{fav.empresa.razon_social}</TableCell>
                <TableCell>{fav.ubicacion}</TableCell>
                <TableCell>
                    <IconButton onClick={() => navigate(`/egresados/vacantes/${fav.vacante_id}`)}>
                    <InfoIcon />
                    </IconButton>
                </TableCell>
                <TableCell>
                    <IconButton onClick={() => handleRemove(fav.id)}>
                    <DeleteIcon />
                    </IconButton>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </Box>
    );
};

export default FavoritesList;