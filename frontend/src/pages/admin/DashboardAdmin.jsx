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
      spacing={3}
      justifyContent="center"
      container
      sx={{
        display: { xs: "flex", sm: "grid", lg: "flex", xl: "flex" },
        justifyContent: "center",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: "10px" },
        top: {
          xs: "50px",
        },
        gridTemplateRows: { sm: "repeat(2, 1fr)" },
        gridTemplateColumns: { sm: "repeat(2, 1fr)" },
        justifyItems: "center",
        position: "relative",
        width: "auto",
        height: "auto",
        justifySelf: "center",
      }}
    >
      <Grid item>
        <Card
          sx={{
            width: {
              xs: "180px",
              sm: "220px",
              md: "250px",
            },
            height: {
              xs: "150px",
              sm: "180px",
              md: "200px",
              lg: "250px",
            },
            gap: { xs: "10px", sm: "15px", md: "20px", lg: "25px" },
            padding: {
              xs: "10px",
              sm: "12px",
              md: "14px",
              lg: "16px",
            },
            borderRadius: {
              xs: "16px",
              sm: "18px",
              md: "20px",
              lg: "22px",
            },
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            flexShrink: "1",
            backgroundColor: "rgba(245, 235, 235, 1)",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CardContent>
            <Avatar
              alt="Egresados"
              sx={{
                // 40px en móviles (xs), 80px en tablets/pc (md)

                width: {
                  xs: "30px",
                  sm: "80px",
                  md: "110px",
                  lg: "120px",
                },
                height: {
                  xs: "30px",
                  sm: "80px",
                  md: "110px",
                  lg: "120px",
                },
                justifySelf: "center",
              }}
            >
              <People
                sx={{
                  width: {
                    xs: "20px",
                    sm: "40px",
                    md: "60px",
                    lg: "80px",
                  },
                  height: {
                    xs: "20px",
                    sm: "40px",
                    md: "60px",
                    lg: "80px",
                  },
                }}
              />
            </Avatar>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: {
                  xs: "16px",
                  sm: "22px",
                  md: "24px",
                },
                color: "rgba(30, 30, 30, 1)",
                fontFamily: "Inter",
                fontWeight: "700",
                lineHeight: "1",
                fontStretch: "normal",
                alignSelf: "center",
              }}
            >
              {" "}
              Egresados Registrados
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: {
                  xs: "18px",
                  sm: "24px",
                  md: "26px",
                },
                color: "rgba(30, 30, 30, 1)",
                fontFamily: "Inter",
                fontWeight: "700",
                lineHeight: "1",
                fontStretch: "normal",
                alignSelf: "center",
              }}
            >
              {" "}
              {stats.egresados}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Card
          sx={{
            width: {
              xs: "180px",
              sm: "220px",
              md: "250px",
            },
            height: {
              xs: "150px",
              sm: "180px",
              md: "200px",
              lg: "250px",
            },
            gap: { xs: "10px", sm: "15px", md: "20px", lg: "25px" },
            padding: {
              xs: "10px",
              sm: "12px",
              md: "14px",
              lg: "16px",
            },
            borderRadius: {
              xs: "16px",
              sm: "18px",
              md: "20px",
              lg: "22px",
            },
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            flexShrink: 1,
            backgroundColor: "rgba(245, 235, 235, 1)",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CardContent>
            <Avatar
              alt="Empresas"
              sx={{
                // 40px en móviles (xs), 80px en tablets/pc (md)
                justifySelf: "center",
                width: {
                  xs: "30px",
                  sm: "80px",
                  md: "110px",
                  lg: "120px",
                },
                height: {
                  xs: "30px",
                  sm: "80px",
                  md: "110px",
                  lg: "120px",
                },
              }}
            >
              <Business
                sx={{
                  width: { xs: "20px", sm: "40px", md: "60px" },
                  height: { xs: "20px", sm: "40px", md: "60px" },
                }}
              />
            </Avatar>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: {
                  xs: "16px",
                  sm: "22px",
                  md: "24px",
                },
                color: "rgba(30, 30, 30, 1)",
                fontFamily: "Inter",
                fontWeight: "700",
                lineHeight: "1",
                fontStretch: "normal",
                alignSelf: "center",
              }}
            >
              Empresas
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: {
                  xs: "18px",
                  sm: "24px",
                  md: "26px",
                },
                color: "rgba(30, 30, 30, 1)",
                fontFamily: "Inter",
                fontWeight: "700",
                lineHeight: "1",
                fontStretch: "normal",
                alignSelf: "center",
              }}
            >
              {stats.empresas}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid
        item
        sx={{
          gridColumnEnd: { sm: "span 2", lg: "span1" },
        }}
      >
        <Card
          sx={{
            width: {
              xs: "180px",
              sm: "220px",
              md: "250px",
            },
            height: {
              xs: "150px",
              sm: "180px",
              md: "200px",
              lg: "250px",
            },
            gap: { xs: "10px", sm: "15px", md: "20px", lg: "25px" },
            padding: {
              xs: "10px",
              sm: "12px",
              md: "14px",
              lg: "16px",
            },
            borderRadius: {
              xs: "16px",
              sm: "18px",
              md: "20px",
              lg: "22px",
            },
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            backgroundColor: "rgba(245, 235, 235, 1)",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CardContent>
            <Avatar
              sx={{
                // 40px en móviles (xs), 80px en tablets/pc (md)
                justifySelf: "center",
                width: {
                  xs: "30px",
                  sm: "80px",
                  md: "110px",
                  lg: "120px",
                },
                height: {
                  xs: "30px",
                  sm: "80px",
                  md: "110px",
                  lg: "120px",
                },
              }}
            >
              <Work
                sx={{
                  width: { xs: "20px", sm: "50px", md: "60px" },
                  height: { xs: "30px", sm: "50px", md: "60px" },
                }}
              />
            </Avatar>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: {
                  xs: "16px",
                  sm: "22px",
                  md: "24px",
                },
                color: "rgba(30, 30, 30, 1)",
                fontFamily: "Inter",
                fontWeight: "700",
                lineHeight: "1",
                fontStretch: "normal",
                alignSelf: "center",
              }}
            >
              Vacantes Activos
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: {
                  xs: "18px",
                  sm: "24px",
                  md: "26px",
                },
                color: "rgba(30, 30, 30, 1)",
                fontFamily: "Inter",
                fontWeight: 700,
                lineHeight: 1,
                fontStretch: "normal",
                alignSelf: "center",
              }}
            >
              {stats.vacantes}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
