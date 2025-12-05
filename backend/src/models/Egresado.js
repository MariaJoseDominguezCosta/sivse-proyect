// backend/src/models/Egresado.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Egresado = sequelize.define(
    "Egresado",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre_completo: { type: DataTypes.STRING, allowNull: false },
      telefono: { type: DataTypes.STRING },
      generacion: { type: DataTypes.STRING },
      carrera: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING, unique: true },
      estado_laboral: { type: DataTypes.STRING, defaultValue: "Desempleado" },
      ubicacion: { type: DataTypes.STRING },
      empresa_actual: { type: DataTypes.STRING },
      puesto: { type: DataTypes.STRING },
      modalidad: { type: DataTypes.STRING },
      fecha_inicio: { type: DataTypes.DATE },
      redes: { type: DataTypes.JSON },
      historial: { type: DataTypes.JSON },
      foto_perfil: { type: DataTypes.BLOB },
      user_id: { type: DataTypes.INTEGER, unique: true },
    },
    {
      tableName: "Egresados",
      timestamps: true,
    }
  );

  // Egresado.associate = (models) => {
  //   Egresado.hasMany(models.HistorialActualizacion, {
  //     foreignKey: "egresado_id",
  //     onDelete: "CASCADE",
  //   });
  //   Egresado.hasMany(models.Postulacion, {
  //     foreignKey: "egresado_id",
  //     onDelete: "CASCADE",
  //   });
  //   Egresado.hasMany(models.Notificacion, {
  //     foreignKey: "egresado_id",
  //     onDelete: "CASCADE",
  //   });
  //   Egresado.belongsTo(models.Usuario, {
  //     foreignKey: "user_id",
  //   });
  // };

  return Egresado;
};

