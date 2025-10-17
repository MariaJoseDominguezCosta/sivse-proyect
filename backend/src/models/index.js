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
db.User.hasMany(db.Notificacion, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Notificacion.belongsTo(db.User, { foreignKey: 'user_id' });

// Otras asociaciones existentes (e.g., Empresa-Vacante)
db.Empresa.hasMany(db.Vacante, {
    foreignKey: 'empresa_id',
    as: 'vacantes',
    onDelete: 'CASCADE',
});
db.Vacante.belongsTo(db.Empresa, { foreignKey: 'empresa_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;