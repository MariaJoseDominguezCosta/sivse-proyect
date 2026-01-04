import React from 'react';
import '../../assets/publicHeader.css';

const PublicHeader = () => {
  return (
    // Usa estilos de tu App.css o estilos inline para el azul oscuro
    <header className='header-elm'>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Placeholder para logo TecNM */}
        <img src="/logo-tecnologico.png" alt="TecNM" className='image5-elm2' />
      </div>
      <h1 className='text'>SIVSE</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Placeholder para logo Comitán */}
        <img src="/logo-tecnologico-comitan-removebg-preview.png" alt="Comitán" className='image5-elm1' />
      </div>
    </header>
  );
};

export default PublicHeader;