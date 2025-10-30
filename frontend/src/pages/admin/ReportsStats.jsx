import React from 'react';
import { Grid, Button } from '@mui/material';
import { CSVLink } from 'react-csv'; // Requiere npm install react-csv
import Typography from '@mui/material/Typography';

const ReportsStats = () => {
  // Asume datos mock o fetch si hay endpoint para reportes detallados
  const egresadosData = []; // Fetch from API if needed
  const empresasData = [];
  const vacantesData = [];

  return (
    <Grid container spacing={3} className="dashboard-cards">
      <Grid item>
        <CSVLink data={egresadosData} filename="egresados_por_generacion.csv">
          <Button className="btn-save">Generar</Button>
        </CSVLink>
        <Typography>Egresados por generación</Typography>
      </Grid>
      <Grid item>
        <CSVLink data={empresasData} filename="empresas_por_sector.csv">
          <Button className="btn-save">Generar</Button>
        </CSVLink>
        <Typography>Empresas por sector</Typography>
      </Grid>
      <Grid item>
        <CSVLink data={vacantesData} filename="vacantes_activas.csv">
          <Button className="btn-save">Generar</Button>
        </CSVLink>
        <Typography>Vacantes Activos</Typography>
      </Grid>
    </Grid>
  );
};

export default ReportsStats;