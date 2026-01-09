import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import axios from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";

const JobBoard = () => {
  const [vacantes, setVacantes] = useState([]);
  const [search, setSearch] = useState("");
  const [ubicacionFilter, setUbicacionFilter] = useState("");
  const [empresaFilter, setEmpresaFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacantes = async () => {
      try {
        const res = await axios.get("/admin/vacantes");
        setVacantes(res.data);
      } catch (err) {
        console.error("Error fetching vacantes", err);
      }
    };
    fetchVacantes();
  }, []);

  // Opciones de Ubicación y Empresa (con useMemo)
  const uniqueUbicaciones = useMemo(() => {
    const allUbicaciones = vacantes.map((v) => v.ubicacion).filter(Boolean);
    return [...new Set(allUbicaciones)];
  }, [vacantes]);

  const uniqueEmpresas = useMemo(() => {
    // Asegura que vacantes[i].empresa existe antes de acceder a razon_social
    const allEmpresas = vacantes
      .map((v) => v.empresa?.razon_social)
      .filter(Boolean);
    return [...new Set(allEmpresas)];
  }, [vacantes]);

  // Lógica de filtrado MÚLTIPLE
  const filteredVacantes = vacantes.filter((vac) => {
    const matchesSearch = vac.titulo
      .toLowerCase()
      .includes(search.toLowerCase());

    // Filtro por Ubicación
    const matchesUbicacion =
      !ubicacionFilter || vac.ubicacion === ubicacionFilter;

    // Filtro por Empresa (usa el ID o el nombre, aquí usaremos el nombre para simplicidad)
    const matchesEmpresa =
      !empresaFilter || vac.empresa?.razon_social === empresaFilter;

    return matchesSearch && matchesUbicacion && matchesEmpresa;
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", alignItems: "center", position: "relative", justifyContent: "space-between", gap: "20px", paddingBottom: "20px", paddingTop: "20px" }}>
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
        {/* Filtro Ubicación */}
        <Select
          value={ubicacionFilter}
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
          }}
          onChange={(e) => setUbicacionFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Ubicación</MenuItem>
          {uniqueUbicaciones.map((ubicacion) => (
            <MenuItem key={ubicacion} value={ubicacion}>
              {ubicacion}
            </MenuItem>
          ))}
        </Select>

        {/* Filtro Empresa */}
        <Select
          value={empresaFilter}
          sx={{
            fontSize: {
              xs: "0.8rem",
              sm: "1rem",
              md: "1.2rem",
            },
            fontWeight: "normal",
            lineHeight: "1",
            letterSpacing: "0.00938em",
            width: "auto",
            height: "auto",
            backgroundColor: "#FFFDFD",
            textTransform: "none",
          }}
          onChange={(e) => setEmpresaFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Empresa</MenuItem>
          {uniqueEmpresas.map((empresa) => (
            <MenuItem key={empresa} value={empresa}>
              {empresa}
            </MenuItem>
          ))}
        </Select>
        <Button
          startIcon={<Add />}
          variant="contained"
          sx={{
            display: "flex",
            padding: {
              xs: "8px",
              sm: "10px",
              md: "12px",
            },
            fontSize: {
              xs: "0.8rem",
              sm: "1rem",
              md: "1.2rem",
            },
            fontWeight: "normal",
            lineHeight: "1",
            letterSpacing: "0.00938em",
            width: "auto",
            height: "auto",
            backgroundColor: "rgba(44, 44, 44, 1)",
            borderRadius: "8px",
            color: "rgba(245, 245, 245, 1)",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(44, 44, 44, 0.9)",
            },
          }}
          onClick={() => navigate("/admin/vacantes/register")}
        >
          Publicar nueva vacante
        </Button>
      </Box>
      <Box sx={{
        display: "flex", position: "relative", justifyContent: "center", width: {
          xs: "400px",
          sm: "500px",
          md: "550px",
        },
      }}>
        <TableContainer
          component={Paper}
          sx={{
            overflow: "auto",
            scrollbarWidth: "thin",
            maxHeight: "calc(100vh - 300px)",
            width: "100%",
            borderRadius: "8px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "stretch",
            justifySelf: "center",
            alignSelf: "center",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{
                  flexDirection: "row",
                }}
              >
                <TableCell
                  variant="head"
                  sx={{
                    width: {
                      xs: "10px",
                      sm: "20px",
                    },
                    padding: {
                      xs: "2px",
                      sm: "4px",
                      md: "6px",
                    },
                    fontSize: {
                      xs: "0.9rem",
                      sm: "1rem",
                      md: "1.1rem",
                    },
                    fontWeight: "600",
                    lineHeight: "1",
                    justifyContent: "center",
                    margin: "0px",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  variant="head"
                  sx={{
                    width: {
                      xs: "80px",
                      sm: "130px",
                    },
                    padding: {
                      xs: "2px",
                      sm: "4px",
                      md: "6px",
                    },
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: {
                      xs: "0.9rem",
                      sm: "1rem",
                      md: "1.1rem",
                    },
                    textAlign: "center",
                    fontWeight: "600",
                    lineHeight: "1",
                    margin: "0px",
                  }}
                >
                  Titulo
                </TableCell>
                <TableCell
                  variant="head"
                  sx={{
                    width: {
                      xs: "80px",
                      sm: "130px",
                    },
                    padding: {
                      xs: "2px",
                      sm: "4px",
                      md: "6px",
                    },
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: {
                      xs: "0.9rem",
                      sm: "1rem",
                      md: "1.1rem",
                    },
                    textAlign: "center",
                    fontWeight: "600",
                    lineHeight: "1",
                    margin: "0px",
                  }}
                >
                  Empresa
                </TableCell>
                <TableCell
                  variant="head"
                  sx={{
                    width: {
                      xs: "100px",
                      sm: "130px",
                    },
                    padding: {
                      xs: "2px",
                      sm: "4px",
                      md: "6px",
                    },
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: {
                      xs: "0.9rem",
                      sm: "1rem",
                      md: "1.1rem",
                    },
                    textAlign: "center",
                    fontWeight: "600",
                    lineHeight: "1",
                    margin: "0px",
                  }}
                >
                  Ubicación
                </TableCell>
                <TableCell
                  variant="head"
                  sx={{
                    width: {
                      xs: "60px",
                      sm: "100px",
                    },
                    padding: {
                      xs: "2px",
                      sm: "4px",
                      md: "6px",
                    },
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: {
                      xs: "0.9rem",
                      sm: "1rem",
                      md: "1.1rem",
                    },
                    textAlign: "center",
                    fontWeight: "600",
                    lineHeight: "1",
                    margin: "0px",
                  }}
                >
                  Editar
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVacantes.map((vac, index) => (
                <TableRow
                  sx={{
                    flexDirection: "row",
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                  key={vac.id}
                >
                  <TableCell
                    sx={{
                      width: {
                        xs: "10px",
                        sm: "20px",
                      },
                      padding: {
                        xs: "2px",
                        sm: "4px",
                        md: "6px",
                      },
                      fontSize: {
                        xs: "0.7rem",
                        sm: "0.8rem",
                        md: "0.9rem",
                      },
                      fontWeight: "400",
                      lineHeight: "1",
                      justifyContent: "center",
                      margin: "0px",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: {
                        xs: "80px",
                        sm: "130px",
                      },
                      padding: {
                        xs: "2px",
                        sm: "4px",
                        md: "6px",
                      },
                      fontSize: {
                        xs: "0.7rem",
                        sm: "0.8rem",
                        md: "0.9rem",
                      },
                      fontWeight: "400",
                      lineHeight: "1",
                      justifyContent: "center",
                      margin: "0px",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {vac.titulo}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: {
                        xs: "80px",
                        sm: "130px",
                      },
                      padding: {
                        xs: "2px",
                        sm: "4px",
                        md: "6px",
                      },
                      fontSize: {
                        xs: "0.7rem",
                        sm: "0.8rem",
                        md: "0.9rem",
                      },
                      fontWeight: "400",
                      lineHeight: "1",
                      justifyContent: "center",
                      margin: "0px",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {vac.empresa.razon_social}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: {
                        xs: "100px",
                        sm: "130px",
                      },
                      padding: {
                        xs: "2px",
                        sm: "4px",
                        md: "6px",
                      },
                      fontSize: {
                        xs: "0.7rem",
                        sm: "0.8rem",
                        md: "0.9rem",
                      },
                      fontWeight: "400",
                      lineHeight: "1",
                      justifyContent: "center",
                      margin: "0px",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {vac.ubicacion}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: {
                        xs: "60px",
                        sm: "100px",
                      },
                      padding: {
                        xs: "2px",
                        sm: "4px",
                        md: "6px",
                      },
                      fontWeight: "400",
                      lineHeight: "1",
                      justifyContent: "center",
                      margin: "0px",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <IconButton
                      onClick={() => navigate(`/admin/vacantes/edit/${vac.id}`)}
                    >
                      <Edit sx={{
                        fontSize: {
                          xs: "1rem",
                          sm: "1.1rem",
                          md: "1.2rem",
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
    </Box>
  );
};

export default JobBoard;
