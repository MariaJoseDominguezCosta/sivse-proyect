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
        const empresa_id =
          data.empresa_id || (data.empresa ? data.empresa.id : "");
        setFormData((prevData) => ({
          ...prevData, // Mantenemos la estructura inicial si es necesario
          ...data, // Sobrescribimos con los datos de la API (titulo, descripcion, etc.)
          empresaAsociada: empresa_id,
        }));
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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        gap: "10px",
        top: {
          xs: "200px",
          lg: "250px",
        },
        p: {
          xs: "10px",
          sm: "15px",
          md: "20px",
          lg: "25px",
          xl: "30px",
        },
        width: {
          xs: "450px",
          md: "500px",
          lg: "600px",
          xl: "700px",
        },
        justifySelf: "center",
        alignSelf: "center",
        backgroundColor: "#FFFDFD",
        borderRadius: "8px",
        boxShadow: 3,
        display: "grid",
        flexDirection: "column",
        position: "absolute",
        WebkitAlignItems: "center",
        alignItems: "center",
        justifyContent: "center",
        WebkitJustifyContent: "center",
        gridTemplateRows: "repeat(5, 1fr)",
        gridTemplateColumns: "repeat(2, 1fr)",
      }}
    >
      <TextField
        name="titulo"
        label="Título"
        value={formData.titulo}
        onChange={handleChange}
        placeholder="Ej: Desarrollador Frontend"
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "1",
          gridRowEnd: "2",
          gridColumnStart: "1",
          gridColumnEnd: "2",
        }} />
      <TextField
        name="salario_estimado"
        label="Salario"
        value={formData.salario_estimado}
        onChange={handleChange}
        placeholder="Ej: 20000"
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "1",
          gridRowEnd: "2",
          gridColumnStart: "2",
          gridColumnEnd: "3",
        }}
      />
      <TextField
        name="descripcion"
        label="Descripción"
        value={formData.descripcion}
        onChange={handleChange}
        multiline
        placeholder="Ej: Descripción de la vacante"
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "2",
          gridRowEnd: "4",
          gridColumnStart: "1",
          gridColumnEnd: "2",
        }}

      />
      <TextField
        name="ubicacion"
        label="Ubicación"
        value={formData.ubicacion}
        onChange={handleChange}
        placeholder="Ej: Ciudad de México o Remoto"
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "2",
          gridRowEnd: "3",
          gridColumnStart: "2",
          gridColumnEnd: "3",
        }}
      />
      <TextField
        name="modalidad"
        label="Modalidad"
        value={formData.modalidad}
        onChange={handleChange}
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "4",
          gridRowEnd: "5",
          gridColumnStart: "1",
          gridColumnEnd: "2",
        }}
        placeholder="Ej: Presencial o Remoto"
      />
      <TextField
        name="requisitos"
        label="Requisitos (Separados con comas)"
        value={formData.requisitos}
        onChange={handleChange}
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "3",
          gridRowEnd: "4",
          gridColumnStart: "2",
          gridColumnEnd: "3",
        }}
        placeholder="Ej: Experiencia en HTML, CSS y JavaScript"
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
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "4",
          gridRowEnd: "5",
          gridColumnStart: "2",
          gridColumnEnd: "3",
          display: "flex",
          justifySelf: "center",
        }}
      />
      <Select
        name="empresaAsociada"
        value={formData.empresaAsociada || ""} // Usar '' si es null o undefined para evitar errores de MUI
        onChange={handleChange}
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "5",
          gridRowEnd: "6",
          gridColumnStart: "1",
          gridColumnEnd: "2",
        }}
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
        sx={{
          width: {
            xs: "150px",
            sm: "200px",
            md: "250px",
            lg: "300px",
            xl: "350px",
          },
          gridRowStart: "5",
          gridRowEnd: "6",
          gridColumnStart: "2",
          gridColumnEnd: "3",
        }}
        placeholder="Ej: 2023-08-15"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Box component="div"
        sx={{
          gridColumn: "span 2",
          display: "flex",
          gap: 2,
          justifyContent: "center",
          marginTop: 1,
        }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/admin/vacantes")}
          sx={{
            p: {
              xs: 1,
            },
            color: "rgba(30, 30, 30, 1)",
            borderColor: "rgba(118, 118, 118, 1)",
          }}
        >
          Cancelar
        </Button>
        <Button variant="contained" type="submit" sx={{ p: { xs: 1 }, bgcolor: "rgba(44, 44, 44, 1)" }}>
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default EditVacancy;
