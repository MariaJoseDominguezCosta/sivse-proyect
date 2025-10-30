'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Postulaciones', {
      fields: ['egresado_id'],
      type: 'foreign key',
      name: 'fk_postulacion_egresado',
      references: { table: 'Egresados', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('Postulaciones', {
      fields: ['vacante_id'],
      type: 'foreign key',
      name: 'fk_postulacion_vacante',
      references: { table: 'Vacantes', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    // Añade más constraints según sea necesario
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint('Postulaciones', 'fk_postulacion_egresado');
    await queryInterface.removeConstraint('Postulaciones', 'fk_postulacion_vacante');
  }
};