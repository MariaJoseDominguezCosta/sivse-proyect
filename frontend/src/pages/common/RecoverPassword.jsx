import React, { useState, useEffect } from 'react'; // Importar useEffect
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Importar useSearchParams
import axios from '../../utils/axiosConfig'; 
import { toast } from 'react-toastify'; 
import '../../assets/recoverPassword.css';

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
        width: '100%', 
        maxWidth: 350 // Tamaño fijo
    }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Recuperar Contraseña</Typography>

      {!showResetForm ? (
        // FORMULARIO DE ENVÍO DE EMAIL (Similar a la maqueta "Enviar enlace")
        <>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" variant="outlined" placeholder="Value" />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
            <Button className="btn-cancel" onClick={() => navigate('/')} sx={{ flexGrow: 1, mr: 1 }}>Cancelar</Button>
            <Button 
                variant="contained" 
                onClick={handleSendEmail} 
                sx={{ 
                    flexGrow: 1, 
                    bgcolor: 'var(--button-save)', // Negro
                    '&:hover': { bgcolor: 'var(--button-save)', opacity: 0.9 } 
                }}
            > 
                Enviar enlace 
            </Button>
          </Box>
        </>
      ) : (
        // FORMULARIO DE RESTABLECIMIENTO (Similar a la maqueta "Nueva contraseña")
        <>
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
        </>
      )}
    </Box>
  );
};

export default RecoverPassword;