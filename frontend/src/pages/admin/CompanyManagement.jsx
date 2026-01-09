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
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [convenioFilter, setConvenioFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/admin/empresas");
        setCompanies(res.data);
      } catch (err) {
        console.error("Error fetching companies", err);
      }
    };
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres remover esta empresa?")) {
      try {
        await axios.delete(`/admin/empresas/${id}`);
        setCompanies(companies.filter((company) => company.id !== id));
      } catch (err) {
        console.error("Error deleting company", err);
      }
    }
  };

  // Lógica para extraer valores únicos y sin duplicados
  const uniqueConvenios = useMemo(() => {
    // 1. Mapear todos los valores de tipo_convenio
    const allConvenios = companies.map((c) => c.tipo_convenio).filter(Boolean);
    // 2. Usar Set para obtener solo valores únicos
    return [...new Set(allConvenios)];
  }, [companies]);

  const uniqueSectores = useMemo(() => {
    const allSectores = companies.map((c) => c.sector).filter(Boolean);
    return [...new Set(allSectores)];
  }, [companies]);

  // Lógica de filtrado MÚLTIPLE (queda igual, es correcta)
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company?.razon_social &&
      typeof company.razon_social === "string" &&
      company.razon_social.toLowerCase().includes(search.toLowerCase());

    const matchesConvenio =
      !convenioFilter || company?.tipo_convenio === convenioFilter;
    const matchesSector = !sectorFilter || company?.sector === sectorFilter;

    return matchesSearch && matchesConvenio && matchesSector;
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
        {/* Filtro Tipo Convenio */}
        <Select
          value={convenioFilter}
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
          onChange={(e) => setConvenioFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Tipo Convenio</MenuItem>
          {uniqueConvenios.map((convenio) => (
            <MenuItem key={convenio} value={convenio}>
              {convenio}
            </MenuItem>
          ))}
        </Select>

        {/* Filtro Sector */}
        <Select
          value={sectorFilter}
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
          onChange={(e) => setSectorFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Sector</MenuItem>
          {uniqueSectores.map((sector) => (
            <MenuItem key={sector} value={sector}>
              {sector}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          startIcon={<Add />}
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
          onClick={() => navigate("/admin/empresas/register")}
        >
          Registrar nueva empresa
        </Button>
      </Box>
      <Box sx={{
        display: "flex", position: "relative", width: {
          xs: "400px",
          sm: "500px",
          md: "550px",
          lg: "700px",
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
                  Razón Social
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
                  Sector
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
                  Tipo Convenio
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
                  Telefono
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
                  Vacantes
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
                  Editar
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
                  Remover
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompanies.map((company, index) => (
                <TableRow key={company.id} sx={{
                  flexDirection: "row",
                  "&:last-child td, &:last-child th": { border: 0 },
                }}>
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
                    {company.razon_social}
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
                    {company.sector}
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
                    {company.tipo_convenio}
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
                    {company.telefono}
                  </TableCell>
                  <TableCell
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
                      fontWeight: "400",
                      lineHeight: "1",
                      justifyContent: "center",
                      margin: "0px",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      onClick={() =>
                        navigate(`/admin/empresas/${company.id}/vacantes`)
                      }
                      sx={{
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
                        textTransform: "none",
                      }}
                    >
                      {company.vacantes?.length || 0} Vacantes
                    </Button>
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
                      onClick={() =>
                        navigate(`/admin/empresas/edit/${company.id}`)
                      }
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
                    <IconButton onClick={() => handleDelete(company.id)}>
                      <Delete sx={{
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

export default CompanyManagement;
