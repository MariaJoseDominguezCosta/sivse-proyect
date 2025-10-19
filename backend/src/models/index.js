// backend/src/models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');





const db = {};

fs.readdirSync(__dirname)
    .filter(file => file !== 'index.js' && file.endsWith('.js'))
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

// Definir asociaciones después de cargar todos los modelos
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Asociaciones específicas
// db.Usuarios.hasMany(db.Notificaciones, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
// db.Notificaciones.belongsTo(db.Usuarios, { foreignKey: 'usuario_id' });

// // Otras asociaciones (agrega basadas en PDF)
// db.Usuarios.hasOne(db.Egresados, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
// db.Usuarios.hasOne(db.Admin, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
// db.Empresas.hasMany(db.Vacantes, { foreignKey: 'empresa_id', as: 'vacantes', onDelete: 'CASCADE' });
// db.Vacantes.belongsTo(db.Empresas, { foreignKey: 'empresa_id' });
// db.Egresados.hasMany(db.Favoritos, { foreignKey: 'egresado_id', onDelete: 'CASCADE' });
// db.Favoritos.belongsTo(db.Egresados, { foreignKey: 'egresado_id' });
// db.Favoritos.belongsTo(db.Vacantes, { foreignKey: 'vacante_id' });
// db.Egresados.hasMany(db.HistorialActualizaciones, { foreignKey: 'egresado_id', onDelete: 'CASCADE' });
// db.HistorialActualizaciones.belongsTo(db.Egresados, { foreignKey: 'egresado_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;