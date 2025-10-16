// controllers/vacantesController.js
const Vacante = require('../models/Vacante');
const Empresa = require('../models/Empresa');
const Egresado = require('../models/Egresado');
const Notificacion = require('../models/Notificacion');
const sendEmail = require('../utils/email');
const io = require('../app').io; // Importa io

const aplicar = async (req, res) => {
    const vacanteId = req.params.id;
    const userId = req.user.id; // De authMiddleware

    try {
        const vacante = await Vacante.findByPk(vacanteId, { include: 'Empresa' });
        if (!vacante || vacante.estado !== 'Activa') {
        return res.status(400).json({ error: 'Vacante no disponible' });
        }
        const egresado = await Egresado.findOne({ where: { usuario_id: userId } });
        if (!egresado) {
        return res.status(400).json({ error: 'Egresado no encontrado' });
        }

        // Enviar email a empresa
        const emailText = `Egresado ${egresado.nombre} (${egresado.correo}) ha aplicado a la vacante "${vacante.titulo}".\nDetalles: ${egresado.puesto_actual || 'N/A'}, ${egresado.ubicacion || 'N/A'}.`;
        await sendEmail(vacante.Empresa.correo, `Nueva postulación a ${vacante.titulo}`, emailText);

        // Crear notificación in-app para admin (asumir admin user_id = 1 o query admins)
        await Notificacion.create({
        user_id: 1, // O busca admins
        mensaje: `Egresado ${egresado.nombre} aplicó a vacante ${vacante.titulo}`,
        });

        // Emitir WebSocket para real-time (Observer)
        io.emit('nueva_postulacion', { mensaje: `Nueva postulación: ${egresado.nombre} a ${vacante.titulo}` });

        res.status(200).json({ success: true, message: 'Postulación enviada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al postular' });
    }
};
const getAll = async (req, res) => {
    try {
        const { ubicacion, empresa, sector } = req.query; // Filtros
        let whereClause = {};
        if (ubicacion) whereClause.ubicacion = ubicacion;
        if (empresa) whereClause.empresa_id = empresa; // Asumir ID de empresa
        if (sector) whereClause.sector = sector; // Añadir campo sector si necesario

        const vacantes = await Vacante.findAll({
        where: whereClause,
        include: [{ model: Empresa, attributes: ['id', 'nombre', 'correo_contacto', 'telefono', 'sitio_web'] }],
        });
        res.status(200).json({ success: true, data: vacantes });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener vacantes' });
    }
};

const getById = async (req, res) => {
    try {
        const vacante = await Vacante.findByPk(req.params.id, {
        include: [{ model: Empresa, attributes: ['id', 'nombre', 'correo_contacto', 'telefono', 'sitio_web'] }],
        });
        if (!vacante) return res.status(404).json({ error: 'Vacante no encontrada' });
        res.status(200).json({ success: true, data: vacante });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener vacante' });
    }
};

const create = async (req, res) => {
    const { titulo, descripcion, requisitos, ubicacion, modalidad, salario_estimado, empresa_id, estado, fecha_publicacion } = req.body;
    if (!titulo || !descripcion || !empresa_id) return res.status(400).json({ error: 'Título, descripción y empresa_id son obligatorios' });
    if (descripcion.length < 10) return res.status(400).json({ error: 'Descripción mínima 10 caracteres' });
    if (requisitos && requisitos.length < 10) return res.status(400).json({ error: 'Requisitos mínimos 10 caracteres' });
    if (modalidad && !['Remoto', 'Presencial', 'Mixto'].includes(modalidad)) return res.status(400).json({ error: 'Modalidad inválida' });
    if (salario_estimado && (isNaN(salario_estimado) || salario_estimado < 0)) return res.status(400).json({ error: 'Salario debe ser un número positivo' });

    try {
        const empresa = await Empresa.findByPk(empresa_id);
        if (!empresa) return res.status(400).json({ error: 'Empresa_id no válida' });
        const nuevaVacante = await Vacante.create({ titulo, descripcion, requisitos, ubicacion, modalidad, salario_estimado, empresa_id, estado, fecha_publicacion });
        res.status(201).json({ success: true, data: nuevaVacante });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear vacante' });
    }
};

const update = async (req, res) => {
    const { titulo, descripcion, requisitos, ubicacion, modality, salario_estimado, empresa_id, estado, fecha_publicacion } = req.body;
    try {
        const vacante = await Vacante.findByPk(req.params.id);
        if (!vacante) return res.status(404).json({ error: 'Vacante no encontrada' });
        if (empresa_id) {
        const empresa = await Empresa.findByPk(empresa_id);
        if (!empresa) return res.status(400).json({ error: 'Empresa_id no válida' });
        }
        await vacante.update({ titulo, descripcion, requisitos, ubicacion, modality, salario_estimado, empresa_id, estado, fecha_publicacion });
        res.status(200).json({ success: true, data: vacante });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar vacante' });
    }
};

const deleteVacante = async (req, res) => {
    try {
        const vacante = await Vacante.findByPk(req.params.id);
        if (!vacante) return res.status(404).json({ error: 'Vacante no encontrada' });
        await vacante.destroy();
        res.status(200).json({ success: true, message: 'Vacante eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar vacante' });
    }
};

const toggleFavorite = async (req, res) => {
    try {
        const vacante = await Vacante.findByPk(req.params.id);
        if (!vacante) return res.status(404).json({ error: 'Vacante no encontrada' });
        vacante.es_favorito = !vacante.es_favorito;
        await vacante.save();
        res.status(200).json({ success: true, message: `Vacante ${vacante.es_favorito ? 'agregada' : 'eliminada'} de favoritos` });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar favorito' });
    }
};

module.exports = { getAll, getById, create, update, deleteVacante, toggleFavorite, aplicar };