// models/Favoritos.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
    const Favorito = sequelize.define(
        "Favorito",
        {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        egresado_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "Egresados", key: "id" },
        },
        vacante_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "Vacantes", key: "id" },
        },
        },
        {
        tableName: "Favoritos",
        timestamps: true,
        }
    );

    // Favorito.associate = (models) => {
    //     Favorito.belongsTo(models.Egresado, { foreignKey: "egresado_id" });
    //     Favorito.belongsTo(models.Vacante, { foreignKey: "vacante_id" });
    // };

    return Favorito;
};
