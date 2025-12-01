// src/layouts/EgresadoLayout.jsx
import React from 'react';
import SectionBanner from '../components/common/SectionBanner';
import SidebarEgresado from '../components/egresados/SidebarEgresado';
import { Outlet } from 'react-router-dom';

// El componente EgresadoLayout recibe el título de App.jsx, aunque su
// implementación original dentro de App.jsx mezclaba props y children.
// Adoptamos el patrón de AdminLayout para consistencia.
const EgresadoLayout = ({ children, title }) => { 
  return (
    <div className="admin-layout">
      <div className="admin-body">
        <SidebarEgresado />
        <main className="admin-content">
          {/* Se integra el SectionBanner para el título */}
          <SectionBanner title={title || 'SIVSE'} />
          <div className="page-padding">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EgresadoLayout;