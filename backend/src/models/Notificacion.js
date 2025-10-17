const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notificacion = (sequelize, DataTypes) => {
    const NotificacionModel = sequelize.define('Notificacion', {
        id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
        user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'USUARIO', key: 'id' }, // Referencia a USUARIO
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
        tableName: 'NOTIFICACION',
        timestamps: true,
    });

    return NotificacionModel;
};

module.exports = Notificacion;