// controllers/vacantesController.js
const Vacante = require('../models/Vacante');
const Empresa = require('../models/Empresa');

// Obtener todas las vacantes (incluye empresa y todos los campos relevantes)
const getAll = async (req, res) => {
    try {
        const vacantes = await Vacante.findAll({
        include: [{ model: Empresa, attributes: ['id', 'nombre'] }],
        });
        res.status(200).json({ success: true, data: vacantes });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener vacantes' });
    }
};

// Obtener por ID (incluye todos los detalles para vista de detalles)
const getById = async (req, res) => {
    try {
        const vacante = await Vacante.findByPk(req.params.id, {
        include: [{ model: Empresa, attributes: ['id', 'nombre'] }],
        });
        if (!vacante) {
        return res.status(404).json({ error: 'Vacante no encontrada' });
        }
        res.status(200).json({ success: true, data: vacante });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener vacante' });
    }
};

// Crear vacante (cubriendo todos los campos del maquetado y BD)
const create = async (req, res) => {
    const {
        titulo, descripcion, requisitos, ubicacion, modalidad, salario_estimado,
        empresa_id, estado, fecha_publicacion
    } = req.body;

    // Validaciones obligatorias (basado en maquetado y BD)
    if (!titulo || !descripcion || !empresa_id) {
        return res.status(400).json({ error: 'Título, descripción y empresa_id son obligatorios' });
    }
    if (descripcion.length < 10) {
        return res.status(400).json({ error: 'Descripción debe tener al menos 10 caracteres' });
    }
    // Validaciones adicionales para campos del maquetado
    if (requisitos && requisitos.length < 10) {
        return res.status(400).json({ error: 'Requisitos deben tener al menos 10 caracteres si se proporcionan' });
    }
    const modalidadesPermitidas = ['Remoto', 'Presencial', 'Mixto'];
    if (modalidad && !modalidadesPermitidas.includes(modalidad)) {
        return res.status(400).json({ error: 'Modalidad debe ser Remoto, Presencial o Mixto' });
    }

    try {
        // Validar empresa existe
        const empresa = await Empresa.findByPk(empresa_id);
        if (!empresa) {
        return res.status(400).json({ error: 'Empresa_id no válida' });
        }
        const nuevaVacante = await Vacante.create({
        titulo,
        descripcion,
        requisitos,
        ubicacion,
        modalidad,
        salario_estimado,
        empresa_id,
        estado: estado || 'Activa',
        fecha_publicacion: fecha_publicacion || new Date(),
        });
        res.status(201).json({ success: true, data: nuevaVacante });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear vacante' });
    }
    };

    // Actualizar vacante (similar a create, permite updates parciales)
    const update = async (req, res) => {
    const {
        titulo, descripcion, requisitos, ubicacion, modalidad, salario_estimado,
        empresa_id, estado, fecha_publicacion
    } = req.body;

    try {
        const vacante = await Vacante.findByPk(req.params.id);
        if (!vacante) {
        return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        // Validaciones si se proporcionan
        if (descripcion && descripcion.length < 10) {
        return res.status(400).json({ error: 'Descripción debe tener al menos 10 caracteres' });
        }
        if (requisitos && requisitos.length < 10) {
        return res.status(400).json({ error: 'Requisitos deben tener al menos 10 caracteres' });
        }
        const modalidadesPermitidas = ['Remoto', 'Presencial', 'Mixto'];
        if (modalidad && !modalidadesPermitidas.includes(modalidad)) {
        return res.status(400).json({ error: 'Modalidad debe ser Remoto, Presencial o Mixto' });
        }
        if (empresa_id) {
        const empresa = await Empresa.findByPk(empresa_id);
        if (!empresa) {
            return res.status(400).json({ error: 'Empresa_id no válida' });
        }
        }

        await vacante.update({
        titulo: titulo || vacante.titulo,
        descripcion: descripcion || vacante.descripcion,
        requisitos: requisitos !== undefined ? requisitos : vacante.requisitos,
        ubicacion: ubicacion !== undefined ? ubicacion : vacante.ubicacion,
        modalidad: modalidad !== undefined ? modalidad : vacante.modalidad,
        salario_estimado: salario_estimado !== undefined ? salario_estimado : vacante.salario_estimado,
        empresa_id: empresa_id || vacante.empresa_id,
        estado: estado || vacante.estado,
        fecha_publicacion: fecha_publicacion || vacante.fecha_publicacion,
        });
        res.status(200).json({ success: true, data: vacante });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar vacante' });
    }
};

// Eliminar vacante (sin cambios, respeta CASCADE en BD)
const deleteVacante = async (req, res) => {
    try {
        const vacante = await Vacante.findByPk(req.params.id);
        if (!vacante) {
        return res.status(404).json({ error: 'Vacante no encontrada' });
        }
        await vacante.destroy();
        res.status(200).json({ success: true, message: 'Vacante eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar vacante' });
    }
};

module.exports = { getAll, getById, create, update, deleteVacante };