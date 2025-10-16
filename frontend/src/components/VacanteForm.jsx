import React, { useState } from "react";
import { Switch, TextField } from "@mui/material";

// src/components/VacanteForm.js (extracto de cambios)
function VacanteForm() {
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        requisitos: "",
        ubicacion: "",
        modalidad: "",
        salario_estimado: "",
        empresa_id: "",
        estado: "Activa",
        fecha_publicacion: new Date(),
    });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSwitchChange = (e) =>
        setFormData({
        ...formData,
        estado: e.target.checked ? "Activa" : "Inactiva",
        });

    return (
        <>
        <Switch
            checked={formData.estado === "Activa"}
            onChange={handleSwitchChange}
        />
        <TextField
            name="salario_estimado"
            value={formData.salario_estimado}
            onChange={handleChange}
            type="number"
        />
        </>
    );
}

export default VacanteForm;
