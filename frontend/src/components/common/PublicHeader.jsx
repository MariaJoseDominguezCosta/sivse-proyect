import React from 'react';

const PublicHeader = () => {
  return (
    // Usa estilos de tu App.css o estilos inline para el azul oscuro
    <header style={{
        backgroundColor: '#003366', // Azul oscuro similar a tu sidebar
        color: 'white',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Placeholder para logo TecNM */}
        <img src="/logo-tecnologico.png" alt="TecNM" style={{ height: '50px', marginRight: '15px' }} />
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>SIVSE</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Placeholder para logo Comitán */}
        <img src="/logo-tecnologico-comitan-removebg-preview.png" alt="Comitán" style={{ height: '90px' }} />
      </div>
    </header>
  );
};

export default PublicHeader;