import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Switch,
  Select,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import axios from "../../utils/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditVacancy = () => {
  const { id } = useParams();
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    salario_estimado: "",
    descripcion: "",
    modalidad: "",
    requisitos: "",
    estado: false,
    empresaAsociada: "",
    fecha_publicacion: "",
    ubicacion: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/admin/empresas");
        setCompanies(res.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
        toast.error("No se pudieron cargar las empresas para el selector.");
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const res = await axios.get(`/admin/vacantes/${id}`);
        const data = res.data;
        const empresa_id = data.empresa_id || (data.empresa ? data.empresa.id : '');
        setFormData(prevData => ({
            ...prevData, // Mantenemos la estructura inicial si es necesario
            ...data, // Sobrescribimos con los datos de la API (titulo, descripcion, etc.)
            empresaAsociada: empresa_id,
        }));
        console.log("empresa: ", empresa_id);
      } catch (err) {
        console.error("Error fetching vacancy", err);
      }
    };
    fetchVacancy();
  }, [id]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/vacantes/${id}`, formData);
      toast.success("Vacante actualizada con éxito");
      navigate("/admin/vacantes");
    } catch (err) {
      console.error("Error updating vacancy", err);
      toast.error("Error al actualizar la vacante");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="form-container">
      <TextField
        name="titulo"
        label="Título"
        value={formData.titulo}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Value"
      />
      <TextField
        name="salario_estimado"
        label="Salario"
        value={formData.salario_estimado}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Value"
      />
      <TextField
        name="descripcion"
        label="Descripción"
        value={formData.descripcion}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        placeholder="Value"
      />
      <TextField
        name="ubicacion"
        label="Ubicación"
        value={formData.ubicacion}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Ej: Ciudad de México o Remoto"
      />
      <TextField
        name="modalidad"
        label="Modalidad"
        value={formData.modalidad}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Value"
      />
      <TextField
        name="requisitos"
        label="Requisitos (Separados con comas)"
        value={formData.requisitos}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Value"
      />
      <FormControlLabel
        control={
          <Switch
            name="estado"
            checked={formData.estado}
            onChange={handleChange}
          />
        }
        label="Estado Activa/Inactiva"
      />
      <Select
        name="empresaAsociada"
        value={formData.empresaAsociada || ""} // Usar '' si es null o undefined para evitar errores de MUI
        onChange={handleChange}
        fullWidth
        margin="normal"
        displayEmpty
      >
        <MenuItem value="" disabled>
          Selecciona una empresa
        </MenuItem>
        {companies.map((company) => (
          <MenuItem key={company.id} value={company.id}>
            {company.razon_social}
          </MenuItem>
        ))}
      </Select>
      <TextField
        name="fecha_publicacion"
        label="Fecha de publicación"
        type="date"
        value={formData.fecha_publicacion}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Value"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Box className="buttons">
        <Button
          className="btn-cancel"
          onClick={() => navigate("/admin/vacantes")}
        >
          Cancelar
        </Button>
        <Button className="btn-save" type="submit">
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default EditVacancy;
