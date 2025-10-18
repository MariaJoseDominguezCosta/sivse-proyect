const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Vacante = (sequelize, DataTypes) => {
  const VacanteModel = sequelize.define(
    "Vacantes",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      empresa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Referencia se establecerá en index.js para evitar ciclos
      },
      titulo: { type: DataTypes.STRING(255), allowNull: false },
      descripcion: { type: DataTypes.TEXT, allowNull: false },
      requisitos: { type: DataTypes.TEXT, allowNull: true },
      ubicacion: { type: DataTypes.STRING(255), allowNull: true },
      modalidad: { type: DataTypes.STRING(10), allowNull: true },
      salario_estimado: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      estado: {
        type: DataTypes.STRING(50),
        defaultValue: "Activa",
        validate: { isIn: [["Activa", "Inactiva"]] },
      },
      empresa_id: { 
        type: DataTypes.INTEGER,
      references: {
        model: 'Empresas',
        key: 'id'
      },
    },
      fecha_publicacion: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
      es_favorito: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: "Vacantes",
      timestamps: true,
    }
  );

  return VacanteModel;
};

module.exports = Vacante;
