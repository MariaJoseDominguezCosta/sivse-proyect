const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empresa = (sequelize, DataTypes) => {
  const EmpresaModel = sequelize.define('Empresas', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    razon_social: { type: DataTypes.STRING, allowNull: false, unique: true },
    sector: { type: DataTypes.STRING, allowNull: false },
    tipo_convenio: { type: DataTypes.STRING, allowNull: false },
    direccion: { type: DataTypes.STRING, allowNull: false },
    correo_contacto: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
    telefono: { type: DataTypes.STRING, allowNull: false, validate: { len: [10, 15] } },
    sitio_web: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
  }, {
    tableName: 'Empresas',
    timestamps: true,
  });

  return EmpresaModel;
};

module.exports = Empresa;