import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, IconButton, TextField, Select, MenuItem } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const VacantesList = () => {
    const navigate = useNavigate();
    const [vacancies, setVacancies] = useState([]);
    const [search, setSearch] = useState('');
    const [sectorFilter, setSectorFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');

    useEffect(() => {
        const fetchVacancies = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/egresado/vacantes', { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setVacancies(data);
        } catch (error) {
            console.error('Error fetching vacancies:', error);
            toast.error('Error al cargar vacantes');
        }
        };
        fetchVacancies();
    }, []);

    const handleAddFavorite = async (id) => {
        const token = localStorage.getItem('token');
        try {
        const res = await fetch('/api/egresado/favoritos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ vacante_id: id }),
        });
        if (res.ok) {
            toast.success('Añadido a favoritos');
        } else {
            toast.error('Error al añadir favorito');
        }
        } catch (error) {
            console.error('Error adding favorite:', error);
            toast.error('Error al añadir favorito');
        }
    };

    const filteredVacancies = vacancies.filter(vac => 
        vac.titulo.toLowerCase().includes(search.toLowerCase()) &&
        (sectorFilter ? vac.empresa.sector === sectorFilter : true) &&
        (locationFilter ? vac.ubicacion === locationFilter : true) &&
        (companyFilter ? vac.empresa.razon_social === companyFilter : true)
    );

    return (
        <Box sx={{ p: 3, bgcolor: '#E1F2FF' }}>
        <Typography variant="h4">Vacantes</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField label="Búsqueda" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} displayEmpty>
            <MenuItem value="">Sector</MenuItem>
            {/* Opciones dinámicas o estáticas */}
            <MenuItem value="Tecnología">Tecnología</MenuItem>
            </Select>
            <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} displayEmpty>
            <MenuItem value="">Ubicación</MenuItem>
            <MenuItem value="Ciudad de México">Ciudad de México</MenuItem>
            <MenuItem value="Remoto">Remoto</MenuItem>
            </Select>
            <Select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} displayEmpty>
            <MenuItem value="">Empresa</MenuItem>
            <MenuItem value="data corp">data corp</MenuItem>
            </Select>
        </Box>
        <Grid container spacing={2} sx={{ mt: 2 }}>
            {filteredVacancies.map((vac) => (
            <Grid item xs={12} md={4} key={vac.id}>
                <Card sx={{ bgcolor: '#F0E0E0' }}>
                <CardContent>
                    <Typography variant="h6">{vac.titulo} <IconButton onClick={() => handleAddFavorite(vac.id)}><StarIcon /></IconButton></Typography>
                    <Typography>{vac.empresa.razon_social}</Typography>
                    <Typography>{vac.ubicacion}, {vac.modalidad}</Typography>
                    <Typography>{vac.fecha_publicacion}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                    {vac.requisitos.split(',').map((req, index) => (
                        <Button key={index} variant="outlined" size="small">{req.trim()}</Button>
                    ))}
                    </Box>
                    <Button variant="outlined" sx={{ mt: 1 }} onClick={() => navigate(`/egresados/vacantes/${vac.id}`)}>Ver detalles</Button>
                    <Button variant="contained" sx={{ mt: 1, ml: 1, bgcolor: '#2C2C2C' }}>Aplicar</Button>
                </CardContent>
                </Card>
            </Grid>
            ))}
        </Grid>
        </Box>
    );
};

export default VacantesList;