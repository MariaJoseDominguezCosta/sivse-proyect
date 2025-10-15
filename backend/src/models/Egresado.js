const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Egresado = sequelize.define(
  "Egresado",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre_completo: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING },
    generacion: { type: DataTypes.STRING }, // e.g., '2020-2025'
    carrera: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    estado_laboral: { type: DataTypes.STRING, defaultValue: "Desempleado" },
    ubicacion: { type: DataTypes.STRING },
    empresa_actual: { type: DataTypes.STRING },
    puesto: { type: DataTypes.STRING },
    modalidad: { type: DataTypes.STRING },
    fecha_inicio: { type: DataTypes.DATE },
    redes: { type: DataTypes.JSON }, // {linkedin: '', instagram: '', otro: ''}
    historial: { type: DataTypes.JSON }, // Array de {fecha: '', accion: ''}
    foto_perfil: { type: DataTypes.STRING }, // URL de foto
    user_id: { type: DataTypes.INTEGER, unique: true },
  },
  {
    tableName: "EGRESADO",
    timestamps: true,
  }
);

User.hasOne(Egresado, { foreignKey: "user_id" });
Egresado.belongsTo(User, { foreignKey: "user_id" });

module.exports = Egresado;
