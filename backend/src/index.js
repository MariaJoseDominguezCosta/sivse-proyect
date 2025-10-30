// src/index.js - Archivo principal del servidor (MVC: Punto de entrada)
require('dotenv').config(); // Carga variables de entorno
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/database'); // Conexión DB
const egresadoRoutes = require('./routes/egresadoRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Ajusta al frontend (React) en desarrollo
    methods: ['GET', 'POST'],
  },
});
const PORT = process.env.PORT || 5000;

// Middleware básico
app.use(helmet()); // Seguridad contra vulnerabilidades comunes
app.use(cors()); // Permite peticiones cross-origin (para frontend)
app.use(bodyParser.json()); // Parsea JSON en req.body

// Rutas (asegúrate de incluir todas)
app.use('/api/auth', require('./routes/authRoutes')); // Rutas públicas (registro/login)
app.use('/api/egresado', egresadoRoutes); 
app.use('/api/admin', adminRoutes);


// Configuración de Socket.io
io.on('connection', (socket) => {
  console.log(`Usuario conectado a Socket.io a las ${new Date().toLocaleString('es-MX', { timeZone: 'America/Chicago' })}`);
  socket.on('disconnect', () => {
    console.log(`Usuario desconectado a las ${new Date().toLocaleString('es-MX', { timeZone: 'America/Chicago' })}`);
  });
});

// Exporta io para usarlo en controllers
app.set('io', io);

// Sincronizar DB y arrancar servidor
sequelize.sync({ alter: true, force: false }) // Sincroniza modelos con DB (usa { force: true } solo en dev para resetear)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Servidor backend corriendo en http://localhost:${PORT} a las ${new Date().toLocaleString('es-MX', { timeZone: 'America/Chicago' })}`);
    });
  })
  .catch(err => {
    console.error(`Error al conectar DB a las ${new Date().toLocaleString('es-MX', { timeZone: 'America/Chicago' })}:`, err);
  });

