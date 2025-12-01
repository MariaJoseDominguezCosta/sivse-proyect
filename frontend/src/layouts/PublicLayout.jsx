import React from 'react';
import { Box } from '@mui/material';
import PublicHeader from '../components/common/PublicHeader';

const PublicLayout = ({ children }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#E1F2FF', // var(--primary-light)
    }}>
      <PublicHeader />
      <Box sx={{
        flexGrow: 1, // Ocupa el espacio restante
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // Centra el contenido verticalmente
        padding: 3,
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default PublicLayout;