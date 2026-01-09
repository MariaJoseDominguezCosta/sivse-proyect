import React, { useState, useEffect } from 'react';
import { Box, Typography, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField, Select, MenuItem, Paper } from '@mui/material';
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
        <Box sx={{ display: "flex", flexDirection: "column", height: "auto", width: "auto", alignItems: "center", position: "relative", justifyContent: "space-between", gap: "20px", paddingBottom: "20px", paddingTop: "20px" }}>
            <Box sx={{
                display: "flex", position: "relative",
                width: {
                    xs: "350px",
                    sm: "400px",
                    md: "450px",
                    lg: "500px",
                },
                alignItems: "center",
                justifyContent: "center",
                height: {
                    xs: "20px",
                    sm: "25px",
                    md: "30px",
                    lg: "35px",
                },
                marginBottom: "10px",

            }}>
                <TextField placeholder="Búsqueda" value={search} onChange={(e) => setSearch(e.target.value)} sx={{
                    display: "flex",
                    alignSelf: "stretch",
                    width: "100%",
                    height: "100%",
                    "& .MuiInputBase-input": {
                        padding: "8px",
                        fontSize: {
                            xs: "0.8rem",
                            sm: "0.9rem",
                            md: "1rem",
                        },
                        fontWeight: "normal",
                        lineHeight: "1",
                    },
                    "& .MuiInputBase-root": {
                        borderRadius: "28px",
                        backgroundColor: "#FFFDFD",
                        height: "100%",
                        width: "100%",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignSelf: "stretch",
                    },
                }}
                />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", position: "relative", gap: "20px" }}>
                <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} displayEmpty
                    sx={{
                        fontSize: {
                            xs: "0.8rem",
                            sm: "1rem",
                            md: "1.2rem",
                        },
                        fontWeight: "normal",
                        letterSpacing: "0.00938em",
                        width: "auto",
                        height: "auto",
                        backgroundColor: "#FFFDFD",
                        textTransform: "none",
                    }}>
                    <MenuItem value="">Ubicación</MenuItem>
                    {uniqueOptions.locations.map(loc => (<MenuItem key={loc} value={loc}>{loc}</MenuItem>))}
                </Select>

                <Select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} displayEmpty
                    sx={{
                        fontSize: {
                            xs: "0.8rem",
                            sm: "1rem",
                            md: "1.2rem",
                        },
                        fontWeight: "normal",
                        letterSpacing: "0.00938em",
                        width: "auto",
                        height: "auto",
                        backgroundColor: "#FFFDFD",
                        textTransform: "none",
                    }}>
                    <MenuItem value="">Empresa</MenuItem>
                    {uniqueOptions.companies.map(comp => (<MenuItem key={comp} value={comp}>{comp}</MenuItem>))}
                </Select>
            </Box>
            <TableContainer component={Paper} sx={{
                overflow: "auto",
                scrollbarWidth: "thin",
                maxHeight: "calc(100vh - 300px)",
                borderRadius: "8px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                justifyContent: "stretch",
                justifySelf: "center",
                alignSelf: "center",
                width: {
                    xs: "400px",
                    sm: "500px",
                    md: "550px",
                },
                boxShadow: 3,
            }}>

                <Table sx={{ minWidth: 300 }} aria-label="favorites table">
                    <TableHead>
                        <TableRow stickyHeader sx={{
                            flexDirection: "row",
                        }} >
                            <TableCell
                                variant="head"
                                sx={{
                                    fontSize: {
                                        xs: "0.9rem",
                                        sm: "1rem",
                                        md: "1.1rem",
                                    },
                                    fontWeight: "600",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                }}>#</TableCell>
                            <TableCell
                                variant="head"
                                sx={{
                                    fontSize: {
                                        xs: "0.9rem",
                                        sm: "1rem",
                                        md: "1.1rem",
                                    },
                                    fontWeight: "600",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                }}>Título</TableCell>
                            <TableCell variant="head"
                                sx={{
                                    fontSize: {
                                        xs: "0.9rem",
                                        sm: "1rem",
                                        md: "1.1rem",
                                    },
                                    fontWeight: "600",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                }}>Empresa</TableCell>
                            <TableCell variant="head"
                                sx={{
                                    fontSize: {
                                        xs: "0.9rem",
                                        sm: "1rem",
                                        md: "1.1rem",
                                    },
                                    fontWeight: "600",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                }}>Ubicación</TableCell>
                            <TableCell variant="head"
                                sx={{
                                    fontSize: {
                                        xs: "0.9rem",
                                        sm: "1rem",
                                        md: "1.1rem",
                                    },
                                    fontWeight: "600",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                }}>Ver detalles</TableCell>
                            <TableCell variant="head"
                                sx={{
                                    fontSize: {
                                        xs: "0.9rem",
                                        sm: "1rem",
                                        md: "1.1rem",
                                    },
                                    fontWeight: "600",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                }}>Remover</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredFavorites.map((fav, index) => (
                            <TableRow hover key={fav.id}
                                sx={{
                                    "&:last-child td, &:last-child th": { border: 0 },
                                }}>
                                <TableCell component="th" scope="row"
                                    sx={{
                                        fontSize: {
                                            xs: "0.7rem",
                                            sm: "0.8rem",
                                            md: "0.9rem",
                                        },
                                        fontWeight: "400",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                    }}>{index + 1}</TableCell>
                                <TableCell align="right"
                                    sx={{
                                        fontSize: {
                                            xs: "0.7rem",
                                            sm: "0.8rem",
                                            md: "0.9rem",
                                        },
                                        fontWeight: "400",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                    }}>{fav.vacantes?.titulo || 'N/A'}</TableCell>
                                <TableCell align="right"
                                    sx={{
                                        fontSize: {
                                            xs: "0.7rem",
                                            sm: "0.8rem",
                                            md: "0.9rem",
                                        },
                                        fontWeight: "400",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                    }}>{fav.vacantes?.empresa?.razon_social || 'N/A'}</TableCell>
                                <TableCell align="right"
                                    sx={{
                                        fontSize: {
                                            xs: "0.7rem",
                                            sm: "0.8rem",
                                            md: "0.9rem",
                                        },
                                        fontWeight: "400",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                    }}>{fav.vacantes?.ubicacion || 'N/A'}</TableCell>
                                <TableCell align="right"
                                    sx={{
                                        fontWeight: "400",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                    }}>
                                    <IconButton onClick={() => navigate(`/egresados/vacantes/${fav.vacante_id}`)}>
                                        <InfoIcon sx={{
                                            fontSize: {
                                                xs: "1.2rem",
                                                sm: "1.4rem",
                                                md: "1.6rem",
                                            },
                                        }} />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="right" sx={{
                                    fontWeight: "400",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                }}>
                                    <IconButton onClick={() => handleRemove(fav.id)}>
                                        <DeleteIcon sx={{
                                            fontSize: {
                                                xs: "1.2rem",
                                                sm: "1.4rem",
                                                md: "1.6rem",
                                            },
                                        }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default FavoritesList;