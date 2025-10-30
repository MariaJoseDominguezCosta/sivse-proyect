const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {    
    const Notificacion = sequelize.define('Notificacion', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Usuarios', key: 'id' }, // Referencia a USUARIO
        },
        mensaje: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        leida: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        tableName: 'Notificaciones',
        timestamps: true,
    });

    // Notificacion.associate = (models) => {
    //     Notificacion.belongsTo(models.Usuario, { foreignKey: 'user_id' });
    // };

    return Notificacion;
};