import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Avatar } from "@mui/material";
import { People, Business, Work } from "@mui/icons-material";
import axios from "../../utils/axiosConfig";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    egresados: 0,
    empresas: 0,
    vacantes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No estás autenticado. Inicia sesión.");
        return;
      }
      try {
        const res = await axios.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <Grid
      container
      spacing={3}
      justifyContent="center"
      className="dashboard-cards"
    >
      <Grid item>
        <Card className="card">
          <CardContent>
            <Avatar>
              <People/>
            </Avatar>
            <Typography>Egresados Registrados</Typography>
            <Typography variant="h3">{stats.egresados}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Card className="card">
          <CardContent>
            <Avatar>
              <Business />
            </Avatar>
            <Typography>Empresas</Typography>
            <Typography variant="h3">{stats.empresas}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Card className="card">
          <CardContent>
            <Avatar>
              <Work />
            </Avatar>
            <Typography>Vacantes Activos</Typography>
            <Typography variant="h3">{stats.vacantes}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
