const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empresa = sequelize.define('Empresa', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  razon_social: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Nombre legal único
  },
  sector: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_convenio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },  // Validación de email
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [10, 15] },  // Ej. longitud de teléfono
  },
  sitio_web: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isUrl: true },  // Validación de URL
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