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
        const { nombre, sector, contacto, email, telefono, direccion, web, tipo_convenio } = req.body;
        // Validaciones básicas (más en middleware si es necesario)
        if (!nombre || !sector || !contacto || !email || !telefono || !direccion || !web || !tipo_convenio) {
            return res.status(400).json({ success: false, message: 'Campos requeridos: nombre, sector, contacto, email, telefono, direccion, web, tipo_convenio' });
        }
        if (nombre.length < 3) {
        return res.status(400).json({ success: false, message: 'Nombre debe tener al menos 3 caracteres' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Email inválido' });
        }
        if (!/^\+?[0-9]{7,15}$/.test(telefono)) {
        return res.status(400).json({ success: false, message: 'Teléfono inválido' });
        }
        if (telefono.length !== 10) {
        return res.status(400).json({ success: false, message: 'Teléfono debe tener 10 dígitos' });
        }

        // Chequea unicidad (Sequelize lo maneja, pero agregamos chequeo explícito)
        const existing = await Empresa.findOne({ where: { nombre } });
        if (existing) return res.status(400).json({ success: false, message: 'Nombre de empresa ya existe' });

        const existingEmail = await Empresa.findOne({ where: { email } });
        if (existingEmail) return res.status(400).json({ success: false, message: 'Email de empresa ya existe' });

        const existingTelefono = await Empresa.findOne({ where: { telefono } });
        if (existingTelefono) return res.status(400).json({ success: false, message: 'Teléfono de empresa ya existe' });

        const existingWeb = await Empresa.findOne({ where: { web } });
        if (existingWeb) return res.status(400).json({ success: false, message: 'Web de empresa ya existe' });

        const empresa = await Empresa.create({ nombre, sector, contacto, email, telefono, direccion, web, tipo_convenio });
        res.status(201).json({ success: true, data: empresa });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear empresa', error: error.message });
    }
};

// PUT /api/empresas/:id - Editar empresa (solo admin)
exports.updateEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });

        const { nombre, sector, contacto, email, telefono, direccion, web, tipo_convenio } = req.body;
        if (nombre && nombre.length < 3) {
        return res.status(400).json({ success: false, message: 'Nombre debe tener al menos 3 caracteres' });
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Email inválido' });
        }

        if (telefono && !/^\+?[0-9]{7,15}$/.test(telefono)) {
        return res.status(400).json({ success: false, message: 'Teléfono inválido' });
        }

        if (telefono && telefono.length !== 10) {
        return res.status(400).json({ success: false, message: 'Teléfono debe tener 10 dígitos' });
        }

        if (web && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(web)) {
        return res.status(400).json({ success: false, message: 'Web inválida' });
        }

        // Chequea unicidad si se están cambiando campos únicos
        if (nombre && nombre !== empresa.nombre) {
        const existing = await Empresa.findOne({ where: { nombre } });
        if (existing) return res.status(400).json({ success: false, message: 'Nombre de empresa ya existe' });
        }

        if (email && email !== empresa.email) {
        const existingEmail = await Empresa.findOne({ where: { email } });
            if (existingEmail) return res.status(400).json({ success: false, message: 'Email de empresa ya existe' });
        }
        if (telefono && telefono !== empresa.telefono) {
        const existingTelefono = await Empresa.findOne({ where: { telefono } });
            if (existingTelefono) return res.status(400).json({ success: false, message: 'Teléfono de empresa ya existe' });
        }
        if (web && web !== empresa.web) {
        const existingWeb = await Empresa.findOne({ where: { web } });
            if (existingWeb) return res.status(400).json({ success: false, message: 'Web de empresa ya existe' });
        }
        await empresa.update({ nombre, sector, contacto, email, telefono, direccion, web, tipo_convenio });
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