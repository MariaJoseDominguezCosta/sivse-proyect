// backend/src/controllers/publicController.js
// --- CORRECCIÓN CLAVE: AGREGAR ESTA LÍNEA ---
const { Egresado } = require('../models'); 
const { Op } = require('sequelize'); // <--- IMPORTAR EL OBJETO OP

exports.getCarreras = async (req, res) => {
    try {
        // --- TEMPORALMENTE: Obtener todas las filas para ver los datos ---
        const egresados = await Egresado.findAll({
            attributes: ['carrera'] // Solo trae el campo carrera
        });
        
        console.log("DATOS DE EGRESADOS (CARRERAS):", egresados);
        
        // Vuelve al código original (pero comentado)
        const carrerasUnicas = egresados.map(e => e.carrera).filter(Boolean);
        const uniqueCarreras = [...new Set(carrerasUnicas)];

        res.json(uniqueCarreras);
        // -----------------------------------------------------------------
        
    } catch (error) {
        console.error('Error fetching carreras:', error);
        res.status(500).json({ message: 'Error al obtener carreras' });
    }
};


exports.getGeneraciones = async (req, res) => {
    try {
        // --- TEMPORALMENTE: Obtener todas las filas para ver los datos ---
        const egresados = await Egresado.findAll({
            attributes: ['generacion'] // Solo trae el campo generacion
        });
        
        console.log("DATOS DE EGRESADOS (GENERACIONES):", egresados);
        
        // Vuelve al código original (pero comentado)
        const generacionesUnicas = egresados.map(e => e.generacion).filter(Boolean);
        const uniqueGeneraciones = [...new Set(generacionesUnicas)];
        
        res.json(uniqueGeneraciones);
        // -----------------------------------------------------------------
    } catch (error) {
        console.error('Error fetching generaciones:', error);
        res.status(500).json({ message: 'Error al obtener generaciones' });
    }
};