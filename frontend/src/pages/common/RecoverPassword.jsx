import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const RecoverPassword = () => {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [formData, setFormData] = useState({ code: '', newPassword: '' });
  const navigate = useNavigate();

  const handleSendCode = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/recover`, { email });
      setCodeSent(true);
    } catch (err) {
      console.error('Error sending code', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/reset`, { email, ...formData });
      navigate('/');
    } catch (err) {
      console.error('Reset error', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
      <Typography variant="h4">Recuperar Contraseña</Typography>
      {!codeSent ? (
        <>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
          <Button variant="contained" onClick={handleSendCode} fullWidth> Enviar Código </Button>
        </>
      ) : (
        <>
          <TextField label="Código" name="code" value={formData.code} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Nueva Contraseña" name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} fullWidth margin="normal" />
          <Button variant="contained" onClick={handleReset} fullWidth> Resetear </Button>
        </>
      )}
    </Box>
  );
};

export default RecoverPassword;