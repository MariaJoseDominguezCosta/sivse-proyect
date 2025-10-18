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

db.Usuarios.hasMany(db.Notificaciones, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
db.Notificaciones.belongsTo(db.Usuarios, { foreignKey: 'usuario_id' });

// Otras asociaciones existentes (e.g., Empresa-Vacante)
db.Empresas.hasMany(db.Vacantes, {
    foreignKey: 'empresa_id',
    as: 'vacante',
    onDelete: 'CASCADE',
});
db.Vacantes.belongsTo(db.Empresas, { foreignKey: 'empresa_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;