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
    <div>
      <div className="search-bar">
        <TextField
          placeholder="Hinted search text"
          value={search}
          sx={{
            display: "flex",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "100%",
            height: "100%",
            "& .MuiInputBase-input": {
              padding: "8px",
              fontSize: {
                xs: "0.8rem",
                sm: "1rem",
                md: "1.2rem",
              },
              fontWeight: "normal",
              lineHeight: "1",
            },
            "& .MuiInputBase-root": {
              borderRadius: "28px",
              backgroundColor: "#FFFDFD",
              left: {
                xs: "50px",
                sm: "100px",
                md: "150px",
              },
              top: { xs: "200px" },
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "stretch",
              right: "auto",
            },
          }}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="filters">
        {/* Filtro Ubicación */}
        <Select
          value={ubicacionFilter}
          sx={{
            fontSize: {
              xs: "0.8rem",
              sm: "1rem",
            },
            fontWeight: "normal",
            lineHeight: "1",
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
      </div>
      <div>
        <TableContainer
          component={Paper}
          className="table-container"
          sx={{
            overflow: "auto",
            maxHeight: "calc(100vh - 300px)",
            width: {
              xs: "450px",
              sm: "600px",
              md: "750px",
              lg: "1000px",
              xl: "1200px",
            },
            justifySelf: "center",
            position: "relative",
            top: "350px",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "stretch",
            "&::-webkit-scrollbar": {
              width: "1px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "1px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "1px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
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
                    flexShrink: "0",
                    fontSize: {
                      xs: "0.8rem",
                      sm: "1rem",
                      md: "1.2rem",
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
                    flexShrink: "0",
                    justifyContent: "center",
                    fontSize: {
                      xs: "0.8rem",
                      sm: "1rem",
                      md: "1.2rem",
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
                    flexShrink: "0",
                    justifyContent: "center",
                    fontSize: {
                      xs: "0.8rem",
                      sm: "1rem",
                      md: "1.2rem",
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
                    flexShrink: "0",
                    justifyContent: "center",
                    fontSize: {
                      xs: "0.8rem",
                      sm: "1rem",
                      md: "1.2rem",
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
                    flexShrink: "0",
                    justifyContent: "center",
                    fontSize: {
                      xs: "0.8rem",
                      sm: "1rem",
                      md: "1.2rem",
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
                        xs: "4px",
                        sm: "6px",
                        md: "8px",
                      },
                      flexShrink: "0",
                      fontSize: {
                        xs: "0.8rem",
                        sm: "1rem",
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
                      margin: "0px",
                      width: {
                        xs: "80px",
                        sm: "130px",
                      },
                      padding: {
                        xs: "4px",
                        sm: "6px",
                        md: "8px",
                      },
                      alignItems: "center",
                      flexShrink: "0",
                      justifyContent: "center",
                      fontSize: {
                        xs: "0.8rem",
                        sm: "1rem",
                      },
                      textAlign: "center",
                      fontWeight: "400",
                      lineHeight: "1",
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
                        xs: "4px",
                        sm: "6px",
                        md: "8px",
                      },
                      alignItems: "center",
                      flexShrink: "0",
                      justifyContent: "center",
                      fontSize: {
                        xs: "0.8rem",
                        sm: "1rem",
                      },
                      textAlign: "center",
                      fontWeight: "400",
                      lineHeight: "1",
                      margin: "0px",
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
                        xs: "4px",
                        sm: "6px",
                        md: "8px",
                      },
                      alignItems: "center",
                      flexShrink: "0",
                      justifyContent: "center",
                      fontSize: {
                        xs: "0.8rem",
                        sm: "1rem",
                      },
                      textAlign: "center",
                      fontWeight: "400",
                      lineHeight: "1",
                      margin: "0px",
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
                      alignItems: "center",
                      flexShrink: "0",
                      justifyContent: "center",
                      textAlign: "center",
                      lineHeight: "1",
                      margin: "0px",
                    }}
                  >
                    <IconButton
                      onClick={() => navigate(`/admin/vacantes/edit/${vac.id}`)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default JobBoard;
