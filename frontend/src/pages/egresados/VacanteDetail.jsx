import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Grid, Card, CardContent, Paper, Chip, Dialog, DialogTitle, DialogContent } from '@mui/material'; // AGREGAR IMPORTS
import { useParams } from 'react-router-dom';
import api from '../../utils/axiosConfig';
import StarIcon from '@mui/icons-material/Star';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';



const VacanteDetail = () => {
  const { id } = useParams();
  const [vacante, setVacante] = useState(null); // Usamos null para controlar la carga
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false); // Estado para el modal de contacto

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/egresado/vacantes/${id}`);
        setVacante(res.data);
      } catch (error) {
        console.error('Error al cargar detalle de vacante:', error);
        toast.error('No se pudo cargar el detalle de la vacante.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleAddFavorite = async () => {
    try {
      const res = await api.post('/egresado/favoritos', { vacante_id: id });
      if (res.status === 201) {
        toast.success('Vacante añadida a favoritos.');
        // Actualizar el estado 'es_favorito'
        setVacante(prev => ({ ...prev, es_favorito: true }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ya está en favoritos o error al añadir.';
      toast.error(errorMessage);
    }
  };

  if (loading || !vacante) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Desestructurar los datos para la vista
  const {
    titulo,
    descripcion,
    requisitos,
    ubicacion,
    modalidad,
    salario_estimado,
    fecha_publicacion,
    es_favorito,
    empresa
  } = vacante;

  // Formatear la fecha
  const formattedDate = new Date(fecha_publicacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  // Formatear el salario a un número y luego a una cadena formateada
  const formattedSalario = (salario_estimado) => {
    // Intentar convertir a float. Si falla (es null/undefined/vacío), usar 0.
    const numericSalario = parseFloat(salario_estimado);

    if (isNaN(numericSalario) || numericSalario === 0) {
      return 'No especificado';
    }
    // Usar toLocaleString para formatear con separador de miles y dos decimales
    return numericSalario.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Formatear requisitos (si es un string separado por comas)
  const reqTags = requisitos?.split(',').map(r => r.trim()).filter(r => r.length > 0) || []


  return (
    <Box sx={{ margin: 'auto', p: 0, mb: 1, maxWidth: '900px' }}>

      {/* Contenedor Principal con Fondo Gris/Rosado */}
      <Box sx={{
        position: "relative",
        mt: "20px",
        backgroundColor: "background.paper",
        padding: "20px",
        borderRadius: "8px",
        width: {
          xs: "auto",
          md: "500px",
          lg: "600px",
          xl: "700px",
        },
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        justifySelf: "center",
        alignSelf: "center",
      }}>

        <Grid container justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2, display: 'flex', position: "relative" }}>
          {/* Título y Empresa */}
          <Grid item sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom sx={{
              fontWeight: "bold", fontSize: {
                xs: "1.2rem",
                sm: "1.4rem",
                md: "1.6rem",
                lg: "1.8rem",
                xl: "2rem",
              }
            }}>{titulo}</Typography>
            <Typography variant="h6" gutterBottom sx={{
              fontWeight: "bold", fontSize: {
                xs: "1.1rem",
                sm: "1.2rem",
                md: "1.3rem",
                lg: "1.4rem",
                xl: "1.5rem",
              }
            }}>{empresa?.razon_social}</Typography>
          </Grid>

          {/* Ubicación y Botón de Favorito */}
          <Grid item sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: "relative" }}>
            <Typography variant="h6" sx={{
              fontWeight: "bold", fontSize: {
                xs: "1.1rem",
                sm: "1.2rem",
                md: "1.3rem",
                lg: "1.4rem",
                xl: "1.5rem",
              }
            }}>{ubicacion}</Typography>
            <IconButton onClick={handleAddFavorite} disabled={es_favorito} sx={{ color: 'var(--accent)', p: 0, ml: 1 }}>
              <StarIcon sx={{ color: es_favorito ? 'var(--accent)' : 'inherit' }} />
            </IconButton>
          </Grid>
        </Grid>

        {/* Fecha de Publicación */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="body1" sx={{
            fontSize: {
              xs: "0.9rem",
              sm: "1.0rem",
              md: "1.1rem",
              lg: "1.2rem",
              xl: "1.3rem",
            }
          }}>
            <span style={{ marginRight: '8px' }}>📅</span> {formattedDate}
          </Typography>
        </Box>

        {/* Descripción del Puesto */}
        <Typography variant="h6" sx={{
          fontWeight: 'bold', mb: 1, fontSize: {
            xs: "1.1rem",
            sm: "1.2rem",
            md: "1.3rem",
            lg: "1.4rem",
            xl: "1.5rem",
          }
        }}>Descripción del puesto</Typography>
        <Typography variant="body1" sx={{
          mb: 3, whiteSpace: 'pre-wrap', fontSize: {
            xs: "0.9rem",
            sm: "1.0rem",
            md: "1.1rem",
            lg: "1.2rem",
            xl: "1.3rem",
          }
        }}>{descripcion}</Typography>

        {/* Requisitos */}
        <Typography variant="h6" sx={{
          fontWeight: 'bold', mb: 1, fontSize: {
            xs: "1.1rem",
            sm: "1.2rem",
            md: "1.3rem",
            lg: "1.4rem",
            xl: "1.5rem",
          }
        }}>Requisitos del puesto</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          {reqTags.map((req, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              sx={{
                textTransform: 'none',
                borderRadius: '4px',
                color: 'var(--text-dark)',
                borderColor: 'var(--text-dark)',
                cursor: 'default',
                fontSize: {
                  xs: "0.9rem",
                  sm: "1.0rem",
                  md: "1.1rem",
                  lg: "1.2rem",
                  xl: "1.3rem",
                }

              }}
            >
              {req}
            </Button>
          ))}
        </Box>

        {/* Salario y Modalidad */}
        <Typography variant="h6" sx={{
          fontWeight: 'bold', mb: 1, fontSize: {
            xs: "1rem",
            sm: "1.1rem",
            md: "1.2rem",
            lg: "1.3rem",
            xl: "1.4rem",
          }
        }}>Salario mensual estimado del puesto</Typography>
        <Typography variant="body1" sx={{
          mb: 3, fontSize: {
            xs: "0.9rem",
            sm: "1.0rem",
            md: "1.1rem",
            lg: "1.2rem",
            xl: "1.3rem",
          }
        }}>${formattedSalario(salario_estimado)}</Typography>

        <Typography variant="h6" sx={{
          fontWeight: 'bold', mb: 1, fontSize: {
            xs: "1rem",
            sm: "1.1rem",
            md: "1.2rem",
            lg: "1.3rem",
            xl: "1.4rem",
          }
        }}>Modalidad</Typography>
        <Typography variant="body1" sx={{
          mb: 4, fontSize: {
            xs: "0.9rem",
            sm: "1.0rem",
            md: "1.1rem",
            lg: "1.2rem",
            xl: "1.3rem",
          }
        }}>{modalidad || 'No especificada'}</Typography>

        {/* Botón de Postularse (Alineado a la derecha en la maqueta) */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={() => setShowContact(true)} // Mostrar modal de contacto
            sx={{
              bgcolor: 'var(--button-save)',
              color: 'white',
              textTransform: 'none',
              p: '10px 25px'
            }}
          >
            Postular
          </Button>
        </Box>

      </Box>

      {/* --- MODAL DE CONTACTO (Datos de contacto para postulación) --- */}
      <Dialog open={showContact} onClose={() => setShowContact(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{
            fontWeight: 'bold', 
          }}>Datos de contacto para postulación</Typography>
          <IconButton onClick={() => setShowContact(false)} size="small">×</IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" sx={{
              mb: 2, fontSize: {
                xs: "0.9rem",
                sm: "1.0rem",
                md: "1.1rem",
                lg: "1.2rem",
                xl: "1.3rem",
              }
            }}>
              <strong>Correo:</strong> <span style={{ textDecoration: 'underline' }}>{empresa?.correo_contacto || 'N/A'}</span>
            </Typography>
            <Typography variant="body1" sx={{
              mb: 2, fontSize: {
                xs: "0.9rem",
                sm: "1.0rem",
                md: "1.1rem",
                lg: "1.2rem",
                xl: "1.3rem",
              }
            }}>
              <strong>Teléfono:</strong> <span style={{ textDecoration: 'underline' }}>{empresa?.telefono || 'N/A'}</span>
            </Typography>
            <Typography variant="body1" sx={{
              fontSize: {
                xs: "0.9rem",
                sm: "1.0rem",
                md: "1.1rem",
                lg: "1.2rem",
                xl: "1.3rem",
              }
            }}>
              <strong>Sitio web:</strong> <a href={empresa?.sitio_web} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{empresa?.sitio_web || 'N/A'}</a>
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default VacanteDetail;