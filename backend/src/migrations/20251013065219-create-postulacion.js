'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Postulaciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      egresado_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Asumiendo que no puede ser nulo
        references: {
          model: 'Egresados', // Nombre de la tabla
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      vacante_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Asumiendo que no puede ser nulo
        references: {
          model: 'Vacantes', // Nombre de la tabla
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fecha_postulacion: { // Añadir la columna de datos
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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
    // La función down debe eliminar la tabla completa
    await queryInterface.dropTable('Postulaciones');
  }
};