// backend/src/models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    try {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
      console.log(`Modelo cargado: ${model.name}`); // Depuración
    } catch (error) {
      console.error(`Error cargando el modelo desde ${file}:`, error);
    }
  });

// NO ejecutar associate aquí para evitar duplicados
// Object.keys(db).forEach(modelName => {
//   if (db[modelName] && db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// Asociaciones específicas (centralizadas aquí)
db.Usuario.hasMany(db.Egresado, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Egresado.belongsTo(db.Usuario, { foreignKey: 'user_id' });

db.Usuario.hasMany(db.Notificacion, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Notificacion.belongsTo(db.Usuario, { foreignKey: 'user_id' });

db.Egresado.hasMany(db.HistorialActualizacion, { foreignKey: 'egresado_id', onDelete: 'CASCADE' });
db.HistorialActualizacion.belongsTo(db.Egresado, { foreignKey: 'egresado_id' });

db.Egresado.hasMany(db.Postulacion, { foreignKey: 'egresado_id', onDelete: 'CASCADE' });
db.Postulacion.belongsTo(db.Egresado, { foreignKey: 'egresado_id' });
db.Postulacion.belongsTo(db.Vacante, { foreignKey: 'vacante_id' });

db.Empresa.hasMany(db.Vacante, { foreignKey: 'empresa_id', as: 'vacantes', onDelete: 'CASCADE' });
db.Vacante.belongsTo(db.Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

db.Egresado.hasMany(db.Favorito, { foreignKey: 'egresado_id', onDelete: 'CASCADE' });
db.Favorito.belongsTo(db.Egresado, { foreignKey: 'egresado_id' });
db.Favorito.belongsTo(db.Vacante, { foreignKey: 'vacante_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;