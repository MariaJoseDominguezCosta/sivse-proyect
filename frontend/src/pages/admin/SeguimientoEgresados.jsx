import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import axios from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import "../../assets/seguimientoEgresados.css";

const AlumniTracking = () => {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState("");
  const [generacionFilter, setGeneracionFilter] = useState("");
  const [estadoLaboralFilter, setEstadoLaboralFilter] = useState("");
  const navigate = useNavigate();

  const filteredAlumni = alumni.filter((alum) => {
    const matchesSearch =
      alum?.nombre_completo &&
      typeof alum.nombre_completo === "string" &&
      alum.nombre_completo.toLowerCase().includes(search.toLowerCase());

    // Filtro por Generación
    const matchesGeneracion =
      !generacionFilter || alum.generacion === generacionFilter;

    // Filtro por Estado Laboral
    const matchesEstado =
      !estadoLaboralFilter || alum.estado_laboral === estadoLaboralFilter;

    return matchesSearch && matchesGeneracion && matchesEstado;
  });

  // Opciones de Generación y Estado Laboral (deberían ser dinámicas, pero aquí son estáticas para el ejemplo)
  const uniqueGeneraciones = [
    ...new Set(alumni.map((a) => a.generacion).filter(Boolean)),
  ];
  const uniqueEstados = [
    ...new Set(alumni.map((a) => a.estado_laboral).filter(Boolean)),
  ];

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get("/admin/egresados");
        setAlumni(res.data);
      } catch (err) {
        console.error("Error fetching alumni", err);
      }
    };
    fetchAlumni();
  }, []);

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
        {/* Filtro Generación */}
        <Select
          value={generacionFilter}
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
          }}
          onChange={(e) => setGeneracionFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Generación</MenuItem>
          {uniqueGeneraciones.map((gen) => (
            <MenuItem key={gen} value={gen}>
              {gen}
            </MenuItem>
          ))}
        </Select>

        {/* Filtro Estado Laboral */}
        <Select
          value={estadoLaboralFilter}
          onChange={(e) => setEstadoLaboralFilter(e.target.value)}
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
          }}
          displayEmpty
        >
          <MenuItem value="">Estado Laboral</MenuItem>
          {uniqueEstados.map((estado) => (
            <MenuItem key={estado} value={estado}>
              {estado}
            </MenuItem>
          ))}
        </Select>
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
                    margin: "0px",
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
                  }}
                >
                  Nombre
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
                  Generación
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
                  Puesto
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
                  Ubicación
                </TableCell>
                <TableCell
                  variant="head"
                  sx={{
                    width: {
                      xs: "100px",
                      sm: "130px",
                      xl: "200px",
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
                  Empresa Actual
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
                  Ver detalles
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlumni.map((alum, index) => (
                <TableRow
                  sx={{
                    flexDirection: "row",
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                  key={alum.id}
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
                    {alum.nombre_completo}
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
                    {alum.generacion}
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
                    {alum.puesto}
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
                    {alum.ubicacion}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: {
                        xs: "100px",
                        sm: "130px",
                        xl: "200px",
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
                    {alum.empresa_actual}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: {
                        xs: "60px",
                        sm: "100px",
                      },
                      padding: {
                        xs: "4px",
                        sm: "6px",
                        md: "8px",
                      },
                      alignItems: "center",
                      flexShrink: "0",
                      justifyContent: "center",
                      margin: "0px",
                      textAlign: "center",
                    }}
                  >
                    <IconButton
                      onClick={() => navigate(`/admin/egresados/${alum.id}`)}
                    >
                      <Info sx={{}} />
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

export default AlumniTracking;
