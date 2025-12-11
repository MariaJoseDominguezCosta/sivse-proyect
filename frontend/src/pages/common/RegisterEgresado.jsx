import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Link,
  InputLabel,
  FormControl,
} from "@mui/material"; // AGREGAR FormControl, InputLabel
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import { toast } from "react-toastify";

const OTRO_VALOR = "___OTRO___"; // Constante para identificar la opción "Otro"

const SEXO_OPTIONS = ["Masculino", "Femenino", "Otro"];

const RegisterEgresado = () => {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    telefono: "",
    generacion: "",
    carrera: "",
    email: "",
    password: "",
    confirm_password: "",
    sexo: "",
    // Campos para el valor de "Otro"
    otro_carrera: "",
    otro_generacion: "",
  });
  const [generacionesOptions, setGeneracionesOptions] = useState([]); // Cambiado nombre a 'Options'
  const [carrerasOptions, setCarrerasOptions] = useState([]); // Cambiado nombre a 'Options'
  const navigate = useNavigate();

  // --- EFECTO PARA CARGAR LAS OPCIONES DE LA API ---
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Usar la instancia de axios configurada
        const [carrerasRes, generacionesRes] = await Promise.all([
          axios.get("/auth/carreras"),
          axios.get("/auth/generaciones"),
        ]);
        // Asumiendo que la respuesta es un array de strings (como en el controlador)
        setCarrerasOptions(carrerasRes.data);
        setGeneracionesOptions(generacionesRes.data);
      } catch (err) {
        console.error("Error fetching registration options:", err);
        toast.error("Error al cargar opciones de registro.");
      }
    };
    fetchOptions();
  }, []);
  // ------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    // 1. Limpiar el campo "otro" asociado si no se seleccionó "OTRO"
    const nuevoEstado = { ...formData, [name]: value };
    if (name === "carrera" && value !== OTRO_VALOR) {
      nuevoEstado.otro_carrera = "";
    }
    if (name === "generacion" && value !== OTRO_VALOR) {
      nuevoEstado.otro_generacion = "";
    }

    setFormData(nuevoEstado);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validación de contraseñas y otros campos
    if (formData.password !== formData.confirm_password) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    // 2. Preparar los datos finales (reemplazar OTRO_VALOR con el valor del TextField)
    const finalFormData = { ...formData };

    // Reemplazar si se seleccionó "Otro"
    if (finalFormData.carrera === OTRO_VALOR) {
      finalFormData.carrera = finalFormData.otro_carrera.trim();
      if (!finalFormData.carrera) {
        toast.error("Debes especificar la otra carrera.");
        return;
      }
    }
    if (finalFormData.generacion === OTRO_VALOR) {
      finalFormData.generacion = finalFormData.otro_generacion.trim();
      if (!finalFormData.generacion) {
        toast.error("Debes especificar la otra generación.");
        return;
      }
    }

    // Eliminar campos temporales que no van al backend
    delete finalFormData.otro_carrera;
    delete finalFormData.otro_generacion;

    // 3. Ejecutar la llamada al API
    try {
      const res = await axios.post("/auth/register", finalFormData);

      toast.success(res.data.message || "Registro exitoso. Inicia sesión.");
      navigate("/");
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.error || "Error al registrar. Intenta de nuevo.";
      toast.error(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 8,
      }}
    >
      <Typography variant="h4">Registro de Egresado</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 3,
          p: 3,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <TextField
          label="Nombre completo"
          name="nombre_completo"
          value={formData.nombre_completo}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Generación Select */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="generacion-label">Generación</InputLabel>
          <Select
            labelId="generacion-label"
            name="generacion"
            value={formData.generacion}
            onChange={handleSelectChange}
            label="Generación"
          >
            <MenuItem value="" disabled>
              Selecciona tu Generación
            </MenuItem>
            {generacionesOptions.map((gen) => (
              <MenuItem key={gen} value={gen}>
                {gen}
              </MenuItem>
            ))}
            <MenuItem value={OTRO_VALOR}>Otro...</MenuItem>
          </Select>
        </FormControl>

        {/* Generación Otro TextField (Muestra condicionalmente) */}
        {formData.generacion === OTRO_VALOR && (
          <TextField
            label="Especifique la Generación"
            name="otro_generacion"
            value={formData.otro_generacion}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        )}

        {/* Carrera Select */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="carrera-label">Carrera</InputLabel>
          <Select
            labelId="carrera-label"
            name="carrera"
            value={formData.carrera}
            onChange={handleSelectChange}
            label="Carrera" // El label debe coincidir con el texto de InputLabel
            // displayEmpty // DEBEMOS removerlo o asegurarnos de que el primer MenuItem tenga value=""
          >
            {/* Opción deshabilitada para placeholder si no usamos displayEmpty */}
            <MenuItem value="" disabled>
              Selecciona tu Carrera
            </MenuItem>

            {carrerasOptions.map((carrera) => (
              // Usamos el string como key y value
              <MenuItem key={carrera} value={carrera}>
                {carrera}
              </MenuItem>
            ))}
            <MenuItem value={OTRO_VALOR}>Otro...</MenuItem>
          </Select>
        </FormControl>

        {/* Carrera Otro TextField (Muestra condicionalmente) */}
        {formData.carrera === OTRO_VALOR && (
          <TextField
            label="Especifique la Carrera"
            name="otro_carrera"
            value={formData.otro_carrera}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        )}

        <FormControl fullWidth margin="normal" required>
            <InputLabel id="sexo-label">Sexo</InputLabel>
            <Select 
                labelId="sexo-label"
                name="sexo" 
                value={formData.sexo} 
                onChange={handleSelectChange} // Usar el handler de Select
                label="Sexo"
            >
              <MenuItem value="" disabled>Selecciona tu Sexo</MenuItem>
              {SEXO_OPTIONS.map(sexo => <MenuItem key={sexo} value={sexo}>{sexo}</MenuItem>)}
            </Select>
        </FormControl>

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Confirmar Contraseña"
          name="confirm_password"
          type="password"
          value={formData.confirm_password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ mt: 2, bgcolor: "#001f3f" }}
        >
          Registrar
        </Button>
      </Box>
      <Link href="/" sx={{ mt: 1, fontSize: "0.9rem" }}>
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </Box>
  );
};

export default RegisterEgresado;
