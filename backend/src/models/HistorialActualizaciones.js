const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
    const HistorialActualizaciones = sequelize.define(
        "HistorialActualizacion",
        {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        egresado_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "Egresados", key: "id" },
        },
        campo_actualizado: { type: DataTypes.STRING(100), allowNull: false },
        valor_anterior: { type: DataTypes.TEXT },
        valor_nuevo: { type: DataTypes.TEXT },
        fecha_actualizacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        },
        {
        tableName: "historial_actualizaciones",
        timestamps: false,
        }
    );

    // HistorialActualizaciones.associate = (models) => {
    //     HistorialActualizaciones.belongsTo(models.Egresado, {
    //     foreignKey: "egresado_id",
    //     });
    // };

    return HistorialActualizaciones;
};