import React, { useState, useEffect, useMemo } from "react";
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
import api, { IMAGE_BASE_URL } from "../../utils/axiosConfig";

// --- FUNCIÓN UTILITARIA AVANZADA ---
const formatWelcomeName = (fullName, sexo) => {
  if (!fullName) return "Usuario";

  // Dividir el nombre completo en partes
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0);

  let name = 'Usuario';
  if (parts.length >= 2) {
    const firstLastNameIndex = parts.length - 2;
    const firstLastName = parts[firstLastNameIndex];
    name = `${parts.slice(0, firstLastNameIndex).join(' ')} ${firstLastName}`;
  } else if (parts.length === 1) {
    name = parts[0];
  }

  // Determinar el saludo
  let greeting = "Bienvenid@";
  if (sexo === "Femenino") {
    greeting = "Bienvenida";
  } else if (sexo === "Masculino") {
    greeting = "Bienvenido";
  }

  return `${greeting}, ${name}`;
};

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
  const [photoVersion, setPhotoVersion] = useState(0); // Forzar recarga de foto

  const location = useLocation();
  // hay veces que cuando paso el mouse a traves de la pantalla cuando esta el aviso de inactividad, este se abre y cierra varias veces, las primeras veces no aparece el boton de "permanecer activo" y hasta despues aparece ese botón pero ni siquiera deja presionarlo porque el toast se cierra y se abre de nuevo, por eso se usa el useEffect para que se ejecute cada vez que se cambie la ubicacion de la pantalla
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
        setFavoritosCount(res.data.favoritosCount);
        setRecommendedVacancies(res.data.vacantesRecomendadas);
        // Actualizar la versión de la foto para forzar recarga
        setPhotoVersion((prev) => prev + 1);
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

  // Avatar con versión anti-caché
  const avatarSrc = useMemo(() => {
    if (profile?.foto_perfil) {
      return `${IMAGE_BASE_URL}${profile.foto_perfil}?v=${photoVersion}`;
    }
    return "/default-avatar.png";
  }, [profile?.foto_perfil, photoVersion]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{
      position: "relative",
      display: "flex",
      // top: {
      //   xs: "90px",
      //   md: "120px",
      //   lg: "10px",
      // },
      // left: {
      //   xs: "25px",
      //   md: "300px",
      //   lg: "350px",
      // },
      width: "auto",
      height: "auto",
      flexDirection: "column",

    }}>
      <Typography variant="h4" sx={{
        fontWeight: "bold",
        fontSize: {
          xs: "1.4rem",
          sm: "1.6rem",
          md: "2rem",
          lg: "2.2rem",
          xl: "2.4rem",
        },

      }}>
        {formatWelcomeName(profile?.nombre_completo, profile?.sexo)}
      </Typography>

      <Typography variant="subtitle1" sx={{
        mb: 1,
        fontSize: {
          xs: "1rem",
          sm: "1.2rem",
          md: "1.4rem",
          lg: "1.6rem",
          xl: "1.8rem",
        },
      }}>
        Favoritos: {favoritosCount}
      </Typography>

      <Grid container sx={{
        width: "100%",
        height: "100%",
        display: {
          xs: "flex",
          sm: "grid"
        },
        flexDirection: {
          xs: "column",
          sm: "none"
        },
        gap: {
          xs: "10px",
          md: "20px",
          lg: "40px",
          xl: "50px",
        },
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
        },
        gridTemplateRows: {
          xs: "1fr",
          sm: "repeat(1, 1fr)",
        },
        alignSelf: "center",
        justifySelf: "center",
        alignItems: "center",
        justifyContent: "center",

      }}>
        {/* === COLUMNA IZQUIERDA (Perfil y Tabs) === */}
        <Grid item sx={{
          gridRowStart: "1",
          gridColumnStart: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          mb: 1,
        }}>
          {/* Bloque 1: Tarjeta Principal de Perfil */}
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",

              p: {
                xs: "10px",
                md: "14px",
              },
              width: {
                xs: "400px",
                sm: "200px",
                md: "250px",
                xl: "400px",
              },
              height: {
                xs: "auto",
                sm: "450px",
                md: "500px",
              },
              bgcolor: "var(--gray-form)",
              boxShadow: 3,
            }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                justifySelf: "center",
                width: "100%",
                height: "100%"
              }}
            >
              <Avatar
                src={avatarSrc}
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  bgcolor: "var(--accent)",
                }}
              />

              <Typography variant="h6" sx={{
                fontWeight: "bold", textAlign: "center", fontSize: {
                  xs: "1rem",
                  sm: "1.2rem",
                  md: "1.4rem",
                }
              }}>
                {profile?.nombre_completo || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{
                fontSize: {
                  xs: "0.8rem",
                  sm: "1rem",
                  md: "1.2rem",
                }
              }}>
                {profile?.carrera || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{
                fontSize: {
                  xs: "0.8rem",
                  sm: "1rem",
                  md: "1.2rem",
                }
              }}>
                Generación:
                {profile?.generacion || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{
                mb: 1, fontSize: {
                  xs: "0.8rem",
                  sm: "1rem",
                  md: "1.2rem",
                },
                textAlign: "center"
              }}>
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
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            mb: 1,
            gridRowStart: "1",
            gridColumnStart: "2",
            width: {
              xs: "400px",
              lg: "600px",
              xl: "auto",
            },

          }}
        >
          {/* Bloque 2: Tabs de Detalle */}
          <Card sx={{
            bgcolor: "var(--gray-form)",
            boxShadow: 3, mb: 2,

            height: {
              xs: "auto",
              md: "250px",
            },
            gap: {
              xs: "10px",
              sm: "20px",
              md: "30px",
              lg: "40px",
              xl: "50px",
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            justifySelf: "center",

          }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                gap: "10px",
                display: "flex",
                width: "auto",
                justifyContent: "center",
                alignItems: "center",

                borderColor: "divider",
                "& .MuiTabs-indicator": { bgcolor: "var(--accent)" },
              }}
            >
              <Tab label="Personal" sx={{
                textTransform: "none", fontSize: {
                  xs: "0.7rem",
                  sm: "0.8rem",
                  md: "0.9rem",
                  lg: "1rem",
                  xl: "1.1rem",
                }
              }} />
              <Tab label="Empleo" sx={{
                textTransform: "none", fontSize: {
                  xs: "0.7rem",
                  sm: "0.8rem",
                  md: "0.9rem",
                  lg: "1rem",
                  xl: "1.1rem",
                }
              }} />
              <Tab label="Redes" sx={{
                textTransform: "none", fontSize: {
                  xs: "0.7rem",
                  sm: "0.8rem",
                  md: "0.9rem",
                  lg: "1rem",
                  xl: "1.1rem",
                }
              }} />
              <Tab label="Historial" sx={{
                textTransform: "none", fontSize: {
                  xs: "0.7rem",
                  sm: "0.8rem",
                  md: "0.9rem",
                  lg: "1rem",
                  xl: "1.1rem",
                }
              }} />
            </Tabs>

            <Box sx={{ width: "100%", height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
              {tabValue === 0 && ( // Personal
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Typography variant="body1" sx={{
                textTransform: "none", fontSize: {
                  xs: "0.7rem",
                  sm: "0.8rem",
                  md: "0.9rem",
                  lg: "1rem",
                  xl: "1.1rem",
                }}}>
                    <strong>Correo:</strong> {profile?.email || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{
                textTransform: "none", fontSize: {
                  xs: "0.7rem",
                  sm: "0.8rem",
                  md: "0.9rem",
                  lg: "1rem",
                  xl: "1.1rem",
                }}}>
                    <strong>Teléfono:</strong> {profile?.telefono || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{
                textTransform: "none", fontSize: {
                  xs: "0.7rem",
                  sm: "0.8rem",
                  md: "0.9rem",
                  lg: "1rem",
                  xl: "1.1rem",
                }}}>
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
          <Card>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Vacantes recomendadas
            </Typography>

            <Box
              sx={{

                overflowY: "auto",
                pr: 1,
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container>
                  {recommendedVacancies.map((vac) => (
                    <Grid item key={vac.id}>
                      <Card
                        sx={{
                          bgcolor: "var(--card-bg)",
                          boxShadow: 3,
                          mb: 1,
                          width: "170px",
                          height: "200px",
                        }}
                      >
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
