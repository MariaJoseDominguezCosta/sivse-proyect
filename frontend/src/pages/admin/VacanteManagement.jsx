// src/pages/admin/VacanteManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material"; // Removido TextField, Add
import { Add } from "@mui/icons-material";
import axios from "../../utils/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import "../../assets/bolsaTrabajo.css"

const VacanteManagement = () => {
  const { empresa_id } = useParams(); // Usaremos empresa_id para ser consistentes con el routes.js
  const [vacantes, setVacantes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacantes = async () => {
      // Asegurar que el ID exista
      if (!empresa_id) return;
      try {
        // Usar empresa_id del useParams (asumimos que la ruta es /admin/empresas/:empresa_id/vacantes)
        const res = await axios.get(`/admin/empresas/${empresa_id}/vacantes`);
        setVacantes(res.data);
      } catch (err) {
        console.error("Error fetching vacantes", err);
      }
    };
    fetchVacantes();
  }, [empresa_id]); // Dependencia del ID

  const handleRedirectRegister = () => {
    // Redirigir a la página de registro, pasando el ID de la empresa en la query string
    navigate(`/admin/vacantes/register?empresa_id=${empresa_id}`);
  };

  // NOTA: El componente original no tenía el nombre de la empresa,
  // pero deberías obtenerlo del contexto o al montar para mostrarlo en el SectionBanner.
  // Asumiendo que el SectionBanner maneja el título:

  return (
    <div >
      {/* Botón para añadir vacante, reemplaza el formulario inline */}
      <Button
        type="button"
        variant="contained"
        startIcon={<Add />}
        className="btn-save"
        onClick={handleRedirectRegister}
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
          top: "300px",
          position: "absolute",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          zIndex: 1,
          justifySelf: "center",
        }}
      >
        Publicar nueva vacante
      </Button>
      <div>
        <TableContainer component={Paper} className="table-container" sx={{
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
        }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{
                flexDirection: "row",
              }}>
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
                <TableCell variant="head"
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
                  }}>Título</TableCell>
                <TableCell variant="head"
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
                  }}>Descripción</TableCell>
                <TableCell variant="head"
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
                  }}>Fecha Publicación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vacantes.map((vacante) => (
                <TableRow key={vacante.id} sx={{
                  flexDirection: "row",
                  "&:last-child td, &:last-child th": { border: 0 },

                }}><TableCell
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
                    {vacante.id}
                  </TableCell>
                  <TableCell sx={{
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
                  }}>{vacante.titulo}</TableCell>
                  <TableCell sx={{
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
                  }}>{vacante.descripcion}</TableCell>
                  <TableCell sx={{
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
                  }}>
                    {new Date(vacante.fecha_publicacion).toLocaleDateString()}
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

export default VacanteManagement;
