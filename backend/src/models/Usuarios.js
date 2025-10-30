const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Usuarios = sequelize.define('Usuario', {
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

  // Usuarios.associate = (models) => {
  //   Usuarios.hasMany(models.Egresado, { foreignKey: 'user_id' });
  //   Usuarios.hasMany(models.Notificacion, { foreignKey: 'user_id' });
  // };

  return Usuarios;
};

