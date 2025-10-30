// backend/src/models/Postulacion.js (ajustado)
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
    const Postulacion = sequelize.define(
    "Postulacion",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      egresado_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Egresados', key: "id" }, // Corrección aquí
      },
      vacante_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Vacantes', key: "id" }, // Corrección aquí
      },
      fecha_postulacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "Postulaciones",
      timestamps: true,
    }
  );

  // Postulacion.associate = (models) => {
  //   Postulacion.belongsTo(models.Egresado, { foreignKey: "egresado_id" });
  //   Postulacion.belongsTo(models.Vacante, { foreignKey: "vacante_id" });
  // };

  return Postulacion;
};