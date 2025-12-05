// backend/src/controllers/egresadoController.js
const { Op } = require("sequelize");
const {
  Egresado,
  Vacante,
  Favorito,
  Empresa,
  sequelize,
} = require("../models");
const fs = require('fs'); // <-- Importar fs
const path = require('path'); // <-- Importar path

const getUserIdFromReq = (req) => req.user.userId || req.user.id;

// Función utilitaria para encontrar el Egresado
const findEgresado = async (req) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return null;
  return Egresado.findOne({ where: { user_id: userId } });
};

// backend/src/controllers/egresadoController.js
exports.getDashboardSummary = async (req, res) => {
  try {
    const egresado = await findEgresado(req); // Usar la utilitaria
    if (!egresado)
      return res.status(404).json({ message: "Egresado no encontrado" });

    // Usamos egresado.id para las tablas asociadas (Favorito, etc.)
    const [favoritos, vacantesRecomendadas] = await Promise.all([
      Favorito.count({ where: { egresado_id: egresado.id } }), // Usar egresado.id
      Vacante.findAll({
        include: [{ model: Empresa, as: "empresa" }],
        where: {
          [Op.or]: [
            { "$empresa.sector$": { [Op.like]: `%${egresado.carrera}%` } },
            { titulo: { [Op.like]: `%${egresado.puesto}%` } },
            { modalidad: egresado.modalidad },
          ],
        },
        limit: 5,
      }),
    ]);

    res.json({
      perfil: {
        nombre_completo: egresado.nombre_completo,
        telefono: egresado.telefono,
        generacion: egresado.generacion,
        carrera: egresado.carrera,
        email: egresado.email,
        estado_laboral: egresado.estado_laboral,
        ubicacion: egresado.ubicacion,
        empresa_actual: egresado.empresa_actual,
        puesto: egresado.puesto,
        modalidad: egresado.modalidad,
        fecha_inicio: egresado.fecha_inicio,
        redes: egresado.redes,
        historial: egresado.historial,
        foto_perfil: egresado.foto_perfil,
      },
      favoritosCount: favoritos,
      vacantesRecomendadas,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res
      .status(500)
      .json({ message: "Error al obtener resumen del dashboard", error });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const egresado = await findEgresado(req);
    if (!egresado)
      return res.status(404).json({ message: "Egresado no encontrado" });
    res.json(egresado);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error al obtener perfil", error });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = getUserIdFromReq(req);
  let transaction;

  try {
    transaction = await sequelize.transaction(); // Iniciar transacción

    const currentEgresado = await Egresado.findOne({
      where: { user_id: userId },
      transaction,
    });
    if (!currentEgresado) {
      await transaction.rollback();
      return res.status(404).json({ message: "Egresado no encontrado" });
    }

    const dataToUpdate = { ...req.body };
    const newHistorialEntry = [];
    const today = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // --- LÓGICA DE DETECCIÓN DE CAMBIOS Y GENERACIÓN DE HISTORIAL ---
    const fieldsToTrack = [
      "ubicacion",
      "empresa_actual",
      "puesto",
      "modalidad",
      "carrera",
      "generacion",
    ];

    fieldsToTrack.forEach((field) => {
      const oldValue = currentEgresado[field];
      const newValue = dataToUpdate[field];

      // Comparar valores: si cambió y no está vacío
      if (oldValue !== newValue && newValue) {
        let descripcion = "";

        if (field === "ubicacion") {
          descripcion = `Actualizó ubicación a: ${newValue}`;
        } else if (field === "empresa_actual" || field === "puesto") {
          descripcion = `Cambió empleo a: ${newValue} en ${
            dataToUpdate.empresa_actual || currentEgresado.empresa_actual
          }`;
        } else {
          descripcion = `Actualizó ${field} a: ${newValue}`;
        }

        newHistorialEntry.push({
          fecha: today,
          descripcion: descripcion,
          campo: field,
        });
      }
    });

    // 1. CONCATENAR EL HISTORIAL: Tomar el historial existente y añadir los nuevos
    const updatedHistorial = [
      ...(currentEgresado.historial || []),
      ...newHistorialEntry,
    ];

    // 2. PREPARAR DATOS PARA UPDATE: Incluir el historial actualizado
    dataToUpdate.historial = updatedHistorial;
    // -----------------------------------------------------------------

    // 3. EJECUTAR EL UPDATE
    const [updated] = await Egresado.update(dataToUpdate, {
      where: { user_id: userId },
      transaction,
    });

    // 4. COMMIT Y RESPUESTA
    await transaction.commit();
    const updatedEgresado = await Egresado.findOne({
      where: { user_id: userId },
    });
    res.json(updatedEgresado);
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error updating profile and saving history:", error);
    res.status(500).json({ message: "Error al actualizar perfil", error });
  }
};

exports.updateProfilePhoto = async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!req.file) {
    return res.status(400).json({ message: "No se subió ninguna foto" });
  }

  const photoUrl = `/uploads/${req.file.filename}`; // URL pública de la nueva foto
  const newFilePath = req.file.path; // Ruta local de la nueva foto (proporcionada por Multer)
  let transaction;

  try {
    transaction = await sequelize.transaction(); // Iniciar transacción

    // 1. Obtener el egresado actual para la URL de la foto antigua
    const currentEgresado = await Egresado.findOne({
      where: { user_id: userId },
      transaction,
    });
    if (!currentEgresado) {
      // En un caso de fallo, eliminamos la foto recién subida:
      fs.unlink(newFilePath, (err) => {
        if (err)
          console.error(
            "Fallo al eliminar el nuevo archivo subido tras error:",
            err
          );
      });
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Egresado no encontrado o sesión inválida." });
    }

    const oldPhotoUrl = currentEgresado.foto_perfil;

    // 2. Actualizar la DB con la nueva URL
    await Egresado.update(
      { foto_perfil: photoUrl },
      { where: { user_id: userId }, transaction }
    );

    await transaction.commit(); // Éxito en la DB

    // --- LÓGICA DE ELIMINACIÓN DEL ARCHIVO ANTIGUO ---
    if (oldPhotoUrl && !oldPhotoUrl.includes("/default-profile.png")) {
      // Construir la ruta física del archivo antiguo
      const oldFilePath = path.join(__dirname, "..", oldPhotoUrl); // Ajusta la ruta si es necesario (ej: path.join(__dirname, '../../uploads', oldPhotoUrl.replace('/uploads/', '')))

      // Determinar el path de la foto antigua. Asumiendo que /uploads está mapeado a src/uploads
      const oldFilename = oldPhotoUrl.replace("/uploads/", "");
      const oldPath = path.join(__dirname, "..", "uploads", oldFilename);

      fs.unlink(oldPath, (err) => {
        if (err) {
          console.error(
            "Advertencia: Fallo al eliminar la foto antigua:",
            oldPath,
            err
          );
        } else {
          console.log("Foto de perfil antigua eliminada:", oldPath);
        }
      });
    }
    // ----------------------------------------------------

    // 3. Respuesta exitosa
    const updatedEgresado = await Egresado.findOne({
      where: { user_id: userId },
    });
    res.json({
      message: "Foto de perfil actualizada",
      foto_perfil: updatedEgresado.foto_perfil,
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    // Si hay un error, intentamos eliminar el archivo que acabamos de subir
    fs.unlink(newFilePath, (err) => {
      if (err)
        console.error(
          "Fallo al eliminar el nuevo archivo subido tras error:",
          err
        );
    });

    console.error("Error uploading profile photo:", error);
    res.status(500).json({ message: "Error al subir foto de perfil", error });
  }
};

exports.getFavoritos = async (req, res) => {
  try {
    const egresado = await findEgresado(req); // Obtener el egresado
    if (!egresado)
      return res.status(404).json({ message: "Egresado no encontrado" });

    const favoritos = await Favorito.findAll({
      where: { egresado_id: egresado.id }, // <--- USAR egresado.id
      include: [{ model: Vacante, as: "vacantes", include: ["empresa"] }],
    });
    res.json(favoritos);
  } catch (error) {
    console.error("Error fetching favoritos:", error);
    res.status(500).json({ message: "Error al obtener favoritos", error });
  }
};

exports.addFavorito = async (req, res) => {
  try {
    const egresado = await findEgresado(req); // Obtener el egresado
    if (!egresado)
      return res.status(404).json({ message: "Egresado no encontrado" });

    const { vacante_id } = req.body;
    console.log(
      "Creando Favorito para Egresado ID:",
      egresado.id,
      "y Vacante ID:",
      vacante_id
    );
    // CORRECCIÓN 4: Usar egresado.id
    const favorito = await Favorito.create({
      egresado_id: egresado.id, // <--- USAR egresado.id
      vacante_id,
    });

    res.status(201).json(favorito);
  } catch (error) {
    console.error("Error adding favorito:", error);
    res.status(500).json({ message: "Error al agregar favorito", error });
  }
};

exports.removeFavorito = async (req, res) => {
  try {
    const egresado = await findEgresado(req); // Obtener el egresado
    if (!egresado)
      return res.status(404).json({ message: "Egresado no encontrado" });

    const { id } = req.params;
    // CORRECCIÓN 5: Usar egresado.id
    const deleted = await Favorito.destroy({
      where: { id, egresado_id: egresado.id }, // <--- USAR egresado.id
    });
    if (deleted) {
      res.json({ message: "Favorito eliminado" });
    } else {
      res.status(404).json({ message: "Favorito no encontrado" });
    }
  } catch (error) {
    console.error("Error removing favorito:", error);
    res.status(500).json({ message: "Error al eliminar favorito", error });
  }
};

exports.getVacantes = async (req, res) => {
  try {
    const egresado = await findEgresado(req); // Obtener el egresado
    const vacantes = await Vacante.findAll({
      include: [{ model: Empresa, as: "empresa" }],
    });

    // Si hay un egresado, obtener todos sus IDs de favoritos
    let favoritosIds = new Set();
    if (egresado) {
      const favoritos = await Favorito.findAll({
        where: { egresado_id: egresado.id }, // <--- USAR egresado.id
        attibutes: ["vacante_id"],
      });
      favoritosIds = new Set(favoritos.map((fav) => fav.vacante_id));
    }

    // Mapear las vacantes para añadir el flag 'es_favorito'
    const vacantesConFavorito = vacantes.map((vac) => ({
      ...vac.toJSON(),
      es_favorito: favoritosIds.has(vac.id),
    }));
    res.json(vacantesConFavorito);
  } catch (error) {
    console.error("Error fetching vacantes:", error);
    res.status(500).json({ message: "Error al obtener vacantes", error });
  }
};

exports.getVacanteById = async (req, res) => {
  try {
    const { id } = req.params;
    const vacante = await Vacante.findByPk(id, {
      include: [{ model: Empresa, as: "empresa" }],
    });
    if (!vacante)
      return res.status(404).json({ message: "Vacante no encontrada" });
    res.json(vacante);
  } catch (error) {
    console.error("Error fetching vacante:", error);
    res.status(500).json({ message: "Error al obtener vacante", error });
  }
};

exports.getRecomendedVacantes = async (req, res) => {
  try {
    const egresado = await findEgresado(req); // Obtener el egresado
    if (!egresado)
      return res.status(404).json({ message: "Egresado no encontrado" });

    const vacantes = await Vacante.findAll({
      include: [{ model: Empresa, as: "empresa" }],
      where: {
        [Op.or]: [
          { "$empresa.sector$": { [Op.like]: `%${egresado.carrera}%` } }, // Match por sector o carrera
          { "$empresa.puesto$": { [Op.like]: `%${egresado.puesto}%` } },
          { "$empresa.modalidad$": egresado.modalidad },
        ],
      },
      order: [["fecha_publicacion", "DESC"]],
      limit: 10,
    });

    res.json(vacantes);
  } catch (error) {
    console.error("Error fetching recommended vacantes:", error);
    res
      .status(500)
      .json({ message: "Error al obtener recomendaciones", error });
  }
};
