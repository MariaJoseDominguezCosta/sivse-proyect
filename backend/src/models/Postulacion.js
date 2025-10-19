// backend/src/models/Postulacion.js (ajustado)
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Postulacion = (sequelize, DataTypes) => {
  const PostulacionModel = sequelize.define(
    "Postulaciones",
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

  PostulacionModel.associate = (models) => {
    PostulacionModel.belongsTo(models.Egresados, { foreignKey: "egresado_id" });
    PostulacionModel.belongsTo(models.Vacantes, { foreignKey: "vacante_id" });
  };

  return PostulacionModel;
};

module.exports = Postulacion;