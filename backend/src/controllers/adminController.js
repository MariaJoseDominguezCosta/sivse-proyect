// backend/src/controllers/adminController.js
const { Empresa, Vacante, Egresado, Usuario: User } = require('../models');
const bcrypt = require('bcrypt');
const Joi = require('joi');

exports.getEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.findAll({
      include: [{ model: Vacante, as: 'vacantes' }]
    });
    res.json(empresas);
  } catch (error) {
    console.error('Error fetching empresas:', error);
    res.status(500).json({ message: 'Error al obtener empresas', error });
  }
};

exports.createEmpresa = async (req, res) => {
  try {
    const nuevaEmpresa = await Empresa.create(req.body);
    res.status(201).json(nuevaEmpresa);
  } catch (error) {
    console.error('Error creating empresa:', error);
    res.status(500).json({ message: 'Error al registrar empresa', error });
  }
};

exports.getEmpresaById = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findByPk(id, {
      include: [{ model: Vacante, as: 'vacantes' }]
    });
    if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });
    res.json(empresa);
  } catch (error) {
    console.error('Error fetching empresa:', error);
    res.status(500).json({ message: 'Error al obtener empresa', error });
  }
};

exports.updateEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Empresa.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Empresa no encontrada' });
    const updatedEmpresa = await Empresa.findByPk(id);
    res.json(updatedEmpresa);
  } catch (error) {
    console.error('Error updating empresa:', error);
    res.status(500).json({ message: 'Error al actualizar empresa', error });
  }
};

exports.deleteEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Empresa.destroy({ where: { id } });
    if (deleted) {
      await Vacante.destroy({ where: { empresa_id: id } }); // Elimina vacantes asociadas
      res.json({ message: 'Empresa y vacantes asociadas eliminadas' });
    } else {
      res.status(404).json({ message: 'Empresa no encontrada' });
    }
  } catch (error) {
    console.error('Error deleting empresa:', error);
    res.status(500).json({ message: 'Error al eliminar empresa', error });
  }
};

exports.getVacantesByEmpresa = async (req, res) => {
  try {
    const { empresa_id } = req.params;
    const vacantes = await Vacante.findAll({
      where: { empresa_id },
      include: [{ model: Empresa, as: 'empresa' }]
    });
    res.json(vacantes);
  } catch (error) {
    console.error('Error fetching vacantes by empresa:', error);
    res.status(500).json({ message: 'Error al obtener vacantes', error });
  }
};

exports.createVacante = async (req, res) => {
  try {
    const { empresaAsociada, titulo, descripcion, requisitos, ubicacion,  modalidad, salario_estimado, estado, fecha_publicacion } = req.body;
    const estadoString = estado ? 'Activa' : 'Inactiva';
    const nuevaVacante = await Vacante.create({ empresa_id: empresaAsociada, titulo, descripcion, requisitos, ubicacion,  modalidad, salario_estimado, estado: estadoString, fecha_publicacion });
    res.status(201).json(nuevaVacante);
  } catch (error) {
    console.error('Error creating vacante:', error);
    res.status(500).json({ message: 'Error al crear vacante', error });
  }
};

exports.getAllVacantes = async (req, res) => {
  try {
    const vacantes = await Vacante.findAll({
      include: [{ model: Empresa, as: 'empresa' }]
    });
    res.json(vacantes);
  } catch (error) {
    console.error('Error fetching all vacantes:', error);
    res.status(500).json({ message: 'Error al obtener todas las vacantes', error });
  }
};

exports.getVacanteById = async (req, res) => {
  try {
    const { id } = req.params;
    const vacante = await Vacante.findByPk(id, {
      include: [{ model: Empresa, as: 'empresa' }]
    });
    if (!vacante) return res.status(404).json({ message: 'Vacante no encontrada' });
    res.json(vacante);
  } catch (error) {
    console.error('Error fetching vacante:', error);
    res.status(500).json({ message: 'Error al obtener vacante', error });
  }
};

exports.updateVacante = async (req, res) => {
  try {
    const { id } = req.params;
     const updateData = { ...req.body }; // Copiamos el cuerpo de la solicitud
    // Si el estado viene en el cuerpo, lo convertimos a string.
    if (typeof updateData.estado === 'boolean') {
        updateData.estado = updateData.estado ? 'Activa' : 'Inactiva';
    }
    const [updated] = await Vacante.update(updateData, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Vacante no encontrada' });
    const updatedVacante = await Vacante.findByPk(id);
    res.json(updatedVacante);
  } catch (error) {
    console.error('Error updating vacante:', error);
    res.status(500).json({ message: 'Error al actualizar vacante', error });
  }
};

exports.deleteVacante = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Vacante.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Vacante eliminada' });
    } else {
      res.status(404).json({ message: 'Vacante no encontrada' });
    }
  } catch (error) {
    console.error('Error deleting vacante:', error);
    res.status(500).json({ message: 'Error al eliminar vacante', error });
  }
};

exports.getEgresados = async (req, res) => {
  try {
    const egresados = await Egresado.findAll();
    res.json(egresados);
  } catch (error) {
    console.error('Error fetching egresados:', error);
    res.status(500).json({ message: 'Error al obtener egresados', error });
  }
};

exports.getEgresadoById = async (req, res) => {
  try {
    const { id } = req.params;
    const egresado = await Egresado.findByPk(id);
    if (!egresado) return res.status(404).json({ message: 'Egresado no encontrado' });
    res.json(egresado);
  } catch (error) {
    console.error('Error fetching egresado:', error);
    res.status(500).json({ message: 'Error al obtener egresado', error });
  }
};

exports.updateEgresado = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Egresado.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Egresado no encontrado' });
    const updatedEgresado = await Egresado.findByPk(id);
    res.json(updatedEgresado);
  } catch (error) {
    console.error('Error updating egresado:', error);
    res.status(500).json({ message: 'Error al actualizar egresado', error });
  }
};

exports.deleteEgresado = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Egresado.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Egresado eliminado' });
    } else {
      res.status(404).json({ message: 'Egresado no encontrado' });
    }
  } catch (error) {
    console.error('Error deleting egresado:', error);
    res.status(500).json({ message: 'Error al eliminar egresado', error });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const [empresaCount, vacanteCount, egresadoCount] = await Promise.all([
      Empresa.count(),
      Vacante.count(),
      Egresado.count()
    ]);
    res.json({
      empresas: empresaCount,
      vacantes: vacanteCount,
      egresados: egresadoCount
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ message: 'Error al obtener resumen del dashboard', error });
  }
};

exports.registerAdmin = async (req, res) => {
  // Validación con Joi
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  
  try {
        // 2. Verificar duplicado
        if (await User.findOne({ where: { email } })) return res.status(400).json({ error: 'Email ya existe' });

        // 3. Crear Usuario con rol 'admin'
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ 
            email, 
            password: hashedPassword, 
            role: 'admin' // <-- ASIGNACIÓN CLAVE
        });

        res.status(201).json({ message: 'Nuevo administrador registrado', userId: newUser.id });
        
    } catch (err) {
        console.error('Error registering admin:', err);
        // Manejo de errores
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'Email ya existe' });
        } else {
            res.status(500).json({ error: 'Error al registrar el administrador' });
        }
    }
};