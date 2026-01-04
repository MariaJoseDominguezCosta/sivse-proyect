// src/layouts/EgresadoLayout.jsx
import React from 'react';
import SectionBanner from '../components/common/SectionBanner';
import SidebarEgresado from '../components/egresados/SidebarEgresado';
import "../assets/adminLayout.css";

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
          <SectionBanner title={title } />
          <div className="page-padding">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EgresadoLayout;