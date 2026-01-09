import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";

const VacantesList = () => {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState([]);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [ubicacionFilter, setUbicacionFilter] = useState(""); // UbicacionFilter
  const [empresaFilter, setEmpresaFilter] = useState(""); // EmpresaFilter
  const [showContact, setShowContact] = useState(false); // Estado para el modal de contacto


  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await api.get("/egresado/vacantes");
        setVacancies(res.data);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
        toast.error("Error al cargar vacantes");
      }
    };
    fetchVacancies();
  }, []);

  const handleAddFavorite = async (id) => {
    const vacanteIndex = vacancies.findIndex((v) => v.id === id);
    if (vacancies[vacanteIndex]?.es_favorito) {
      toast.info("Esta vacante ya está en tus favoritos.");
      return; // Bloquear si ya es favorito
    }

    try {
      const res = await api.post("/egresado/favoritos", { vacante_id: id });
      if (res.status === 201) {
        toast.success("Añadido a favoritos");

        // Lógica de UX: Actualizar la lista para que la estrella se pinte y se deshabilite
        setVacancies((prevVacancies) =>
          prevVacancies.map((vac) =>
            vac.id === id ? { ...vac, es_favorito: true } : vac
          )
        );
      } else {
        toast.error("Error al añadir favorito");
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
      // Mostrar error de conflicto si es un 409
      if (error.response?.status === 409) {
        toast.error("Esta vacante ya fue agregada.");
      } else {
        toast.error("Error al añadir favorito.");
      }
    }
  };

  // 2. Opciones de Ubicación, Sector y Empresa (con useMemo)
  const uniqueUbicaciones = useMemo(() => {
    const allUbicaciones = vacancies.map((v) => v.ubicacion).filter(Boolean);
    return [...new Set(allUbicaciones)];
  }, [vacancies]);

  // Asumiendo que el campo de sector se llama 'sector' en el objeto 'empresa'
  const uniqueSectores = useMemo(() => {
    const allSectores = vacancies
      .map((v) => v.empresa?.sector)
      .filter(Boolean);
    return [...new Set(allSectores)];
  }, [vacancies]);

  const uniqueEmpresas = useMemo(() => {
    const allEmpresas = vacancies
      .map((v) => v.empresa?.razon_social)
      .filter(Boolean);
    return [...new Set(allEmpresas)];
  }, [vacancies]);


  // 3. Lógica de filtrado MÚLTIPLE (Optimizado)
  const filteredVacancies = vacancies.filter((vac) => {
    const matchesSearch = vac.titulo
      .toLowerCase()
      .includes(search.toLowerCase());

    // Filtro por Sector (nuevo)
    const matchesSector =
      !sectorFilter || vac.empresa?.sector === sectorFilter;

    // Filtro por Ubicación
    const matchesUbicacion =
      !ubicacionFilter || vac.ubicacion === ubicacionFilter;

    // Filtro por Empresa
    const matchesEmpresa =
      !empresaFilter || vac.empresa?.razon_social === empresaFilter;

    return matchesSearch && matchesSector && matchesUbicacion && matchesEmpresa;
  });
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", alignItems: "center", position: "relative", justifyContent: "space-between", gap: "20px", paddingBottom: "20px", paddingTop: "20px" }}>
      <Box sx={{
        display: "flex", position: "relative", width: {
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
        <TextField
          placeholder="Hinted search text"
          value={search}
          sx={{
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
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", position: "relative", gap: "20px" }}>
        <Select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          displayEmpty
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
          }}
        >
          <MenuItem value="">Sector</MenuItem>
          {/* Opciones dinámicas de Sector */}
          {uniqueSectores.map((sector) => (
            <MenuItem key={sector} value={sector}>
              {sector}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={ubicacionFilter} // Usar la variable corregida
          onChange={(e) => setUbicacionFilter(e.target.value)} // Usar el setter corregido
          displayEmpty
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
          }}
        >
          <MenuItem value="">Ubicación</MenuItem>
          {/* Opciones dinámicas de Ubicación */}
          {uniqueUbicaciones.map((ubicacion) => (
            <MenuItem key={ubicacion} value={ubicacion}>
              {ubicacion}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={empresaFilter}
          onChange={(e) => setEmpresaFilter(e.target.value)}
          displayEmpty
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
          }}
        >
          <MenuItem value="">Empresa</MenuItem>
          {/* Opciones dinámicas de Empresa */}
          {uniqueEmpresas.map((empresa) => (
            <MenuItem key={empresa} value={empresa}>
              {empresa}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Grid container spacing={2} sx={{
        mt: 2, display: { xs: "flex", sm: "grid" },
        justifyContent: "center",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: "10px" },
        gridTemplateRows: { sm: "repeat(2, 1fr)" },
        gridTemplateColumns: { sm: "repeat(3, 1fr)" },
        position: "relative",
        width: "auto",
        height: "auto",
        justifySelf: "center",
      }}>
        {filteredVacancies.map((vac) => (
          <Grid item xs={12} md={4} key={vac.id} sx={{ display: "flex", }}>
            <Card sx={{
              borderRadius: "10px",
              padding: "20px",
              transition: "all 0.3s ease-in-out",
              width: {
                xs: "auto",
                sm: "250px",
              },
              height: {
                xs: "auto",
                sm: "250px",
              },
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              backgroundColor: "rgba(245, 235, 235, 1)",
              display: "flex",
              flexDirection: "column",
              overflowY: "hidden",
              "&:hover": { transform: "scale(1.05)", scrollbarWidth: 0, overflowY: "hidden" },
            }}>
              <CardContent sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: "bold", fontSize: {
                    xs: "0.875rem",
                    sm: "1.125rem",
                    xl: "1.150rem",
                  },
                  flexDirection: "row",
                  display: "flex",
                  textTransform: "none",
                }}>
                  {vac.titulo}{" "}
                  <IconButton
                    onClick={() => handleAddFavorite(vac.id)}
                    disabled={vac.es_favorito} // DESHABILITAR si es favorito
                  >
                    <StarIcon
                      sx={{
                        color: vac.es_favorito ? "var(--accent)" : "inherit",
                      }}
                    />
                  </IconButton>
                </Typography>
                <Typography sx={{
                  fontSize: { xs: "0.7rem", sm: "0.75rem", xl: "0.8rem" },
                  textTransform: "none",
                  mt: 1,
                }}>{vac.empresa.razon_social}
                </Typography>
                <Typography sx={{
                  fontSize: { xs: "0.7rem", sm: "0.75rem", xl: "0.8rem" },
                  textTransform: "none",
                  mt: 1,
                }}>
                  {vac.ubicacion}, {vac.modalidad}
                </Typography>
                <Typography sx={{
                  fontSize: { xs: "0.7rem", sm: "0.75rem", xl: "0.8rem" },
                  textTransform: "none",
                  mt: 1,
                }}>{vac.fecha_publicacion}</Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  {vac.requisitos.split(",").map((req, index) => (
                    <Button key={index} variant="outlined" size="small"
                      sx={{
                        textTransform: 'none',
                        borderRadius: '4px',
                        color: 'var(--text-dark)',
                        borderColor: 'var(--text-dark)',
                        cursor: 'default',
                        fontSize: {
                          xs: "0.6rem",
                          sm: "0.7rem",
                          xl: "0.8rem",

                        }
                      }}>
                      {req.trim()}
                    </Button>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap:0 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      mt: 1,
                      color: "var(--text-dark)",
                      textTransform: 'none',
                      display: "flex",
                      fontWeight: "normal",
                    }}
                    onClick={() => navigate(`/egresados/vacantes/${vac.id}`)}
                  >
                    Ver detalles
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setShowContact(true)} // Mostrar modal de contacto
                    sx={{
                      mt: 1, ml: 1, bgcolor: "#2C2C2C",
                      textTransform: 'none',
                      display: "flex",
                      fontWeight: "normal",
                    }}
                  >
                    Aplicar
                  </Button>
                </Box>

              </CardContent>
            </Card>
            {/* --- MODAL DE CONTACTO (Datos de contacto para postulación) --- */}
            <Dialog open={showContact} onClose={() => setShowContact(false)} maxWidth="sm" fullWidth>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{
                  fontWeight: 'bold',
                }}>Datos de contacto para postulación</Typography>
                <IconButton onClick={() => setShowContact(false)} size="small">×</IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body1" sx={{
                    mb: 2, fontSize: {
                      xs: "0.9rem",
                      sm: "1.0rem",
                      md: "1.1rem",
                      lg: "1.2rem",
                      xl: "1.3rem",
                    }
                  }}>
                    <strong>Correo:</strong> <span style={{ textDecoration: 'underline' }}>{vac.empresa?.correo_contacto || 'N/A'}</span>
                  </Typography>
                  <Typography variant="body1" sx={{
                    mb: 2, fontSize: {
                      xs: "0.9rem",
                      sm: "1.0rem",
                      md: "1.1rem",
                      lg: "1.2rem",
                      xl: "1.3rem",
                    }
                  }}>
                    <strong>Teléfono:</strong> <span style={{ textDecoration: 'underline' }}>{vac.empresa?.telefono || 'N/A'}</span>
                  </Typography>
                  <Typography variant="body1" sx={{
                    fontSize: {
                      xs: "0.9rem",
                      sm: "1.0rem",
                      md: "1.1rem",
                      lg: "1.2rem",
                      xl: "1.3rem",
                    }
                  }}>
                    <strong>Sitio web:</strong> <a href={vac.empresa?.sitio_web} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{vac.empresa?.sitio_web || 'N/A'}</a>
                  </Typography>
                </Box>
              </DialogContent>
            </Dialog>
          </Grid>

        ))}
      </Grid>

    </Box>
  );
};

export default VacantesList;
