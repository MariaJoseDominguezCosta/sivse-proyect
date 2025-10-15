// src/controllers/dashboardController.js - Controladores para dashboards protegidos
const adminDashboard = (req, res) => {
  // Lógica futura: Cargar datos admin (e.g., lista de egresados)
    res.json({ message: "Bienvenido al dashboard de Admin" });
};

const egresadoDashboard = (req, res) => {
  // Lógica futura: Cargar datos egresado (e.g., vacantes recomendadas)
    res.json({ message: "Bienvenido al dashboard de Egresado" });
};

module.exports = { adminDashboard, egresadoDashboard };