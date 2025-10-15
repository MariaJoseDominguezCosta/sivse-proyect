// src/index.js - Archivo principal del servidor (MVC: Punto de entrada)
require('dotenv').config(); // Carga variables de entorno
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database'); // Conexión DB

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware básico
app.use(helmet()); // Seguridad contra vulnerabilidades comunes
app.use(cors()); // Permite peticiones cross-origin (para frontend)
app.use(bodyParser.json()); // Parsea JSON en req.body

// Rutas (asegúrate de incluir todas)
app.use('/api/auth', require('./routes/authRoutes')); // Rutas públicas (registro/login)
app.use('/api', require('./routes/dashboardRoutes')); // Rutas protegidas (dashboards)
app.use('/api/empresas', require('./routes/empresasRoutes')); // Rutas de empresas

// Sincronizar DB y arrancar servidor
sequelize.sync() // Sincroniza modelos con DB (usa { force: true } solo en dev para resetear)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Error al conectar DB:', err));