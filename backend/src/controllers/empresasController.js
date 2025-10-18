const { Op } = require('sequelize');
const Empresa = require('../models/Empresa');
const Vacante = require('../models/Vacante');

exports.getAllEmpresas = async (req, res) => {
    try {
        const { sector, tipo_convenio, razon_social, page = 1, limit = 10, sort = 'razon_social', order = 'ASC' } = req.query;
        const where = {};
        if (sector) where.sector = sector;
        if (tipo_convenio) where.tipo_convenio = tipo_convenio;
        if (razon_social) where.razon_social = { [Op.like]: `%${razon_social}%` };

        const empresas = await Empresa.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [[sort, order]],
        });

        res.status(200).json({ success: true, data: empresas.rows, total: empresas.count, page, limit, message: 'Empresas cargadas exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar empresas: ' + error.message });
    }
};

exports.getEmpresaById = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
        res.status(200).json({ success: true, data: empresa, message: 'Empresa cargada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener empresa: ' + error.message });
    }
};

exports.createEmpresa = async (req, res) => {
    try {
        const { razon_social, sector, direccion, correo, telefono, tipo_convenio, sitio_web } = req.body;
        if (!razon_social || !sector || !direccion || !correo || !telefono || !tipo_convenio) {
        return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
        }
        if (razon_social.length < 3) {
        return res.status(400).json({ success: false, message: 'Razón social debe tener al menos 3 caracteres' });
        }

        const existing = await Empresa.findOne({ where: { razon_social } });
        if (existing) return res.status(400).json({ success: false, message: 'Razón social ya existe' });

        const empresa = await Empresa.create({ razon_social, sector, direccion, correo, telefono, tipo_convenio, sitio_web });
        res.status(201).json({ success: true, data: empresa, message: 'Empresa creada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear empresa: ' + error.message });
    }
};

exports.updateEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });

        const { razon_social, sector, direccion, correo, telefono, tipo_convenio, sitio_web } = req.body;
        if (razon_social && razon_social.length < 3) {
        return res.status(400).json({ success: false, message: 'Razón social debe tener al menos 3 caracteres' });
        }

        await empresa.update({ razon_social, sector, direccion, correo, telefono, tipo_convenio, sitio_web });
        res.status(200).json({ success: true, data: empresa, message: 'Empresa actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar empresa: ' + error.message });
    }
};

exports.deleteEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });

        const vacantes = await Vacante.count({ where: { empresaId: req.params.id } });
        if (vacantes > 0) {
        return res.status(400).json({ success: false, message: 'No se puede eliminar: Tiene vacantes asociadas' });
        }

        await empresa.destroy();
        res.status(200).json({ success: true, message: 'Empresa eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar empresa: ' + error.message });
    }
};

exports.getVacantesByEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id, {
        include: [{ model: Vacante, as: 'vacantes' }],
        });
        if (!empresa) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
        res.status(200).json({ success: true, data: empresa.vacantes, message: 'Vacantes cargadas exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar vacantes: ' + error.message });
    }
};