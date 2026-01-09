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
      position: "absolute",
      display: "flex",
      width: "auto",
      height: "auto",
      flexDirection: "column",
      top: "10vh"
    }}>
      <Typography variant="h4" sx={{
        fontWeight: "bold",
        fontSize: {
          xs: "1.2rem",
          sm: "1.4rem",
          md: "1.6rem",
          lg: "1.8rem",
          xl: "2rem",
        },
        position: "relative",
        display: "flex",
      }}>
        {formatWelcomeName(profile?.nombre_completo, profile?.sexo)}
      </Typography>

      <Typography variant="subtitle1" sx={{
        mb: 1,
        fontSize: {
          xs: "1rem",
          sm: "1.1rem",
          md: "1.2rem",
          lg: "1.3rem",
        },
        position: "relative", display: "flex",
      }}>
        Favoritos: {favoritosCount}
      </Typography>

      <Grid container spacing={2} sx={{
        width: "100%",
        height: "100%",
        mt: 1,
        display: {
          xs: "flex",
          sm: "grid"
        },
        flexDirection: {
          xs: "column",
          sm: "row"
        },
        gridTemplateColumns: {
          sm: "repeat(2, 1fr)",
        },
        gridTemplateRows: {
          sm: "repeat(1, 1fr)",
        },
        justifySelf: "center",
        alignSelf: "center",
        justifyContent: "space-between",
        position: "relative",
        alignItems: "center",
        justifyItems: "center",
        alignContent: "center",
        gap: {
          xs: "0px",
          sm: "20px",
        },
        mb: 1,
        p: {
          xs: "10px",
          md: "14px",
        },
      }}>
        {/* === COLUMNA IZQUIERDA (Perfil y Tabs) === */}
        <Grid item sx={{
          gridRowStart: "1",
          gridColumnStart: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          justifySelf: "center",
          alignSelf: "center",
          mb: 1,
          width: {
            xs: "330px",
            sm: "225px",
            md: "240px",
            xl: "300px",
          },
          height: {
            xs: "auto",
            sm: "450px",
            md: "500px",
            lg: "550px",
          },
        }}>
          {/* Bloque 1: Tarjeta Principal de Perfil */}
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              p: {
                xs: "10px",
                md: "14px",
              },
              bgcolor: "var(--gray-form)",
              boxShadow: 2,
              borderRadius: "10px",
            }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                justifySelf: "center",
                width: "100%",
                height: "100%",

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
                },
                textAlign: "center"
              }}>
                {profile?.carrera || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{
                fontSize: {
                  xs: "0.8rem",
                  sm: "1rem",
                  md: "1.2rem",
                },
                textAlign: "center"

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
                  color: "#FFFDFD",

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
            gridRowStart: "1",
            gridColumnStart: "2",
            width: {
              xs: "350px",
              sm: "310px",
              lg: "400px",
            },
            gap: {
              xs: "10px",
            },
            height: {
              xs: "auto",
              sm: "450px",
              md: "500px",
              lg: "550px",
            },

            justifySelf: "center",
            alignSelf: "center",
          }}
        >
          {/* Bloque 2: Tabs de Detalle */}
          <Card sx={{
            bgcolor: "var(--gray-form)",
            boxShadow: 2,
            gap: {
              xs: "10px",
              sm: "20px",
            },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            justifySelf: "center",
            position: "relative",
            width: "100%",
            height: {
              xs: "150px",
              sm: "225px",
              md: "250px",
            },
            borderRadius: "10px",
          }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="hidden"
              sx={{
                borderBottom: 1,
                bgcolor: "var(--gray-form)",
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                borderColor: "divider",
                "& .MuiTabs-indicator": { bgcolor: "var(--accent)" },
              }}
            >
              <Tab label="Personal" sx={{
                textTransform: "none", fontSize: {
                  xs: "0.8rem",
                  md: "0.9rem",
                  lg: "1rem",
                  xl: "1.1rem",
                }
              }} />
              <Tab label="Empleo" sx={{
                textTransform: "none", fontSize: {
                  xs: "0.8rem",
                  md: "0.9rem",
                  lg: "1rem",
                  xl: "1.1rem",
                }
              }} />
              <Tab label="Redes" sx={{
                textTransform: "none", fontSize: {
                  xs: "0.8rem",
                  md: "0.9rem",
                  lg: "1rem",
                  xl: "1.1rem",
                }
              }} />
              <Tab label="Historial" sx={{
                textTransform: "none", fontSize: {
                  xs: "0.8rem",
                  md: "0.9rem",
                  lg: "1rem",
                  xl: "1.1rem",
                }
              }} />
            </Tabs>

            <Box sx={{ width: "100%", height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", mb: 1, textAlign: "center", scrollbarWidth: "thin", gap: 1 }}>
              {tabValue === 0 && ( // Personal
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="body1" sx={{
                    textTransform: "none", fontSize: {
                      xs: "0.8rem",
                      md: "0.9rem",
                      lg: "1rem",
                      xl: "1.1rem",
                    }
                  }}>
                    <strong>Correo:</strong> {profile?.email || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{
                    textTransform: "none", fontSize: {
                      xs: "0.8rem",
                      md: "0.9rem",
                      lg: "1rem",
                      xl: "1.1rem",
                    }
                  }}>
                    <strong>Teléfono:</strong> {profile?.telefono || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{
                    textTransform: "none", fontSize: {
                      xs: "0.8rem",
                      md: "0.9rem",
                      lg: "1rem",
                      xl: "1.1rem",
                    }
                  }}>
                    <strong>Ubicación:</strong> {profile?.ubicacion || "N/A"}
                  </Typography>
                </Box>
              )}
              {tabValue === 1 && ( // Empleo
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", mb: 1, pl: 2, pr: 2 }}>
                  <Typography variant="body1" sx={{
                    textTransform: "none", fontSize: {
                      xs: "0.8rem",
                      md: "0.9rem",
                      lg: "1rem",
                      xl: "1.1rem",
                    }
                  }}>
                    <strong>Empresa Actual:</strong>{" "}
                    {profile?.empresa_actual || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{
                    textTransform: "none", fontSize: {
                      xs: "0.8rem",
                      md: "0.9rem",
                      lg: "1rem",
                      xl: "1.1rem",
                    }
                  }}>
                    <strong>Puesto:</strong> {profile?.puesto || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{
                    textTransform: "none", fontSize: {
                      xs: "0.8rem",
                      md: "0.9rem",
                      lg: "1rem",
                      xl: "1.1rem",
                    }
                  }}>
                    <strong>Modalidad:</strong> {profile?.modalidad || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{
                    textTransform: "none", fontSize: {
                      xs: "0.8rem",
                      md: "0.9rem",
                      lg: "1rem",
                      xl: "1.1rem",
                    }
                  }}>
                    <strong>Fecha de Inicio:</strong>{" "}
                    {formatFechaInicio(profile?.fecha_inicio)}
                  </Typography>
                </Box>
              )}
              {tabValue === 2 && ( // Redes
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", mb: 1, pl: 2, pr: 2 }}>
                  <Typography variant="body1" sx={{
                    textTransform: "none", fontSize: {
                      xs: "0.8rem",
                      md: "0.9rem",
                      lg: "1rem",
                      xl: "1.1rem",
                    }
                  }}>
                    <strong>LinkedIn:</strong>{" "}
                    {profile?.redes?.linkedin || "No proporcionado"}
                  </Typography>
                  <Typography variant="body1" sx={{
                    textTransform: "none", fontSize: {
                      xs: "0.8rem",
                      md: "0.9rem",
                      lg: "1rem",
                      xl: "1.1rem",
                    }
                  }}>
                    <strong>Instagram:</strong>{" "}
                    {profile?.redes?.instagram || "No proporcionado"}
                  </Typography>
                  <Typography variant="body1" sx={{
                    textTransform: "none", fontSize: {
                      xs: "0.8rem",
                      md: "0.9rem",
                      lg: "1rem",
                      xl: "1.1rem",
                    }
                  }}>
                    <strong>Otro:</strong>{" "}
                    {profile?.redes?.otro || "No proporcionado"}
                  </Typography>
                </Box>
              )}
              {tabValue === 3 && ( // Historial
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", mb: 1, pl: 2, pr: 2 }}>
                  {profile?.historial &&
                    Array.isArray(profile.historial) &&
                    profile.historial.length > 0 ? (
                    profile.historial.map((item, index) => (
                      <Typography key={index} variant="body1" sx={{
                        textTransform: "none", fontSize: {
                          xs: "0.8rem", md: "0.9rem", lg: "1rem", xl: "1.1rem",
                        },
                      }}>
                        {item.fecha}: {item.descripcion}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body1"
                      sx={{ textTransform: "none", fontSize: { xs: "0.8rem", md: "0.9rem", lg: "1rem", xl: "1.1rem" } }}>No hay historial registrado.</Typography>
                  )}
                </Box>
              )}
            </Box>
          </Card>

          {/* Bloque 3: Vacantes Recomendadas */}
          <Card sx={{
            bgcolor: "var(--gray-form)",
            boxShadow: 2,
            gap: {
              xs: "5px",
            },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            justifySelf: "end",
            position: "relative",
            width: "auto",
            height: {
              xs: "190px",
              sm: "225px",
              md: "250px",
            },
            borderRadius: "10px",
          }}
          >
            <Typography variant="h6"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                fontSize: {
                  xs: "0.9rem",
                  md: "1.2rem",
                  lg: "1.4rem",
                  xl: "1.6rem"
                },
                mt: 1,
                borderBottom: 1,
                justifyContent: "center",
                alignItems: "center",
                borderColor: "divider",
              }}>
              Vacantes recomendadas
            </Typography>

            <Box
              sx={{
                alignSelf: "center",
                position: "relative",
                flexDirection: "column",
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container sx={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  gap: "15px",
                  display: "flex",
                  flexDirection: "row",
                }}>
                  {recommendedVacancies.map((vac) => (
                    <Grid item key={vac.id} >
                      <Card
                        sx={{
                          bgcolor: "var(--card-bg)",
                          boxShadow: 2,
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          width: {
                            xs: "120px",
                            sm: "150px",
                          },
                          height: {
                            xs: "150px",
                            sm: "170px",
                          },
                          padding: { xs: "0px 0px", sm: "1px 0px" },
                          flexDirection: "column",
                          borderRadius: "10px",
                        }}
                      >
                        <CardContent sx={{
                          display: "flex",
                          alignSelf: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                          flexDirection: "column",
                        }}>
                          <Typography variant="h6" sx={{
                            fontWeight: "bold", fontSize: {
                              xs: "0.875rem",
                              sm: "1.125rem",
                              xl: "1.25rem",
                            },
                            alignSelf: "center",
                            textAlign: "center",
                            textTransform: "none",
                            lineHeight: 1,
                          }}>
                            {vac.titulo}
                          </Typography>
                          <Typography sx={{
                            fontSize: { xs: "0.7rem", sm: "0.75rem", xl: "0.8rem" }, 
                            textTransform: "none", 
                            textAlign: "center", 
                            mt: 1,
                          }}>{vac.empresa.razon_social}</Typography>
                          <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", xl: "0.8rem" }, textTransform: "none", textAlign: "center", mt: 1, }}>
                            {vac.ubicacion}, {vac.modalidad}
                          </Typography>
                          <Button
                            variant="contained"
                            component={Link}
                            to={`/egresados/vacantes/${vac.id}`}
                            sx={{ mt: 1, textTransform: "none", lineHeight: 1, fontSize: { xs: "0.7rem", sm: "0.75rem", xl: "0.8rem" }, width: "auto", alignSelf: "center", backgroundColor: "var(--button-save)", "&:hover": { backgroundColor: "var(--button-save)", opacity: 0.9 } }}
                          >
                            Ver detalles
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  {recommendedVacancies.length === 0 && (
                    <Typography sx={{ p: 2, textAlign: "center", fontSize: "1rem", mt: 2 }}>
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
