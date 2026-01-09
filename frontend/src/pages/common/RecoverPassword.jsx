import React, { useState, useEffect } from 'react'; // Importar useEffect
import { Box, Button, Link, TextField, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Importar useSearchParams
import axios from '../../utils/axiosConfig';
import { toast } from 'react-toastify';


const RecoverPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook para leer parámetros de URL
  const urlToken = searchParams.get('token'); // Obtener el token de la URL: /recover?token=xyz

  const [email, setEmail] = useState('');
  const showResetForm = !!urlToken; // Mostrar formulario de reset si hay token en URL

  // Estado del formulario (ajustado para contener el token de la URL)
  const [formData, setFormData] = useState({
    token: urlToken || '', // Inicializar token con el valor de la URL
    newPassword: '',
    confirmPassword: ''
  });

  // Sincronizar formData si el token se carga después del render inicial
  useEffect(() => {
    if (urlToken) {
      setFormData(prev => {
        if (prev.token === urlToken) return prev;
        return { ...prev, token: urlToken };
      });
    }
  }, [urlToken]);


  const handleSendEmail = async () => { // Renombrado de handleSendCode a handleSendEmail
    try {
      const res = await axios.post('/auth/forgot-password', { email });
      toast.info(res.data.message || 'Enlace de restablecimiento enviado.');
    } catch (err) {
      console.error('Error sending email', err);
      toast.error(err.response?.data?.error || 'Error al enviar el enlace. Revisa tu email.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Endpoint es /auth/reset-password
      await axios.post('/auth/reset-password', {
        token: formData.token, // Usamos el token que vino de la URL
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      navigate('/');
      toast.success('Contraseña restablecida con éxito. Inicia sesión.');
    } catch (err) {
      console.error('Reset error', err);
      toast.error(err.response?.data?.error || 'Error al restablecer la contraseña.');
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      p: 4,
      bgcolor: 'white',
      borderRadius: 2,
      boxShadow: 3,
      position: 'relative',
      maxWidth: 300 // Tamaño fijo
    }}>
      <Typography variant="h5" sx={{ mb: 1 }}>Recuperar Contraseña</Typography>

      {!showResetForm ? (
        // FORMULARIO DE ENVÍO DE EMAIL (Similar a la maqueta "Enviar enlace")
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" variant="outlined" placeholder="Enter your email" />
          <Box sx={{ display: 'flex', justifyContent: 'center', width: 'auto', mt: 2, gap: "10px" }}>
            <Button variant="outlined" onClick={() => navigate('/')} sx={{
              p: {
                xs: 1,
              },
              color: "rgba(30, 30, 30, 1)",
              borderColor: "rgba(118, 118, 118, 1)",
            }}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleSendEmail}
              sx={{
                p: { xs: 1 },
                bgcolor: 'var(--button-save)', // Negro
                '&:hover': { bgcolor: 'var(--button-save)', opacity: 0.9 }
              }}
            >
              Enviar enlace
            </Button>
          </Box>
        </Box>
      ) : (
        // FORMULARIO DE RESTABLECIMIENTO (Similar a la maqueta "Nueva contraseña")
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
          <Typography variant="subtitle1" sx={{ alignSelf: 'flex-start', mt: 1, mb: 1 }}>Nueva contraseña</Typography>
          <TextField
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            placeholder="Value"
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" sx={{ alignSelf: 'flex-start', mb: 1 }}>Confirmar nueva contraseña</Typography>
          <TextField
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            placeholder="Value"
          />

          <Button
            variant="contained"
            onClick={handleReset}
            fullWidth
            sx={{
              mt: 3,
              bgcolor: 'var(--button-save)',
              '&:hover': { bgcolor: 'var(--button-save)', opacity: 0.9 }
            }}
          >
            Restablecer
          </Button>
          <Link href="/" variant="body2" sx={{ mt: 2, fontSize: '0.9rem' }}>
            Volver a Iniciar Sesión
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default RecoverPassword;