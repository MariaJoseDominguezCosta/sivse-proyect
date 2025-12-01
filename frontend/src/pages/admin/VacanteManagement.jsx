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
    <div className="table-container">
      {/* Botón para añadir vacante, reemplaza el formulario inline */}
      <Button
        type="button"
        variant="contained"
        startIcon={<Add />}
        className="btn-save"
        onClick={handleRedirectRegister}
        sx={{ mb: 2 }} // Un poco de margen inferior
      >
        Publicar nueva vacante
      </Button>
      <div style={{ maxHeight: "calc(100vh - 350px)", overflowY: "auto" }}>
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Fecha Publicación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vacantes.map((vacante) => (
                <TableRow key={vacante.id}>
                  <TableCell>{vacante.titulo}</TableCell>
                  <TableCell>{vacante.descripcion}</TableCell>
                  <TableCell>
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
