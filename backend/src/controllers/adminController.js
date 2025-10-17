// controllers/adminController.js
const { Egresado, Empresa, Vacante } = require('../models');

exports.getStats = async (req, res) => {
    try {
        // Conteo de egresados (usa User con role='egresado' o Egresado)
        const egresadosCount = await User.count({ where: { role: 'egresado' } });  // Alternativa: await Egresado.count()

        // Conteo de empresas
        const empresasCount = await Empresa.count();

        // Conteo de vacantes (sin filtro 'activo' si causa error; agrega if needed)
        const vacantesCount = await Vacante.count();  // Quita { where: { activo: true } } temporalmente

        const stats = { egresados: egresadosCount, empresas: empresasCount, vacantes: vacantesCount };
        res.json(stats);
    } catch (err) {
        console.error('Error en getStats:', err);  // Log para depuración
        res.status(500).json({ error: 'Error al cargar estadísticas' });
    }
};