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
  Box,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import axios from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

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
      </Box>
      <Box sx={{
        display: "flex", position: "relative", justifyContent: "center", width: {
          xs: "400px",
          sm: "500px",
          md: "570px",

        },
      }}>
        <TableContainer
          component={Paper}
          sx={{
            overflow: "auto",
            scrollbarWidth: "thin",
            maxHeight: "calc(100vh - 300px)",
            width: "auto",
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
                    alignItems: "center",
                    textAlign: "center",
                    margin: "0px",
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
                    justifyContent: "center",
                    fontSize: {
                      xs: "0.9rem",
                      sm: "1rem",
                      md: "1.1rem",
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
                        xs: "4px",
                        sm: "6px",
                        md: "8px",
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
                      fontWeight: "400",
                      lineHeight: "1",
                      justifyContent: "center",
                      margin: "0px",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <IconButton
                      onClick={() => navigate(`/admin/egresados/${alum.id}`)}
                    >
                      <Info sx={{
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

export default AlumniTracking;
