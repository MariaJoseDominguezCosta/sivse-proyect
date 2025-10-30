// backend/src/controllers/egresadoController.js
const { Op } = require("sequelize");
const { Egresado, Vacante, Favorito, Empresa } = require("../models");

// backend/src/controllers/egresadoController.js
exports.getDashboardSummary = async (req, res) => {
    console.log('User ID from token:', req.user.id); // Depuración
    try {
        const egresado = await Egresado.findByPk(req.user.id);
        if (!egresado) return res.status(404).json({ message: "Egresado no encontrado" });

        const [favoritos, vacantesRecomendadas] = await Promise.all([
        Favorito.count({ where: { egresado_id: req.user.id } }),
        Vacante.findAll({
            include: [{ model: Empresa, as: "empresa" }],
            where: {
            [Op.or]: [
                { "$empresa.sector$": { [Op.like]: `%${egresado.carrera}%` } },
                { "$empresa.puesto$": { [Op.like]: `%${egresado.puesto}%` } },
                { "$empresa.modalidad$": egresado.modalidad },
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
        res.status(500).json({ message: "Error al obtener resumen del dashboard", error });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const egresado = await Egresado.findByPk(req.usuario.id); // ID del usuario autenticado
        if (!egresado)
        return res.status(404).json({ message: "Egresado no encontrado" });
        res.json(egresado);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error al obtener perfil", error });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const [updated] = await Egresado.update(req.body, {
        where: { id: req.user.id },
        });
        if (!updated)
        return res.status(404).json({ message: "Egresado no encontrado" });
        const updatedEgresado = await Egresado.findByPk(req.user.id);
        res.json(updatedEgresado);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error al actualizar perfil", error });
    }
};

exports.getFavoritos = async (req, res) => {
    try {
        const favoritos = await Favorito.findAll({
        where: { egresadoId: req.user.id },
        include: [{ model: Vacante, as: "vacante", include: ["empresa"] }],
        });
        res.json(favoritos);
    } catch (error) {
        console.error("Error fetching favoritos:", error);
        res.status(500).json({ message: "Error al obtener favoritos", error });
    }
};

exports.addFavorito = async (req, res) => {
    try {
        const { vacanteId } = req.body;
        const favorito = await Favorito.create({
        egresadoId: req.user.id,
        vacanteId,
        });
        res.status(201).json(favorito);
    } catch (error) {
        console.error("Error adding favorito:", error);
        res.status(500).json({ message: "Error al agregar favorito", error });
    }
};

exports.removeFavorito = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Favorito.destroy({
        where: { id, egresadoId: req.user.id },
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
        const vacantes = await Vacante.findAll({
        include: [{ model: Empresa, as: "empresa" }],
        });
        res.json(vacantes);
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
        const egresado = await Egresado.findByPk(req.user.id);
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
