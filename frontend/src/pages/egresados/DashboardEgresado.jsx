import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import api from "../../utils/axiosConfig";

// --- FUNCIÓN UTILITARIA AVANZADA ---
const formatWelcomeName = (fullName) => {
  if (!fullName) return "Usuario";

  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0);

  if (parts.length === 0) return "Usuario";
  if (parts.length === 1) return parts[0];

  let firstName = "";
  let firstLastName = "";

  if (parts.length === 2) {
    // Ej: "Juan Pérez"
    firstName = parts[0];
    firstLastName = parts[1];
  } else {
    // Ej: "Juan Pablo Pérez López" (4 partes)
    // Asumimos que la última palabra es el Apellido Materno y la penúltima es el Apellido Paterno.

    // El índice del primer apellido (Apellido Paterno) es el total - 2
    const firstLastNameIndex = parts.length - 2;

    // El Apellido Paterno es la palabra en ese índice
    firstLastName = parts[firstLastNameIndex];

    // Todos los Nombres son las palabras antes del Apellido Paterno
    firstName = parts.slice(0, firstLastNameIndex).join(" ");
  }

  return `${firstName} ${firstLastName}`;
};
// ------------------------------------

// Función para formatear la fecha de inicio a DD/MM/YYYY
const formatFechaInicio = (dateString) => {
  if (!dateString) return "No especificada";
  try {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    console.error("Error al formatear la fecha de inicio:", e);
    return dateString;
  }
};

const DashboardEgresado = () => {
  const [profile, setProfile] = useState(null);
  const [recommendedVacancies, setRecommendedVacancies] = useState([]);
  const [favoritosCount, setFavoritosCount] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error(
          "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente."
        );
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/egresado/dashboard");
        setProfile(res.data.perfil);
        console.log("Dashboard data:", res.data.perfil.foto_perfil);
        setFavoritosCount(res.data.favoritosCount);
        setRecommendedVacancies(res.data.vacantesRecomendadas);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Error al cargar datos del dashboard: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [location.key]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 0, bgcolor: "var(--primary-light)", minHeight: "100%" }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Bienvenido, {formatWelcomeName(profile?.nombre_completo)}
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Favoritos: {favoritosCount}
      </Typography>

      <Grid container spacing={4}>
        {/* === COLUMNA IZQUIERDA (Perfil y Tabs) === */}
        <Grid item xs={12} md={6}>
          {/* Bloque 1: Tarjeta Principal de Perfil */}
          <Card sx={{ bgcolor: "var(--card-bg)", p: 3, boxShadow: 3, mb: 4 }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 0,
              }}
            >
              <Avatar
                src={profile?.foto_perfil}
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  bgcolor: "var(--accent)",

                }}
              />

              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {profile?.nombre_completo || "N/A"}
              </Typography>
              <Typography variant="body1">
                {profile?.carrera || "N/A"}
              </Typography>
              <Typography variant="body1">
                {profile?.generacion || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Estado laboral: {profile?.estado_laboral || "N/A"}
              </Typography>

              <Button
                variant="contained"
                component={Link}
                to="/egresados/perfil/edit"
                sx={{
                  bgcolor: "var(--button-save)",
                  color: "white",
                  "&:hover": { bgcolor: "var(--button-save)", opacity: 0.9 },
                  textTransform: "none",
                }}
              >
                Editar Datos
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* === COLUMNA DERECHA (Vacantes Recomendadas) === */}
        <Grid
          item
          xs={10}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            alignContent: "center",
            justifyContent: "space-between",
            mb: 2,
            width: "500px"
            }}
        >
          {/* Bloque 2: Tabs de Detalle */}
          <Card sx={{ bgcolor: "var(--gray-form)", p: 0, boxShadow: 3, mb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTabs-indicator": { bgcolor: "var(--accent)" },
              }}
            >
              <Tab label="Personal" sx={{ textTransform: "none" }} />
              <Tab label="Empleo" sx={{ textTransform: "none" }} />
              <Tab label="Redes" sx={{ textTransform: "none" }} />
              <Tab label="Historial" sx={{ textTransform: "none" }} />
            </Tabs>

            <Box sx={{ p: 3, minHeight: "200px" }}>
              {tabValue === 0 && ( // Personal
                <Box>
                  <Typography variant="body1">
                    <strong>Correo:</strong> {profile?.email || "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Teléfono:</strong> {profile?.telefono || "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Ubicación:</strong> {profile?.ubicacion || "N/A"}
                  </Typography>
                </Box>
              )}
              {tabValue === 1 && ( // Empleo
                <Box>
                  <Typography variant="body1">
                    <strong>Empresa Actual:</strong>{" "}
                    {profile?.empresa_actual || "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Puesto:</strong> {profile?.puesto || "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Modalidad:</strong> {profile?.modalidad || "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Fecha de Inicio:</strong>{" "}
                    {formatFechaInicio(profile?.fecha_inicio)}
                  </Typography>
                </Box>
              )}
              {tabValue === 2 && ( // Redes
                <Box>
                  <Typography variant="body1">
                    <strong>LinkedIn:</strong>{" "}
                    {profile?.redes?.linkedin || "No proporcionado"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Instagram:</strong>{" "}
                    {profile?.redes?.instagram || "No proporcionado"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Otro:</strong>{" "}
                    {profile?.redes?.otro || "No proporcionado"}
                  </Typography>
                </Box>
              )}
              {tabValue === 3 && ( // Historial
                <Box>
                  {profile?.historial &&
                  Array.isArray(profile.historial) &&
                  profile.historial.length > 0 ? (
                    profile.historial.map((item, index) => (
                      <Typography key={index}>
                        {item.fecha}: {item.descripcion}
                      </Typography>
                    ))
                  ) : (
                    <Typography>No hay historial registrado.</Typography>
                  )}
                </Box>
              )}
            </Box>
          </Card>

          {/* Bloque 3: Vacantes Recomendadas */}
          <Card sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Vacantes recomendadas
            </Typography>

            <Box
              sx={{
                maxHeight: "calc(100vh - 200px)",
                overflowY: "auto",
                pr: 1,
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {recommendedVacancies.map((vac) => (
                    <Grid item xs={12} key={vac.id}>
                      <Card sx={{ bgcolor: "var(--card-bg)", boxShadow: 3, mb: 1, width: "170px", height: "200px" }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {vac.titulo}
                          </Typography>
                          <Typography>{vac.empresa.razon_social}</Typography>
                          <Typography>
                            {vac.ubicacion}, {vac.modalidad}
                          </Typography>
                          <Button
                            variant="outlined"
                            component={Link}
                            to={`/egresados/vacantes/${vac.id}`}
                            sx={{ mt: 1, textTransform: "none" }}
                          >
                            Ver detalles
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  {recommendedVacancies.length === 0 && (
                    <Typography sx={{ p: 2 }}>
                      No se encontraron vacantes recomendadas.
                    </Typography>
                  )}
                </Grid>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardEgresado;
