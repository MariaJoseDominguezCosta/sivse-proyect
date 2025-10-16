// models/Notificacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Asumir admin es user

const Notificacion = sequelize.define('Notificacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    leida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
});

User.hasMany(Notificacion, { foreignKey: 'user_id' });
Notificacion.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Notificacion;