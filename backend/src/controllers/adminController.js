// backend/src/controllers/adminController.js
const db = require('../models');

exports.getStats = async (req, res) => {
  try {
    const egresadosCount = await db.Egresados.count();
    const empresasCount = await db.Empresas.count();
    const vacantesCount = await db.Vacantes.count({ where: { estado: 'Activa' } });
    res.status(200).json({ egresados: egresadosCount, empresas: empresasCount, vacantes: vacantesCount });
  } catch (error) {
    console.error('Error en getStats:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

exports.getEgresados = async (req, res) => {
  try {
    const egresados = await db.Egresados.findAll({
      attributes: ['id', 'nombre_completo', 'puesto', 'ubicacion'],
      include: [{ model: db.Usuarios, attributes: ['email', 'role'] }, { model: db.Postulaciones, attributes: ['vacante_id', 'fecha_postulacion'] }],
    });
    res.status(200).json(egresados);
  } catch (error) {
    console.error('Error al cargar egresados:', error);
    res.status(500).json({ message: 'Error al cargar egresados' });
  }
};

exports.getEgresadoById = async (req, res) => {
  try {
    const egresado = await db.Egresados.findByPk(req.params.id, {
      attributes: ['id', 'nombre_completo', 'puesto', 'ubicacion'],
      include: [{ model: db.Usuarios, attributes: ['email', 'role'] }, { model: db.Postulaciones, attributes: ['vacante_id', 'fecha_postulacion'] }],
    });
    if (!egresado) return res.status(404).json({ message: 'Egresado no encontrado' });
    res.status(200).json(egresado);
  } catch (error) {
    console.error('Error al cargar egresado:', error);
    res.status(500).json({ message: 'Error al cargar egresado' });
  }
};

exports.getEmpresas = async (req, res) => {
  try {
    const empresas = await db.Empresas.findAll({ attributes: ['id', 'razon_social', 'sector', 'tipo_convenio', 'telefono'] });
    res.status(200).json(empresas);
  } catch (error) {
    console.error('Error al cargar empresas:', error);
    res.status(500).json({ message: 'Error al cargar empresas' });
  }
};

exports.getEmpresaById = async (req, res) => {
  try {
    const empresa = await db.Empresas.findByPk(req.params.id);
    if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });
    res.status(200).json(empresa);
  } catch (error) {
    console.error('Error al cargar empresa:', error);
    res.status(500).json({ message: 'Error al cargar empresa' });
  }
};

exports.createEmpresa = async (req, res) => {
  try {
    const { razon_social, sector, tipo_convenio, direccion, correo_contacto, telefono, sitio_web } = req.body;
    if (!razon_social || !sector || !tipo_convenio || !direccion || !correo_contacto || !telefono) {
      return res.status(400).json({ message: 'Todos los campos obligatorios son requeridos' });
    }
    const nuevaEmpresa = await db.Empresas.create({ razon_social, sector, tipo_convenio, direccion, correo_contacto, telefono, sitio_web });
    res.status(201).json({ message: 'Empresa creada exitosamente', empresa: nuevaEmpresa });
  } catch (error) {
    console.error('Error al crear empresa:', error);
    res.status(500).json({ message: 'Error al crear empresa' });
  }
};

exports.updateEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const { razon_social, sector, tipo_convenio, direccion, correo_contacto, telefono, sitio_web } = req.body;

    const empresa = await db.Empresas.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    await empresa.update({ razon_social, sector, tipo_convenio, direccion, correo_contacto, telefono, sitio_web });
    res.status(200).json({ message: 'Empresa actualizada exitosamente', empresa });
  } catch (error) {
    console.error('Error al actualizar empresa:', error);
    res.status(500).json({ message: 'Error al actualizar empresa' });
  }
};

exports.deleteEmpresa = async (req, res) => {
  try {
    const { id } = req.params;

    const empresa = await db.Empresas.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    await empresa.destroy();
    res.status(200).json({ message: 'Empresa eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar empresa:', error);
    res.status(500).json({ message: 'Error al eliminar empresa' });
  }
};

exports.getVacantes = async (req, res) => {
  try {
    const vacantes = await db.Vacantes.findAll({
      attributes: ['id', 'titulo', 'ubicacion', 'estado', 'fecha_publicacion'],
      include: [{ model: db.Empresas, attributes: ['razon_social'] }],
    });
    res.status(200).json(vacantes);
  } catch (error) {
    console.error('Error al cargar vacantes:', error);
    res.status(500).json({ message: 'Error al cargar vacantes' });
  }
};

exports.createVacante = async (req, res) => {
  try {
    const { empresa_id, titulo, descripcion, requisitos, ubicacion, modalidad, salario_estimado } = req.body;
    if (!empresa_id || !titulo || !descripcion) {
      return res.status(400).json({ message: 'Campos obligatorios faltantes' });
    }
    const nuevaVacante = await db.Vacantes.create({
      empresa_id, titulo, descripcion, requisitos, ubicacion, modalidad, salario_estimado, estado: 'Activa',
    });
    res.status(201).json({ message: 'Vacante creada exitosamente', vacante: nuevaVacante });
  } catch (error) {
    console.error('Error al crear vacante:', error);
    res.status(500).json({ message: 'Error al crear vacante' });
  }
};

exports.updateVacante = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresa_id, titulo, descripcion, requisitos, ubicacion, modalidad, salario_estimado } = req.body;
    const vacante = await db.Vacantes.findByPk(id);
    if (!vacante) {
      return res.status(404).json({ message: 'Vacante no encontrada' });
    }
    await vacante.update({ empresa_id, titulo, descripcion, requisitos, ubicacion, modalidad, salario_estimado });
    res.status(200).json({ message: 'Vacante actualizada exitosamente', vacante });
  } catch (error) {
    console.error('Error al actualizar vacante:', error);
    res.status(500).json({ message: 'Error al actualizar vacante' });
  }
};

exports.deleteVacante = async (req, res) => {
  try {
    const { id } = req.params;
    const vacante = await db.Vacantes.findByPk(id);
    if (!vacante) {
      return res.status(404).json({ message: 'Vacante no encontrada' });
    }
    await vacante.destroy();
    res.status(200).json({ message: 'Vacante eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar vacante:', error);
    res.status(500).json({ message: 'Error al eliminar vacante' });
  }
};

exports.getVacanteById = async (req, res) => {
  try {
    const { id } = req.params;
    const vacante = await db.Vacantes.findByPk(id);
    if (!vacante) {
      return res.status(404).json({ message: 'Vacante no encontrada' });
    }
    res.status(200).json(vacante);
  } catch (error) {
    console.error('Error al obtener vacante:', error);
    res.status(500).json({ message: 'Error al obtener vacante' });
  }
};



module.exports = exports;