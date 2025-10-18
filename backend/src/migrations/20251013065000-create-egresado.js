'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Egresados', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre_completo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      estado_laboral: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'desempleado',
      },
      telefono: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ubicacion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      generacion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      carrera: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      empresa_actual: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      puesto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      redes_sociales: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('Egresados');
  }
};
