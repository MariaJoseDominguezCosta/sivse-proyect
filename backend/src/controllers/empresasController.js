const { Op } = require('sequelize');
const Empresa = require('../models/Empresa');
const Vacante = require('../models/Vacante');  // Para chequeo de integridad

// GET /api/empresas - Lista todas con filtros, paginación y orden
exports.getAllEmpresas = async (req, res) => {
    try {
        const { sector, nombre, page = 1, limit = 10, sort = 'nombre', order = 'ASC' } = req.query;
        const where = {};
        if (sector) where.sector = sector;
        if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };  // Búsqueda partial match

        const empresas = await Empresa.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [[sort, order]],
        });

        res.status(200).json({
        success: true,
        data: empresas.rows,
        total: empresas.count,
        page: parseInt(page),
        limit: parseInt(limit),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar empresas', error: error.message });
    }
};

// GET /api/empresas/:id - Detalle de empresa
exports.getEmpresaById = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
        res.status(200).json({ success: true, data: empresa });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener empresa', error: error.message });
    }
};

// POST /api/empresas - Crear empresa (solo admin)
exports.createEmpresa = async (req, res) => {
    try {
        const { razon_social, sector, tipo_convenio, direccion, correo, telefono, sitio_web } = req.body;
        if (!razon_social || !sector || !tipo_convenio || !direccion || !correo || !telefono) {
        return res.status(400).json({ success: false, message: 'Campos requeridos faltantes' });
        }
        // Validaciones adicionales (Sequelize maneja isEmail, isUrl, etc.)
        const existing = await Empresa.findOne({ where: { razon_social } });
        if (existing) return res.status(400).json({ success: false, message: 'Razón social ya existe' });

        const empresa = await Empresa.create({ razon_social, sector, tipo_convenio, direccion, correo, telefono, sitio_web });
        res.status(201).json({ success: true, data: empresa });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear empresa', error: error.message });
    }
};

exports.updateEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });

        const { razon_social, sector, tipo_convenio, direccion, correo, telefono, sitio_web } = req.body;
        await empresa.update({ razon_social, sector, tipo_convenio, direccion, correo, telefono, sitio_web });
        res.status(200).json({ success: true, data: empresa });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar empresa', error: error.message });
    }
};

// DELETE /api/empresas/:id - Eliminar empresa (solo admin, con chequeo de vacantes)
exports.deleteEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });

        // Chequeo de integridad: No eliminar si tiene vacantes asociadas
        const vacantes = await Vacante.count({ where: { empresaId: req.params.id } });
        if (vacantes > 0) {
        return res.status(400).json({ success: false, message: 'No se puede eliminar: Tiene vacantes asociadas' });
        }

        await empresa.destroy();
        res.status(200).json({ success: true, message: 'Empresa eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar empresa', error: error.message });
    }
};

// GET /api/empresas/:id/vacantes - Listar vacantes por empresa
exports.getVacantesByEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id, {
        include: [{ model: Vacante, as: 'vacantes' }],
        });
        if (!empresa) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
        res.status(200).json({ success: true, data: empresa.vacantes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar vacantes', error: error.message });
    }
};