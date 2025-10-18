const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Egresado = require("./Egresado");
const Vacante = require("./Vacante");

const Postulacion = (sequelize, DataTypes) => {
  const PostulacionModel = sequelize.define(
    "Postulaciones",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      egresado_id: {
        type: DataTypes.INTEGER,
        references: { model: Egresado(sequelize, DataTypes), key: "id" },
      },
      vacante_id: {
        type: DataTypes.INTEGER,
        references: { model: Vacante(sequelize, DataTypes), key: "id" },
      },
      fecha_postulacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "Postulaciones",
      timestamps: true,
    }
  );

  Egresado(sequelize, DataTypes).belongsToMany(Vacante(sequelize, DataTypes), {
    through: PostulacionModel,
    foreignKey: "egresado_id",
  });
  Vacante(sequelize, DataTypes).belongsToMany(Egresado(sequelize, DataTypes), {
    through: PostulacionModel,
    foreignKey: "vacante_id",
  });

  return PostulacionModel;
};

module.exports = Postulacion;
