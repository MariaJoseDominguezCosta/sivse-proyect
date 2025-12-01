import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField, Select, MenuItem } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axiosConfig';

const FavoritesList = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [search, setSearch] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await api.get('/egresado/favoritos');
                setFavorites(res.data);
            } catch (error) {
            console.error('Error fetching favorites:', error);
            toast.error('Error al cargar favoritos');
        }
        };
        fetchFavorites();
    }, []);

    const handleRemove = async (id) => {
        try {
            const res = await api.delete(`/egresado/favoritos/${id}`);
        if (res.status === 200) {
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

    const filteredFavorites = favorites.filter(fav => {
        // La Vacante está anidada en el objeto favorito con el alias 'vacantes' (según index.js)
        const vacante = fav.vacantes; // Alias en index.js es 'vacantes'
        
        // El objeto de la empresa está anidado en la vacante con el alias 'empresa'
        
        // 1. Filtrado de Título (fav.vacantes?.titulo)
        const matchesSearch = (vacante?.titulo?.toLowerCase() ?? '').includes(search.toLowerCase());

        // 2. Filtrado de Ubicación
        const matchesLocation = !locationFilter || (vacante?.ubicacion === locationFilter);

        // 3. Filtrado de Empresa
        const matchesCompany = !companyFilter || (vacante?.empresa?.razon_social === companyFilter);

        return matchesSearch && matchesLocation && matchesCompany;
    });

    // Opciones dinámicas para filtros (Mejora de UX)
    const uniqueOptions = {
        locations: [...new Set(favorites.map(f => f.vacantes?.ubicacion).filter(Boolean))],
        companies: [...new Set(favorites.map(f => f.vacantes?.empresa?.razon_social).filter(Boolean))]
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#E1F2FF' }}>
        <Typography variant="h4">Favoritos</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField label="Búsqueda" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} displayEmpty>
                <MenuItem value="">Ubicación</MenuItem>
                {uniqueOptions.locations.map(loc => (<MenuItem key={loc} value={loc}>{loc}</MenuItem>))}
            </Select>
            
            <Select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} displayEmpty>
                <MenuItem value="">Empresa</MenuItem>
                {uniqueOptions.companies.map(comp => (<MenuItem key={comp} value={comp}>{comp}</MenuItem>))}
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
                <TableCell>{fav.vacantes?.titulo || 'N/A'}</TableCell>
                <TableCell>{fav.vacantes?.empresa?.razon_social || 'N/A'}</TableCell>
                <TableCell>{fav.vacantes?.ubicacion || 'N/A'}</TableCell>
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