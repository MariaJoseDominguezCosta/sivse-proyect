// src/config/database.js - Configuración de conexión a la base de datos
require("dotenv").config(); // Carga las variables de entorno desde .env
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos (e.g., sivse)
  process.env.DB_USER, // Usuario de la base de datos (e.g., postgres)
  process.env.DB_PASSWORD, // Contraseña del usuario (e.g., yourpassword)
  {
    host: process.env.DB_HOST, // Host de la base de datos (e.g., localhost)
    port: process.env.DB_PORT, // Puerto (e.g., 5432)
    dialect: "postgres", // Dialecto de la base de datos
    logging: false, // Desactiva los logs SQL en consola (activa para depuración: console.log)
    pool: {
      max: 5, // Máximo de conexiones en el pool
      min: 0, // Mínimo de conexiones en el pool
      acquire: 30000, // Tiempo máximo en ms para adquirir una conexión
      idle: 10000, // Tiempo máximo en ms que una conexión puede estar inactiva
    },
  }
);

// Prueba la conexión
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexión a la base de datos establecida correctamente.");
    } catch (error) {
        console.error("No se pudo conectar a la base de datos:", error);
    }
})();

module.exports = sequelize;
