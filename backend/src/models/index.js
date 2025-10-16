// src/models/index.js - Relaciones entre modelos
const User = require('./user');
const Egresado = require('./egresado');
const Empresa = require('./empresa');
const Vacante = require('./vacante');

// Relaciones
User.hasOne(Egresado, { foreignKey: 'user_id' });
Egresado.belongsTo(User, { foreignKey: 'user_id' });

Empresa.hasMany(Vacante, { foreignKey: 'empresa_id' });
Vacante.belongsTo(Empresa, { foreignKey: 'empresa_id' });

// Ejecuta asociaciones


module.exports = { User, Egresado, Empresa, Vacante };