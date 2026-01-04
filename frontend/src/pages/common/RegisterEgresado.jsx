import React, { useState, useEffect } from "react";
import { Button, Typography, Select, MenuItem, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import "../../assets/registerEgresado.css";

const OTRO_VALOR = "___OTRO___"; // Constante para identificar la opción "Otro"

const SEXO_OPTIONS = ["Masculino", "Femenino", "Otro"];

// --- ESTILOS COMUNES PARA TODOS LOS INPUTS (TEXTO Y SELECT) ---
const CommonInputStyles = (theme) => ({
  "label + &": {
    marginTop: theme.spacing(2.9),
  },
  // Estilos para la raíz del OutlinedInput (el contenedor con el borde)
  "& .MuiOutlinedInput-root,": {
    borderRadius: "8px",
    paddingRight: 0, // Asegura que el padding no interfiera con EndAdornment
    backgroundColor: "rgba(245, 245, 245, 1)", // Fondo gris claro
    boxSizing: "border-box",
    height: "30px", // Permitir que el padding controle la altura

    // Borde personalizado
    "& fieldset": {
      borderColor: "#cacaca", // Borde ligero, como en la imagen
    },
    "&:hover fieldset": {
      borderColor: "rgba(217, 217, 217, 1) !important", // Mantener borde al pasar el ratón
    },
    "&.Mui-focused fieldset": {
      // Usar color primario o un color de enfoque si es necesario, o mantener consistente
      borderColor: theme.palette.primary.main,
    },
  },

  // Estilos para el elemento de entrada real (texto, contraseña o select)
  "& .MuiOutlinedInput-input, & .MuiSelect-select": {
    backgroundColor: "transparent", // Fondo gris claro
    borderRadius: "8px",
    boxSizing: "border-box",
    lineHeight: "normal", // Mejor que '1px' para alineación de texto

    // Padding y tamaño de fuente responsivo (Unificado)
    padding: {
      xs: "2px 6px 2px 6px",
      sm: "4px 8px 4px 8px",
      md: "6px 10px 6px 10px",
      lg: "8px 12px 8px 12px",
      xl: "10px 14px 10px 14px",
    },
    fontSize: {
      xs: "0.8rem",
      sm: "1rem",
      md: "1.2rem",
      lg: "1.4rem",
      xl: "1.6rem",
    },
    "& fieldset": {
      borderColor: "#cacaca", // Borde ligero, como en la imagen
    },
  },

  // Ajuste para el ícono del select
  "& .MuiSelect-icon": {
    right: {
      xs: "6px",
      sm: "8px",
      md: "10px",
      lg: "12px",
      xl: "14px",
    },
  },
});

// Componente para campos de texto/contraseña
const CustomOutlinedInput = styled(OutlinedInput)(({ theme }) =>
  CommonInputStyles(theme)
);

// Componente para campos select
const CustomSelectField = styled((props) => (
  <TextField {...props} select variant="outlined" />
))(({ theme }) => CommonInputStyles(theme));
// --- FIN ESTILOS COMUNES ---

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

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        width: {
          xs: "300px",
          sm: "600px",
          md: "800px",
          lg: "900px",
        },

        margin: {
          xs: "12px",
          sm: "14px",
          md: "16px",
          lg: "18px",
          xl: "20px",
        },
        padding: {
          xs: "12px",
          sm: "14px",
          md: "16px",
          lg: "18px",
          xl: "20px",
        },
        top: {
          xs: "150px",
          md: "200px",
          sm: "150px ",
          xl: "300px",
        },
        backgroundColor: "rgba(255, 253, 253, 1)",
        position: "absolute",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          justifySelf: "center",
        }}
      >
        Registro de Egresado
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="formulario-registro"
      >
        <FormControl
          variant="standard"
          sx={{
            width: {
              xs: "125px",
              sm: "250px",
              md: "300px",
              lg: "350px",
            },
            display: "flex",
            flexGrow: 1,
            flexShrink: 0,
            flexDirection: "column",
          }}
        >
          <InputLabel
            shrink
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.2rem",
                md: "1.4rem",
                lg: "1.6rem",
                xl: "1.8rem",
              },
            }}
          >
            Nombre Completo
          </InputLabel>

          <CustomOutlinedInput
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl
          variant="standard"
          sx={{
            width: {
              xs: "125px",
              sm: "250px",
              md: "300px",
              lg: "350px",
            },
            display: "flex",
            flexGrow: 1,
            flexShrink: 0,
            flexDirection: "column",
          }}
        >
          <InputLabel
            shrink
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.2rem",
                md: "1.4rem",
                lg: "1.6rem",
                xl: "1.8rem",
              },
            }}
          >
            Teléfono
          </InputLabel>
          <CustomOutlinedInput
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            // Se eliminaron los sx redundantes de estilo de input
          />
        </FormControl>

        {/* Generación Select */}
        <FormControl
          variant="standard"
          sx={{
            width: {
              xs: "125px",
              sm: "250px",
              md: "300px",
              lg: "350px",
            },
            display: "flex",
            flexGrow: 1,
            flexShrink: 0,
            flexDirection: "column",
          }}
        >
          <InputLabel
            shrink
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.2rem",
                md: "1.4rem",
                lg: "1.6rem",
                xl: "1.8rem",
              },
            }}
            id="generacion-label"
          >
            Generación
          </InputLabel>
          <CustomSelectField
            id="generacion"
            name="generacion"
            value={formData.generacion}
            onChange={handleSelectChange}
            // Se eliminaron los sx redundantes de estilo de select
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
          </CustomSelectField>
        </FormControl>

        {/* Generación Otro CustomOutlinedInput (Muestra condicionalmente) */}
        {formData.generacion === OTRO_VALOR && (
          <FormControl
            variant="standard"
            sx={{
              width: {
                xs: "125px",
                sm: "250px",
                md: "300px",
                lg: "350px",
              },
              display: "flex",
              flexGrow: 1,
              flexShrink: 0,
              flexDirection: "column",
            }}
          >
            <InputLabel
              shrink
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.2rem",
                  md: "1.4rem",
                  lg: "1.6rem",
                  xl: "1.8rem",
                },
              }}
            >
              Especifique la Generación
            </InputLabel>
            <CustomOutlinedInput
              name="otro_generacion"
              value={formData.otro_generacion}
              onChange={handleChange}
              required
              // Se eliminaron los sx redundantes de estilo de input
            />
          </FormControl>
        )}

        {/* Carrera Select */}
        <FormControl
          variant="standard"
          sx={{
            gap: "10px",
            width: {
              xs: "125px",
              sm: "250px",
              md: "300px",
              lg: "350px",
            },
            display: "flex",
            flexGrow: 1,
            flexShrink: 0,
            flexDirection: "column",
          }}
        >
          <InputLabel
            shrink
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.2rem",
                md: "1.4rem",
                lg: "1.6rem",
                xl: "1.8rem",
              },
            }}
            id="carrera-label"
          >
            Carrera
          </InputLabel>
          <CustomSelectField
            name="carrera"
            id="carrera-label"
            value={formData.carrera}
            onChange={handleSelectChange}
            // Se eliminaron los sx redundantes de estilo de select
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
          </CustomSelectField>
        </FormControl>

        {/* Carrera Otro CustomOutlinedInput (Muestra condicionalmente) */}
        {formData.carrera === OTRO_VALOR && (
          <FormControl
            variant="standard"
            sx={{
              width: {
                xs: "125px",
                sm: "250px",
                md: "300px",
                lg: "350px",
              },
              display: "flex",
              flexGrow: 1,
              flexShrink: 0,
              flexDirection: "column",
            }}
          >
            <InputLabel
              shrink
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.2rem",
                  md: "1.4rem",
                  lg: "1.6rem",
                  xl: "1.8rem",
                },
              }}
            >
              Especifique la Carrera
            </InputLabel>

            <CustomOutlinedInput
              name="otro_carrera"
              value={formData.otro_carrera}
              onChange={handleChange}
              required
              // Se eliminaron los sx redundantes de estilo de input
            />
          </FormControl>
        )}

        <FormControl
          variant="standard"
          sx={{
            gap: "10px",
            width: {
              xs: "125px",
              sm: "250px",
              md: "300px",
              lg: "350px",
            },
            display: "flex",
            flexGrow: "1",
            flexShrink: "0",
            flexDirection: "column",
          }}
        >
          <InputLabel
            shrink
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.2rem",
                md: "1.4rem",
                lg: "1.6rem",
                xl: "1.8rem",
              },
            }}
          >
            Sexo
          </InputLabel>
          <CustomSelectField
            id="sexo-label"
            name="sexo"
            value={formData.sexo}
            onChange={handleSelectChange} // Usar el handler de Select
            // Se eliminaron los sx redundantes de estilo de select
          >
            {/* Se cambió el valor "Selecciona tu Sexo" a un valor vacío para que el placeholder funcione con disabled */}
            <MenuItem value="" disabled>
              Selecciona tu Sexo
            </MenuItem>
            {SEXO_OPTIONS.map((sexo) => (
              <MenuItem key={sexo} value={sexo}>
                {sexo}
              </MenuItem>
            ))}
          </CustomSelectField>
        </FormControl>
        <FormControl
          variant="standard"
          sx={{
            width: {
              xs: "125px",
              sm: "250px",
              md: "300px",
              lg: "350px",
            },
            display: "flex",
            flexGrow: 1,
            flexShrink: 0,
            flexDirection: "column",
          }}
        >
          <InputLabel
            shrink
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.2rem",
                md: "1.4rem",
                lg: "1.6rem",
                xl: "1.8rem",
              },
            }}
          >
            Email
          </InputLabel>

          <CustomOutlinedInput
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            // Se eliminaron los sx redundantes de estilo de input
          />
        </FormControl>
        <FormControl
          variant="standard"
          sx={{
            width: {
              xs: "125px",
              sm: "250px",
              md: "300px",
              lg: "350px",
            },
            display: "flex",
            flexGrow: 1,
            flexShrink: 0,
            flexDirection: "column",
          }}
        >
          <InputLabel
            shrink
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.2rem",
                md: "1.4rem",
                lg: "1.6rem",
                xl: "1.8rem",
              },
            }}
          >
            Contraseña
          </InputLabel>
          <CustomOutlinedInput // Usamos el componente estilizado
            name="password"
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            // Se eliminaron los sx redundantes de estilo de input
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  // Añadimos un pequeño sx al IconButton si es necesario para centrado vertical o color
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl
          variant="standard"
          sx={{
            width: {
              xs: "125px",
              sm: "250px",
              md: "300px",
              lg: "350px",
            },
            display: "flex",
            flexGrow: 1,
            flexShrink: 0,
            flexDirection: "column",
          }}
        >
          <InputLabel
            shrink
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.2rem",
                md: "1.4rem",
                lg: "1.6rem",
                xl: "1.8rem",
              },
            }}
          >
            Confirmar Contraseña
          </InputLabel>
          <CustomOutlinedInput // Usamos el componente estilizado
            name="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
            // Se eliminaron los sx redundantes de estilo de input
          />
        </FormControl>

        <Button
          variant="contained"
          type="submit"
          sx={{
            padding: {
              xs: "6px 12px",
              sm: "8px 16px",
              md: "10px 20px",
              lg: "12px 24px",
              xl: "14px 28px",
            },
            gridColumn: "span 2",
            marginTop: "20px",
            width: "auto",
            fontSize: {
              xs: "0.8rem",
              sm: "1rem",
              md: "1.2rem",
              lg: "1.4rem",
              xl: "1.6rem",
            },
            justifySelf: "center",
            backgroundColor: "var(--button-save)",
            color: "rgba(245, 245, 245, 1)",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "var(--button-save)",
              opacity: 0.9,
            },
          }}
        >
          Registrar
        </Button>
      </Box>
      <Link
        href="/"
        sx={{
          mt: 1,
          fontSize: {
            xs: "0.8rem",
            sm: "1rem",
            md: "1.2rem",
            lg: "1.4rem",
            xl: "1.6rem",
          },
          justifySelf: "center",
          display: "flex",
        }}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </Box>
  );
};

export default RegisterEgresado;
