const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Egresado = sequelize.define('Egresado', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  generacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  carrera: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado_laboral: {
    type: DataTypes.STRING,
    defaultValue: 'desempleado',
  },
  empresa_actual: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  puesto_actual: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  redes_sociales: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  tableName: 'EGRESADO',
  timestamps: true,
});

User.hasOne(Egresado, { foreignKey: 'user_id' });
Egresado.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Egresado;