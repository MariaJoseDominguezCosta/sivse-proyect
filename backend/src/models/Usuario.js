const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Usuarios = sequelize.define('Usuarios', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'egresado'),
        defaultValue: 'egresado',
      },
    }, {
      tableName: 'Usuarios',
      timestamps: true,
  });

  Usuarios.associate = (models) => {
    Usuarios.hasMany(models.Egresados, { foreignKey: 'user_id' });
    Usuarios.hasMany(models.Notificaciones, { foreignKey: 'user_id' });
  };

  return Usuarios;
};

