import React from 'react';
import { Box } from '@mui/material';
import SidebarEgresado from '../components/egresados/SidebarEgresado';
import Header from '../components/common/Header';
import SectionBanner from '../components/common/SectionBanner';


const EgresadoLayout = ({ children, title }) => {
  return (
    <div className="egresado-layout">
      <Header userRole="egresado" />
      <div className="egresado-body">
        <SidebarEgresado />
        <main className="egresado-content">
          <SectionBanner title={title} />
          <div className="page-padding">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EgresadoLayout;