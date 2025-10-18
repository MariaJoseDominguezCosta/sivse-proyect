"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Vacantes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      empresa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Empresas",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      salario_estimado: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      ubicacion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estado: {
        type: Sequelize.ENUM("Activa", "Inactiva"),
        defaultValue: "Activa",
      },
      modalidad: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requisitos: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fecha_publicacion: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW,
      },
      es_favorito: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: true, // Temporalmente nullable
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true, // Temporalmente nullable
        type: Sequelize.DATE,
      },
    });

    // Actualiza las columnas existentes con un valor predeterminado
    await queryInterface.sequelize.query(`
      UPDATE "Vacantes" SET "createdAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "createdAt" IS NULL OR "updatedAt" IS NULL;
    `);

    // Modifica las columnas para que sean NOT NULL
    await queryInterface.changeColumn("Vacantes", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn("Vacantes", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Vacantes");
  },
};
