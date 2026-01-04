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
        {/* Filtro Tipo Convenio */}
        <Select
          value={convenioFilter}
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
            },
            fontWeight: "normal",
            lineHeight: "1",
            letterSpacing: "0.00938em",
            width: "auto",
            height: "auto",
            backgroundColor: "#FFFDFD",
            textTransform: "none",
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
                  Remover
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompanies.map((company, index) => (
                <TableRow key={company.id}>
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
                      },
                      textAlign: "center",
                      fontWeight: "400",
                      lineHeight: "1",
                      margin: "0px",
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
                    <Button
                      onClick={() =>
                        navigate(`/admin/empresas/${company.id}/vacantes`)
                      }
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
                      alignItems: "center",
                      flexShrink: "0",
                      justifyContent: "center",
                      textAlign: "center",
                      lineHeight: "1",
                      margin: "0px",
                    }}
                  >
                    <IconButton
                      onClick={() =>
                        navigate(`/admin/empresas/edit/${company.id}`)
                      }
                    >
                      <Edit />
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
                      alignItems: "center",
                      flexShrink: "0",
                      justifyContent: "center",
                      textAlign: "center",
                      lineHeight: "1",
                      margin: "0px",
                    }}
                  >
                    <IconButton onClick={() => handleDelete(company.id)}>
                      <Delete />
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

export default CompanyManagement;
