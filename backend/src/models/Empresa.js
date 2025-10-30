const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Empresa = sequelize.define('Empresa', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      razon_social: { type: DataTypes.STRING, allowNull: false, unique: true },
      sector: { type: DataTypes.STRING, allowNull: false },
      tipo_convenio: { type: DataTypes.STRING, allowNull: false },
      direccion: { type: DataTypes.STRING, allowNull: false },
      correo_contacto: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true },
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [10, 15] },
      },
      sitio_web: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isUrl: true },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Empresas",
      timestamps: true,
    }
  );

  // Empresa.associate = (models) => {
  //   Empresa.hasMany(models.Vacante, {
  //     foreignKey: "empresa_id",
  //     as: "vacante",
  //   });
  // };

  return Empresa;
};
