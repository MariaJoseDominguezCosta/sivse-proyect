const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Empresa = require('./Empresa');

const Vacante = sequelize.define('Vacante', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  salario: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('Activa', 'Inactiva'),
    defaultValue: 'Activa',
  },
  modalidad: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  empresa_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Empresa,
      key: 'id',
    },
  },
}, {
  tableName: 'VACANTE',
  timestamps: true,
});

// Asociación inversa
Vacante.associate = (models) => {
  Vacante.belongsTo(models.Empresa, {
    foreignKey: 'empresaId',
    as: 'empresa',
  });
};

Empresa.hasMany(Vacante, { foreignKey: 'empresa_id' });

module.exports = Vacante;