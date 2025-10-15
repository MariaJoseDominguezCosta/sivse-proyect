// src/models/index.js - Relaciones entre modelos
const User = require('./User');
const Egresado = require('./Egresado');
const Empresa = require('./Empresa');
const Vacante = require('./Vacante');

// Relaciones
User.hasOne(Egresado, { foreignKey: 'user_id' });
Egresado.belongsTo(User, { foreignKey: 'user_id' });

Empresa.hasMany(Vacante, { foreignKey: 'empresa_id' });
Vacante.belongsTo(Empresa, { foreignKey: 'empresa_id' });

// Ejecuta asociaciones
Empresa.associate({ Vacante });
Vacante.associate({ Empresa });

module.exports = { User, Egresado, Empresa, Vacante };