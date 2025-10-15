// controllers/adminController.js
const { Egresado, Empresa, Vacante } = require('../models');

exports.getStats = async (req, res) => {
    const stats = {
        egresados: await Egresado.count(),
        empresas: await Empresa.count(),
        vacantes: await Vacante.count({ where: { activo: true } }), // Asume campo activo
    };
    res.json(stats);
};