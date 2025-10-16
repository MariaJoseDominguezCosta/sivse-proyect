// models/Vacante.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Empresa = require("./empresa");

const Vacante = sequelize.define(
  "Vacante",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Empresas", key: "id" },
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
    fecha_publicacion: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    es_favorito: { type: DataTypes.BOOLEAN, defaultValue: false }, // Nuevo campo para favoritos
  },
  {
    tableName: "VACANTE",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Relación
Empresa.hasMany(Vacante, { foreignKey: 'empresa_id', onDelete: 'CASCADE' });
Vacante.belongsTo(Empresa, { foreignKey: 'empresa_id' });

module.exports = Vacante;