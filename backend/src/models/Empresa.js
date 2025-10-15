const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empresa = sequelize.define('Empresa', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Nombre único según validaciones
  },
  sector: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  web: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_convenio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contacto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'EMPRESA',
  timestamps: true,
});

// Asociación: Empresa tiene muchas Vacantes
Empresa.associate = (models) => {
  Empresa.hasMany(models.Vacante, {
    foreignKey: 'empresaId',
    as: 'vacantes',
    onDelete: 'CASCADE',  // Elimina vacantes asociadas al borrar empresa (chequeo de integridad)
  });
};

module.exports = Empresa;