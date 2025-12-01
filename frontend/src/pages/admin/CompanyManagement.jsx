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
    <div className="table-container">
      <div className="search-bar">
        <TextField
          placeholder="Hinted search text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* Filtro Tipo Convenio */}
        <Select
          value={convenioFilter}
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
          className="btn-save"
          onClick={() => navigate("/admin/empresas/register")}
        >
          Registrar nueva empresa
        </Button>
      </div>
      <div style={{ maxHeight: "calc(100vh - 350px)", overflowY: "auto" }}>
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Razón Social</TableCell>
                <TableCell>Sector</TableCell>
                <TableCell>Tipo Convenio</TableCell>
                <TableCell>Telefono</TableCell>
                <TableCell>Vacantes</TableCell>
                <TableCell>Editar</TableCell>
                <TableCell>Remover</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompanies.map((company, index) => (
                <TableRow key={company.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{company.razon_social}</TableCell>
                  <TableCell>{company.sector}</TableCell>
                  <TableCell>{company.tipo_convenio}</TableCell>
                  <TableCell>{company.telefono}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        navigate(`/admin/empresas/${company.id}/vacantes`)
                      }
                    >
                      {company.vacantes?.length || 0} Vacantes
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        navigate(`/admin/empresas/edit/${company.id}`)
                      }
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                  <TableCell>
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
