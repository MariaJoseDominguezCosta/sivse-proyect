import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Grid, Card, CardContent, Paper, Chip, Dialog, DialogTitle, DialogContent } from '@mui/material'; // AGREGAR IMPORTS
import { useParams } from 'react-router-dom';
import api from '../../utils/axiosConfig';
import StarIcon from '@mui/icons-material/Star';
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
      return <Box sx={{ p: 3 }}>{loading ? <Typography>Cargando...</Typography> : <Typography>Vacante no encontrada.</Typography>}</Box>;
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
    <Box className="form-container" sx={{ maxWidth: '700px', margin: 'auto', p: 0 }}>
      
      {/* Contenedor Principal con Fondo Gris/Rosado */}
      <Box sx={{ p: 4, bgcolor: 'var(--card-bg)', borderRadius: '10px', boxShadow: 3 }}>

        <Grid container justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          {/* Título y Empresa */}
          <Grid item>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{titulo}</Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>{empresa?.razon_social}</Typography>
          </Grid>

          {/* Ubicación y Botón de Favorito */}
          <Grid item sx={{ textAlign: 'right' }}>
            <Typography variant="h6">{ubicacion}</Typography>
            <IconButton onClick={handleAddFavorite} disabled={es_favorito} sx={{ color: 'var(--accent)', p: 0, ml: 1 }}>
                <StarIcon sx={{ color: es_favorito ? 'var(--accent)' : 'inherit' }} />
            </IconButton>
          </Grid>
        </Grid>

        {/* Fecha de Publicación */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="body1">
            <span style={{ marginRight: '8px' }}>📅</span> {formattedDate}
          </Typography>
        </Box>

        {/* Descripción del Puesto */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Descripción del puesto</Typography>
        <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>{descripcion}</Typography>

        {/* Requisitos */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Requisitos del puesto</Typography>
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
                    borderColor: 'var(--text-dark)'
                }}
            >
              {req}
            </Button>
          ))}
        </Box>

        {/* Salario y Modalidad */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Salario mensual estimado del puesto</Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>${formattedSalario(salario_estimado)}</Typography>
        
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Modalidad</Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>{modalidad || 'No especificada'}</Typography>
        
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
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Datos de contacto para postulación</Typography>
            <IconButton onClick={() => setShowContact(false)} size="small">×</IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Correo:</strong> <span style={{ textDecoration: 'underline' }}>{empresa?.correo_contacto || 'N/A'}</span>
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Teléfono:</strong> <span style={{ textDecoration: 'underline' }}>{empresa?.telefono || 'N/A'}</span>
            </Typography>
            <Typography variant="body1">
              <strong>Sitio web:</strong> <a href={empresa?.sitio_web} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{empresa?.sitio_web || 'N/A'}</a>
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default VacanteDetail;