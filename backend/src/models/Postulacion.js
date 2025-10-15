const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Egresado = require('./Egresado');
const Vacante = require('./Vacante');

const Postulacion = sequelize.define('Postulacion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  egresado_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Egresado,
      key: 'id',
    },
  },
  vacante_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Vacante,
      key: 'id',
    },
  },
  fecha_postulacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'POSTULACION',
  timestamps: true,
});

// Relación N:N
Egresado.belongsToMany(Vacante, { through: Postulacion, foreignKey: 'egresado_id' });
Vacante.belongsToMany(Egresado, { through: Postulacion, foreignKey: 'vacante_id' });

module.exports = Postulacion;