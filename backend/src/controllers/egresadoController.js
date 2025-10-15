// controllers/egresadoController.js
const { Egresado, Vacante } = require('../models');

exports.getProfile = async (req, res) => {
    const egresado = await Egresado.findOne({ where: { user_id: req.user.userId } });
    if (!egresado) return res.status(404).json({ error: 'Perfil no encontrado' });
    res.json(egresado);
};

exports.updateProfile = async (req, res) => {
  // Maneja upload foto con multer si needed
    const data = req.body; // Valida con Joi si quieres
    await Egresado.update(data, { where: { user_id: req.user.userId } });
    res.json({ message: 'Perfil actualizado' });
    };

exports.getRecommendedVacantes = async (req, res) => {
    const vacantes = await Vacante.findAll({ limit: 3 }); // Lógica de recomendación simple
    res.json(vacantes);
};