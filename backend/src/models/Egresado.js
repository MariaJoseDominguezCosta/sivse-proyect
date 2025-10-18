const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./Usuario');

const Egresado = (sequelize, DataTypes) => {
  const EgresadoModel = sequelize.define('Egresados', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre_completo: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING },
    generacion: { type: DataTypes.STRING },
    carrera: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    estado_laboral: { type: DataTypes.STRING, defaultValue: 'Desempleado' },
    ubicacion: { type: DataTypes.STRING },
    empresa_actual: { type: DataTypes.STRING },
    puesto: { type: DataTypes.STRING },
    modalidad: { type: DataTypes.STRING },
    fecha_inicio: { type: DataTypes.DATE },
    redes: { type: DataTypes.JSON },
    historial: { type: DataTypes.JSON },
    foto_perfil: { type: DataTypes.STRING },
    user_id: { type: DataTypes.INTEGER, unique: true },
  }, {
    tableName: 'Egresados',
    timestamps: true,
  });

  EgresadoModel.belongsTo(User(sequelize, DataTypes), { foreignKey: 'user_id' });

  return EgresadoModel;
};

module.exports = Egresado;